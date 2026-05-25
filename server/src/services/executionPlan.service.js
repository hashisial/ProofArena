import mongoose from "mongoose";
import {
  CHALLENGE_STATUS,
  CHALLENGE_VISIBILITY,
  EXECUTION_PLAN_STATUS,
  PLAN_PRICE_TYPE,
  PLAN_TIMELINE_TYPE,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { ExecutionPlan } from "../models/ExecutionPlan.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { markMatchApplied } from "./match.service.js";

const publicUserSelect =
  "_id avatar fullName name role username accountStatus isSuspended isVerified emailVerified verificationStatus";
const providerProfileSelect =
  "_id userId title headline categories skills availability moderationStatus verificationStatus proofScore completedOutcomes totalProofsApproved onTimeRate approvalRate";
const userProfileSelect =
  "_id userId headline profilePicture profileVisibility privacySettings";

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function compactObject(value = {}) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  );
}

function normalizeList(values = [], maxItems = 30, maxLength = 80) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => String(value ?? "").trim().slice(0, maxLength))
        .filter(Boolean),
    ),
  ).slice(0, maxItems);
}

function normalizeObjectList(values = [], maxItems = 20) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => compactObject(item ?? {}))
    .filter((item) => Object.keys(item).length > 0)
    .slice(0, maxItems);
}

function normalizeExecutionPlanPayload(payload = {}) {
  return compactObject({
    approach: payload.approach,
    attachments:
      payload.attachments === undefined ? undefined : normalizeObjectList(payload.attachments, 10),
    availability: payload.availability,
    communicationPlan: payload.communicationPlan,
    milestones:
      payload.milestones === undefined ? undefined : normalizeObjectList(payload.milestones, 20),
    price: payload.price,
    proofPlan:
      payload.proofPlan === undefined ? undefined : normalizeObjectList(payload.proofPlan, 20),
    riskHandling:
      payload.riskHandling === undefined ? undefined : normalizeObjectList(payload.riskHandling, 10),
    skills: payload.skills === undefined ? undefined : normalizeList(payload.skills, 30, 50),
    summary: payload.summary,
    timeline: payload.timeline,
    title: payload.title,
    tools: payload.tools === undefined ? undefined : normalizeList(payload.tools, 30, 50),
    whyThisProvider: payload.whyThisProvider,
  });
}

function assertObjectId(value, label = "Execution plan id") {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

async function getProviderUser(providerId) {
  assertObjectId(providerId, "Provider id");

  const user = await User.findById(providerId)
    .select("_id accountStatus fullName isSuspended name role username")
    .lean();

  if (!user) {
    throw new AppError("Provider account not found", 404);
  }

  if (user.role !== USER_ROLES.PROVIDER) {
    throw new AppError("Only providers can submit execution plans", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider account is not available", 403);
  }

  return user;
}

async function getClientUser(clientId) {
  assertObjectId(clientId, "Client id");

  const user = await User.findById(clientId)
    .select("_id accountStatus fullName isSuspended name role username")
    .lean();

  if (!user) {
    throw new AppError("Client account not found", 404);
  }

  if (user.role !== USER_ROLES.CLIENT) {
    throw new AppError("Only the challenge owner can make this decision", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Client account is not available", 403);
  }

  return user;
}

async function findProviderProfile(providerId) {
  return ProviderProfile.findOne({ userId: providerId }).select(providerProfileSelect);
}

function hasText(value, minLength = 1) {
  return String(value ?? "").trim().length >= minLength;
}

function hasTimeline(timeline = {}) {
  if (!timeline?.type) {
    return false;
  }

  if (timeline.type === PLAN_TIMELINE_TYPE.FIXED_DAYS) {
    return Number.isFinite(Number(timeline.days));
  }

  if (timeline.type === PLAN_TIMELINE_TYPE.RANGE_DAYS) {
    return Number.isFinite(Number(timeline.minDays)) &&
      Number.isFinite(Number(timeline.maxDays));
  }

  if (timeline.type === PLAN_TIMELINE_TYPE.CUSTOM) {
    return hasText(timeline.customLabel);
  }

  return true;
}

function hasPrice(price = {}) {
  if (!price?.type) {
    return false;
  }

  if (price.type === PLAN_PRICE_TYPE.CUSTOM) {
    return hasText(price.customLabel);
  }

  if (price.type === PLAN_PRICE_TYPE.RANGE) {
    return Number.isFinite(Number(price.min)) && Number.isFinite(Number(price.max));
  }

  return Number.isFinite(Number(price.min));
}

export function calculatePlanScore(plan = {}) {
  const checks = [
    ["title", hasText(plan.title, 8), "Clear title"],
    ["summary", hasText(plan.summary, 80), "Strong summary"],
    ["approach", hasText(plan.approach, 250), "Detailed approach"],
    ["milestones", Array.isArray(plan.milestones) && plan.milestones.length > 0, "Milestones included"],
    ["proofPlan", Array.isArray(plan.proofPlan) && plan.proofPlan.length > 0, "Proof plan included"],
    ["timeline", hasTimeline(plan.timeline), "Timeline included"],
    ["price", hasPrice(plan.price), "Price included"],
    ["riskHandling", Array.isArray(plan.riskHandling) && plan.riskHandling.length > 0, "Risks addressed"],
    [
      "communicationPlan",
      hasText(plan.communicationPlan?.updateFrequency),
      "Communication cadence included",
    ],
    [
      "tools/skills",
      (Array.isArray(plan.tools) && plan.tools.length > 0) ||
        (Array.isArray(plan.skills) && plan.skills.length > 0),
      "Tools or skills included",
    ],
    ["whyThisProvider", hasText(plan.whyThisProvider, 80), "Provider fit explained"],
    ["attachments", Array.isArray(plan.attachments) && plan.attachments.length > 0, "Relevant assets attached"],
  ];
  const strengths = [];
  const missingFields = [];
  const warnings = [];

  for (const [field, passed, strength] of checks) {
    if (passed) {
      strengths.push(strength);
    } else {
      missingFields.push(field);
    }
  }

  if (hasText(plan.approach) && !hasText(plan.approach, 250)) {
    warnings.push("approach_needs_more_detail");
  }

  if (Array.isArray(plan.proofPlan) && plan.proofPlan.every((proof) => proof?.required === false)) {
    warnings.push("no_required_proof_items");
  }

  return {
    lastCalculatedAt: new Date(),
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
    strengths,
    warnings,
  };
}

function toPlainPlan(plan) {
  return typeof plan?.toObject === "function" ? plan.toObject() : { ...(plan ?? {}) };
}

function buildChallengeSummary(challenge = {}) {
  if (!challenge) {
    return null;
  }

  return {
    budget: challenge.budget ?? {},
    category: challenge.category ?? "",
    clientId: challenge.clientId ? normalizeId(challenge.clientId) : "",
    id: normalizeId(challenge._id ?? challenge.id),
    shortSummary: challenge.shortSummary ?? "",
    slug: challenge.slug ?? "",
    status: challenge.status ?? "",
    targetOutcome: challenge.targetOutcome ?? {},
    timeline: challenge.timeline ?? {},
    title: challenge.title ?? "",
    visibility: challenge.visibility ?? "",
  };
}

function buildProviderSummary({ profile, providerProfile, user }) {
  if (!user) {
    return null;
  }

  return {
    avatar: user.avatar ?? profile?.profilePicture ?? "",
    completedOutcomes: providerProfile?.completedOutcomes ?? 0,
    fullName: user.fullName ?? user.name ?? "",
    headline: profile?.headline || providerProfile?.headline || providerProfile?.title || "",
    id: normalizeId(user._id),
    proofScore: providerProfile?.proofScore ?? 0,
    publicUrl: user.username ? `/providers/${user.username}` : "",
    title: providerProfile?.title ?? "",
    username: user.username ?? "",
    verificationStatus: providerProfile?.verificationStatus ?? user.verificationStatus ?? "none",
  };
}

async function getProviderSummaryMap(providerIds) {
  const ids = Array.from(new Set(providerIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, providerProfiles, profiles, settings] = await Promise.all([
    User.find({
      _id: { $in: ids },
      accountStatus: { $nin: ["suspended", "deleted"] },
      isSuspended: { $ne: true },
      role: USER_ROLES.PROVIDER,
    })
      .select(publicUserSelect)
      .lean(),
    ProviderProfile.find({ userId: { $in: ids } }).select(providerProfileSelect).lean(),
    UserProfile.find({ userId: { $in: ids } }).select(userProfileSelect).lean(),
    UserSettings.find({ userId: { $in: ids } }).select("profileVisibility userId").lean(),
  ]);

  const usersById = new Map(users.map((user) => [normalizeId(user._id), user]));
  const providerProfilesByUserId = new Map(
    providerProfiles.map((profile) => [normalizeId(profile.userId), profile]),
  );
  const profilesByUserId = new Map(profiles.map((profile) => [normalizeId(profile.userId), profile]));
  const settingsByUserId = new Map(settings.map((setting) => [normalizeId(setting.userId), setting]));

  return new Map(
    ids
      .map((id) => {
        const user = usersById.get(id);
        const profile = profilesByUserId.get(id);
        const providerProfile = providerProfilesByUserId.get(id);
        const visibility = settingsByUserId.get(id)?.profileVisibility ??
          profile?.profileVisibility ??
          "public";

        if (!user) {
          return null;
        }

        if (visibility !== "public") {
          return [
            id,
            {
              avatar: "",
              completedOutcomes: providerProfile?.completedOutcomes ?? 0,
              fullName: "Private provider",
              headline: "",
              id,
              proofScore: providerProfile?.proofScore ?? 0,
              publicUrl: user.username ? `/providers/${user.username}` : "",
              title: providerProfile?.title ?? "",
              username: user.username ?? "",
              verificationStatus: providerProfile?.verificationStatus ?? "none",
            },
          ];
        }

        return [
          id,
          buildProviderSummary({
            profile,
            providerProfile,
            user,
          }),
        ];
      })
      .filter(Boolean),
  );
}

export function sanitizePlanForProvider(plan, challengeSummary = null) {
  const data = toPlainPlan(plan);

  return {
    id: normalizeId(data._id ?? data.id),
    aiMetadata: {
      generatedByAI: Boolean(data.aiMetadata?.generatedByAI),
      aiVersion: data.aiMetadata?.aiVersion ?? "",
      lastAIImprovedAt: data.aiMetadata?.lastAIImprovedAt ?? null,
    },
    acceptedAt: data.acceptedAt ?? null,
    approach: data.approach ?? "",
    attachments: data.attachments ?? [],
    availability: data.availability ?? {},
    challenge: challengeSummary ?? null,
    challengeId: normalizeId(data.challengeId),
    clientFeedback: data.clientFeedback ?? {},
    communicationPlan: data.communicationPlan ?? {},
    createdAt: data.createdAt,
    matchSnapshot: data.matchSnapshot ?? {},
    milestones: data.milestones ?? [],
    outcomeOfferId: data.outcomeOfferId ? normalizeId(data.outcomeOfferId) : null,
    planScore: data.planScore ?? { missingFields: [], score: 0, strengths: [], warnings: [] },
    price: data.price ?? {},
    proofPlan: data.proofPlan ?? [],
    providerId: normalizeId(data.providerId),
    providerProfileId: data.providerProfileId ? normalizeId(data.providerProfileId) : null,
    rejectedAt: data.rejectedAt ?? null,
    riskHandling: data.riskHandling ?? [],
    shortlistedAt: data.shortlistedAt ?? null,
    skills: data.skills ?? [],
    stats: data.stats ?? {},
    status: data.status ?? EXECUTION_PLAN_STATUS.SUBMITTED,
    submittedAt: data.submittedAt ?? null,
    summary: data.summary ?? "",
    timeline: data.timeline ?? {},
    title: data.title ?? "",
    tools: data.tools ?? [],
    updatedAt: data.updatedAt,
    whyThisProvider: data.whyThisProvider ?? "",
    withdrawnAt: data.withdrawnAt ?? null,
  };
}

export function sanitizePlanForClient(plan, providerSummary = null, challengeSummary = null) {
  const data = toPlainPlan(plan);

  return {
    id: normalizeId(data._id ?? data.id),
    acceptedAt: data.acceptedAt ?? null,
    approach: data.approach ?? "",
    attachments: data.attachments ?? [],
    availability: data.availability ?? {},
    challenge: challengeSummary ?? null,
    challengeId: normalizeId(data.challengeId),
    clientFeedback: data.clientFeedback ?? {},
    communicationPlan: data.communicationPlan ?? {},
    createdAt: data.createdAt,
    matchSnapshot: data.matchSnapshot ?? {},
    milestones: data.milestones ?? [],
    outcomeOfferId: data.outcomeOfferId ? normalizeId(data.outcomeOfferId) : null,
    planScore: data.planScore ?? { missingFields: [], score: 0, strengths: [], warnings: [] },
    price: data.price ?? {},
    proofPlan: data.proofPlan ?? [],
    provider: providerSummary,
    rejectedAt: data.rejectedAt ?? null,
    riskHandling: data.riskHandling ?? [],
    shortlistedAt: data.shortlistedAt ?? null,
    skills: data.skills ?? [],
    status: data.status ?? EXECUTION_PLAN_STATUS.SUBMITTED,
    submittedAt: data.submittedAt ?? null,
    summary: data.summary ?? "",
    timeline: data.timeline ?? {},
    title: data.title ?? "",
    tools: data.tools ?? [],
    updatedAt: data.updatedAt,
    whyThisProvider: data.whyThisProvider ?? "",
    withdrawnAt: data.withdrawnAt ?? null,
  };
}

async function getChallengeSummaryMap(challengeIds) {
  const ids = Array.from(new Set(challengeIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const challenges = await Challenge.find({ _id: { $in: ids } })
    .select("_id budget category clientId shortSummary slug status targetOutcome timeline title visibility")
    .lean();

  return new Map(challenges.map((challenge) => [normalizeId(challenge._id), buildChallengeSummary(challenge)]));
}

function assertChallengeAcceptingPlans(challenge, providerId) {
  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  if (normalizeId(challenge.clientId) === normalizeId(providerId)) {
    throw new AppError("You cannot submit a plan to your own challenge", 403);
  }

  if (
    challenge.visibility !== CHALLENGE_VISIBILITY.PUBLIC ||
    challenge.moderation?.status !== "approved" ||
    ![CHALLENGE_STATUS.OPEN, CHALLENGE_STATUS.REVIEWING_PLANS].includes(challenge.status)
  ) {
    throw new AppError("This challenge is not accepting execution plans", 400);
  }
}

async function assertOutcomeOfferBelongsToProvider(providerId, outcomeOfferId) {
  if (!outcomeOfferId) {
    return null;
  }

  assertObjectId(outcomeOfferId, "Outcome offer id");

  const offer = await OutcomeOffer.findOne({ _id: outcomeOfferId, providerId })
    .select("_id")
    .lean();

  if (!offer) {
    throw new AppError("Outcome offer not found", 404);
  }

  return offer;
}

async function findOwnedProviderPlan(providerId, planId) {
  assertObjectId(planId);

  const plan = await ExecutionPlan.findOne({ _id: planId, providerId });

  if (!plan) {
    throw new AppError("Execution plan not found", 404);
  }

  return plan;
}

async function findPlanForClient(clientId, planId) {
  assertObjectId(planId);

  const plan = await ExecutionPlan.findById(planId);

  if (!plan) {
    throw new AppError("Execution plan not found", 404);
  }

  const challenge = await Challenge.findOne({ _id: plan.challengeId, clientId }).lean();

  if (!challenge) {
    throw new AppError("You are not allowed to view this execution plan", 403);
  }

  return { challenge, plan };
}

function assertPlanEditable(plan) {
  if (![EXECUTION_PLAN_STATUS.DRAFT, EXECUTION_PLAN_STATUS.SUBMITTED].includes(plan.status)) {
    throw new AppError("This execution plan cannot be edited", 400);
  }
}

function assertClientCanDecidePlan(plan, allowedStatuses) {
  if (!allowedStatuses.includes(plan.status)) {
    throw new AppError("This execution plan cannot be edited", 400);
  }
}

function buildProviderPlanQuery(providerId, filters = {}) {
  const query = { providerId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.challengeId) {
    query.challengeId = filters.challengeId;
  }

  return query;
}

function buildPlanSort(sort) {
  if (sort === "score") {
    return { "planScore.score": -1, submittedAt: -1, createdAt: -1 };
  }

  if (sort === "price_low") {
    return { "price.min": 1, submittedAt: -1, createdAt: -1 };
  }

  if (sort === "price_high") {
    return { "price.min": -1, submittedAt: -1, createdAt: -1 };
  }

  return { submittedAt: -1, createdAt: -1 };
}

export async function submitExecutionPlan(providerId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  assertObjectId(payload.challengeId, "Challenge id");

  const challenge = await Challenge.findById(payload.challengeId);
  assertChallengeAcceptingPlans(challenge, providerId);
  await assertOutcomeOfferBelongsToProvider(providerId, payload.outcomeOfferId);

  const duplicatePlan = await ExecutionPlan.exists({
    challengeId: payload.challengeId,
    providerId,
    status: {
      $nin: [
        EXECUTION_PLAN_STATUS.EXPIRED,
        EXECUTION_PLAN_STATUS.REJECTED,
        EXECUTION_PLAN_STATUS.WITHDRAWN,
      ],
    },
  });

  if (duplicatePlan) {
    throw new AppError("You have already submitted an execution plan for this challenge", 409);
  }

  const providerProfile = await findProviderProfile(providerId);
  const normalizedPayload = normalizeExecutionPlanPayload(payload);
  const plan = new ExecutionPlan({
    ...normalizedPayload,
    challengeId: challenge._id,
    outcomeOfferId: payload.outcomeOfferId ?? null,
    providerId,
    providerProfileId: providerProfile?._id ?? null,
    status: EXECUTION_PLAN_STATUS.SUBMITTED,
    submittedAt: new Date(),
  });
  plan.planScore = calculatePlanScore(plan);

  try {
    await plan.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("You have already submitted an execution plan for this challenge", 409);
    }

    throw error;
  }

  const challengeUpdate = {
    $inc: { "applicationStats.totalPlans": 1 },
  };

  if (challenge.status === CHALLENGE_STATUS.OPEN) {
    challengeUpdate.$set = { status: CHALLENGE_STATUS.REVIEWING_PLANS };
    challenge.status = CHALLENGE_STATUS.REVIEWING_PLANS;
  }

  await Challenge.updateOne({ _id: challenge._id }, challengeUpdate);

  try {
    await markMatchApplied(providerId, challenge._id);
  } catch {
    // Matching is advisory; execution plan submission must not fail if no match exists.
  }

  return sanitizePlanForProvider(plan, buildChallengeSummary(challenge));
}

export async function getMyExecutionPlans(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const query = buildProviderPlanQuery(providerId, filters);
  const [items, total] = await Promise.all([
    ExecutionPlan.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ExecutionPlan.countDocuments(query),
  ]);
  const challengeSummaries = await getChallengeSummaryMap(items.map((plan) => plan.challengeId));

  return {
    items: items.map((plan) =>
      sanitizePlanForProvider(plan, challengeSummaries.get(normalizeId(plan.challengeId))),
    ),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getExecutionPlanByIdForProvider(providerId, planId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const plan = await findOwnedProviderPlan(providerId, planId);
  const challenge = await Challenge.findById(plan.challengeId)
    .select("_id budget category clientId shortSummary slug status targetOutcome timeline title visibility")
    .lean();

  return sanitizePlanForProvider(plan, buildChallengeSummary(challenge));
}

export async function getPlansForClientChallenge(clientId, challengeId, filters = {}) {
  ensureDatabaseConnection();
  await getClientUser(clientId);
  assertObjectId(challengeId, "Challenge id");

  const challenge = await Challenge.findOne({ _id: challengeId, clientId }).lean();

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const query = { challengeId };

  if (filters.status) {
    query.status = filters.status;
  }

  const [items, total] = await Promise.all([
    ExecutionPlan.find(query)
      .sort(buildPlanSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ExecutionPlan.countDocuments(query),
  ]);
  const providerSummaries = await getProviderSummaryMap(items.map((plan) => plan.providerId));
  const challengeSummary = buildChallengeSummary(challenge);

  return {
    items: items.map((plan) =>
      sanitizePlanForClient(
        plan,
        providerSummaries.get(normalizeId(plan.providerId)),
        challengeSummary,
      ),
    ),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getExecutionPlanByIdForClient(clientId, planId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const { challenge, plan } = await findPlanForClient(clientId, planId);
  const providerSummaries = await getProviderSummaryMap([plan.providerId]);

  return sanitizePlanForClient(
    plan,
    providerSummaries.get(normalizeId(plan.providerId)),
    buildChallengeSummary(challenge),
  );
}

export async function updateExecutionPlan(providerId, planId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const plan = await findOwnedProviderPlan(providerId, planId);
  assertPlanEditable(plan);

  Object.assign(plan, normalizeExecutionPlanPayload(payload));
  plan.planScore = calculatePlanScore(plan);
  await plan.save();

  const challenge = await Challenge.findById(plan.challengeId)
    .select("_id budget category clientId shortSummary slug status targetOutcome timeline title visibility")
    .lean();

  return sanitizePlanForProvider(plan, buildChallengeSummary(challenge));
}

export async function withdrawExecutionPlan(providerId, planId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const plan = await findOwnedProviderPlan(providerId, planId);

  if (plan.status === EXECUTION_PLAN_STATUS.ACCEPTED) {
    throw new AppError("This execution plan cannot be edited", 400);
  }

  plan.status = EXECUTION_PLAN_STATUS.WITHDRAWN;
  plan.withdrawnAt = new Date();
  await plan.save();

  return sanitizePlanForProvider(plan);
}

export async function shortlistExecutionPlan(clientId, planId, note = "") {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const { challenge, plan } = await findPlanForClient(clientId, planId);
  assertClientCanDecidePlan(plan, [EXECUTION_PLAN_STATUS.SUBMITTED]);

  plan.status = EXECUTION_PLAN_STATUS.SHORTLISTED;
  plan.shortlistedAt = new Date();
  plan.clientFeedback = {
    ...(plan.clientFeedback?.toObject?.() ?? plan.clientFeedback ?? {}),
    feedbackAt: new Date(),
    shortlistNote: note ?? "",
  };
  await plan.save();
  await Challenge.updateOne(
    { _id: challenge._id },
    { $inc: { "applicationStats.shortlistedPlans": 1 } },
  );

  const providerSummaries = await getProviderSummaryMap([plan.providerId]);
  return sanitizePlanForClient(
    plan,
    providerSummaries.get(normalizeId(plan.providerId)),
    buildChallengeSummary(challenge),
  );
}

export async function rejectExecutionPlan(clientId, planId, rejectionReason = "") {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const { challenge, plan } = await findPlanForClient(clientId, planId);
  assertClientCanDecidePlan(plan, [
    EXECUTION_PLAN_STATUS.SUBMITTED,
    EXECUTION_PLAN_STATUS.SHORTLISTED,
  ]);

  plan.status = EXECUTION_PLAN_STATUS.REJECTED;
  plan.rejectedAt = new Date();
  plan.clientFeedback = {
    ...(plan.clientFeedback?.toObject?.() ?? plan.clientFeedback ?? {}),
    feedbackAt: new Date(),
    rejectionReason: rejectionReason ?? "",
  };
  await plan.save();

  const providerSummaries = await getProviderSummaryMap([plan.providerId]);
  return sanitizePlanForClient(
    plan,
    providerSummaries.get(normalizeId(plan.providerId)),
    buildChallengeSummary(challenge),
  );
}

export async function acceptExecutionPlan(clientId, planId, note = "") {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const { challenge, plan } = await findPlanForClient(clientId, planId);
  assertClientCanDecidePlan(plan, [
    EXECUTION_PLAN_STATUS.SUBMITTED,
    EXECUTION_PLAN_STATUS.SHORTLISTED,
  ]);

  plan.status = EXECUTION_PLAN_STATUS.ACCEPTED;
  plan.acceptedAt = new Date();
  plan.clientFeedback = {
    ...(plan.clientFeedback?.toObject?.() ?? plan.clientFeedback ?? {}),
    acceptedNote: note ?? "",
    feedbackAt: new Date(),
  };
  await plan.save();
  await Challenge.updateOne(
    { _id: challenge._id },
    {
      $set: {
        "applicationStats.selectedProviderId": plan.providerId,
        status: CHALLENGE_STATUS.PROVIDER_SELECTED,
      },
    },
  );

  const providerSummaries = await getProviderSummaryMap([plan.providerId]);
  return sanitizePlanForClient(
    plan,
    providerSummaries.get(normalizeId(plan.providerId)),
    {
      ...buildChallengeSummary(challenge),
      status: CHALLENGE_STATUS.PROVIDER_SELECTED,
    },
  );
}
