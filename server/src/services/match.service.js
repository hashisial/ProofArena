import mongoose from "mongoose";
import {
  CHALLENGE_BUDGET_TYPE,
  CHALLENGE_STATUS,
  CHALLENGE_VISIBILITY,
  EXECUTION_PLAN_STATUS,
  MATCH_DIRECTION,
  MATCH_SOURCE,
  MATCH_STATUS,
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_VISIBILITY,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { ExecutionPlan } from "../models/ExecutionPlan.model.js";
import { MatchRecord } from "../models/MatchRecord.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
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
const publicUserSelect =
  "_id avatar fullName name role username accountStatus isSuspended isVerified emailVerified verificationStatus";
const providerProfileSelect =
  "_id userId title headline categories skills availability moderationStatus verificationStatus proofScore completedOutcomes totalProofsApproved onTimeRate approvalRate hourlyRate fixedStartingPrice isAvailableForChallenges";
const userProfileSelect =
  "_id userId headline profilePicture profileVisibility privacySettings industry location services skills";
const offerSelect =
  "_id providerId title slug shortSummary category subCategory targetOutcome deliveryTimeline priceRange availability skills tools industries tags qualityScore status visibility moderation";
const challengeSelect =
  "_id clientId title slug shortSummary category subCategory targetOutcome timeline budget skillsNeeded toolsNeeded industries industry tags qualityScore status visibility urgency location moderation publishedAt applicationStats";

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label = "Id") {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

function toPlain(document) {
  return typeof document?.toObject === "function" ? document.toObject() : { ...(document ?? {}) };
}

function clampScore(value, max) {
  return Math.max(0, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function normalizeList(values = []) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .flatMap((value) => {
          if (typeof value === "string") {
            return [value];
          }

          if (value?.name) {
            return [value.name];
          }

          if (value?.title) {
            return [value.title];
          }

          return [];
        })
        .map((value) => String(value ?? "").trim())
        .filter(Boolean),
    ),
  );
}

function normalizeToken(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function listKey(value) {
  return normalizeToken(value);
}

function textTokens(...values) {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "for",
    "in",
    "of",
    "or",
    "the",
    "to",
    "with",
    "your",
  ]);

  return Array.from(
    new Set(
      values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length >= 3 && !stopWords.has(token)),
    ),
  );
}

function findExactMatches(required = [], available = []) {
  const availableMap = new Map(
    normalizeList(available).map((item) => [listKey(item), item]),
  );

  return normalizeList(required)
    .map((item) => availableMap.get(listKey(item)))
    .filter(Boolean);
}

function scoreListOverlap(required = [], available = [], maxScore = 10) {
  const requiredList = normalizeList(required);

  if (requiredList.length === 0) {
    return { matched: [], score: Math.round(maxScore * 0.6), total: 0 };
  }

  const matched = findExactMatches(requiredList, available);

  return {
    matched,
    score: Math.round((matched.length / requiredList.length) * maxScore),
    total: requiredList.length,
  };
}

function average(values = []) {
  const usable = values.map(Number).filter(Number.isFinite);

  if (usable.length === 0) {
    return 0;
  }

  return usable.reduce((sum, value) => sum + value, 0) / usable.length;
}

function getOfferId(offer) {
  return offer?._id ?? offer?.id;
}

function getOfferCategories(outcomeOffers = []) {
  return outcomeOffers.flatMap((offer) =>
    normalizeList([offer.category, offer.subCategory, ...(offer.industries ?? []), ...(offer.tags ?? [])]),
  );
}

function getOfferSkills(outcomeOffers = []) {
  return outcomeOffers.flatMap((offer) => normalizeList(offer.skills));
}

function getOfferTools(outcomeOffers = []) {
  return outcomeOffers.flatMap((offer) => normalizeList(offer.tools));
}

function categoryScore(providerProfile, outcomeOffers, challenge) {
  const challengeCategory = challenge?.category ?? "";
  const availableCategories = normalizeList([
    ...(providerProfile?.categories ?? []),
    ...getOfferCategories(outcomeOffers),
  ]);
  const exact = findExactMatches([challengeCategory], availableCategories);

  if (exact.length > 0) {
    return {
      matched: exact,
      score: 15,
    };
  }

  const challengeTokens = textTokens(challengeCategory, challenge?.subCategory);
  const categoryTokens = textTokens(...availableCategories);
  const overlap = challengeTokens.filter((token) => categoryTokens.includes(token));

  return {
    matched: overlap,
    score: overlap.length > 0 ? 8 : 0,
  };
}

function outcomeScore(outcomeOffers = [], challenge = {}) {
  const challengeTokens = textTokens(
    challenge.title,
    challenge.shortSummary,
    challenge.targetOutcome?.metricName,
    challenge.targetOutcome?.outcomeStatement,
    ...(challenge.successCriteria ?? []).map((item) => `${item.title} ${item.description}`),
  );

  if (challengeTokens.length === 0 || outcomeOffers.length === 0) {
    return { matchedOfferIds: [], matchedOutcomeKeywords: [], score: 0 };
  }

  let bestScore = 0;
  const matchedOfferIds = [];
  const matchedOutcomeKeywords = new Set();

  for (const offer of outcomeOffers) {
    const offerTokens = textTokens(
      offer.title,
      offer.shortSummary,
      offer.targetOutcome?.metricName,
      offer.targetOutcome?.outcomeStatement,
      ...(offer.successCriteria ?? []).map((item) => `${item.title} ${item.description}`),
      ...(offer.tags ?? []),
    );
    const overlap = challengeTokens.filter((token) => offerTokens.includes(token));
    const score = Math.round(Math.min(overlap.length / Math.max(challengeTokens.length, 1), 1) * 15);

    if (score >= 5) {
      matchedOfferIds.push(getOfferId(offer));
      overlap.slice(0, 8).forEach((token) => matchedOutcomeKeywords.add(token));
    }

    bestScore = Math.max(bestScore, score);
  }

  return {
    matchedOfferIds: matchedOfferIds.filter(Boolean),
    matchedOutcomeKeywords: Array.from(matchedOutcomeKeywords).slice(0, 20),
    score: bestScore,
  };
}

function proofScore(providerProfile) {
  const score = Number(providerProfile?.proofScore);

  if (Number.isFinite(score) && score > 0) {
    return Math.round((Math.min(score, 100) / 100) * 10);
  }

  if (Number(providerProfile?.completedOutcomes) > 0 || Number(providerProfile?.totalProofsApproved) > 0) {
    return 5;
  }

  if (Number(providerProfile?.approvalRate) > 0) {
    return Math.round((Math.min(Number(providerProfile.approvalRate), 100) / 100) * 8);
  }

  return 2;
}

function availabilityScore(providerProfile, outcomeOffers = []) {
  const statuses = normalizeList([
    providerProfile?.availability,
    ...outcomeOffers.map((offer) => offer.availability?.status),
  ]).map(listKey);

  if (statuses.some((status) => ["available", "available now", "available_now"].includes(status))) {
    return 10;
  }

  if (statuses.some((status) => ["available this week", "available_this_week"].includes(status))) {
    return 9;
  }

  if (statuses.some((status) => ["limited", "available next week", "available_next_week"].includes(status))) {
    return 6;
  }

  if (statuses.some((status) => ["unavailable", "fully booked", "fully_booked", "paused"].includes(status))) {
    return 1;
  }

  return 5;
}

function rangeFromBudget(budget = {}) {
  if (!budget?.type || [CHALLENGE_BUDGET_TYPE.HIDDEN, CHALLENGE_BUDGET_TYPE.NEGOTIABLE].includes(budget.type)) {
    return null;
  }

  const min = Number(budget.min ?? budget.max);
  const max = Number(budget.max ?? budget.min);

  if (!Number.isFinite(min) && !Number.isFinite(max)) {
    return null;
  }

  return {
    currency: String(budget.currency ?? "USD").toUpperCase(),
    max: Number.isFinite(max) ? max : min,
    min: Number.isFinite(min) ? min : max,
    type: budget.type,
  };
}

function rangeFromOfferPrice(priceRange = {}) {
  if (!priceRange?.type || ["hidden", "custom"].includes(priceRange.type)) {
    return null;
  }

  const min = Number(priceRange.min ?? priceRange.max);
  const max = Number(priceRange.max ?? priceRange.min);

  if (!Number.isFinite(min) && !Number.isFinite(max)) {
    return null;
  }

  return {
    currency: String(priceRange.currency ?? "USD").toUpperCase(),
    max: Number.isFinite(max) ? max : min,
    min: Number.isFinite(min) ? min : max,
    type: priceRange.type,
  };
}

function budgetScore(challenge = {}, outcomeOffers = []) {
  const challengeRange = rangeFromBudget(challenge.budget);

  if (!challengeRange) {
    return { score: 5, weakness: "Budget fit is unclear because the challenge budget is hidden or negotiable." };
  }

  const offerRanges = outcomeOffers.map((offer) => rangeFromOfferPrice(offer.priceRange)).filter(Boolean);

  if (offerRanges.length === 0) {
    return { score: 5, weakness: "Budget fit is unclear because your price is hidden or custom." };
  }

  for (const offerRange of offerRanges) {
    if (offerRange.currency !== challengeRange.currency) {
      continue;
    }

    const overlaps = offerRange.min <= challengeRange.max && challengeRange.min <= offerRange.max;

    if (overlaps) {
      return { score: 10 };
    }

    if (offerRange.min <= challengeRange.max * 1.2) {
      return { score: 6, weakness: "Your pricing may need clarification for this challenge budget." };
    }
  }

  return { score: 2, weakness: "Your visible pricing appears outside the challenge budget." };
}

function daysFromChallengeTimeline(timeline = {}) {
  if (timeline.durationDays) return Number(timeline.durationDays);
  if (timeline.maxDays) return Number(timeline.maxDays);
  if (timeline.endDate && timeline.startDate) {
    const diffMs = new Date(timeline.endDate).getTime() - new Date(timeline.startDate).getTime();
    return Math.ceil(diffMs / 86400000);
  }
  return null;
}

function daysFromOfferTimeline(timeline = {}) {
  if (timeline.days) return Number(timeline.days);
  if (timeline.maxDays) return Number(timeline.maxDays);
  return null;
}

function timelineScore(challenge = {}, outcomeOffers = []) {
  const challengeDays = daysFromChallengeTimeline(challenge.timeline);
  const offerDays = outcomeOffers
    .map((offer) => daysFromOfferTimeline(offer.deliveryTimeline))
    .filter(Number.isFinite);

  if (!Number.isFinite(challengeDays) || offerDays.length === 0) {
    return { score: 3 };
  }

  if (offerDays.some((days) => days <= challengeDays)) {
    return { score: 5 };
  }

  if (offerDays.some((days) => days <= challengeDays * 1.25)) {
    return { score: 3, weakness: "Your offer timeline may be slightly longer than the challenge timeline." };
  }

  return { score: 1, weakness: "Your delivery timeline appears slower than the challenge target." };
}

function qualityScore(challenge = {}, outcomeOffers = []) {
  const offerQuality = Math.max(
    0,
    ...outcomeOffers.map((offer) => Number(offer.qualityScore?.score ?? 0)),
  );
  const challengeQuality = Number(challenge.qualityScore?.score ?? 0);
  return Math.round(((offerQuality + challengeQuality) / 200) * 5);
}

function chooseRecommendedAction(score, weaknesses = []) {
  if (score >= 75) {
    return "Submit an execution plan with proof examples attached.";
  }

  if (weaknesses.some((item) => item.toLowerCase().includes("proof"))) {
    return "Improve your offer with proof examples before applying.";
  }

  if (weaknesses.some((item) => item.toLowerCase().includes("tool"))) {
    return "Add missing tools to your provider profile or execution plan if relevant.";
  }

  return "Submit only if you can address the weak areas in a clear execution plan.";
}

export function calculateProviderChallengeMatch(provider, providerProfile, outcomeOffers = [], challenge = {}) {
  const categories = categoryScore(providerProfile, outcomeOffers, challenge);
  const skills = scoreListOverlap(
    challenge.skillsNeeded,
    normalizeList([...(providerProfile?.skills ?? []), ...getOfferSkills(outcomeOffers)]),
    20,
  );
  const tools = scoreListOverlap(challenge.toolsNeeded, getOfferTools(outcomeOffers), 10);
  const outcomes = outcomeScore(outcomeOffers, challenge);
  const proof = proofScore(providerProfile);
  const availability = availabilityScore(providerProfile, outcomeOffers);
  const budget = budgetScore(challenge, outcomeOffers);
  const timeline = timelineScore(challenge, outcomeOffers);
  const quality = qualityScore(challenge, outcomeOffers);
  const scoreBreakdown = {
    availabilityScore: availability,
    budgetScore: budget.score,
    categoryScore: categories.score,
    locationScore: challenge.location?.remote === false ? 2 : 5,
    outcomeScore: outcomes.score,
    proofScore: proof,
    qualityScore: quality,
    skillScore: skills.score,
    timelineScore: timeline.score,
    toolScore: tools.score,
  };
  const matchScore = clampScore(
    scoreBreakdown.categoryScore +
      scoreBreakdown.skillScore +
      scoreBreakdown.toolScore +
      scoreBreakdown.outcomeScore +
      scoreBreakdown.proofScore +
      scoreBreakdown.availabilityScore +
      scoreBreakdown.budgetScore +
      scoreBreakdown.timelineScore +
      scoreBreakdown.qualityScore,
    100,
  );
  const matchReasons = [];
  const weaknesses = [];

  if (categories.score >= 15) {
    matchReasons.push(`Your ${categories.matched[0]} work matches this challenge category.`);
  } else if (categories.score > 0) {
    matchReasons.push("Your profile or offers have related category language.");
  } else {
    weaknesses.push("No strong category match found yet.");
  }

  if (skills.total > 0) {
    matchReasons.push(`You match ${skills.matched.length} of ${skills.total} required skills.`);
  }

  if (skills.score < 10 && skills.total > 0) {
    weaknesses.push("Some required skills are missing from your profile or outcome offers.");
  }

  if (tools.total > 0) {
    matchReasons.push(`You match ${tools.matched.length} of ${tools.total} required tools.`);
  }

  if (tools.score < 5 && tools.total > 0) {
    weaknesses.push("Your offer does not mention some required tools.");
  }

  if (outcomes.score >= 7) {
    matchReasons.push("You have an outcome offer with a similar target result.");
  } else {
    weaknesses.push("No similar outcome offer was found.");
  }

  if (proof >= 6) {
    matchReasons.push("Your proof score supports this category.");
  } else {
    weaknesses.push("No matching proof history found yet.");
  }

  if (availability >= 8) {
    matchReasons.push(`Your availability is marked as ${providerProfile?.availability ?? "available"}.`);
  } else if (availability <= 3) {
    weaknesses.push("Your availability is limited.");
  }

  if (budget.score >= 8) {
    matchReasons.push("Your price range appears compatible with the challenge budget.");
  } else if (budget.weakness) {
    weaknesses.push(budget.weakness);
  }

  if (timeline.score >= 5) {
    matchReasons.push("Your delivery timeline appears compatible with the challenge timeline.");
  } else if (timeline.weakness) {
    weaknesses.push(timeline.weakness);
  }

  return {
    matchReasons: matchReasons.slice(0, 20),
    matchScore,
    metadata: {
      challengeBudgetType: challenge.budget?.type ?? "",
      matchedCategories: categories.matched,
      matchedOfferIds: outcomes.matchedOfferIds,
      matchedOutcomeKeywords: outcomes.matchedOutcomeKeywords,
      matchedSkillNames: skills.matched,
      matchedToolNames: tools.matched,
      providerAvailability: providerProfile?.availability ?? outcomeOffers[0]?.availability?.status ?? "",
    },
    recommendedAction: chooseRecommendedAction(matchScore, weaknesses),
    scoreBreakdown,
    weaknesses: weaknesses.slice(0, 20),
  };
}

async function getProviderUser(providerId) {
  assertObjectId(providerId, "Provider id");

  const user = await User.findById(providerId)
    .select(publicUserSelect)
    .lean();

  if (!user) {
    throw new AppError("Provider profile not found", 404);
  }

  if (user.role !== USER_ROLES.PROVIDER) {
    throw new AppError("Provider profile not found", 404);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider profile not found", 404);
  }

  return user;
}

async function getClientUser(clientId) {
  assertObjectId(clientId, "Client id");

  const user = await User.findById(clientId)
    .select(publicUserSelect)
    .lean();

  if (!user) {
    throw new AppError("Client account not found", 404);
  }

  if (user.role !== USER_ROLES.CLIENT) {
    throw new AppError("Only clients can access recommended providers", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Client account is not available", 403);
  }

  return user;
}

async function findProviderProfile(providerId) {
  const providerProfile = await ProviderProfile.findOne({
    moderationStatus: "active",
    userId: providerId,
  })
    .select(providerProfileSelect)
    .lean();

  if (!providerProfile) {
    throw new AppError("Provider profile not found", 404);
  }

  return providerProfile;
}

async function getProviderContext(providerId) {
  const [user, providerProfile, publicProfile, settings, outcomeOffers] = await Promise.all([
    getProviderUser(providerId),
    findProviderProfile(providerId),
    UserProfile.findOne({ userId: providerId }).select(userProfileSelect).lean(),
    UserSettings.findOne({ userId: providerId }).select("profileVisibility userId").lean(),
    OutcomeOffer.find({
      "moderation.status": "approved",
      providerId,
      status: OUTCOME_OFFER_STATUS.PUBLISHED,
      visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    })
      .select(offerSelect)
      .limit(50)
      .lean(),
  ]);

  return { outcomeOffers, publicProfile, providerProfile, settings, user };
}

function isDiscoverableProvider({ publicProfile, providerProfile, settings, user }) {
  if (!user || user.role !== USER_ROLES.PROVIDER || user.isSuspended) {
    return false;
  }

  if (["deleted", "suspended"].includes(user.accountStatus)) {
    return false;
  }

  if (!providerProfile || providerProfile.moderationStatus !== "active") {
    return false;
  }

  if (providerProfile.isAvailableForChallenges === false) {
    return false;
  }

  const visibility = settings?.profileVisibility ?? publicProfile?.profileVisibility ?? "public";

  if (visibility !== "public") {
    return false;
  }

  if (publicProfile?.privacySettings?.allowDiscovery === false) {
    return false;
  }

  if (publicProfile?.privacySettings?.allowProviderListing === false) {
    return false;
  }

  return true;
}

async function assertOwnedChallenge(clientId, challengeId) {
  assertObjectId(challengeId, "Challenge id");
  await getClientUser(clientId);

  const challenge = await Challenge.findOne({ _id: challengeId, clientId })
    .select(challengeSelect)
    .lean();

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  return challenge;
}

async function getPublicChallengesForMatching(providerId) {
  const submittedChallengeIds = await ExecutionPlan.distinct("challengeId", {
    providerId,
    status: {
      $nin: [
        EXECUTION_PLAN_STATUS.EXPIRED,
        EXECUTION_PLAN_STATUS.REJECTED,
        EXECUTION_PLAN_STATUS.WITHDRAWN,
      ],
    },
  });

  return Challenge.find({
    _id: { $nin: submittedChallengeIds },
    "moderation.status": "approved",
    clientId: { $ne: providerId },
    status: { $in: activeChallengeStatuses },
    visibility: CHALLENGE_VISIBILITY.PUBLIC,
  })
    .select(challengeSelect)
    .limit(500)
    .lean();
}

function defaultExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt;
}

async function upsertMatch({ challenge, direction, match, providerId, providerProfileId, source }) {
  return MatchRecord.findOneAndUpdate(
    {
      challengeId: challenge._id,
      providerId,
    },
    {
      $set: {
        clientId: challenge.clientId,
        direction,
        expiresAt: defaultExpiry(),
        matchReasons: match.matchReasons,
        matchScore: match.matchScore,
        metadata: match.metadata,
        providerProfileId,
        recommendedAction: match.recommendedAction,
        scoreBreakdown: match.scoreBreakdown,
        source,
        weaknesses: match.weaknesses,
      },
      $setOnInsert: {
        status: MATCH_STATUS.NEW,
      },
    },
    {
      new: true,
      setDefaultsOnInsert: true,
      upsert: true,
    },
  ).lean();
}

function getPagination(filters = {}) {
  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  return { limit, page };
}

function providerMatchSort(sort) {
  if (sort === "newest") return { createdAt: -1 };
  if (sort === "category") return { "metadata.matchedCategories.0": 1, matchScore: -1 };
  if (sort === "budget_fit") return { "scoreBreakdown.budgetScore": -1, matchScore: -1 };
  return { matchScore: -1, createdAt: -1 };
}

function clientMatchSort(sort) {
  if (sort === "newest") return { createdAt: -1 };
  if (sort === "proof_score") return { "scoreBreakdown.proofScore": -1, matchScore: -1 };
  if (sort === "availability") return { "scoreBreakdown.availabilityScore": -1, matchScore: -1 };
  return { matchScore: -1, createdAt: -1 };
}

function buildProviderMatchQuery(providerId, filters = {}) {
  const query = {
    providerId,
  };

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = { $nin: [MATCH_STATUS.DISMISSED, MATCH_STATUS.EXPIRED] };
  }

  if (filters.minScore !== undefined) {
    query.matchScore = { $gte: Number(filters.minScore) };
  }

  if (filters.category) {
    query["metadata.matchedCategories"] = new RegExp(`^${String(filters.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }

  return query;
}

function buildClientMatchQuery(clientId, challengeId, filters = {}) {
  const query = {
    challengeId,
    clientId,
  };

  if (filters.status) {
    query.status = filters.status;
  } else {
    query.status = { $ne: MATCH_STATUS.EXPIRED };
  }

  if (filters.minScore !== undefined) {
    query.matchScore = { $gte: Number(filters.minScore) };
  }

  return query;
}

function buildClientSummary(user, profile) {
  const visibility = profile?.profileVisibility ?? "public";

  if (visibility !== "public") {
    return {
      avatar: "",
      fullName: "Private client",
      headline: "",
      id: normalizeId(user?._id),
      publicUrl: user?.username ? `/profile/${user.username}` : "",
      username: user?.username ?? "",
      verificationStatus: user?.verificationStatus ?? "pending",
    };
  }

  return {
    avatar: user?.avatar ?? profile?.profilePicture ?? "",
    fullName: user?.fullName ?? user?.name ?? "",
    headline: profile?.headline ?? "",
    id: normalizeId(user?._id),
    publicUrl: user?.username ? `/profile/${user.username}` : "",
    username: user?.username ?? "",
    verificationStatus: user?.verificationStatus ?? "pending",
  };
}

function buildProviderSummary({ publicProfile, providerProfile, user }) {
  return {
    avatar: user?.avatar ?? publicProfile?.profilePicture ?? "",
    availability: providerProfile?.availability ?? "available",
    categories: providerProfile?.categories ?? [],
    completedOutcomes: providerProfile?.completedOutcomes ?? 0,
    fullName: user?.fullName ?? user?.name ?? "",
    headline: publicProfile?.headline || providerProfile?.headline || providerProfile?.title || "",
    id: normalizeId(user?._id),
    proofScore: providerProfile?.proofScore ?? 0,
    publicUrl: user?.username ? `/providers/${user.username}` : "",
    skills: providerProfile?.skills ?? [],
    title: providerProfile?.title ?? "",
    username: user?.username ?? "",
    verificationStatus: providerProfile?.verificationStatus ?? user?.verificationStatus ?? "none",
  };
}

function sanitizeChallengeSummary(challenge, clientSummary = null) {
  const data = toPlain(challenge);
  return {
    budget: data.budget?.type === CHALLENGE_BUDGET_TYPE.HIDDEN
      ? { currency: data.budget?.currency ?? "USD", type: CHALLENGE_BUDGET_TYPE.HIDDEN }
      : data.budget ?? {},
    category: data.category ?? "",
    client: clientSummary,
    id: normalizeId(data._id ?? data.id),
    shortSummary: data.shortSummary ?? "",
    skillsNeeded: data.skillsNeeded ?? [],
    slug: data.slug ?? "",
    status: data.status ?? "",
    targetOutcome: data.targetOutcome ?? {},
    timeline: data.timeline ?? {},
    title: data.title ?? "",
    toolsNeeded: data.toolsNeeded ?? [],
    urgency: data.urgency ?? "normal",
  };
}

function sanitizeOfferSummary(offer) {
  const data = toPlain(offer);
  return {
    category: data.category ?? "",
    deliveryTimeline: data.deliveryTimeline ?? {},
    id: normalizeId(data._id ?? data.id),
    priceRange: data.priceRange?.type === "hidden"
      ? { currency: data.priceRange?.currency ?? "USD", type: "hidden" }
      : data.priceRange ?? {},
    qualityScore: { score: data.qualityScore?.score ?? 0 },
    shortSummary: data.shortSummary ?? "",
    skills: data.skills ?? [],
    slug: data.slug ?? "",
    targetOutcome: data.targetOutcome ?? {},
    title: data.title ?? "",
    tools: data.tools ?? [],
  };
}

async function getClientSummaryMap(clientIds = []) {
  const ids = Array.from(new Set(clientIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, profiles] = await Promise.all([
    User.find({ _id: { $in: ids } }).select(publicUserSelect).lean(),
    UserProfile.find({ userId: { $in: ids } }).select(userProfileSelect).lean(),
  ]);
  const userMap = new Map(users.map((user) => [normalizeId(user._id), user]));
  const profileMap = new Map(profiles.map((profile) => [normalizeId(profile.userId), profile]));

  return new Map(ids.map((id) => [id, buildClientSummary(userMap.get(id), profileMap.get(id))]));
}

async function getChallengeMap(challengeIds = []) {
  const ids = Array.from(new Set(challengeIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const challenges = await Challenge.find({
    _id: { $in: ids },
    "moderation.status": "approved",
    status: { $in: activeChallengeStatuses },
    visibility: CHALLENGE_VISIBILITY.PUBLIC,
  })
    .select(challengeSelect)
    .lean();
  const clientSummaries = await getClientSummaryMap(challenges.map((challenge) => challenge.clientId));

  return new Map(
    challenges.map((challenge) => [
      normalizeId(challenge._id),
      sanitizeChallengeSummary(challenge, clientSummaries.get(normalizeId(challenge.clientId)) ?? null),
    ]),
  );
}

async function getProviderSummaryMap(providerIds = []) {
  const ids = Array.from(new Set(providerIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, providerProfiles, publicProfiles, settings] = await Promise.all([
    User.find({ _id: { $in: ids } }).select(publicUserSelect).lean(),
    ProviderProfile.find({ userId: { $in: ids } }).select(providerProfileSelect).lean(),
    UserProfile.find({ userId: { $in: ids } }).select(userProfileSelect).lean(),
    UserSettings.find({ userId: { $in: ids } }).select("profileVisibility userId").lean(),
  ]);
  const userMap = new Map(users.map((user) => [normalizeId(user._id), user]));
  const providerProfileMap = new Map(providerProfiles.map((profile) => [normalizeId(profile.userId), profile]));
  const publicProfileMap = new Map(publicProfiles.map((profile) => [normalizeId(profile.userId), profile]));
  const settingsMap = new Map(settings.map((setting) => [normalizeId(setting.userId), setting]));

  return new Map(
    ids
      .map((id) => {
        const context = {
          publicProfile: publicProfileMap.get(id),
          providerProfile: providerProfileMap.get(id),
          settings: settingsMap.get(id),
          user: userMap.get(id),
        };

        if (!isDiscoverableProvider(context)) {
          return null;
        }

        return [id, buildProviderSummary(context)];
      })
      .filter(Boolean),
  );
}

async function getOfferSummaryMap(offerIds = []) {
  const ids = Array.from(new Set(offerIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const offers = await OutcomeOffer.find({
    _id: { $in: ids },
    "moderation.status": "approved",
    status: OUTCOME_OFFER_STATUS.PUBLISHED,
    visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
  })
    .select(offerSelect)
    .lean();

  return new Map(offers.map((offer) => [normalizeId(offer._id), sanitizeOfferSummary(offer)]));
}

export function sanitizeMatchForProvider(match, challengeSummary = null) {
  const data = toPlain(match);

  return {
    challenge: challengeSummary,
    createdAt: data.createdAt,
    id: normalizeId(data._id ?? data.id),
    matchReasons: data.matchReasons ?? [],
    matchScore: data.matchScore ?? 0,
    recommendedAction: data.recommendedAction ?? "",
    scoreBreakdown: data.scoreBreakdown ?? {},
    status: data.status ?? MATCH_STATUS.NEW,
    updatedAt: data.updatedAt,
    weaknesses: data.weaknesses ?? [],
  };
}

export function sanitizeMatchForClient(match, providerSummary = null, offerSummaries = []) {
  const data = toPlain(match);

  return {
    createdAt: data.createdAt,
    id: normalizeId(data._id ?? data.id),
    matchReasons: data.matchReasons ?? [],
    matchScore: data.matchScore ?? 0,
    matchedOffers: offerSummaries,
    provider: providerSummary,
    recommendedAction: data.recommendedAction ?? "",
    scoreBreakdown: data.scoreBreakdown ?? {},
    status: data.status ?? MATCH_STATUS.NEW,
    updatedAt: data.updatedAt,
    weaknesses: data.weaknesses ?? [],
  };
}

export async function generateMatchesForProvider(providerId, options = {}) {
  ensureDatabaseConnection();
  const { outcomeOffers, providerProfile, user } = await getProviderContext(providerId);
  const threshold = Number(options.threshold ?? options.minScore ?? 40);
  const source = options.source ?? MATCH_SOURCE.MANUAL_REFRESH;
  const challenges = await getPublicChallengesForMatching(providerId);

  for (const challenge of challenges) {
    const match = calculateProviderChallengeMatch(user, providerProfile, outcomeOffers, challenge);

    if (match.matchScore >= threshold) {
      await upsertMatch({
        challenge,
        direction: MATCH_DIRECTION.PROVIDER_TO_CHALLENGE,
        match,
        providerId,
        providerProfileId: providerProfile._id,
        source,
      });
    }
  }

  return getProviderMatchedChallenges(providerId, options);
}

async function getProviderCandidates() {
  const providerProfiles = await ProviderProfile.find({
    moderationStatus: "active",
    isAvailableForChallenges: { $ne: false },
  })
    .select(providerProfileSelect)
    .limit(500)
    .lean();
  const ids = providerProfiles.map((profile) => profile.userId);
  const [users, publicProfiles, settings, offers] = await Promise.all([
    User.find({
      _id: { $in: ids },
      accountStatus: { $nin: ["suspended", "deleted"] },
      isSuspended: { $ne: true },
      role: USER_ROLES.PROVIDER,
    })
      .select(publicUserSelect)
      .lean(),
    UserProfile.find({ userId: { $in: ids } }).select(userProfileSelect).lean(),
    UserSettings.find({ userId: { $in: ids } }).select("profileVisibility userId").lean(),
    OutcomeOffer.find({
      "moderation.status": "approved",
      providerId: { $in: ids },
      status: OUTCOME_OFFER_STATUS.PUBLISHED,
      visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    })
      .select(offerSelect)
      .limit(2000)
      .lean(),
  ]);
  const userMap = new Map(users.map((user) => [normalizeId(user._id), user]));
  const publicProfileMap = new Map(publicProfiles.map((profile) => [normalizeId(profile.userId), profile]));
  const settingsMap = new Map(settings.map((setting) => [normalizeId(setting.userId), setting]));
  const offersByProvider = new Map();

  for (const offer of offers) {
    const id = normalizeId(offer.providerId);
    offersByProvider.set(id, [...(offersByProvider.get(id) ?? []), offer]);
  }

  return providerProfiles
    .map((providerProfile) => {
      const id = normalizeId(providerProfile.userId);
      const context = {
        outcomeOffers: offersByProvider.get(id) ?? [],
        publicProfile: publicProfileMap.get(id),
        providerProfile,
        settings: settingsMap.get(id),
        user: userMap.get(id),
      };

      if (!isDiscoverableProvider(context)) {
        return null;
      }

      return context;
    })
    .filter(Boolean);
}

export async function generateMatchesForChallenge(challengeId, clientId, options = {}) {
  ensureDatabaseConnection();
  const challenge = await assertOwnedChallenge(clientId, challengeId);
  const threshold = Number(options.threshold ?? options.minScore ?? 40);
  const source = options.source ?? MATCH_SOURCE.MANUAL_REFRESH;
  const providers = await getProviderCandidates();

  for (const provider of providers) {
    const match = calculateProviderChallengeMatch(
      provider.user,
      provider.providerProfile,
      provider.outcomeOffers,
      challenge,
    );

    if (match.matchScore >= threshold) {
      await upsertMatch({
        challenge,
        direction: MATCH_DIRECTION.CHALLENGE_TO_PROVIDER,
        match,
        providerId: provider.user._id,
        providerProfileId: provider.providerProfile._id,
        source,
      });
    }
  }

  return getClientRecommendedProviders(clientId, challengeId, options);
}

export async function getProviderMatchedChallenges(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const { limit, page } = getPagination(filters);
  const query = buildProviderMatchQuery(providerId, filters);
  const [matches, total] = await Promise.all([
    MatchRecord.find(query)
      .sort(providerMatchSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MatchRecord.countDocuments(query),
  ]);
  const challengeMap = await getChallengeMap(matches.map((match) => match.challengeId));
  const visibleMatches = matches.filter((match) => challengeMap.has(normalizeId(match.challengeId)));

  return {
    items: visibleMatches.map((match) =>
      sanitizeMatchForProvider(match, challengeMap.get(normalizeId(match.challengeId))),
    ),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getClientRecommendedProviders(clientId, challengeId, filters = {}) {
  ensureDatabaseConnection();
  const challenge = await assertOwnedChallenge(clientId, challengeId);
  const { limit, page } = getPagination(filters);
  const query = buildClientMatchQuery(clientId, challenge._id, filters);
  const [matches, total] = await Promise.all([
    MatchRecord.find(query)
      .sort(clientMatchSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    MatchRecord.countDocuments(query),
  ]);
  const providerMap = await getProviderSummaryMap(matches.map((match) => match.providerId));
  const offerIds = matches.flatMap((match) => match.metadata?.matchedOfferIds ?? []);
  const offerMap = await getOfferSummaryMap(offerIds);
  const visibleMatches = matches.filter((match) => providerMap.has(normalizeId(match.providerId)));

  return {
    challenge: sanitizeChallengeSummary(challenge),
    items: visibleMatches.map((match) => {
      const matchedOffers = (match.metadata?.matchedOfferIds ?? [])
        .map((offerId) => offerMap.get(normalizeId(offerId)))
        .filter(Boolean);

      return sanitizeMatchForClient(
        match,
        providerMap.get(normalizeId(match.providerId)),
        matchedOffers,
      );
    }),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getMatchByIdForProvider(providerId, matchId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  assertObjectId(matchId, "Match id");

  const match = await MatchRecord.findOne({ _id: matchId, providerId }).lean();

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  const challengeMap = await getChallengeMap([match.challengeId]);
  const challenge = challengeMap.get(normalizeId(match.challengeId));

  if (!challenge) {
    throw new AppError("Match not found", 404);
  }

  return sanitizeMatchForProvider(match, challenge);
}

export async function getMatchByIdForClient(clientId, matchId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);
  assertObjectId(matchId, "Match id");

  const match = await MatchRecord.findOne({ _id: matchId, clientId }).lean();

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  await assertOwnedChallenge(clientId, match.challengeId);
  const providerMap = await getProviderSummaryMap([match.providerId]);
  const provider = providerMap.get(normalizeId(match.providerId));

  if (!provider) {
    throw new AppError("Match not found", 404);
  }

  const offerMap = await getOfferSummaryMap(match.metadata?.matchedOfferIds ?? []);
  const matchedOffers = (match.metadata?.matchedOfferIds ?? [])
    .map((offerId) => offerMap.get(normalizeId(offerId)))
    .filter(Boolean);

  return sanitizeMatchForClient(match, provider, matchedOffers);
}

function providerStatusUpdate(status) {
  const update = { status };
  const now = new Date();

  if (status === MATCH_STATUS.VIEWED) update.providerViewedAt = now;
  if (status === MATCH_STATUS.SAVED) update.savedAt = now;
  if ([MATCH_STATUS.DISMISSED, MATCH_STATUS.IGNORED].includes(status)) update.dismissedAt = now;

  return update;
}

function clientStatusUpdate(status) {
  const update = { status };
  const now = new Date();

  if (status === MATCH_STATUS.VIEWED) update.clientViewedAt = now;
  if (status === MATCH_STATUS.SAVED) update.savedAt = now;
  if (status === MATCH_STATUS.DISMISSED) update.dismissedAt = now;

  return update;
}

export async function updateProviderMatchStatus(providerId, matchId, status) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  assertObjectId(matchId, "Match id");

  if (![MATCH_STATUS.VIEWED, MATCH_STATUS.SAVED, MATCH_STATUS.IGNORED, MATCH_STATUS.DISMISSED].includes(status)) {
    throw new AppError("Match status is not allowed", 400);
  }

  const match = await MatchRecord.findOneAndUpdate(
    { _id: matchId, providerId },
    { $set: providerStatusUpdate(status) },
    { new: true },
  ).lean();

  if (!match) {
    throw new AppError("Match not found", 404);
  }

  const challengeMap = await getChallengeMap([match.challengeId]);
  return sanitizeMatchForProvider(match, challengeMap.get(normalizeId(match.challengeId)) ?? null);
}

export async function updateClientMatchStatus(clientId, matchId, status) {
  ensureDatabaseConnection();
  await getClientUser(clientId);
  assertObjectId(matchId, "Match id");

  if (![MATCH_STATUS.VIEWED, MATCH_STATUS.SAVED, MATCH_STATUS.DISMISSED].includes(status)) {
    throw new AppError("Match status is not allowed", 400);
  }

  const existingMatch = await MatchRecord.findOne({ _id: matchId, clientId }).lean();

  if (!existingMatch) {
    throw new AppError("Match not found", 404);
  }

  await assertOwnedChallenge(clientId, existingMatch.challengeId);

  const match = await MatchRecord.findByIdAndUpdate(
    matchId,
    { $set: clientStatusUpdate(status) },
    { new: true },
  ).lean();
  const providerMap = await getProviderSummaryMap([match.providerId]);
  return sanitizeMatchForClient(match, providerMap.get(normalizeId(match.providerId)) ?? null);
}

export async function markMatchApplied(providerId, challengeId) {
  ensureDatabaseConnection();

  if (!mongoose.isValidObjectId(providerId) || !mongoose.isValidObjectId(challengeId)) {
    return null;
  }

  return MatchRecord.findOneAndUpdate(
    { challengeId, providerId },
    {
      $set: {
        appliedAt: new Date(),
        status: MATCH_STATUS.APPLIED,
      },
    },
    { new: true },
  ).lean();
}

export async function markMatchInvited(clientId, providerId, challengeId) {
  ensureDatabaseConnection();
  const challenge = await assertOwnedChallenge(clientId, challengeId);

  return MatchRecord.findOneAndUpdate(
    { challengeId: challenge._id, providerId },
    {
      $set: {
        clientId,
        invitedAt: new Date(),
        status: MATCH_STATUS.INVITED,
      },
    },
    { new: true },
  ).lean();
}

export async function expireOldMatches() {
  ensureDatabaseConnection();

  const result = await MatchRecord.updateMany(
    {
      expiresAt: { $lt: new Date() },
      status: { $nin: [MATCH_STATUS.APPLIED, MATCH_STATUS.INVITED, MATCH_STATUS.EXPIRED] },
    },
    {
      $set: { status: MATCH_STATUS.EXPIRED },
    },
  );

  return {
    expired: result.modifiedCount ?? 0,
  };
}
