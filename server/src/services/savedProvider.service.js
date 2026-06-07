import mongoose from "mongoose";
import {
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_VISIBILITY,
  SAVED_PROVIDER_SOURCE,
  SAVED_PROVIDER_STATUS,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { SavedProvider } from "../models/SavedProvider.model.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

function publicPrivacyAllows(profile, key) {
  return profile?.privacySettings?.[key] !== false;
}

function isPublicDiscoverableProfile(profile) {
  if (!profile) {
    return false;
  }

  const visibility = profile.profileVisibility ?? "public";

  return (
    visibility === "public" &&
    publicPrivacyAllows(profile, "allowDiscovery") &&
    publicPrivacyAllows(profile, "allowProviderListing")
  );
}

function normalizeMediaUrl(value) {
  if (typeof value === "string") {
    return value;
  }

  return value?.url ?? "";
}

function locationToText(location) {
  if (typeof location === "string") {
    return location.trim();
  }

  return [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");
}

function uniqueStrings(values = [], limit = 20) {
  return Array.from(
    new Set(
      values
        .flat()
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  ).slice(0, limit);
}

function getDiscoveryAvailability(providerProfile = {}, topOffer = null) {
  const offerAvailability = topOffer?.availability?.status;

  if (offerAvailability) {
    return offerAvailability;
  }

  if (providerProfile.availability === "limited") {
    return "limited";
  }

  if (providerProfile.availability === "unavailable") {
    return "fully_booked";
  }

  return "available_now";
}

function getPublicVerificationDisplay(publicProfile = {}, providerProfile = {}) {
  const providerStatus = String(providerProfile?.verificationStatus ?? "").toLowerCase();
  const profileStatus = String(publicProfile?.verificationBadge?.status ?? "").toLowerCase();
  const isVerified = profileStatus === "verified" || providerStatus === "verified";

  return {
    isVerified,
    label:
      profileStatus === "verified"
        ? publicProfile?.verificationBadge?.label || "Verified"
        : isVerified
          ? "Verified"
          : "",
    status: isVerified ? "verified" : profileStatus || providerStatus || "none",
    type:
      profileStatus === "verified"
        ? "profile"
        : providerStatus === "verified"
          ? "provider"
          : "none",
  };
}

function publicPriceRange(priceRange = {}) {
  if (!priceRange || priceRange.type === "hidden") {
    return { type: "hidden" };
  }

  return {
    currency: priceRange.currency ?? "USD",
    customLabel: priceRange.customLabel ?? "",
    max: priceRange.max ?? null,
    min: priceRange.min ?? null,
    type: priceRange.type ?? "hidden",
  };
}

function serializeOutcomeOfferPreview(offer = {}) {
  if (!offer) {
    return null;
  }

  return {
    availability: offer.availability?.status ?? "",
    category: offer.category ?? "",
    deliveryTimeline: offer.deliveryTimeline ?? null,
    priceRange: publicPriceRange(offer.priceRange ?? {}),
    proofIncludedCount: offer.proofIncluded?.length ?? 0,
    qualityScore: offer.qualityScore?.score ?? 0,
    shortSummary: offer.shortSummary ?? "",
    skills: (offer.skills ?? []).slice(0, 6),
    slug: offer.slug ?? "",
    targetOutcome: offer.targetOutcome?.outcomeStatement ?? "",
    title: offer.title ?? "",
    tools: (offer.tools ?? []).slice(0, 6),
  };
}

async function getPublicOutcomeOfferSummary(providerId) {
  const query = {
    providerId,
    status: OUTCOME_OFFER_STATUS.PUBLISHED,
    visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    $or: [
      { "moderation.status": "approved" },
      { "moderation.status": { $exists: false } },
    ],
  };
  const [topOffer, count] = await Promise.all([
    OutcomeOffer.findOne(query)
      .select(
        "availability category deliveryTimeline priceRange proofIncluded qualityScore shortSummary skills slug targetOutcome title tools",
      )
      .sort({ "qualityScore.score": -1, createdAt: -1 })
      .lean(),
    OutcomeOffer.countDocuments(query),
  ]);

  return {
    count,
    top: serializeOutcomeOfferPreview(topOffer),
  };
}

function sanitizeProviderSummary({ outcomeOfferSummary, providerProfile, publicProfile, user }) {
  const showProofScore = publicPrivacyAllows(publicProfile, "showProofScore");
  const showServices = publicPrivacyAllows(publicProfile, "showServices");
  const publicSkills = (publicProfile?.skills ?? []).map((skill) =>
    typeof skill === "string" ? skill : skill?.name,
  );
  const topPublicOutcomeOffer = showServices ? outcomeOfferSummary.top : null;
  const verification = getPublicVerificationDisplay(publicProfile, providerProfile);
  const displayName = user.fullName || user.name || user.username || "ProofArena provider";
  const proofScore = showProofScore ? Number(providerProfile.proofScore ?? 0) : undefined;
  const completedOutcomes = showProofScore
    ? Number(providerProfile.completedOutcomes ?? providerProfile.completedProjects ?? 0)
    : undefined;
  const approvalRate = showProofScore ? Number(providerProfile.approvalRate ?? 0) : undefined;
  const onTimeRate = showProofScore ? Number(providerProfile.onTimeRate ?? 0) : undefined;
  const categories = uniqueStrings([
    providerProfile.categories ?? [],
    showServices && topPublicOutcomeOffer?.category ? [topPublicOutcomeOffer.category] : [],
  ]);
  const skills = uniqueStrings([
    providerProfile.skills ?? [],
    publicSkills,
    showServices ? topPublicOutcomeOffer?.skills ?? [] : [],
  ], 30);

  return {
    avatar: normalizeMediaUrl(publicProfile?.profilePicture) || user.avatar || "",
    avatarUrl: normalizeMediaUrl(publicProfile?.profilePicture) || user.avatar || "",
    availability: getDiscoveryAvailability(providerProfile, topPublicOutcomeOffer),
    bioExcerpt: String(publicProfile?.bio ?? "").replace(/\s+/g, " ").trim().slice(0, 220),
    categories,
    completedOutcomes,
    displayName,
    fullName: displayName,
    headline: publicProfile?.headline || providerProfile.headline || providerProfile.title || "",
    id: normalizeId(user._id),
    location: locationToText(publicProfile?.location),
    onTimeRate,
    outcomeOfferCount: showServices ? outcomeOfferSummary.count : 0,
    outcomeOffers: {
      count: showServices ? outcomeOfferSummary.count : 0,
      top: topPublicOutcomeOffer,
    },
    outcomeOffersSummary: {
      count: showServices ? outcomeOfferSummary.count : 0,
      top: topPublicOutcomeOffer,
    },
    profileUrl: user.username ? `/profile/${user.username}` : "",
    proofMetricsAvailable: showProofScore,
    proofScore,
    providerProfileId: normalizeId(providerProfile._id),
    providerSince: providerProfile.createdAt ?? user.createdAt ?? null,
    publicProfileUrl: user.username ? `/profile/${user.username}` : "",
    skills,
    topPublicOutcomeOffer,
    userId: normalizeId(user._id),
    username: user.username ?? "",
    verification,
    verificationBadge: {
      isVerified: verification.isVerified,
      label: verification.label,
      status: verification.status,
      type: verification.type,
    },
    verificationStatus: verification.status,
    approvalRate,
  };
}

async function getPublicProviderSummary(providerId) {
  assertObjectId(providerId, "Provider id");

  const [user, publicProfile, providerProfile] = await Promise.all([
    User.findOne({
      _id: providerId,
      accountStatus: "active",
      isSuspended: { $ne: true },
      role: "provider",
    })
      .select("_id accountStatus avatar createdAt fullName isSuspended isVerified name role username verificationStatus")
      .lean(),
    UserProfile.findOne({ userId: providerId })
      .select("bio headline location privacySettings profilePicture profileVisibility services skills userId verificationBadge")
      .lean(),
    ProviderProfile.findOne({
      userId: providerId,
      $or: [
        { moderationStatus: "active" },
        { moderationStatus: { $exists: false } },
      ],
    }).lean(),
  ]);

  if (!user || !providerProfile || !isPublicDiscoverableProfile(publicProfile)) {
    throw new AppError("Provider is not available to save", 404);
  }

  const outcomeOfferSummary = await getPublicOutcomeOfferSummary(providerId);

  return sanitizeProviderSummary({
    outcomeOfferSummary,
    providerProfile,
    publicProfile,
    user,
  });
}

function createCompareSnapshot(provider) {
  return {
    approvalRate: provider.proofMetricsAvailable ? provider.approvalRate : undefined,
    availability: provider.availability ?? "",
    categories: provider.categories ?? [],
    completedOutcomes: provider.proofMetricsAvailable ? provider.completedOutcomes : undefined,
    headline: provider.headline ?? "",
    onTimeRate: provider.proofMetricsAvailable ? provider.onTimeRate : undefined,
    proofScore: provider.proofMetricsAvailable ? provider.proofScore : undefined,
    savedAt: new Date(),
    skills: provider.skills ?? [],
  };
}

async function getChallengeSummary(clientId, challengeId) {
  if (!challengeId) {
    return null;
  }

  assertObjectId(challengeId, "Challenge id");

  const challenge = await Challenge.findOne({
    _id: challengeId,
    clientId,
  })
    .select("_id category slug status title targetOutcome")
    .lean();

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  return {
    category: challenge.category ?? "",
    id: normalizeId(challenge._id),
    slug: challenge.slug ?? "",
    status: challenge.status ?? "",
    targetOutcome: challenge.targetOutcome?.outcomeStatement ?? "",
    title: challenge.title ?? "",
  };
}

function getQueryForClientProvider({ challengeId, clientId, providerId }) {
  return {
    challengeId: challengeId || null,
    clientId,
    providerId,
  };
}

function textMatchesSavedProvider(item, q) {
  const query = String(q ?? "").trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [
    item.provider?.displayName,
    item.provider?.headline,
    item.provider?.username,
    item.note,
    ...(item.tags ?? []),
    ...(item.provider?.skills ?? []),
    ...(item.provider?.categories ?? []),
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
}

function sortSavedProviders(items, sort) {
  const direction = sort === "oldest" ? 1 : -1;

  if (sort === "proof_score") {
    return items.sort(
      (left, right) =>
        Number(right.provider?.proofScore ?? right.compareSnapshot?.proofScore ?? -1) -
        Number(left.provider?.proofScore ?? left.compareSnapshot?.proofScore ?? -1),
    );
  }

  if (sort === "completed_outcomes") {
    return items.sort(
      (left, right) =>
        Number(right.provider?.completedOutcomes ?? right.compareSnapshot?.completedOutcomes ?? -1) -
        Number(left.provider?.completedOutcomes ?? left.compareSnapshot?.completedOutcomes ?? -1),
    );
  }

  return items.sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.createdAt ?? 0).getTime();

    return (leftTime - rightTime) * direction;
  });
}

async function sanitizeSavedProviderForClient(record, { challenge = null, provider = null } = {}) {
  const publicProvider = provider ?? await getPublicProviderSummary(record.providerId);

  return {
    challenge,
    compareSnapshot: record.compareSnapshot ?? {},
    createdAt: record.createdAt ?? null,
    note: record.note ?? "",
    provider: publicProvider,
    providerId: normalizeId(record.providerId),
    savedProviderId: normalizeId(record._id),
    source: record.source ?? SAVED_PROVIDER_SOURCE.PROVIDER_DISCOVERY,
    status: record.status ?? SAVED_PROVIDER_STATUS.SAVED,
    tags: record.tags ?? [],
    updatedAt: record.updatedAt ?? null,
  };
}

async function hydrateSavedProviderRecords(records, clientId) {
  const providerSummaries = new Map();
  const challengeSummaries = new Map();

  await Promise.all(
    records.map(async (record) => {
      const providerId = normalizeId(record.providerId);
      const challengeId = normalizeId(record.challengeId);

      if (providerId && !providerSummaries.has(providerId)) {
        providerSummaries.set(providerId, await getPublicProviderSummary(providerId));
      }

      if (challengeId && !challengeSummaries.has(challengeId)) {
        challengeSummaries.set(challengeId, await getChallengeSummary(clientId, challengeId));
      }
    }),
  );

  return Promise.all(
    records.map((record) =>
      sanitizeSavedProviderForClient(record, {
        challenge: challengeSummaries.get(normalizeId(record.challengeId)) ?? null,
        provider: providerSummaries.get(normalizeId(record.providerId)) ?? null,
      }),
    ),
  );
}

export async function saveProvider(clientId, payload = {}) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "Client id");
  assertObjectId(payload.providerId, "Provider id");

  if (normalizeId(clientId) === normalizeId(payload.providerId)) {
    throw new AppError("You cannot save your own provider profile", 400);
  }

  const client = await User.findOne({
    _id: clientId,
    accountStatus: "active",
    isSuspended: { $ne: true },
    role: "client",
  })
    .select("_id")
    .lean();

  if (!client) {
    throw new AppError("Only authenticated clients can save providers", 403);
  }

  const [provider, challenge] = await Promise.all([
    getPublicProviderSummary(payload.providerId),
    getChallengeSummary(clientId, payload.challengeId),
  ]);
  const query = getQueryForClientProvider({
    challengeId: payload.challengeId,
    clientId,
    providerId: payload.providerId,
  });
  const existing = await SavedProvider.findOne(query);
  const nextData = {
    compareSnapshot: createCompareSnapshot(provider),
    providerProfileId: provider.providerProfileId || null,
    source: payload.source ?? SAVED_PROVIDER_SOURCE.PROVIDER_DISCOVERY,
  };

  if (payload.note !== undefined) {
    nextData.note = payload.note;
  }

  if (payload.tags !== undefined) {
    nextData.tags = payload.tags;
  }

  if (existing) {
    existing.set(nextData);
    if (existing.status === SAVED_PROVIDER_STATUS.DISMISSED) {
      existing.status = SAVED_PROVIDER_STATUS.SAVED;
    }
    await existing.save();

    return sanitizeSavedProviderForClient(existing.toObject(), { challenge, provider });
  }

  const savedProvider = await SavedProvider.create({
    ...query,
    ...nextData,
    status: SAVED_PROVIDER_STATUS.SAVED,
  });

  return sanitizeSavedProviderForClient(savedProvider.toObject(), { challenge, provider });
}

export async function getMySavedProviders(clientId, filters = {}) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "Client id");

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const query = { clientId };

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = { $ne: SAVED_PROVIDER_STATUS.DISMISSED };
  }

  if (filters.challengeId) {
    assertObjectId(filters.challengeId, "Challenge id");
    query.challengeId = filters.challengeId;
  }

  const records = await SavedProvider.find(query)
    .sort({ createdAt: filters.sort === "oldest" ? 1 : -1 })
    .limit(500)
    .lean();
  const hydrated = await hydrateSavedProviderRecords(records, clientId);
  const filtered = hydrated.filter((item) => textMatchesSavedProvider(item, filters.q));
  const sorted = sortSavedProviders(filtered, filters.sort ?? "newest");
  const total = sorted.length;
  const start = (page - 1) * limit;

  return {
    items: sorted.slice(start, start + limit),
    pagination: {
      hasMore: page * limit < total,
      limit,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      total,
    },
    stats: {
      invitedLater: hydrated.filter((item) => item.status === SAVED_PROVIDER_STATUS.INVITED_LATER).length,
      saved: hydrated.filter((item) => item.status === SAVED_PROVIDER_STATUS.SAVED).length,
      shortlisted: hydrated.filter((item) => item.status === SAVED_PROVIDER_STATUS.SHORTLISTED).length,
      total: hydrated.filter((item) => item.status !== SAVED_PROVIDER_STATUS.DISMISSED).length,
    },
  };
}

export async function updateSavedProvider(clientId, savedProviderId, payload = {}) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "Client id");
  assertObjectId(savedProviderId, "Saved provider id");

  const record = await SavedProvider.findOne({
    _id: savedProviderId,
    clientId,
  });

  if (!record) {
    throw new AppError("Saved provider not found", 404);
  }

  ["note", "status", "tags"].forEach((field) => {
    if (payload[field] !== undefined) {
      record[field] = payload[field];
    }
  });

  await record.save();
  const [provider, challenge] = await Promise.all([
    getPublicProviderSummary(record.providerId),
    getChallengeSummary(clientId, record.challengeId),
  ]);

  return sanitizeSavedProviderForClient(record.toObject(), { challenge, provider });
}

export async function unsaveProvider(clientId, providerId, challengeId = undefined) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "Client id");
  assertObjectId(providerId, "Provider id");

  if (challengeId) {
    assertObjectId(challengeId, "Challenge id");
  }

  const query = getQueryForClientProvider({
    challengeId,
    clientId,
    providerId,
  });
  const deleted = await SavedProvider.findOneAndDelete(query).lean();

  if (!deleted) {
    throw new AppError("Saved provider not found", 404);
  }

  return {
    deleted: true,
    providerId: normalizeId(providerId),
  };
}

export async function getSavedProviderStatus(clientId, providerId) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "Client id");
  assertObjectId(providerId, "Provider id");

  const record = await SavedProvider.findOne({
    clientId,
    providerId,
  })
    .sort({ updatedAt: -1 })
    .lean();

  return {
    saved: Boolean(record && record.status !== SAVED_PROVIDER_STATUS.DISMISSED),
    savedProviderId: record ? normalizeId(record._id) : null,
    status: record?.status ?? null,
  };
}

export { sanitizeSavedProviderForClient };
