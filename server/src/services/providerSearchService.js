import mongoose from "mongoose";
import {
  OFFER_AVAILABILITY_STATUS,
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_VISIBILITY,
} from "../constants/index.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const discoveryAvailabilityValues = [
  OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW,
  OFFER_AVAILABILITY_STATUS.AVAILABLE_THIS_WEEK,
  OFFER_AVAILABILITY_STATUS.AVAILABLE_NEXT_WEEK,
  OFFER_AVAILABILITY_STATUS.LIMITED,
  OFFER_AVAILABILITY_STATUS.FULLY_BOOKED,
];
const validAvailability = new Set([
  "available",
  "limited",
  "unavailable",
  ...discoveryAvailabilityValues,
]);
const validModerationStatuses = new Set(["pending", "active", "rejected", "suspended"]);
const validSorts = new Set([
  "relevance",
  "proof_score",
  "completed_outcomes",
  "availability",
  "name",
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
    return value.map((item) => String(item ?? "").trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueStrings(values, limit = 100) {
  return Array.from(
    new Set(
      values
        .flat()
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  )
    .sort((left, right) => left.localeCompare(right))
    .slice(0, limit);
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

function hasAnyTextMatch(values, needles) {
  const normalizedNeedles = normalizeList(needles);

  if (normalizedNeedles.length === 0) {
    return true;
  }

  return normalizedNeedles.some((needle) =>
    values.some((value) => containsInsensitive(value, needle)),
  );
}

function firstNonEmpty(...values) {
  return values.find((value) => String(value ?? "").trim()) ?? "";
}

function truncateText(value, maxLength = 220) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
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

function normalizeAvailabilityFilter(value) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  if (!validAvailability.has(normalized)) {
    throw new AppError("Availability filter is invalid", 400);
  }

  return normalized;
}

function getDiscoveryAvailability(profile, outcomeOfferSummary = {}) {
  const offerStatuses = outcomeOfferSummary.availabilityStatuses ?? [];

  if (offerStatuses.includes(OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW)) {
    return OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW;
  }

  if (offerStatuses.includes(OFFER_AVAILABILITY_STATUS.AVAILABLE_THIS_WEEK)) {
    return OFFER_AVAILABILITY_STATUS.AVAILABLE_THIS_WEEK;
  }

  if (offerStatuses.includes(OFFER_AVAILABILITY_STATUS.AVAILABLE_NEXT_WEEK)) {
    return OFFER_AVAILABILITY_STATUS.AVAILABLE_NEXT_WEEK;
  }

  if (offerStatuses.includes(OFFER_AVAILABILITY_STATUS.LIMITED)) {
    return OFFER_AVAILABILITY_STATUS.LIMITED;
  }

  if (offerStatuses.includes(OFFER_AVAILABILITY_STATUS.FULLY_BOOKED)) {
    return OFFER_AVAILABILITY_STATUS.FULLY_BOOKED;
  }

  if (profile?.availability === "limited") {
    return OFFER_AVAILABILITY_STATUS.LIMITED;
  }

  if (profile?.availability === "unavailable") {
    return OFFER_AVAILABILITY_STATUS.FULLY_BOOKED;
  }

  return OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW;
}

function getAvailabilityRank(status) {
  return {
    [OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW]: 5,
    [OFFER_AVAILABILITY_STATUS.AVAILABLE_THIS_WEEK]: 4,
    [OFFER_AVAILABILITY_STATUS.AVAILABLE_NEXT_WEEK]: 3,
    [OFFER_AVAILABILITY_STATUS.LIMITED]: 2,
    [OFFER_AVAILABILITY_STATUS.FULLY_BOOKED]: 1,
  }[status] ?? 0;
}

function matchesAvailability(profile, outcomeOfferSummary, requestedAvailability) {
  if (!requestedAvailability) {
    return true;
  }

  const providerAvailability = getDiscoveryAvailability(profile, outcomeOfferSummary);
  const offerStatuses = new Set(outcomeOfferSummary?.availabilityStatuses ?? []);

  if (requestedAvailability === "available") {
    return profile.availability === "available" || providerAvailability === OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW;
  }

  if (requestedAvailability === "unavailable") {
    return profile.availability === "unavailable" || providerAvailability === OFFER_AVAILABILITY_STATUS.FULLY_BOOKED;
  }

  if (requestedAvailability === OFFER_AVAILABILITY_STATUS.AVAILABLE_NOW) {
    return profile.availability === "available" || offerStatuses.has(requestedAvailability);
  }

  if (
    requestedAvailability === OFFER_AVAILABILITY_STATUS.AVAILABLE_THIS_WEEK ||
    requestedAvailability === OFFER_AVAILABILITY_STATUS.AVAILABLE_NEXT_WEEK
  ) {
    return profile.availability === "available" || offerStatuses.has(requestedAvailability);
  }

  if (requestedAvailability === OFFER_AVAILABILITY_STATUS.LIMITED) {
    return profile.availability === "limited" || offerStatuses.has(requestedAvailability);
  }

  if (requestedAvailability === OFFER_AVAILABILITY_STATUS.FULLY_BOOKED) {
    return profile.availability === "unavailable" || offerStatuses.has(requestedAvailability);
  }

  return true;
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

  if (sort === "availability") {
    return { featured: -1, searchBoost: -1, availability: 1, proofScore: -1 };
  }

  if (sort === "name") {
    return { featured: -1, searchBoost: -1, title: 1 };
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
  outcomeOfferSummary = createEmptyOutcomeOfferSummary(),
  profile,
  publicProfile,
  searchScore,
  serviceSummary,
}) {
  const user = serializeUser(profile.userId, { includePrivate });
  const showProofScore = publicPrivacyAllows(publicProfile, "showProofScore");
  const showServices = publicPrivacyAllows(publicProfile, "showServices");
  const safeOutcomeOfferSummary = showServices
    ? outcomeOfferSummary
    : createEmptyOutcomeOfferSummary();
  const topPublicOutcomeOffer = safeOutcomeOfferSummary.offers?.[0] ?? null;
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
  const displayName = user?.fullName ?? user?.name ?? "ProofArena provider";
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
  const publicHourlyRate = showServices ? profile.hourlyRate ?? 0 : 0;
  const publicServiceSummary = {
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
  };

  const serialized = {
    approvalRate,
    availability: getDiscoveryAvailability(profile, safeOutcomeOfferSummary),
    avatar: normalizeMediaUrl(publicProfile?.profilePicture) || user?.avatar || "",
    avatarUrl: normalizeMediaUrl(publicProfile?.profilePicture) || user?.avatar || "",
    bioExcerpt: truncateText(publicProfile?.bio, 220),
    categories: profile.categories ?? [],
    completedOutcomes,
    completedProjects: completedOutcomes,
    coverImage: normalizeMediaUrl(publicProfile?.coverImage),
    currentCompany: publicProfile?.currentCompany ?? publicProfile?.companyName ?? publicProfile?.company ?? "",
    currentPosition: publicProfile?.currentPosition ?? profile.title ?? "",
    displayName,
    fullName: displayName,
    headline: publicProfile?.headline || profile.title,
    hourlyRate: publicHourlyRate,
    id: user?.id || user?._id || "",
    isAvailableForChallenges: profile.isAvailableForChallenges !== false,
    languages: profile.languages ?? [],
    location: locationToText(publicProfile?.location),
    onTimeRate,
    outcomeOfferCount: safeOutcomeOfferSummary.count ?? 0,
    outcomeOffers: {
      categories: safeOutcomeOfferSummary.categories ?? [],
      count: safeOutcomeOfferSummary.count ?? 0,
      offers: safeOutcomeOfferSummary.offers ?? [],
      top: topPublicOutcomeOffer,
      titles: safeOutcomeOfferSummary.titles ?? [],
    },
    outcomeOffersSummary: {
      categories: safeOutcomeOfferSummary.categories ?? [],
      count: safeOutcomeOfferSummary.count ?? 0,
      top: topPublicOutcomeOffer,
      titles: safeOutcomeOfferSummary.titles ?? [],
      tools: safeOutcomeOfferSummary.tools ?? [],
    },
    profilePicture: normalizeMediaUrl(publicProfile?.profilePicture) || user?.avatar || "",
    profileUrl: username ? `/profile/${username}` : "",
    providerSince: profile.createdAt ?? user?.createdAt ?? null,
    proofScore,
    proofMetricsAvailable: showProofScore,
    publicProfileUrl: username ? `/profile/${username}` : "",
    publicUrl: username ? `/profile/${username}` : "",
    rating: ratingAverage,
    ratingAverage,
    role: user?.role ?? "provider",
    searchScore: searchScore ?? 0,
    serviceSummary: publicServiceSummary,
    servicesPreview: publicServices,
    servicesSummary: publicServiceSummary,
    skills: profile.skills ?? [],
    title: profile.title,
    topPublicOutcomeOffer,
    tools: safeOutcomeOfferSummary.tools ?? [],
    totalChallengesApplied: showProofScore ? profile.totalChallengesApplied ?? 0 : 0,
    totalChallengesWon: showProofScore ? profile.totalChallengesWon ?? 0 : 0,
    totalProofsApproved: showProofScore ? profile.totalProofsApproved ?? 0 : 0,
    totalReviews,
    user,
    userId: user?.id || user?._id || "",
    username,
    verificationBadge: {
      isVerified: verification.isVerified,
      label: verification.label,
      status: verificationStatus,
      type: verification.type,
    },
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

function createEmptyOutcomeOfferSummary() {
  return {
    availabilityStatuses: [],
    categories: [],
    count: 0,
    offers: [],
    skills: [],
    tags: [],
    titles: [],
    tools: [],
  };
}

function getPublishedOutcomeOfferQuery(providerIds) {
  return {
    providerId: { $in: providerIds },
    status: OUTCOME_OFFER_STATUS.PUBLISHED,
    visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    $or: [
      { "moderation.status": "approved" },
      { "moderation.status": { $exists: false } },
    ],
  };
}

async function getOutcomeOfferSummary(providerIds) {
  if (providerIds.length === 0) {
    return new Map();
  }

  const offers = await OutcomeOffer.find(getPublishedOutcomeOfferQuery(providerIds))
    .select(
      "availability category deliveryTimeline providerId priceRange proofIncluded qualityScore shortSummary skills slug tags targetOutcome title tools",
    )
    .sort({ "qualityScore.score": -1, createdAt: -1 })
    .limit(600)
    .lean();
  const summary = new Map();

  offers.forEach((offer) => {
    const providerId = offer.providerId?.toString?.() ?? "";
    const current = summary.get(providerId) ?? {
      availabilityStatuses: new Set(),
      categories: new Set(),
      count: 0,
      offers: [],
      skills: new Set(),
      tags: new Set(),
      titles: [],
      tools: new Set(),
    };

    current.count += 1;

    if (offer.availability?.status) {
      current.availabilityStatuses.add(offer.availability.status);
    }

    if (offer.category) {
      current.categories.add(offer.category);
    }

    (offer.skills ?? []).forEach((skill) => current.skills.add(skill));
    (offer.tags ?? []).forEach((tag) => current.tags.add(tag));
    (offer.tools ?? []).forEach((tool) => current.tools.add(tool));

    if (offer.title && current.titles.length < 5) {
      current.titles.push(offer.title);
    }

    if (current.offers.length < 3) {
      current.offers.push({
        availability: offer.availability?.status ?? "",
        category: offer.category ?? "",
        deliveryTimeline: offer.deliveryTimeline ?? null,
        priceRange: offer.priceRange ?? null,
        proofIncludedCount: offer.proofIncluded?.length ?? 0,
        qualityScore: offer.qualityScore?.score ?? 0,
        shortSummary: offer.shortSummary ?? "",
        skills: (offer.skills ?? []).slice(0, 6),
        slug: offer.slug ?? "",
        targetOutcome: offer.targetOutcome?.outcomeStatement ?? "",
        title: offer.title ?? "",
        tools: (offer.tools ?? []).slice(0, 6),
      });
    }

    summary.set(providerId, current);
  });

  return new Map(
    Array.from(summary.entries()).map(([providerId, value]) => [
      providerId,
      {
        availabilityStatuses: Array.from(value.availabilityStatuses),
        categories: Array.from(value.categories),
        count: value.count,
        offers: value.offers,
        skills: Array.from(value.skills),
        tags: Array.from(value.tags).slice(0, 12),
        titles: value.titles,
        tools: Array.from(value.tools).slice(0, 20),
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
  const tools = normalizeList(filters.tool ?? filters.tools);
  const location = String(filters.location ?? "").trim();
  const availability = normalizeAvailabilityFilter(filters.availability);
  const available = normalizeBoolean(filters.available);
  const verified = normalizeBoolean(filters.verified);
  const hasOutcomeOffers = normalizeBoolean(filters.hasOutcomeOffers);
  const minRate = normalizeNumber(filters.minRate ?? filters.minPrice, "Minimum pricing");
  const maxRate = normalizeNumber(filters.maxRate ?? filters.maxPrice, "Maximum pricing");
  const minRating = normalizeNumber(filters.minRating ?? filters.rating, "Minimum rating");
  const minProofScore = normalizeNumber(filters.minProofScore, "Minimum proof score");
  const minCompletedOutcomes = normalizeNumber(
    filters.minCompletedOutcomes,
    "Minimum completed outcomes",
  );
  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1),
    50,
  );
  const hasSearchQuery = queryText.length > 0;
  const sort = normalizeSort(filters.sort, hasSearchQuery);
  const role = String(filters.role ?? "provider").trim().toLowerCase() || "provider";
  const appliedFilters = {
    available,
    availability,
    categories,
    hasOutcomeOffers,
    location,
    maxRate,
    minCompletedOutcomes,
    minProofScore,
    minRate,
    minRating,
    q: queryText,
    role,
    skills,
    sort,
    tools,
    verified,
  };
  const createResult = (items = [], total = 0, filterOptions = {}) => ({
    filters: {
      applied: appliedFilters,
      availability: discoveryAvailabilityValues,
      categories: filterOptions.categories ?? [],
      skills: filterOptions.skills ?? [],
      tools: filterOptions.tools ?? [],
    },
    items,
    pagination: {
      hasMore: page * limit < total,
      limit,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      total,
    },
  });
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

  if (available === true) {
    providerQuery.isAvailableForChallenges = { $ne: false };
  }

  const legacyAvailability =
    availability === "available" || availability === "limited" || availability === "unavailable"
      ? availability
      : "";

  if (legacyAvailability) {
    providerQuery.availability = legacyAvailability;
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

  if (minCompletedOutcomes !== undefined) {
    providerQuery.$and.push({
      $or: [
        { completedOutcomes: { $gte: minCompletedOutcomes } },
        { completedProjects: { $gte: minCompletedOutcomes } },
      ],
    });
  }

  if (role === "client") {
    return createResult();
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
    return createResult();
  }

  providerQuery.userId = { $in: activeUserIds };

  const profiles = await ProviderProfile.find(providerQuery)
    .sort(buildSort(sort, hasSearchQuery))
    .lean();
  const publicProfileByUserId = new Map(
    allowedPublicProfiles.map((profile) => [profile.userId.toString(), profile]),
  );
  const userById = new Map(activeUsers.map((user) => [user._id.toString(), user]));
  const [serviceSummary, outcomeOfferSummary] = await Promise.all([
    getServiceSummary(activeUserIds),
    getOutcomeOfferSummary(activeUserIds),
  ]);
  const filteredProfiles = profiles.filter((profile) => {
    const userId = profile.userId?.toString?.() ?? "";
    const user = userById.get(userId);
    const publicProfile = publicProfileByUserId.get(userId);
    const showServices = publicPrivacyAllows(publicProfile, "showServices");
    const offers = showServices
      ? outcomeOfferSummary.get(userId) ?? createEmptyOutcomeOfferSummary()
      : createEmptyOutcomeOfferSummary();
    const serviceCategories = showServices
      ? [
          ...(publicProfile?.services ?? [])
            .filter((service) => service?.isActive !== false)
            .map((service) => service.category),
          ...(serviceSummary.get(userId)?.categories ?? []),
        ]
      : [];
    const publicSkillNames = (publicProfile?.skills ?? []).map((skill) =>
      typeof skill === "string" ? skill : skill?.name,
    );

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

    if (minCompletedOutcomes !== undefined && !publicPrivacyAllows(publicProfile, "showProofScore")) {
      return false;
    }

    if (
      categories.length > 0 &&
      !hasAnyTextMatch(
        [
          ...(profile.categories ?? []),
          ...(offers.categories ?? []),
          ...serviceCategories,
        ],
        categories,
      )
    ) {
      return false;
    }

    if (
      skills.length > 0 &&
      !hasAnyTextMatch(
        [
          ...(profile.skills ?? []),
          ...publicSkillNames,
          ...(offers.skills ?? []),
        ],
        skills,
      )
    ) {
      return false;
    }

    if (hasOutcomeOffers === true && offers.count === 0) {
      return false;
    }

    if (hasOutcomeOffers === false && offers.count > 0) {
      return false;
    }

    if (!matchesAvailability(profile, offers, availability || (available ? "available" : ""))) {
      return false;
    }

    if (tools.length > 0 && !hasAnyTextMatch(offers.tools ?? [], tools)) {
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
    const offerText = showServices
      ? [
          ...(offers.titles ?? []),
          ...(offers.categories ?? []),
          ...(offers.skills ?? []),
          ...(offers.tools ?? []),
          ...(offers.tags ?? []),
          ...(offers.offers ?? []).flatMap((offer) => [
            offer.shortSummary,
            offer.targetOutcome,
            offer.title,
          ]),
        ].join(" ")
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
      offerText,
      serviceText,
    ].join(" ");

    return containsInsensitive(haystack, queryText);
  });

  filteredProfiles.sort((left, right) => {
    const leftProfile = publicProfileByUserId.get(left.userId?.toString?.() ?? "");
    const rightProfile = publicProfileByUserId.get(right.userId?.toString?.() ?? "");
    const leftShowProof = publicPrivacyAllows(leftProfile, "showProofScore");
    const rightShowProof = publicPrivacyAllows(rightProfile, "showProofScore");
    const leftOffers = publicPrivacyAllows(leftProfile, "showServices")
      ? outcomeOfferSummary.get(left.userId?.toString?.() ?? "") ?? createEmptyOutcomeOfferSummary()
      : createEmptyOutcomeOfferSummary();
    const rightOffers = publicPrivacyAllows(rightProfile, "showServices")
      ? outcomeOfferSummary.get(right.userId?.toString?.() ?? "") ?? createEmptyOutcomeOfferSummary()
      : createEmptyOutcomeOfferSummary();

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

    if (sort === "availability") {
      return (
        getAvailabilityRank(getDiscoveryAvailability(right, rightOffers)) -
        getAvailabilityRank(getDiscoveryAvailability(left, leftOffers))
      );
    }

    if (sort === "name") {
      const leftUser = userById.get(left.userId?.toString?.() ?? "");
      const rightUser = userById.get(right.userId?.toString?.() ?? "");
      const leftName = firstNonEmpty(leftUser?.fullName, leftUser?.name, leftUser?.username, left.title);
      const rightName = firstNonEmpty(rightUser?.fullName, rightUser?.name, rightUser?.username, right.title);

      return leftName.localeCompare(rightName);
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
  const filterOptions = {
    categories: uniqueStrings([
      filteredProfiles.flatMap((profile) => profile.categories ?? []),
      Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.categories ?? []),
    ]),
    skills: uniqueStrings([
      filteredProfiles.flatMap((profile) => profile.skills ?? []),
      Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.skills ?? []),
    ]),
    tools: uniqueStrings(Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.tools ?? [])),
  };

  return createResult(
    paginatedProfiles.map((profile) => {
      const userId = profile.userId.toString();

      return serializeProvider({
        outcomeOfferSummary: outcomeOfferSummary.get(userId) ?? createEmptyOutcomeOfferSummary(),
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
    total,
    filterOptions,
  );
}

export const getPublicProviders = searchProviders;

export async function comparePublicProviders(providerIds = []) {
  ensureDatabaseConnection();

  const requestedProviderIds = uniqueObjectIds(providerIds);

  if (requestedProviderIds.length === 0) {
    throw new AppError("At least one provider id is required", 400);
  }

  if (requestedProviderIds.length > 4) {
    throw new AppError("Maximum 4 providers can be compared", 400);
  }

  const users = await User.find({
    _id: { $in: requestedProviderIds },
    accountStatus: "active",
    isSuspended: { $ne: true },
    role: "provider",
  })
    .select(providerUserSelect)
    .lean();
  const activeUsers = users.filter(isActiveUser);
  const activeUserIds = activeUsers.map((user) => user._id);

  if (activeUserIds.length === 0) {
    return {
      items: [],
      maxProviders: 4,
      requested: requestedProviderIds.length,
    };
  }

  const [publicProfiles, providerProfiles, serviceSummary, outcomeOfferSummary] =
    await Promise.all([
      UserProfile.find({
        userId: { $in: activeUserIds },
        $or: [
          { profileVisibility: "public" },
          { profileVisibility: { $exists: false } },
        ],
        $and: [
          { "privacySettings.allowDiscovery": { $ne: false } },
          { "privacySettings.allowProviderListing": { $ne: false } },
        ],
      })
        .select(
          "bio company companyName coverImage currentCompany currentPosition headline industry location privacySettings profilePicture profileVisibility services skills userId verificationBadge",
        )
        .lean(),
      ProviderProfile.find({
        userId: { $in: activeUserIds },
        $or: [
          { moderationStatus: "active" },
          { moderationStatus: { $exists: false } },
        ],
      }).lean(),
      getServiceSummary(activeUserIds),
      getOutcomeOfferSummary(activeUserIds),
    ]);
  const userById = new Map(activeUsers.map((user) => [user._id.toString(), user]));
  const publicProfileByUserId = new Map(
    publicProfiles
      .filter(isPublicDiscoverableProfile)
      .map((profile) => [profile.userId.toString(), profile]),
  );
  const serializedByUserId = new Map();

  providerProfiles.forEach((profile) => {
    const userId = profile.userId?.toString?.() ?? "";
    const user = userById.get(userId);
    const publicProfile = publicProfileByUserId.get(userId);

    if (!user || !publicProfile) {
      return;
    }

    serializedByUserId.set(
      userId,
      serializeProvider({
        outcomeOfferSummary: outcomeOfferSummary.get(userId) ?? createEmptyOutcomeOfferSummary(),
        profile: {
          ...profile,
          userId: user,
        },
        publicProfile,
        serviceSummary: serviceSummary.get(userId) ?? {
          categories: [],
          count: 0,
          startingPrice: null,
          tags: [],
          titles: [],
        },
      }),
    );
  });

  return {
    items: requestedProviderIds
      .map((providerId) => serializedByUserId.get(providerId.toString()))
      .filter(Boolean),
    maxProviders: 4,
    requested: requestedProviderIds.length,
  };
}

export function buildProviderSearchQuery(filters = {}) {
  return {
    availability: normalizeAvailabilityFilter(filters.availability),
    categories: normalizeList(filters.category ?? filters.categories),
    hasOutcomeOffers: normalizeBoolean(filters.hasOutcomeOffers),
    minCompletedOutcomes: normalizeNumber(filters.minCompletedOutcomes, "Minimum completed outcomes"),
    minProofScore: normalizeNumber(filters.minProofScore, "Minimum proof score"),
    q: String(filters.q ?? filters.search ?? "").trim(),
    skills: normalizeList(filters.skill ?? filters.skills),
    sort: normalizeSort(filters.sort, Boolean(filters.q ?? filters.search)),
    tools: normalizeList(filters.tool ?? filters.tools),
    verified: normalizeBoolean(filters.verified),
  };
}

export function sanitizeProviderForDiscovery({
  outcomeOfferSummary = createEmptyOutcomeOfferSummary(),
  profile,
  publicProfile,
  searchScore,
  serviceSummary,
} = {}) {
  return serializeProvider({
    outcomeOfferSummary,
    profile,
    publicProfile,
    searchScore,
    serviceSummary,
  });
}

export async function getProviderFilterOptions() {
  ensureDatabaseConnection();

  const publicProfiles = await UserProfile.find({
    $or: [
      { profileVisibility: "public" },
      { profileVisibility: { $exists: false } },
    ],
    $and: [
      { "privacySettings.allowDiscovery": { $ne: false } },
      { "privacySettings.allowProviderListing": { $ne: false } },
    ],
  })
    .select("profileVisibility privacySettings userId")
    .limit(1000)
    .lean();
  const allowedUserIds = publicProfiles
    .filter(isPublicDiscoverableProfile)
    .map((profile) => profile.userId);
  const activeUsers = allowedUserIds.length
    ? await User.find({
        _id: { $in: allowedUserIds },
        accountStatus: "active",
        isSuspended: { $ne: true },
        role: "provider",
      })
        .select("_id")
        .limit(1000)
        .lean()
    : [];
  const activeUserIds = activeUsers.map((user) => user._id);

  if (activeUserIds.length === 0) {
    return {
      availability: discoveryAvailabilityValues,
      categories: [],
      skills: [],
      tools: [],
    };
  }

  const [providerProfiles, outcomeOfferSummary] = await Promise.all([
    ProviderProfile.find({
      userId: { $in: activeUserIds },
      isAvailableForChallenges: { $ne: false },
      $or: [
        { moderationStatus: "active" },
        { moderationStatus: { $exists: false } },
      ],
    })
      .select("categories skills")
      .limit(1000)
      .lean(),
    getOutcomeOfferSummary(activeUserIds),
  ]);

  return {
    availability: discoveryAvailabilityValues,
    categories: uniqueStrings([
      providerProfiles.flatMap((profile) => profile.categories ?? []),
      Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.categories ?? []),
    ]),
    skills: uniqueStrings([
      providerProfiles.flatMap((profile) => profile.skills ?? []),
      Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.skills ?? []),
    ]),
    tools: uniqueStrings(Array.from(outcomeOfferSummary.values()).flatMap((summary) => summary.tools ?? [])),
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
