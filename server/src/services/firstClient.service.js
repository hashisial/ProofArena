import mongoose from "mongoose";
import {
  CHALLENGE_BUDGET_TYPE,
  CHALLENGE_STATUS,
  CHALLENGE_VISIBILITY,
  EXECUTION_PLAN_STATUS,
  MATCH_STATUS,
  OUTCOME_OFFER_STATUS,
  OPPORTUNITY_STAGE,
  PROFILE_VISIBILITY,
  PROVIDER_BADGE_KEY,
  STARTER_CHALLENGE_LEVEL,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { ExecutionPlan } from "../models/ExecutionPlan.model.js";
import { MatchRecord } from "../models/MatchRecord.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { OpportunityPipelineItem } from "../models/OpportunityPipelineItem.model.js";
import { ProofAsset } from "../models/ProofAsset.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const activeChallengeStatuses = Object.freeze([
  CHALLENGE_STATUS.OPEN,
  CHALLENGE_STATUS.REVIEWING_PLANS,
]);

const badgeCatalog = Object.freeze({
  [PROVIDER_BADGE_KEY.FAST_STARTER]: {
    description: "Completed multiple first-client setup actions early.",
    label: "Fast Starter",
    source: "system",
  },
  [PROVIDER_BADGE_KEY.FIRST_CHALLENGE_WON]: {
    description: "Won the first client challenge on ProofArena.",
    label: "First Challenge Won",
    source: "challenge",
  },
  [PROVIDER_BADGE_KEY.FIRST_EXECUTION_PLAN_SUBMITTED]: {
    description: "Submitted the first structured execution plan.",
    label: "First Execution Plan Submitted",
    source: "execution_plan",
  },
  [PROVIDER_BADGE_KEY.FIRST_OFFER_CREATED]: {
    description: "Created the first outcome offer.",
    label: "First Offer Created",
    source: "system",
  },
  [PROVIDER_BADGE_KEY.FIRST_PROOF_ASSET_ADDED]: {
    description: "Added the first reusable proof asset.",
    label: "First Proof Asset Added",
    source: "proof",
  },
  [PROVIDER_BADGE_KEY.FIRST_SHORTLIST]: {
    description: "Received the first execution plan shortlist.",
    label: "First Shortlist",
    source: "execution_plan",
  },
  [PROVIDER_BADGE_KEY.FIRST_VERIFIED_OUTCOME]: {
    description: "Earned the first verified outcome after proof review.",
    label: "First Verified Outcome",
    source: "proof",
  },
  [PROVIDER_BADGE_KEY.PROFILE_READY]: {
    description: "Reached a first-client readiness score of 70 or higher.",
    label: "Profile Ready",
    source: "system",
  },
});

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function escapeRegex(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasText(value, minLength = 1) {
  return String(value ?? "").trim().length >= minLength;
}

function publicBudget(budget = {}) {
  if (budget.type === CHALLENGE_BUDGET_TYPE.HIDDEN) {
    return {
      currency: budget.currency ?? "USD",
      type: CHALLENGE_BUDGET_TYPE.HIDDEN,
    };
  }

  return {
    currency: budget.currency ?? "USD",
    customLabel: budget.customLabel ?? "",
    max: budget.max,
    min: budget.min,
    type: budget.type ?? CHALLENGE_BUDGET_TYPE.HIDDEN,
  };
}

function buildSort(sort = "level") {
  if (sort === "budget_low") return { "budget.min": 1, publishedAt: -1, createdAt: -1 };
  if (sort === "budget_high") return { "budget.min": -1, publishedAt: -1, createdAt: -1 };
  if (sort === "newest") return { publishedAt: -1, createdAt: -1 };
  if (sort === "best_match") return { "qualityScore.score": -1, publishedAt: -1, createdAt: -1 };

  return {
    "starterChallenge.level": 1,
    "starterChallenge.estimatedHours": 1,
    publishedAt: -1,
    createdAt: -1,
  };
}

function buildBadge(key, metadata = {}) {
  const catalogItem = badgeCatalog[key] ?? {};

  return {
    description: catalogItem.description ?? "",
    earnedAt: new Date(),
    key,
    label: catalogItem.label ?? key,
    source: metadata.source ?? catalogItem.source ?? "system",
  };
}

function sanitizeBadge(badge = {}) {
  return {
    description: badge.description ?? "",
    earnedAt: badge.earnedAt ?? null,
    key: badge.key ?? "",
    label: badge.label ?? "",
    source: badge.source ?? "system",
  };
}

async function getProviderUser(providerId) {
  if (!mongoose.isValidObjectId(providerId)) {
    throw new AppError("Provider id is invalid", 400);
  }

  const user = await User.findById(providerId)
    .select("_id accountStatus fullName isSuspended name role username")
    .lean();

  if (!user || user.role !== USER_ROLES.PROVIDER) {
    throw new AppError("Provider profile not found", 404);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider account is not available", 403);
  }

  return user;
}

async function getProviderFirstClientContext(providerId) {
  const [user, providerProfile, publicProfile, settings] = await Promise.all([
    getProviderUser(providerId),
    ProviderProfile.findOne({ userId: providerId }),
    UserProfile.findOne({ userId: providerId })
      .select("_id bio headline profileCompletion profileVisibility privacySettings skills userId")
      .lean(),
    UserSettings.findOne({ userId: providerId }).select("profileVisibility userId").lean(),
  ]);

  return { providerProfile, publicProfile, settings, user };
}

async function getProgressCounts(providerId) {
  const starterChallengeIds = await Challenge.distinct("_id", {
    $or: [
      { "starterChallenge.enabled": true },
      { "starterChallenge.newProviderFriendly": true },
      { "starterChallenge.recommendedForFirstClient": true },
    ],
  });
  const [
    outcomeOffers,
    proofAssets,
    executionPlans,
    shortlistedPlans,
    acceptedPlans,
    activeOpportunities,
    savedOrAppliedMatches,
    starterChallengesApplied,
    starterChallengesWon,
  ] = await Promise.all([
    OutcomeOffer.countDocuments({ providerId }),
    ProofAsset.countDocuments({ providerId }),
    ExecutionPlan.countDocuments({ providerId }),
    ExecutionPlan.countDocuments({ providerId, status: EXECUTION_PLAN_STATUS.SHORTLISTED }),
    ExecutionPlan.countDocuments({ providerId, status: EXECUTION_PLAN_STATUS.ACCEPTED }),
    OpportunityPipelineItem.countDocuments({
      providerId,
      stage: { $nin: [OPPORTUNITY_STAGE.ARCHIVED, OPPORTUNITY_STAGE.LOST, OPPORTUNITY_STAGE.COMPLETED] },
    }),
    MatchRecord.countDocuments({
      providerId,
      status: { $in: [MATCH_STATUS.SAVED, MATCH_STATUS.APPLIED] },
    }),
    ExecutionPlan.countDocuments({
      providerId,
      challengeId: { $in: starterChallengeIds },
    }),
    ExecutionPlan.countDocuments({
      providerId,
      status: EXECUTION_PLAN_STATUS.ACCEPTED,
      challengeId: { $in: starterChallengeIds },
    }),
  ]);

  return {
    acceptedPlans,
    activeOpportunities,
    executionPlans,
    outcomeOffers,
    proofAssets,
    savedOrAppliedMatches,
    shortlistedPlans,
    starterChallengesApplied,
    starterChallengesWon,
  };
}

function calculateProfileCompleted(providerProfile, publicProfile) {
  const headline = providerProfile?.headline || publicProfile?.headline || providerProfile?.title;
  const bio = providerProfile?.professionalSummary || publicProfile?.bio;
  const skills = [
    ...(providerProfile?.skills ?? []),
    ...(Array.isArray(publicProfile?.skills)
      ? publicProfile.skills.map((skill) => skill?.name ?? skill).filter(Boolean)
      : []),
  ];

  return hasText(headline, 12) && hasText(bio, 80) && skills.length > 0;
}

function isDiscoverable(providerProfile, publicProfile, settings) {
  const visibility = settings?.profileVisibility ??
    publicProfile?.profileVisibility ??
    PROFILE_VISIBILITY.PUBLIC;

  return (
    visibility === PROFILE_VISIBILITY.PUBLIC &&
    providerProfile?.moderationStatus === "active" &&
    providerProfile?.isAvailableForChallenges !== false &&
    publicProfile?.privacySettings?.allowDiscovery !== false &&
    publicProfile?.privacySettings?.allowProviderListing !== false
  );
}

function buildReadiness({
  counts,
  providerProfile,
  publicProfile,
  settings,
}) {
  const profileCompleted = calculateProfileCompleted(providerProfile, publicProfile);
  const outcomeOfferCreated = counts.outcomeOffers > 0;
  const proofAssetAdded = counts.proofAssets > 0;
  const executionPlanSubmitted = counts.executionPlans > 0;
  const shortlistedOnce = counts.shortlistedPlans > 0;
  const firstChallengeWon = counts.acceptedPlans > 0;
  const firstVerifiedOutcome = Boolean(providerProfile?.firstClientMode?.firstVerifiedOutcomeId);
  const availabilityActive = ["available", "limited"].includes(providerProfile?.availability);
  const profilePublic = isDiscoverable(providerProfile, publicProfile, settings);

  const scoreItems = [
    ["profile", profileCompleted, 20, "Complete profile"],
    ["offer", outcomeOfferCreated, 20, "Create outcome offer"],
    ["proof", proofAssetAdded, 15, "Add proof asset"],
    ["plan", executionPlanSubmitted, 15, "Apply to starter challenge"],
    ["match", counts.savedOrAppliedMatches > 0, 10, "Check matched challenges"],
    ["availability", availabilityActive, 10, "Set active availability"],
    ["discoverability", profilePublic, 10, "Make profile public and discoverable"],
  ];
  const score = scoreItems.reduce((sum, [, passed, points]) => sum + (passed ? points : 0), 0);
  const checklist = {
    executionPlanSubmitted,
    firstChallengeWon,
    firstProofSubmitted: false,
    firstVerifiedOutcome,
    outcomeOfferCreated,
    profileCompleted,
    proofAssetAdded,
    shortlistedOnce,
  };
  const missingItems = scoreItems
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
  const suggestedActions = scoreItems
    .filter(([, passed]) => !passed)
    .map(([, , , action]) => action)
    .slice(0, 4);

  return {
    checklist,
    missingItems,
    score,
    suggestedActions,
  };
}

function sanitizeChallenge(challenge = {}) {
  return {
    budget: publicBudget(challenge.budget ?? {}),
    category: challenge.category ?? "",
    client: challenge.client ?? null,
    id: normalizeId(challenge._id ?? challenge.id),
    proofRequirementsCount: Array.isArray(challenge.proofRequirements)
      ? challenge.proofRequirements.length
      : 0,
    shortSummary: challenge.shortSummary ?? "",
    skillsNeeded: challenge.skillsNeeded ?? [],
    slug: challenge.slug ?? "",
    starterChallenge: challenge.starterChallenge ?? {},
    status: challenge.status ?? "",
    targetOutcome: challenge.targetOutcome ?? {},
    timeline: challenge.timeline ?? {},
    title: challenge.title ?? "",
  };
}

export async function calculateFirstClientReadiness(providerId) {
  ensureDatabaseConnection();
  const { providerProfile, publicProfile, settings } = await getProviderFirstClientContext(providerId);
  const counts = await getProgressCounts(providerId);

  return buildReadiness({
    counts,
    providerProfile,
    publicProfile,
    settings,
  });
}

export function sanitizeFirstClientStatus(data = {}) {
  return {
    badges: (data.badges ?? []).map(sanitizeBadge),
    checklist: data.checklist ?? {},
    firstClientMode: {
      completed: Boolean(data.firstClientMode?.completed),
      completedAt: data.firstClientMode?.completedAt ?? null,
      enabled: data.firstClientMode?.enabled !== false,
      readinessScore: data.firstClientMode?.readinessScore ?? data.readinessScore ?? 0,
      starterChallengesApplied: data.firstClientMode?.starterChallengesApplied ?? 0,
      starterChallengesWon: data.firstClientMode?.starterChallengesWon ?? 0,
    },
    missingItems: data.missingItems ?? [],
    readinessScore: data.readinessScore ?? 0,
    starterChallengeStats: data.starterChallengeStats ?? {
      applied: 0,
      won: 0,
    },
    opportunityStats: data.opportunityStats ?? {
      active: 0,
    },
    suggestedActions: data.suggestedActions ?? [],
  };
}

export async function markProviderBadge(providerId, badgeKey, metadata = {}) {
  ensureDatabaseConnection();

  if (!mongoose.isValidObjectId(providerId) || !badgeCatalog[badgeKey]) {
    return null;
  }

  const providerProfile = await ProviderProfile.findOne({ userId: providerId });

  if (!providerProfile) {
    return null;
  }

  if (providerProfile.providerBadges?.some((badge) => badge.key === badgeKey)) {
    return sanitizeBadge(providerProfile.providerBadges.find((badge) => badge.key === badgeKey));
  }

  const badge = buildBadge(badgeKey, metadata);
  providerProfile.providerBadges.push(badge);
  await providerProfile.save();

  return sanitizeBadge(badge);
}

export async function syncFirstClientProgress(providerId) {
  ensureDatabaseConnection();
  const { providerProfile, publicProfile, settings } = await getProviderFirstClientContext(providerId);
  const counts = await getProgressCounts(providerId);
  const readiness = buildReadiness({
    counts,
    providerProfile,
    publicProfile,
    settings,
  });

  if (!providerProfile) {
    return sanitizeFirstClientStatus({
      ...readiness,
      badges: [],
      firstClientMode: { readinessScore: readiness.score },
      readinessScore: readiness.score,
      starterChallengeStats: {
        applied: counts.starterChallengesApplied,
        won: counts.starterChallengesWon,
      },
      opportunityStats: {
        active: counts.activeOpportunities,
      },
    });
  }

  providerProfile.onboardingProgress = {
    ...(providerProfile.onboardingProgress?.toObject?.() ?? providerProfile.onboardingProgress ?? {}),
    ...readiness.checklist,
  };
  providerProfile.firstClientMode = {
    ...(providerProfile.firstClientMode?.toObject?.() ?? providerProfile.firstClientMode ?? {}),
    lastCalculatedAt: new Date(),
    readinessScore: readiness.score,
    starterChallengesApplied: counts.starterChallengesApplied,
    starterChallengesWon: counts.starterChallengesWon,
  };

  await providerProfile.save();

  let badges = providerProfile.providerBadges ?? [];

  if (readiness.score >= 70) {
    const profileReadyBadge = await markProviderBadge(providerId, PROVIDER_BADGE_KEY.PROFILE_READY);
    if (profileReadyBadge && !badges.some((badge) => badge.key === profileReadyBadge.key)) {
      badges = [...badges, profileReadyBadge];
    }
  }

  return sanitizeFirstClientStatus({
    ...readiness,
    badges,
    firstClientMode: providerProfile.firstClientMode,
    readinessScore: readiness.score,
    starterChallengeStats: {
      applied: counts.starterChallengesApplied,
      won: counts.starterChallengesWon,
    },
    opportunityStats: {
      active: counts.activeOpportunities,
    },
  });
}

export async function getFirstClientStatus(providerId) {
  return syncFirstClientProgress(providerId);
}

export async function getProviderBadges(providerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const profile = await ProviderProfile.findOne({ userId: providerId })
    .select("providerBadges")
    .lean();

  return {
    items: (profile?.providerBadges ?? []).map(sanitizeBadge),
  };
}

export async function completeFirstClientMode(providerId, firstVerifiedOutcomeId = null) {
  ensureDatabaseConnection();

  const update = {
    "firstClientMode.completed": true,
    "firstClientMode.completedAt": new Date(),
    "onboardingProgress.firstVerifiedOutcome": true,
  };

  if (mongoose.isValidObjectId(firstVerifiedOutcomeId)) {
    update["firstClientMode.firstVerifiedOutcomeId"] = firstVerifiedOutcomeId;
  }

  await ProviderProfile.updateOne({ userId: providerId }, { $set: update });
  return markProviderBadge(providerId, PROVIDER_BADGE_KEY.FIRST_VERIFIED_OUTCOME, { source: "proof" });
}

export async function getStarterChallenges(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const appliedChallengeIds = await ExecutionPlan.distinct("challengeId", { providerId });
  const query = {
    _id: { $nin: appliedChallengeIds },
    "moderation.status": "approved",
    clientId: { $ne: providerId },
    status: { $in: activeChallengeStatuses },
    visibility: CHALLENGE_VISIBILITY.PUBLIC,
    $or: [
      { "starterChallenge.enabled": true },
      { "starterChallenge.newProviderFriendly": true },
      { "starterChallenge.recommendedForFirstClient": true },
    ],
  };
  const andConditions = [];
  const search = String(filters.q ?? "").trim();

  if (search) {
    query.$text = { $search: search };
  }

  if (filters.level) {
    query["starterChallenge.level"] = filters.level;
  }

  if (filters.category) {
    query.category = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
  }

  if (filters.minBudget !== undefined || filters.maxBudget !== undefined) {
    andConditions.push({ "budget.type": { $ne: CHALLENGE_BUDGET_TYPE.HIDDEN } });

    if (filters.minBudget !== undefined) {
      andConditions.push({
        $or: [
          { "budget.max": { $gte: filters.minBudget } },
          { "budget.min": { $gte: filters.minBudget } },
        ],
      });
    }

    if (filters.maxBudget !== undefined) {
      andConditions.push({ "budget.min": { $lte: filters.maxBudget } });
    }
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  const [items, total] = await Promise.all([
    Challenge.find(query)
      .sort(buildSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Challenge.countDocuments(query),
  ]);
  const clientIds = Array.from(new Set(items.map((challenge) => normalizeId(challenge.clientId))));
  const clients = clientIds.length > 0
    ? await User.find({ _id: { $in: clientIds } }).select("_id fullName name username").lean()
    : [];
  const clientById = new Map(
    clients.map((client) => [
      normalizeId(client._id),
      {
        fullName: client.fullName ?? client.name ?? "",
        id: normalizeId(client._id),
        username: client.username ?? "",
      },
    ]),
  );

  return {
    items: items.map((challenge) => {
      const sanitized = sanitizeChallenge({
        ...challenge,
        client: clientById.get(normalizeId(challenge.clientId)) ?? null,
      });
      return {
        ...sanitized,
        starterChallenge: {
          enabled: Boolean(sanitized.starterChallenge?.enabled),
          estimatedHours: sanitized.starterChallenge?.estimatedHours ?? null,
          level: sanitized.starterChallenge?.level ?? STARTER_CHALLENGE_LEVEL.STANDARD,
          newProviderFriendly: Boolean(sanitized.starterChallenge?.newProviderFriendly),
          proofSimplicity: sanitized.starterChallenge?.proofSimplicity ?? "moderate",
          providerLimit: sanitized.starterChallenge?.providerLimit ?? null,
          recommendedForFirstClient: Boolean(sanitized.starterChallenge?.recommendedForFirstClient),
        },
      };
    }),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}
