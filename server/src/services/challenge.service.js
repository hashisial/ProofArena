import mongoose from "mongoose";
import {
  CHALLENGE_BUDGET_TYPE,
  CHALLENGE_STATUS,
  CHALLENGE_TIMELINE_TYPE,
  CHALLENGE_VISIBILITY,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const publicUserSelect =
  "_id avatar fullName name role username accountStatus isSuspended isVerified emailVerified verificationStatus";
const clientProfileSelect =
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

function escapeRegex(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeChallengePayload(payload = {}) {
  return compactObject({
    budget: payload.budget,
    category: payload.category,
    clientIntent: payload.clientIntent,
    description: payload.description,
    industries:
      payload.industries === undefined ? undefined : normalizeList(payload.industries, 20, 80),
    industry: payload.industry,
    location: payload.location,
    milestoneTemplate:
      payload.milestoneTemplate === undefined
        ? undefined
        : normalizeObjectList(payload.milestoneTemplate, 20),
    proofRequirements:
      payload.proofRequirements === undefined
        ? undefined
        : normalizeObjectList(payload.proofRequirements, 20),
    shortSummary: payload.shortSummary,
    skillsNeeded:
      payload.skillsNeeded === undefined ? undefined : normalizeList(payload.skillsNeeded, 30, 50),
    subCategory: payload.subCategory,
    successCriteria:
      payload.successCriteria === undefined
        ? undefined
        : normalizeObjectList(payload.successCriteria, 20),
    tags: payload.tags === undefined ? undefined : normalizeList(payload.tags, 20, 50),
    targetOutcome: payload.targetOutcome,
    targetProviderType: payload.targetProviderType,
    timeline: payload.timeline,
    title: payload.title,
    toolsNeeded:
      payload.toolsNeeded === undefined ? undefined : normalizeList(payload.toolsNeeded, 30, 50),
    urgency: payload.urgency,
    visibility: payload.visibility,
  });
}

function assertObjectId(value, label = "Challenge id") {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
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
    throw new AppError("Only clients can create challenges", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Client account is not available", 403);
  }

  return user;
}

async function findClientProfile(clientId) {
  return UserProfile.findOne({ userId: clientId }).select(clientProfileSelect);
}

async function generateUniqueSlug(clientId, title) {
  const baseSlug = slugify(title, "challenge").slice(0, 96);
  let slug = baseSlug;
  let suffix = 2;

  while (await Challenge.exists({ clientId, slug })) {
    const suffixText = `-${suffix}`;
    slug = `${baseSlug.slice(0, 96 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  return slug;
}

function hasText(value, minLength = 1) {
  return String(value ?? "").trim().length >= minLength;
}

function hasTimeline(timeline = {}) {
  if (!timeline?.type) {
    return false;
  }

  if (timeline.type === CHALLENGE_TIMELINE_TYPE.FIXED_DEADLINE) {
    return Boolean(timeline.endDate);
  }

  if (timeline.type === CHALLENGE_TIMELINE_TYPE.DURATION_DAYS) {
    return Number.isFinite(Number(timeline.durationDays));
  }

  if (timeline.type === CHALLENGE_TIMELINE_TYPE.RANGE_DAYS) {
    return Number.isFinite(Number(timeline.minDays)) &&
      Number.isFinite(Number(timeline.maxDays));
  }

  if (timeline.type === CHALLENGE_TIMELINE_TYPE.CUSTOM) {
    return hasText(timeline.customLabel);
  }

  return true;
}

function hasBudget(budget = {}) {
  if (!budget?.type || budget.type === CHALLENGE_BUDGET_TYPE.HIDDEN) {
    return false;
  }

  if (budget.type === CHALLENGE_BUDGET_TYPE.NEGOTIABLE) {
    return true;
  }

  if (budget.type === CHALLENGE_BUDGET_TYPE.RANGE) {
    return Number.isFinite(Number(budget.min)) && Number.isFinite(Number(budget.max));
  }

  return Number.isFinite(Number(budget.min));
}

export function calculateChallengeQualityScore(challenge = {}) {
  const missingFields = [];
  const warnings = [];
  const checks = [
    ["title", hasText(challenge.title, 8)],
    ["category", hasText(challenge.category)],
    ["targetOutcome.outcomeStatement", hasText(challenge.targetOutcome?.outcomeStatement)],
    ["successCriteria", Array.isArray(challenge.successCriteria) && challenge.successCriteria.length > 0],
    ["proofRequirements", Array.isArray(challenge.proofRequirements) && challenge.proofRequirements.length > 0],
    ["timeline", hasTimeline(challenge.timeline)],
    ["budget", hasBudget(challenge.budget)],
    ["skillsNeeded", Array.isArray(challenge.skillsNeeded) && challenge.skillsNeeded.length > 0],
    ["milestoneTemplate", Array.isArray(challenge.milestoneTemplate) && challenge.milestoneTemplate.length > 0],
    ["description", hasText(challenge.description, 160)],
    ["clientIntent", hasText(challenge.clientIntent?.hiringUrgency)],
  ];

  for (const [field, passed] of checks) {
    if (!passed) {
      missingFields.push(field);
    }
  }

  if (!challenge.clientIntent?.budgetConfirmed) {
    warnings.push("budget_not_confirmed");
  }

  if (!challenge.clientIntent?.decisionMakerConfirmed) {
    warnings.push("decision_maker_not_confirmed");
  }

  return {
    lastCalculatedAt: new Date(),
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
    warnings,
  };
}

function countRequiredProofs(proofRequirements = []) {
  if (!Array.isArray(proofRequirements)) {
    return 0;
  }

  return proofRequirements.filter((proof) => proof?.required !== false).length;
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

function toPlainChallenge(challenge) {
  return typeof challenge?.toObject === "function" ? challenge.toObject() : { ...(challenge ?? {}) };
}

export function sanitizeChallengeForOwner(challenge) {
  const data = toPlainChallenge(challenge);

  return {
    id: normalizeId(data._id ?? data.id),
    aiMetadata: {
      generatedByAI: Boolean(data.aiMetadata?.generatedByAI),
      aiVersion: data.aiMetadata?.aiVersion ?? "",
      lastAIImprovedAt: data.aiMetadata?.lastAIImprovedAt ?? null,
    },
    applicationStats: data.applicationStats ?? {},
    budget: data.budget ?? {},
    category: data.category ?? "",
    clientId: normalizeId(data.clientId),
    clientIntent: data.clientIntent ?? {},
    clientProfileId: data.clientProfileId ? normalizeId(data.clientProfileId) : null,
    closedAt: data.closedAt ?? null,
    createdAt: data.createdAt,
    description: data.description ?? "",
    industries: data.industries ?? [],
    industry: data.industry ?? "",
    location: data.location ?? {},
    milestoneTemplate: data.milestoneTemplate ?? [],
    moderation: {
      reason: data.moderation?.reason ?? "",
      reviewedAt: data.moderation?.reviewedAt ?? null,
      status: data.moderation?.status ?? "approved",
    },
    proofRequirements: data.proofRequirements ?? [],
    proofStatus: data.proofStatus ?? {},
    publishedAt: data.publishedAt ?? null,
    qualityScore: data.qualityScore ?? { missingFields: [], score: 0, warnings: [] },
    shortSummary: data.shortSummary ?? "",
    skillsNeeded: data.skillsNeeded ?? [],
    slug: data.slug ?? "",
    stats: data.stats ?? {},
    status: data.status ?? CHALLENGE_STATUS.DRAFT,
    subCategory: data.subCategory ?? "",
    successCriteria: data.successCriteria ?? [],
    tags: data.tags ?? [],
    targetOutcome: data.targetOutcome ?? {},
    targetProviderType: data.targetProviderType ?? "",
    timeline: data.timeline ?? {},
    title: data.title ?? "",
    toolsNeeded: data.toolsNeeded ?? [],
    updatedAt: data.updatedAt,
    urgency: data.urgency ?? "normal",
    visibility: data.visibility ?? CHALLENGE_VISIBILITY.PUBLIC,
  };
}

export function sanitizeChallengeForPublic(challenge, clientSummary = null) {
  const data = toPlainChallenge(challenge);

  return {
    id: normalizeId(data._id ?? data.id),
    applicationStats: {
      totalPlans: data.applicationStats?.totalPlans ?? 0,
    },
    budget: publicBudget(data.budget ?? {}),
    category: data.category ?? "",
    client: clientSummary,
    createdAt: data.createdAt,
    description: data.description ?? "",
    industries: data.industries ?? [],
    industry: data.industry ?? "",
    location: {
      city: data.location?.city ?? "",
      country: data.location?.country ?? "",
      remote: data.location?.remote ?? true,
      timezone: data.location?.timezone ?? "",
    },
    milestoneTemplate: data.milestoneTemplate ?? [],
    proofRequirements: data.proofRequirements ?? [],
    proofStatus: {
      approvedProofs: data.proofStatus?.approvedProofs ?? 0,
      requiredProofs: data.proofStatus?.requiredProofs ?? 0,
      submittedProofs: data.proofStatus?.submittedProofs ?? 0,
    },
    publishedAt: data.publishedAt ?? null,
    qualityScore: {
      score: data.qualityScore?.score ?? 0,
    },
    shortSummary: data.shortSummary ?? "",
    skillsNeeded: data.skillsNeeded ?? [],
    slug: data.slug ?? "",
    subCategory: data.subCategory ?? "",
    successCriteria: data.successCriteria ?? [],
    tags: data.tags ?? [],
    targetOutcome: data.targetOutcome ?? {},
    targetProviderType: data.targetProviderType ?? "",
    timeline: data.timeline ?? {},
    title: data.title ?? "",
    toolsNeeded: data.toolsNeeded ?? [],
    urgency: data.urgency ?? "normal",
  };
}

function buildClientSummary({ profile, settings, user }) {
  const visibility = settings?.profileVisibility ?? profile?.profileVisibility ?? "public";
  const profileIsPublic = visibility === "public";

  if (!profileIsPublic) {
    return {
      avatar: "",
      fullName: "Private client",
      headline: "",
      id: normalizeId(user._id),
      publicUrl: user.username ? `/profile/${user.username}` : "",
      username: user.username ?? "",
      verificationStatus: user.verificationStatus ?? "pending",
    };
  }

  return {
    avatar: user.avatar ?? profile?.profilePicture ?? "",
    fullName: user.fullName ?? user.name ?? "",
    headline: profile?.headline ?? "",
    id: normalizeId(user._id),
    publicUrl: user.username ? `/profile/${user.username}` : "",
    username: user.username ?? "",
    verificationStatus: user.verificationStatus ?? "pending",
  };
}

async function getPublicClientSummaryMap(clientIds) {
  const ids = Array.from(new Set(clientIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, profiles, settings] = await Promise.all([
    User.find({
      _id: { $in: ids },
      accountStatus: { $nin: ["suspended", "deleted"] },
      isSuspended: { $ne: true },
      role: USER_ROLES.CLIENT,
    })
      .select(publicUserSelect)
      .lean(),
    UserProfile.find({ userId: { $in: ids } }).select(clientProfileSelect).lean(),
    UserSettings.find({ userId: { $in: ids } }).select("profileVisibility userId").lean(),
  ]);

  const usersById = new Map(users.map((user) => [normalizeId(user._id), user]));
  const profilesByUserId = new Map(profiles.map((profile) => [normalizeId(profile.userId), profile]));
  const settingsByUserId = new Map(settings.map((setting) => [normalizeId(setting.userId), setting]));

  return new Map(
    ids
      .map((id) => {
        const user = usersById.get(id);

        if (!user) {
          return null;
        }

        return [
          id,
          buildClientSummary({
            profile: profilesByUserId.get(id),
            settings: settingsByUserId.get(id),
            user,
          }),
        ];
      })
      .filter(Boolean),
  );
}

async function getEligiblePublicClientIds() {
  const clients = await User.find({
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
    role: USER_ROLES.CLIENT,
  })
    .select("_id")
    .limit(10000)
    .lean();

  return clients.map((client) => client._id);
}

function buildPublicChallengeQuery(filters = {}, eligibleClientIds = []) {
  const statuses = filters.status
    ? [filters.status]
    : [CHALLENGE_STATUS.OPEN, CHALLENGE_STATUS.REVIEWING_PLANS];
  const query = {
    "moderation.status": "approved",
    clientId: { $in: eligibleClientIds },
    status: { $in: statuses },
    visibility: CHALLENGE_VISIBILITY.PUBLIC,
  };
  const andConditions = [];
  const search = String(filters.q ?? "").trim();

  if (search) {
    query.$text = { $search: search };
  }

  if (filters.category) {
    query.category = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
  }

  if (filters.skill) {
    query.skillsNeeded = new RegExp(`^${escapeRegex(filters.skill)}$`, "i");
  }

  if (filters.tool) {
    query.toolsNeeded = new RegExp(`^${escapeRegex(filters.tool)}$`, "i");
  }

  if (filters.industry) {
    const industryRegex = new RegExp(`^${escapeRegex(filters.industry)}$`, "i");
    andConditions.push({
      $or: [{ industry: industryRegex }, { industries: industryRegex }],
    });
  }

  if (filters.urgency) {
    query.urgency = filters.urgency;
  }

  if (filters.currency) {
    query["budget.currency"] = String(filters.currency).trim().toUpperCase();
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

  return query;
}

function buildPublicSort(sort, hasSearchQuery) {
  if (sort === "budget_low") {
    return { "budget.min": 1, publishedAt: -1, createdAt: -1 };
  }

  if (sort === "budget_high") {
    return { "budget.min": -1, publishedAt: -1, createdAt: -1 };
  }

  if (sort === "urgent") {
    return { urgency: -1, publishedAt: -1, createdAt: -1 };
  }

  if (sort === "most_plans") {
    return { "applicationStats.totalPlans": -1, publishedAt: -1, createdAt: -1 };
  }

  if (sort === "quality_score") {
    return { "qualityScore.score": -1, publishedAt: -1, createdAt: -1 };
  }

  if (sort === "relevance" && hasSearchQuery) {
    return { score: { $meta: "textScore" }, "qualityScore.score": -1, publishedAt: -1 };
  }

  return { publishedAt: -1, createdAt: -1 };
}

async function findOwnedChallenge(clientId, challengeId) {
  assertObjectId(challengeId);

  const challenge = await Challenge.findOne({ _id: challengeId, clientId });

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  return challenge;
}

function assertCanEdit(challenge) {
  if (
    [
      CHALLENGE_STATUS.ARCHIVED,
      CHALLENGE_STATUS.CANCELLED,
      CHALLENGE_STATUS.COMPLETED,
      CHALLENGE_STATUS.IN_PROGRESS,
      CHALLENGE_STATUS.PROOF_REVIEW,
    ].includes(challenge.status)
  ) {
    throw new AppError("This challenge cannot be edited", 400);
  }
}

function assertPublishable(challenge) {
  const quality = calculateChallengeQualityScore(challenge);
  const blockingMissingFields = quality.missingFields.filter((field) =>
    [
      "title",
      "category",
      "targetOutcome.outcomeStatement",
      "successCriteria",
      "proofRequirements",
      "timeline",
      "budget",
      "description",
    ].includes(field),
  );

  if (blockingMissingFields.length > 0) {
    throw new AppError("Challenge is missing required fields before publishing", 400, {
      missingFields: blockingMissingFields,
    });
  }
}

export async function createChallenge(clientId, payload = {}) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const clientProfile = await findClientProfile(clientId);
  const normalizedPayload = normalizeChallengePayload(payload);
  const slug = await generateUniqueSlug(clientId, normalizedPayload.title);
  const challenge = new Challenge({
    ...normalizedPayload,
    clientId,
    clientProfileId: clientProfile?._id ?? null,
    moderation: { status: "approved" },
    slug,
    status: CHALLENGE_STATUS.DRAFT,
  });
  challenge.qualityScore = calculateChallengeQualityScore(challenge);
  challenge.proofStatus = {
    ...(challenge.proofStatus?.toObject?.() ?? challenge.proofStatus ?? {}),
    requiredProofs: countRequiredProofs(challenge.proofRequirements),
  };

  try {
    await challenge.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("Challenge slug already exists for this client", 409);
    }

    throw error;
  }

  return sanitizeChallengeForOwner(challenge);
}

export async function getMyChallenges(clientId, filters = {}) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const query = { clientId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.visibility) {
    query.visibility = filters.visibility;
  }

  if (filters.category) {
    query.category = new RegExp(`^${escapeRegex(filters.category)}$`, "i");
  }

  const challenges = await Challenge.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();

  return {
    items: challenges.map(sanitizeChallengeForOwner),
  };
}

export async function getPublicChallenges(filters = {}) {
  ensureDatabaseConnection();

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const eligibleClientIds = await getEligiblePublicClientIds();

  if (eligibleClientIds.length === 0) {
    return {
      items: [],
      pagination: { limit, page, pages: 1, total: 0 },
    };
  }

  const hasSearchQuery = Boolean(String(filters.q ?? "").trim());
  const query = buildPublicChallengeQuery(filters, eligibleClientIds);
  const projection = hasSearchQuery ? { score: { $meta: "textScore" } } : undefined;
  const [items, total] = await Promise.all([
    Challenge.find(query, projection)
      .sort(buildPublicSort(filters.sort, hasSearchQuery))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Challenge.countDocuments(query),
  ]);
  const clientSummaries = await getPublicClientSummaryMap(items.map((challenge) => challenge.clientId));

  return {
    items: items
      .map((challenge) => sanitizeChallengeForPublic(
        challenge,
        clientSummaries.get(normalizeId(challenge.clientId)),
      ))
      .filter((challenge) => challenge.client),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getChallengeByIdForOwner(clientId, challengeId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);
  return sanitizeChallengeForOwner(challenge);
}

export async function getPublicChallengeBySlug(username, slug) {
  ensureDatabaseConnection();

  const user = await User.findOne({
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
    role: USER_ROLES.CLIENT,
    username: String(username ?? "").trim().toLowerCase(),
  })
    .select(publicUserSelect)
    .lean();

  if (!user) {
    throw new AppError("Challenge not found", 404);
  }

  const clientSummaries = await getPublicClientSummaryMap([user._id]);
  const clientSummary = clientSummaries.get(normalizeId(user._id));

  if (!clientSummary) {
    throw new AppError("Private challenge is not available publicly", 404);
  }

  const challenge = await Challenge.findOneAndUpdate(
    {
      "moderation.status": "approved",
      clientId: user._id,
      slug: String(slug ?? "").trim().toLowerCase(),
      status: {
        $in: [
          CHALLENGE_STATUS.OPEN,
          CHALLENGE_STATUS.REVIEWING_PLANS,
          CHALLENGE_STATUS.PROVIDER_SELECTED,
          CHALLENGE_STATUS.IN_PROGRESS,
          CHALLENGE_STATUS.COMPLETED,
        ],
      },
      visibility: CHALLENGE_VISIBILITY.PUBLIC,
    },
    { $inc: { "stats.views": 1 } },
    { new: true },
  ).lean();

  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  return sanitizeChallengeForPublic(challenge, clientSummary);
}

export async function updateChallenge(clientId, challengeId, payload = {}) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);
  assertCanEdit(challenge);

  Object.assign(challenge, normalizeChallengePayload(payload));
  challenge.qualityScore = calculateChallengeQualityScore(challenge);
  challenge.proofStatus = {
    ...(challenge.proofStatus?.toObject?.() ?? challenge.proofStatus ?? {}),
    requiredProofs: countRequiredProofs(challenge.proofRequirements),
  };
  await challenge.save();

  return sanitizeChallengeForOwner(challenge);
}

export async function publishChallenge(clientId, challengeId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);
  assertCanEdit(challenge);

  challenge.qualityScore = calculateChallengeQualityScore(challenge);
  challenge.proofStatus = {
    ...(challenge.proofStatus?.toObject?.() ?? challenge.proofStatus ?? {}),
    requiredProofs: countRequiredProofs(challenge.proofRequirements),
  };
  assertPublishable(challenge);
  challenge.status = CHALLENGE_STATUS.OPEN;
  challenge.publishedAt = challenge.publishedAt ?? new Date();

  if (challenge.visibility === CHALLENGE_VISIBILITY.PRIVATE) {
    challenge.visibility = CHALLENGE_VISIBILITY.UNLISTED;
  }

  await challenge.save();

  return sanitizeChallengeForOwner(challenge);
}

export async function pauseChallenge(clientId, challengeId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);

  if (challenge.status === CHALLENGE_STATUS.ARCHIVED) {
    throw new AppError("This challenge cannot be edited", 400);
  }

  challenge.status = CHALLENGE_STATUS.PAUSED;
  await challenge.save();

  return sanitizeChallengeForOwner(challenge);
}

export async function closeChallenge(clientId, challengeId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);

  challenge.status = CHALLENGE_STATUS.CANCELLED;
  challenge.closedAt = new Date();
  await challenge.save();

  return sanitizeChallengeForOwner(challenge);
}

export async function archiveChallenge(clientId, challengeId) {
  ensureDatabaseConnection();
  await getClientUser(clientId);

  const challenge = await findOwnedChallenge(clientId, challengeId);

  challenge.status = CHALLENGE_STATUS.ARCHIVED;
  challenge.closedAt = challenge.closedAt ?? new Date();
  await challenge.save();

  return sanitizeChallengeForOwner(challenge);
}

export async function deleteChallenge(clientId, challengeId) {
  return archiveChallenge(clientId, challengeId);
}
