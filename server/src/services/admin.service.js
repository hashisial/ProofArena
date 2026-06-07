import { Challenge } from "../models/Challenge.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProofAsset } from "../models/ProofAsset.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const safeUserSelect =
  "_id accountStatus avatar createdAt email fullName isEmailVerified isSuspended lastLoginAt name role updatedAt username verificationStatus";
const safeRelatedUserSelect =
  "_id accountStatus avatar fullName isSuspended name role username verificationStatus";

function escapeRegex(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRegex(value) {
  return value ? new RegExp(escapeRegex(value), "i") : null;
}

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? "";
}

function getPagination(filters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(filters.limit) || 20));

  return { limit, page, skip: (page - 1) * limit };
}

function createPagination(page, limit, total) {
  return {
    limit,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    total,
  };
}

function getSort(sort = "newest", nameField = "createdAt", statusField = "status") {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "name") return { [nameField]: 1, createdAt: -1 };
  if (sort === "status") return { [statusField]: 1, createdAt: -1 };
  return { createdAt: -1 };
}

function normalizeProviderModerationStatus(status) {
  if (status === "active") return "approved";
  if (status === "suspended") return "flagged";
  return status ?? "pending";
}

function providerModerationStorageStatus(status) {
  if (status === "approved") return "active";
  if (status === "flagged") return "suspended";
  return status;
}

function normalizeProofModerationStatus(status) {
  if (status === "verified") return "approved";
  if (status === "pending_review" || status === "unverified") return "pending";
  return status ?? "pending";
}

function proofModerationStorageStatus(status) {
  if (status === "approved") return "verified";
  if (status === "pending") return "pending_review";
  return status;
}

function sanitizeRelatedUser(user) {
  if (!user) return null;

  return {
    accountStatus: user.accountStatus ?? "active",
    avatarUrl: user.avatar ?? "",
    displayName: user.fullName ?? user.name ?? user.username ?? "User",
    id: normalizeId(user),
    role: user.role ?? "",
    username: user.username ?? "",
    verificationStatus: user.verificationStatus ?? "pending",
  };
}

function sanitizeUser(user) {
  return {
    accountStatus: user.accountStatus ?? (user.isSuspended ? "suspended" : "active"),
    avatarUrl: user.avatar ?? "",
    createdAt: user.createdAt ?? null,
    displayName: user.fullName ?? user.name ?? user.username ?? "User",
    email: user.email ?? "",
    id: normalizeId(user),
    isEmailVerified: Boolean(user.isEmailVerified),
    lastLoginAt: user.lastLoginAt ?? null,
    role: user.role ?? "client",
    updatedAt: user.updatedAt ?? null,
    username: user.username ?? "",
    verificationStatus: user.verificationStatus ?? "pending",
  };
}

function sanitizeProvider(profile) {
  return {
    approvalRate: profile.approvalRate ?? null,
    availability: profile.availability ?? "available",
    categories: profile.categories ?? [],
    completedOutcomes: profile.completedOutcomes ?? 0,
    createdAt: profile.createdAt ?? null,
    headline: profile.headline || profile.title || "",
    id: normalizeId(profile),
    moderation: {
      reason: profile.moderationNote ?? "",
      reviewedAt: profile.moderationReviewedAt ?? null,
      status: normalizeProviderModerationStatus(profile.moderationStatus),
    },
    onTimeRate: profile.onTimeRate ?? null,
    proofScore: profile.proofScore ?? null,
    provider: sanitizeRelatedUser(profile.userId),
    skills: profile.skills ?? [],
    updatedAt: profile.updatedAt ?? null,
    verificationStatus: profile.verificationStatus ?? "none",
  };
}

function sanitizeChallenge(challenge) {
  return {
    budget: challenge.budget ?? null,
    category: challenge.category ?? "",
    client: sanitizeRelatedUser(challenge.clientId),
    createdAt: challenge.createdAt ?? null,
    id: normalizeId(challenge),
    moderation: {
      reason: challenge.moderation?.reason ?? "",
      reviewedAt: challenge.moderation?.reviewedAt ?? null,
      status: challenge.moderation?.status ?? "approved",
    },
    qualityScore: challenge.qualityScore?.score ?? null,
    slug: challenge.slug ?? "",
    status: challenge.status ?? "draft",
    title: challenge.title ?? "Untitled challenge",
    updatedAt: challenge.updatedAt ?? null,
    visibility: challenge.visibility ?? "private",
  };
}

function sanitizeOffer(offer) {
  return {
    category: offer.category ?? "",
    createdAt: offer.createdAt ?? null,
    id: normalizeId(offer),
    moderation: {
      reason: offer.moderation?.reason ?? "",
      reviewedAt: offer.moderation?.reviewedAt ?? null,
      status: offer.moderation?.status ?? "approved",
    },
    provider: sanitizeRelatedUser(offer.providerId),
    qualityScore: offer.qualityScore?.score ?? null,
    slug: offer.slug ?? "",
    status: offer.status ?? "draft",
    title: offer.title ?? "Untitled outcome offer",
    updatedAt: offer.updatedAt ?? null,
    visibility: offer.visibility ?? "private",
  };
}

function sanitizeProofAsset(asset) {
  return {
    assetType: asset.assetType ?? "other",
    category: asset.category ?? "",
    createdAt: asset.createdAt ?? null,
    id: normalizeId(asset),
    moderation: {
      reason: asset.review?.rejectionReason || asset.review?.note || "",
      reviewedAt: asset.review?.reviewedAt ?? null,
      status: normalizeProofModerationStatus(asset.verificationStatus),
    },
    provider: sanitizeRelatedUser(asset.providerId),
    sourceType: asset.sourceType ?? "",
    title: asset.title ?? "Untitled proof asset",
    updatedAt: asset.updatedAt ?? null,
    verificationStatus: asset.verificationStatus ?? "unverified",
    visibility: asset.visibility ?? "private",
  };
}

async function getMatchingUserIds(q, role) {
  const regex = getRegex(q);

  if (!regex) return [];

  return User.find({
    ...(role ? { role } : {}),
    $or: [{ fullName: regex }, { name: regex }, { username: regex }, { email: regex }],
  }).distinct("_id");
}

export async function listAdminUsers(filters = {}) {
  ensureDatabaseConnection();
  const { limit, page, skip } = getPagination(filters);
  const query = {};
  const regex = getRegex(filters.q);

  if (filters.role) query.role = filters.role;
  if (filters.status) query.accountStatus = filters.status;
  if (regex) {
    query.$or = [{ fullName: regex }, { name: regex }, { username: regex }, { email: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(query)
      .select(safeUserSelect)
      .sort(getSort(filters.sort, "fullName", "accountStatus"))
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeUser),
    pagination: createPagination(page, limit, total),
  };
}

export async function listAdminProviders(filters = {}) {
  ensureDatabaseConnection();
  const { limit, page, skip } = getPagination(filters);
  const query = {};
  const regex = getRegex(filters.q);

  if (filters.moderationStatus) {
    query.moderationStatus = providerModerationStorageStatus(filters.moderationStatus);
  }
  if (filters.status) query.verificationStatus = filters.status;
  if (regex) {
    const userIds = await getMatchingUserIds(filters.q, "provider");
    query.$or = [
      { categories: regex },
      { headline: regex },
      { skills: regex },
      { title: regex },
      ...(userIds.length ? [{ userId: { $in: userIds } }] : []),
    ];
  }

  const [items, total] = await Promise.all([
    ProviderProfile.find(query)
      .select(
        "_id approvalRate availability categories completedOutcomes createdAt headline moderationNote moderationReviewedAt moderationReviewedBy moderationStatus onTimeRate proofScore skills title updatedAt userId verificationStatus",
      )
      .populate({ path: "userId", select: safeRelatedUserSelect })
      .sort(getSort(filters.sort, "title", "moderationStatus"))
      .skip(skip)
      .limit(limit)
      .lean(),
    ProviderProfile.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeProvider),
    pagination: createPagination(page, limit, total),
  };
}

export async function listAdminChallenges(filters = {}) {
  ensureDatabaseConnection();
  const { limit, page, skip } = getPagination(filters);
  const query = {};
  const regex = getRegex(filters.q);

  if (filters.moderationStatus) query["moderation.status"] = filters.moderationStatus;
  if (filters.status) query.status = filters.status;
  if (regex) {
    const clientIds = await getMatchingUserIds(filters.q, "client");
    query.$or = [
      { category: regex },
      { title: regex },
      ...(clientIds.length ? [{ clientId: { $in: clientIds } }] : []),
    ];
  }

  const [items, total] = await Promise.all([
    Challenge.find(query)
      .select(
        "_id budget category clientId createdAt moderation qualityScore slug status title updatedAt visibility",
      )
      .populate({ path: "clientId", select: safeRelatedUserSelect })
      .sort(getSort(filters.sort, "title", "moderation.status"))
      .skip(skip)
      .limit(limit)
      .lean(),
    Challenge.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeChallenge),
    pagination: createPagination(page, limit, total),
  };
}

export async function listAdminOutcomeOffers(filters = {}) {
  ensureDatabaseConnection();
  const { limit, page, skip } = getPagination(filters);
  const query = {};
  const regex = getRegex(filters.q);

  if (filters.moderationStatus) query["moderation.status"] = filters.moderationStatus;
  if (filters.status) query.status = filters.status;
  if (regex) {
    const providerIds = await getMatchingUserIds(filters.q, "provider");
    query.$or = [
      { category: regex },
      { title: regex },
      ...(providerIds.length ? [{ providerId: { $in: providerIds } }] : []),
    ];
  }

  const [items, total] = await Promise.all([
    OutcomeOffer.find(query)
      .select(
        "_id category createdAt moderation providerId qualityScore slug status title updatedAt visibility",
      )
      .populate({ path: "providerId", select: safeRelatedUserSelect })
      .sort(getSort(filters.sort, "title", "moderation.status"))
      .skip(skip)
      .limit(limit)
      .lean(),
    OutcomeOffer.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeOffer),
    pagination: createPagination(page, limit, total),
  };
}

export async function listAdminProofAssets(filters = {}) {
  ensureDatabaseConnection();
  const { limit, page, skip } = getPagination(filters);
  const query = {};
  const regex = getRegex(filters.q);
  const requestedStatus = filters.moderationStatus || filters.status;

  if (requestedStatus) query.verificationStatus = proofModerationStorageStatus(requestedStatus);
  if (regex) {
    const providerIds = await getMatchingUserIds(filters.q, "provider");
    query.$or = [
      { category: regex },
      { title: regex },
      ...(providerIds.length ? [{ providerId: { $in: providerIds } }] : []),
    ];
  }

  const [items, total] = await Promise.all([
    ProofAsset.find(query)
      .select(
        "_id assetType category createdAt providerId review sourceType title updatedAt verificationStatus visibility",
      )
      .populate({ path: "providerId", select: safeRelatedUserSelect })
      .sort(getSort(filters.sort, "title", "verificationStatus"))
      .skip(skip)
      .limit(limit)
      .lean(),
    ProofAsset.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeProofAsset),
    pagination: createPagination(page, limit, total),
  };
}

async function getModerationQueue() {
  const [providers, challenges, offers, proofAssets] = await Promise.all([
    ProviderProfile.find({ moderationStatus: { $in: ["pending", "suspended"] } })
      .select("_id headline moderationNote moderationStatus title updatedAt userId")
      .populate({ path: "userId", select: safeRelatedUserSelect })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
    Challenge.find({ "moderation.status": { $in: ["pending", "flagged"] } })
      .select("_id clientId moderation title updatedAt")
      .populate({ path: "clientId", select: safeRelatedUserSelect })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
    OutcomeOffer.find({ "moderation.status": { $in: ["pending", "flagged"] } })
      .select("_id moderation providerId title updatedAt")
      .populate({ path: "providerId", select: safeRelatedUserSelect })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
    ProofAsset.find({ verificationStatus: { $in: ["pending_review", "flagged"] } })
      .select("_id providerId review title updatedAt verificationStatus")
      .populate({ path: "providerId", select: safeRelatedUserSelect })
      .sort({ updatedAt: -1 })
      .limit(3)
      .lean(),
  ]);

  return [
    ...providers.map((item) => ({ ...sanitizeProvider(item), resourceType: "provider" })),
    ...challenges.map((item) => ({ ...sanitizeChallenge(item), resourceType: "challenge" })),
    ...offers.map((item) => ({ ...sanitizeOffer(item), resourceType: "outcome-offer" })),
    ...proofAssets.map((item) => ({ ...sanitizeProofAsset(item), resourceType: "proof-asset" })),
  ]
    .sort((left, right) => new Date(right.updatedAt ?? 0) - new Date(left.updatedAt ?? 0))
    .slice(0, 8);
}

export async function getAdminOverview() {
  ensureDatabaseConnection();

  const [
    totalUsers,
    totalProviders,
    totalClients,
    totalChallenges,
    openChallenges,
    totalOutcomeOffers,
    publishedOutcomeOffers,
    totalProofAssets,
    pendingProviders,
    pendingChallenges,
    pendingOffers,
    pendingProofAssets,
    flaggedProviders,
    flaggedChallenges,
    flaggedOffers,
    flaggedProofAssets,
    pendingUserVerification,
    pendingProviderVerification,
    pendingProfileVerification,
    recentUsers,
    recentChallenges,
    recentOffers,
    recentProofAssets,
    moderationQueue,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ role: "provider" }),
    User.countDocuments({ role: "client" }),
    Challenge.countDocuments({}),
    Challenge.countDocuments({ status: "open" }),
    OutcomeOffer.countDocuments({}),
    OutcomeOffer.countDocuments({ status: "published" }),
    ProofAsset.countDocuments({}),
    ProviderProfile.countDocuments({ moderationStatus: "pending" }),
    Challenge.countDocuments({ "moderation.status": "pending" }),
    OutcomeOffer.countDocuments({ "moderation.status": "pending" }),
    ProofAsset.countDocuments({ verificationStatus: "pending_review" }),
    ProviderProfile.countDocuments({ moderationStatus: "suspended" }),
    Challenge.countDocuments({ "moderation.status": "flagged" }),
    OutcomeOffer.countDocuments({ "moderation.status": "flagged" }),
    ProofAsset.countDocuments({ verificationStatus: "flagged" }),
    User.countDocuments({ verificationStatus: "pending" }),
    ProviderProfile.countDocuments({ verificationStatus: "pending" }),
    UserProfile.countDocuments({ "verificationBadge.status": "pending" }),
    listAdminUsers({ limit: 5, sort: "newest" }),
    listAdminChallenges({ limit: 5, sort: "newest" }),
    listAdminOutcomeOffers({ limit: 5, sort: "newest" }),
    listAdminProofAssets({ limit: 5, sort: "newest" }),
    getModerationQueue(),
  ]);

  return {
    flaggedItemsCount:
      flaggedProviders + flaggedChallenges + flaggedOffers + flaggedProofAssets,
    moderationQueue,
    openChallenges,
    pendingModerationCount:
      pendingProviders + pendingChallenges + pendingOffers + pendingProofAssets,
    publishedOutcomeOffers,
    recentChallenges: recentChallenges.items,
    recentOffers: recentOffers.items,
    recentProofAssets: recentProofAssets.items,
    recentUsers: recentUsers.items,
    totalChallenges,
    totalClients,
    totalOutcomeOffers,
    totalProofAssets,
    totalProviders,
    totalUsers,
    verificationPendingCount:
      pendingUserVerification + pendingProviderVerification + pendingProfileVerification,
  };
}

export async function updateAdminUserStatus(adminId, userId, status) {
  ensureDatabaseConnection();

  if (String(adminId) === String(userId) && status !== "active") {
    throw new AppError("You cannot suspend or deactivate your active admin account", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      accountStatus: status,
      isSuspended: status === "suspended",
    },
    { new: true, runValidators: true },
  )
    .select(safeUserSelect)
    .lean();

  if (!user) throw new AppError("User not found", 404);
  return sanitizeUser(user);
}

export async function moderateAdminProvider(adminId, providerId, payload) {
  ensureDatabaseConnection();
  const profile = await ProviderProfile.findOne({
    $or: [{ _id: providerId }, { userId: providerId }],
  });

  if (!profile) throw new AppError("Provider profile not found", 404);

  profile.moderationStatus = providerModerationStorageStatus(payload.status);
  profile.moderationNote = payload.reason ?? "";
  profile.moderationReviewedAt = new Date();
  profile.moderationReviewedBy = adminId;
  await profile.save();
  await profile.populate({ path: "userId", select: safeRelatedUserSelect });
  return sanitizeProvider(profile);
}

export async function moderateAdminChallenge(adminId, challengeId, payload) {
  ensureDatabaseConnection();
  const challenge = await Challenge.findByIdAndUpdate(
    challengeId,
    {
      moderation: {
        reason: payload.reason ?? "",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        status: payload.status,
      },
    },
    { new: true, runValidators: true },
  ).populate({ path: "clientId", select: safeRelatedUserSelect });

  if (!challenge) throw new AppError("Challenge not found", 404);
  return sanitizeChallenge(challenge);
}

export async function moderateAdminOutcomeOffer(adminId, offerId, payload) {
  ensureDatabaseConnection();
  const offer = await OutcomeOffer.findByIdAndUpdate(
    offerId,
    {
      moderation: {
        reason: payload.reason ?? "",
        reviewedAt: new Date(),
        reviewedBy: adminId,
        status: payload.status,
      },
    },
    { new: true, runValidators: true },
  ).populate({ path: "providerId", select: safeRelatedUserSelect });

  if (!offer) throw new AppError("Outcome offer not found", 404);
  return sanitizeOffer(offer);
}

export async function moderateAdminProofAsset(adminId, assetId, payload) {
  ensureDatabaseConnection();
  const proofAsset = await ProofAsset.findByIdAndUpdate(
    assetId,
    {
      review: {
        note: payload.reason ?? "",
        rejectionReason: payload.status === "rejected" ? payload.reason ?? "" : "",
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
      verificationStatus: proofModerationStorageStatus(payload.status),
    },
    { new: true, runValidators: true },
  ).populate({ path: "providerId", select: safeRelatedUserSelect });

  if (!proofAsset) throw new AppError("Proof asset not found", 404);
  return sanitizeProofAsset(proofAsset);
}
