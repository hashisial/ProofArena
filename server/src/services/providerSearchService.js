import mongoose from "mongoose";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const validAvailability = new Set(["available", "limited", "unavailable"]);
const validModerationStatuses = new Set(["pending", "active", "rejected", "suspended"]);
const validSorts = new Set([
  "relevance",
  "proof_score",
  "completed_outcomes",
  "rating",
  "rating_desc",
  "price_asc",
  "price_desc",
  "completed_desc",
  "newest",
]);
const providerUserSelect =
  "_id accountStatus avatar createdAt fullName isSuspended isVerified name role stripeConnectStatus username verificationStatus";

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactRegex(value) {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

function containsInsensitive(haystack, needle) {
  const normalizedNeedle = String(needle ?? "").trim().toLowerCase();

  if (!normalizedNeedle) {
    return true;
  }

  return String(haystack ?? "").toLowerCase().includes(normalizedNeedle);
}

function locationToText(location) {
  if (typeof location === "string") {
    return location.trim();
  }

  return [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");
}

function normalizeMediaUrl(value) {
  if (typeof value === "string") {
    return value;
  }

  return value?.url ?? "";
}

function publicPrivacyAllows(profile, key) {
  return profile?.privacySettings?.[key] !== false;
}

function isPublicDiscoverableProfile(profile) {
  const visibility = profile?.profileVisibility ?? "public";

  return (
    visibility === "public" &&
    publicPrivacyAllows(profile, "allowDiscovery") &&
    publicPrivacyAllows(profile, "allowProviderListing")
  );
}

function getPublicVerificationDisplay(profile, providerProfile) {
  const providerStatus = String(providerProfile?.verificationStatus ?? "").toLowerCase();
  const profileStatus = String(profile?.verificationBadge?.status ?? "").toLowerCase();
  const isVerified =
    profileStatus === "verified" ||
    providerStatus === "verified";

  return {
    isVerified,
    label:
      profileStatus === "verified"
        ? profile?.verificationBadge?.label || "Verified"
        : isVerified
          ? "Verified"
          : "",
    type:
      profileStatus === "verified"
        ? "profile"
        : providerStatus === "verified"
          ? "provider"
          : "none",
  };
}

function isActiveUser(user) {
  return Boolean(user) && user.accountStatus === "active" && !user.isSuspended;
}

function normalizeBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "1", "yes"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no"].includes(normalized)) {
    return false;
  }

  return undefined;
}

function normalizeNumber(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    throw new AppError(`${label} must be a valid number`, 400);
  }

  return numberValue;
}

function normalizeSort(value, hasSearchQuery) {
  const sort = String(value ?? "").trim();

  if (validSorts.has(sort)) {
    if (sort === "rating_desc") {
      return "rating";
    }

    if (sort === "completed_desc") {
      return "completed_outcomes";
    }

    return sort;
  }

  return hasSearchQuery ? "relevance" : "proof_score";
}

function buildSort(sort, hasSearchQuery) {
  if (sort === "proof_score") {
    return { featured: -1, searchBoost: -1, proofScore: -1, completedOutcomes: -1, rating: -1 };
  }

  if (sort === "completed_outcomes") {
    return { featured: -1, searchBoost: -1, completedOutcomes: -1, totalProofsApproved: -1, proofScore: -1 };
  }

  if (sort === "rating") {
    return { featured: -1, searchBoost: -1, ratingAverage: -1, rating: -1, totalReviews: -1 };
  }

  if (sort === "price_asc") {
    return { featured: -1, searchBoost: -1, hourlyRate: 1, rating: -1, completedProjects: -1 };
  }

  if (sort === "price_desc") {
    return { featured: -1, searchBoost: -1, hourlyRate: -1, rating: -1, completedProjects: -1 };
  }

  if (sort === "completed_desc") {
    return { featured: -1, searchBoost: -1, completedProjects: -1, rating: -1, hourlyRate: 1 };
  }

  if (sort === "newest") {
    return { featured: -1, searchBoost: -1, createdAt: -1 };
  }

  if (sort === "relevance" && hasSearchQuery) {
    return { featured: -1, searchBoost: -1, rating: -1, completedProjects: -1, hourlyRate: 1 };
  }

  return { featured: -1, searchBoost: -1, rating: -1, completedProjects: -1, hourlyRate: 1 };
}

function uniqueObjectIds(values) {
  const ids = new Map();

  values.forEach((value) => {
    const stringValue = value?._id?.toString?.() ?? value?.toString?.() ?? "";

    if (mongoose.Types.ObjectId.isValid(stringValue)) {
      ids.set(stringValue, new mongoose.Types.ObjectId(stringValue));
    }
  });

  return Array.from(ids.values());
}

function serializeUser(user, { includePrivate = false } = {}) {
  if (!user) {
    return null;
  }

  const userId = user._id?.toString?.() ?? user.id;
  const serialized = {
    avatar: user.avatar ?? "",
    fullName: user.fullName ?? user.name ?? "",
    id: userId,
    isVerified: includePrivate ? Boolean(user.isVerified) : false,
    name: user.name ?? user.fullName ?? "",
    role: user.role ?? "provider",
    username: user.username ?? "",
    verificationStatus: includePrivate
      ? user.verificationStatus ?? "pending"
      : "none",
  };

  if (includePrivate) {
    serialized._id = userId;
    serialized.stripeConnectStatus = user.stripeConnectStatus ?? "not_started";
  }

  return serialized;
}

function serializeProvider({
  includePrivate = false,
  profile,
  publicProfile,
  searchScore,
  serviceSummary,
}) {
  const user = serializeUser(profile.userId, { includePrivate });
  const showProofScore = publicPrivacyAllows(publicProfile, "showProofScore");
  const showServices = publicPrivacyAllows(publicProfile, "showServices");
  const publicServices =
    showServices
      ? (publicProfile?.services ?? [])
          .filter((service) => service?.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .slice(0, 3)
          .map((service) => ({
            category: service.category ?? "",
            deliveryType: service.deliveryType ?? "",
            startingPrice: service.startingPrice ?? 0,
            title: service.title ?? "",
          }))
      : [];
  const verification = getPublicVerificationDisplay(publicProfile, profile);
  const verificationStatus = verification.isVerified ? "verified" : "none";
  const username = user?.username ?? "";
  const proofScore = showProofScore ? profile.proofScore ?? 0 : 0;
  const completedOutcomes = showProofScore
    ? profile.completedOutcomes ?? profile.completedProjects ?? 0
    : 0;
  const approvalRate = showProofScore ? profile.approvalRate ?? 0 : 0;
  const onTimeRate = showProofScore ? profile.onTimeRate ?? 0 : 0;
  const ratingAverage = showProofScore
    ? profile.ratingAverage ?? profile.rating ?? profile.stats?.averageRating ?? 0
    : 0;
  const totalReviews = showProofScore
    ? profile.totalReviews ?? profile.stats?.totalReviews ?? 0
    : 0;

  const serialized = {
    approvalRate,
    availability: profile.availability,
    avatar: normalizeMediaUrl(publicProfile?.profilePicture) || user?.avatar || "",
    categories: profile.categories ?? [],
    completedOutcomes,
    completedProjects: profile.completedProjects ?? 0,
    coverImage: normalizeMediaUrl(publicProfile?.coverImage),
    currentCompany: publicProfile?.currentCompany ?? publicProfile?.companyName ?? publicProfile?.company ?? "",
    currentPosition: publicProfile?.currentPosition ?? profile.title ?? "",
    fullName: user?.fullName ?? user?.name ?? "",
    headline: publicProfile?.headline || profile.title,
    hourlyRate: profile.hourlyRate ?? 0,
    id: user?.id || user?._id || "",
    isAvailableForChallenges: profile.isAvailableForChallenges !== false,
    languages: profile.languages ?? [],
    location: locationToText(publicProfile?.location),
    onTimeRate,
    profilePicture: normalizeMediaUrl(publicProfile?.profilePicture) || user?.avatar || "",
    profileUrl: username ? `/profile/${username}` : "",
    proofScore,
    publicUrl: username ? `/profile/${username}` : "",
    rating: profile.rating ?? 0,
    ratingAverage,
    role: user?.role ?? "provider",
    searchScore: searchScore ?? 0,
    serviceSummary: {
      categories: showServices
        ? publicServices.map((service) => service.category).filter(Boolean).length > 0
          ? publicServices.map((service) => service.category).filter(Boolean)
          : serviceSummary?.categories ?? []
        : [],
      count: showServices ? publicServices.length || serviceSummary?.count || 0 : 0,
      startingPrice:
        showServices
          ? publicServices
              .map((service) => service.startingPrice)
              .filter((price) => Number(price) > 0)
              .sort((a, b) => a - b)[0] ??
            serviceSummary?.startingPrice ??
            null
          : null,
      tags: showServices ? serviceSummary?.tags ?? [] : [],
      titles: showServices
        ? publicServices.map((service) => service.title).filter(Boolean).length > 0
          ? publicServices.map((service) => service.title).filter(Boolean)
          : serviceSummary?.titles ?? []
        : [],
    },
    servicesPreview: publicServices,
    skills: profile.skills ?? [],
    title: profile.title,
    totalChallengesApplied: showProofScore ? profile.totalChallengesApplied ?? 0 : 0,
    totalChallengesWon: showProofScore ? profile.totalChallengesWon ?? 0 : 0,
    totalProofsApproved: showProofScore ? profile.totalProofsApproved ?? 0 : 0,
    totalReviews,
    user,
    username,
    verification,
    verificationStatus,
    verifiedAt: profile.verifiedAt ?? null,
  };

  if (includePrivate) {
    serialized._id = profile._id?.toString?.() ?? profile.id;
    serialized.userId = user?._id || user?.id || "";
    serialized.verificationStatus = profile.verificationStatus ?? "none";
  }

  if (!verification.isVerified) {
    serialized.verifiedAt = null;
  }

  return serialized;
}

async function getServiceSummary(providerIds) {
  if (providerIds.length === 0) {
    return new Map();
  }

  const services = await Service.find({
    providerId: { $in: providerIds },
    status: "active",
  })
    .select("providerId fixedPrice hourlyRate pricingType title category tags")
    .sort({ price: 1, createdAt: -1 })
    .lean();
  const summary = new Map();

  services.forEach((service) => {
    const providerId = service.providerId?.toString?.() ?? "";
    const current = summary.get(providerId) ?? {
      categories: new Set(),
      count: 0,
      startingPrice: null,
      tags: new Set(),
      titles: [],
    };

    current.count += 1;

    if (service.category) {
      current.categories.add(service.category);
    }

    (service.tags ?? []).forEach((tag) => current.tags.add(tag));

    if (service.title && current.titles.length < 3) {
      current.titles.push(service.title);
    }

    const servicePrice =
      service.pricingType === "hourly" ? service.hourlyRate : service.fixedPrice;

    if (
      servicePrice > 0 &&
      (current.startingPrice === null || servicePrice < current.startingPrice)
    ) {
      current.startingPrice = servicePrice;
    }

    summary.set(providerId, current);
  });

  return new Map(
    Array.from(summary.entries()).map(([providerId, value]) => [
      providerId,
      {
        categories: Array.from(value.categories),
        count: value.count,
        startingPrice: value.startingPrice,
        tags: Array.from(value.tags).slice(0, 8),
        titles: value.titles,
      },
    ]),
  );
}

async function findTextMatchedProviderProfiles(queryText) {
  try {
    return await ProviderProfile.find({
      $text: { $search: queryText },
      $or: [
        { moderationStatus: "active" },
        { moderationStatus: { $exists: false } },
      ],
    })
      .select("_id")
      .limit(400)
      .lean();
  } catch (error) {
    if (String(error.message ?? "").toLowerCase().includes("text index")) {
      return [];
    }

    throw error;
  }
}

async function findProviderSearchMatches(queryText) {
  const regex = new RegExp(escapeRegex(queryText), "i");
  const [textProfiles, matchingUsers, matchingPublicProfiles] = await Promise.all([
    findTextMatchedProviderProfiles(queryText),
    User.find({
      isSuspended: { $ne: true },
      role: "provider",
      $or: [
        { fullName: regex },
        { name: regex },
        { username: regex },
      ],
    })
      .select("_id")
      .limit(300)
      .lean(),
    UserProfile.find({
      $or: [
        { company: regex },
        { headline: regex },
        { location: regex },
        { skills: regex },
      ],
    })
      .select("userId")
      .limit(300)
      .lean(),
  ]);

  return {
    profileIds: uniqueObjectIds(textProfiles.map((profile) => profile._id)),
    userIds: uniqueObjectIds([
      ...matchingUsers.map((user) => user._id),
      ...matchingPublicProfiles.map((profile) => profile.userId),
    ]),
  };
}

export async function searchProviders(filters = {}) {
  ensureDatabaseConnection();

  const queryText = String(filters.q ?? filters.search ?? "").trim();
  const categories = normalizeList(filters.category ?? filters.categories);
  const skills = normalizeList(filters.skill ?? filters.skills);
  const location = String(filters.location ?? "").trim();
  const availability = String(filters.availability ?? "").trim().toLowerCase();
  const available = normalizeBoolean(filters.available);
  const verified = normalizeBoolean(filters.verified);
  const minRate = normalizeNumber(filters.minRate ?? filters.minPrice, "Minimum pricing");
  const maxRate = normalizeNumber(filters.maxRate ?? filters.maxPrice, "Maximum pricing");
  const minRating = normalizeNumber(filters.minRating ?? filters.rating, "Minimum rating");
  const minProofScore = normalizeNumber(filters.minProofScore, "Minimum proof score");
  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1),
    50,
  );
  const hasSearchQuery = queryText.length > 0;
  const sort = normalizeSort(filters.sort, hasSearchQuery);
  const role = String(filters.role ?? "provider").trim().toLowerCase() || "provider";
  const providerQuery = {
    $and: [
      {
        $or: [
          { moderationStatus: "active" },
          { moderationStatus: { $exists: false } },
        ],
      },
    ],
  };

  if (categories.length > 0) {
    providerQuery.categories = { $in: categories.map(exactRegex) };
  }

  if (skills.length > 0) {
    providerQuery.$and = [
      ...(providerQuery.$and ?? []),
      ...skills.map((skill) => ({ skills: exactRegex(skill) })),
    ];
  }

  if (available === true) {
    providerQuery.isAvailableForChallenges = { $ne: false };
  }

  if (availability || available !== undefined) {
    const normalizedAvailability = availability || (available ? "available" : "");

    if (normalizedAvailability && !validAvailability.has(normalizedAvailability)) {
      throw new AppError("Availability filter is invalid", 400);
    }

    if (normalizedAvailability) {
      providerQuery.availability = normalizedAvailability;
    }
  }

  if (minRate !== undefined || maxRate !== undefined) {
    providerQuery.hourlyRate = {};

    if (minRate !== undefined) {
      providerQuery.hourlyRate.$gte = minRate;
    }

    if (maxRate !== undefined) {
      providerQuery.hourlyRate.$lte = maxRate;
    }
  }

  if (minRating !== undefined) {
    providerQuery.$and.push({
      $or: [
        { rating: { $gte: minRating } },
        { ratingAverage: { $gte: minRating } },
      ],
    });
  }

  if (minProofScore !== undefined) {
    providerQuery.proofScore = { $gte: minProofScore };
  }

  if (role === "client") {
    return {
      filters: {
        available,
        availability,
        categories,
        location,
        maxRate,
        minProofScore,
        minRate,
        minRating,
        q: queryText,
        role,
        skills,
        sort,
        verified,
      },
      items: [],
      pagination: {
        hasMore: false,
        limit,
        page,
        total: 0,
      },
    };
  }

  const publicProfileQuery = {
    $or: [
      { profileVisibility: "public" },
      { profileVisibility: { $exists: false } },
    ],
    $and: [
      { "privacySettings.allowDiscovery": { $ne: false } },
      { "privacySettings.allowProviderListing": { $ne: false } },
    ],
  };

  if (location) {
    const locationRegex = new RegExp(escapeRegex(location), "i");
    publicProfileQuery.$and.push({
      $or: [
        { location: locationRegex },
        { "location.city": locationRegex },
        { "location.country": locationRegex },
        { "location.state": locationRegex },
      ],
    });
  }

  const publicProfiles = await UserProfile.find(publicProfileQuery)
    .select(
      "bio company companyName coverImage currentCompany currentPosition headline industry location privacySettings profilePicture profileVisibility services skills userId verificationBadge",
    )
    .lean();
  const allowedPublicProfiles = publicProfiles.filter(isPublicDiscoverableProfile);
  const allowedUserIds = allowedPublicProfiles.map((profile) => profile.userId);
  const users = allowedUserIds.length
    ? await User.find({
        _id: { $in: allowedUserIds },
        accountStatus: "active",
        isSuspended: { $ne: true },
        role: "provider",
      })
        .select(providerUserSelect)
        .lean()
    : [];
  const activeUsers = users.filter(isActiveUser);
  const activeUserIds = activeUsers.map((user) => user._id);

  if (activeUserIds.length === 0) {
    return {
      filters: {
        available,
        availability,
        categories,
        location,
        maxRate,
        minProofScore,
        minRate,
        minRating,
        q: queryText,
        role,
        skills,
        sort,
        verified,
      },
      items: [],
      pagination: {
        hasMore: false,
        limit,
        page,
        total: 0,
      },
    };
  }

  providerQuery.userId = { $in: activeUserIds };

  const profiles = await ProviderProfile.find(providerQuery)
    .sort(buildSort(sort, hasSearchQuery))
    .lean();
  const publicProfileByUserId = new Map(
    allowedPublicProfiles.map((profile) => [profile.userId.toString(), profile]),
  );
  const userById = new Map(activeUsers.map((user) => [user._id.toString(), user]));
  const [serviceSummary] = await Promise.all([
    getServiceSummary(activeUserIds),
  ]);
  const filteredProfiles = profiles.filter((profile) => {
    const userId = profile.userId?.toString?.() ?? "";
    const user = userById.get(userId);
    const publicProfile = publicProfileByUserId.get(userId);

    if (!user || !publicProfile) {
      return false;
    }

    if (minProofScore !== undefined && !publicPrivacyAllows(publicProfile, "showProofScore")) {
      return false;
    }

    const publicVerification = getPublicVerificationDisplay(publicProfile, profile, user);

    if (verified === true && !publicVerification.isVerified) {
      return false;
    }

    if (verified === false && publicVerification.isVerified) {
      return false;
    }

    if (!hasSearchQuery) {
      return true;
    }

    const serviceText = publicPrivacyAllows(publicProfile, "showServices")
      ? (publicProfile.services ?? [])
          .filter((service) => service?.isActive !== false)
          .flatMap((service) => [
            service.title,
            service.category,
            service.description,
            ...(service.proofRequired ?? []),
          ])
          .join(" ")
      : "";
    const haystack = [
      user.fullName,
      user.name,
      user.username,
      publicProfile.bio,
      publicProfile.company,
      publicProfile.companyName,
      publicProfile.currentCompany,
      publicProfile.currentPosition,
      publicProfile.headline,
      publicProfile.industry,
      locationToText(publicProfile.location),
      ...(publicProfile.skills ?? []).map((skill) =>
        typeof skill === "string" ? skill : skill?.name,
      ),
      profile.headline,
      profile.professionalSummary,
      profile.title,
      ...(profile.categories ?? []),
      ...(profile.languages ?? []),
      ...(profile.skills ?? []),
      serviceText,
    ].join(" ");

    return containsInsensitive(haystack, queryText);
  });

  filteredProfiles.sort((left, right) => {
    const leftProfile = publicProfileByUserId.get(left.userId?.toString?.() ?? "");
    const rightProfile = publicProfileByUserId.get(right.userId?.toString?.() ?? "");
    const leftShowProof = publicPrivacyAllows(leftProfile, "showProofScore");
    const rightShowProof = publicPrivacyAllows(rightProfile, "showProofScore");

    if (sort === "newest") {
      return new Date(right.createdAt ?? 0) - new Date(left.createdAt ?? 0);
    }

    if (sort === "completed_outcomes") {
      return (
        (rightShowProof ? right.completedOutcomes ?? right.completedProjects ?? 0 : 0) -
        (leftShowProof ? left.completedOutcomes ?? left.completedProjects ?? 0 : 0)
      );
    }

    if (sort === "rating") {
      return (
        (rightShowProof ? right.ratingAverage ?? right.rating ?? 0 : 0) -
        (leftShowProof ? left.ratingAverage ?? left.rating ?? 0 : 0)
      );
    }

    if (sort === "price_asc") {
      return (left.hourlyRate ?? 0) - (right.hourlyRate ?? 0);
    }

    if (sort === "price_desc") {
      return (right.hourlyRate ?? 0) - (left.hourlyRate ?? 0);
    }

    return (
      (right.featured ? 1 : 0) - (left.featured ? 1 : 0) ||
      (right.searchBoost ?? 0) - (left.searchBoost ?? 0) ||
      (rightShowProof ? right.proofScore ?? 0 : 0) -
        (leftShowProof ? left.proofScore ?? 0 : 0) ||
      (rightShowProof ? right.completedOutcomes ?? 0 : 0) -
        (leftShowProof ? left.completedOutcomes ?? 0 : 0) ||
      (right.rating ?? 0) - (left.rating ?? 0)
    );
  });

  const total = filteredProfiles.length;
  const paginatedProfiles = filteredProfiles.slice((page - 1) * limit, page * limit);

  return {
    filters: {
      available,
      availability,
      categories,
      location,
      maxRate,
      minProofScore,
      minRate,
      minRating,
      q: queryText,
      role,
      skills,
      sort,
      verified,
    },
    items: paginatedProfiles.map((profile) => {
      const userId = profile.userId.toString();

      return serializeProvider({
        profile: {
          ...profile,
          userId: userById.get(userId),
        },
        publicProfile: publicProfileByUserId.get(userId),
        searchScore: profile.score,
        serviceSummary: serviceSummary.get(userId) ?? {
          categories: [],
          count: 0,
          startingPrice: null,
          tags: [],
          titles: [],
        },
      });
    }),
    pagination: {
      hasMore: page * limit < total,
      limit,
      page,
      total,
    },
  };
}

export async function listMarketplaceProvidersForAdmin(filters = {}) {
  ensureDatabaseConnection();

  const status = String(filters.status ?? "").trim();
  const search = String(filters.q ?? filters.search ?? "").trim();
  const query = {};

  if (status) {
    if (!validModerationStatuses.has(status)) {
      throw new AppError("Provider moderation status is invalid", 400);
    }

    query.moderationStatus = status;
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { categories: regex },
      { languages: regex },
      { skills: regex },
      { title: regex },
    ];
  }

  const profiles = await ProviderProfile.find(query)
    .populate({
      path: "userId",
      select: providerUserSelect,
    })
    .sort({ featured: -1, rating: -1, createdAt: -1 })
    .limit(100)
    .lean();
  const activeProfiles = profiles.filter((profile) => profile.userId);
  const providerIds = activeProfiles.map((profile) =>
    new mongoose.Types.ObjectId(profile.userId._id),
  );
  const [publicProfiles, serviceSummary] = await Promise.all([
    providerIds.length ? UserProfile.find({ userId: { $in: providerIds } }).lean() : [],
    getServiceSummary(providerIds),
  ]);
  const publicProfileByUserId = new Map(
    publicProfiles.map((profile) => [profile.userId.toString(), profile]),
  );

  return {
    items: activeProfiles.map((profile) => {
      const userId = profile.userId._id.toString();

      return {
        ...serializeProvider({
          includePrivate: true,
          profile,
          publicProfile: publicProfileByUserId.get(userId),
          serviceSummary: serviceSummary.get(userId) ?? {
            categories: [],
            count: 0,
            startingPrice: null,
            tags: [],
            titles: [],
          },
        }),
        featured: Boolean(profile.featured),
        moderationNote: profile.moderationNote ?? "",
        moderationStatus: profile.moderationStatus ?? "active",
        searchBoost: profile.searchBoost ?? 0,
        verificationDocuments: profile.verificationDocuments ?? [],
        verificationStatus: profile.verificationStatus ?? "none",
        verifiedAt: profile.verifiedAt ?? null,
      };
    }),
  };
}

export async function updateMarketplaceProviderForAdmin(userId, updates = {}) {
  ensureDatabaseConnection();

  const providerProfile = await ProviderProfile.findOne({ userId });

  if (!providerProfile) {
    throw new AppError("Provider profile not found", 404);
  }

  if (updates.moderationStatus !== undefined) {
    const status = String(updates.moderationStatus ?? "").trim();

    if (!validModerationStatuses.has(status)) {
      throw new AppError("Provider moderation status is invalid", 400);
    }

    providerProfile.moderationStatus = status;
  }

  if (updates.featured !== undefined) {
    providerProfile.featured = Boolean(updates.featured);
  }

  if (updates.searchBoost !== undefined) {
    const searchBoost = Number(updates.searchBoost);

    if (!Number.isFinite(searchBoost) || searchBoost < 0 || searchBoost > 100) {
      throw new AppError("Search boost must be between 0 and 100", 400);
    }

    providerProfile.searchBoost = searchBoost;
  }

  if (updates.moderationNote !== undefined) {
    providerProfile.moderationNote = String(updates.moderationNote ?? "")
      .trim()
      .slice(0, 1000);
  }

  if (updates.rating !== undefined) {
    const rating = Number(updates.rating);

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      throw new AppError("Rating must be between 0 and 5", 400);
    }

    providerProfile.rating = rating;
  }

  if (updates.verificationStatus !== undefined) {
    const verificationStatus = String(updates.verificationStatus ?? "").trim();

    if (!["none", "pending", "verified", "rejected"].includes(verificationStatus)) {
      throw new AppError("Provider verification status is invalid", 400);
    }

    providerProfile.verificationStatus = verificationStatus;
    providerProfile.verifiedAt = verificationStatus === "verified" ? new Date() : null;
  }

  await providerProfile.save();

  return listMarketplaceProvidersForAdmin();
}
