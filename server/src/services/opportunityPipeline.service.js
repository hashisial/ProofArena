import mongoose from "mongoose";
import {
  LOST_REASON,
  OPPORTUNITY_PRIORITY,
  OPPORTUNITY_SOURCE,
  OPPORTUNITY_STAGE,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { ExecutionPlan } from "../models/ExecutionPlan.model.js";
import { MatchRecord } from "../models/MatchRecord.model.js";
import { OpportunityPipelineItem } from "../models/OpportunityPipelineItem.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const publicUserSelect =
  "_id avatar fullName name role username accountStatus isSuspended isVerified emailVerified verificationStatus";
const clientProfileSelect = "_id userId headline profilePicture profileVisibility privacySettings";
const challengeSelect = "_id budget category clientId shortSummary slug status targetOutcome timeline title visibility";
const planSelect = "_id challengeId outcomeOfferId price planScore status submittedAt summary title updatedAt";
const matchSelect = "_id challengeId matchReasons matchScore recommendedAction status weaknesses";
const offerSelect = "_id category priceRange shortSummary slug status title visibility";

const stageRank = Object.freeze({
  [OPPORTUNITY_STAGE.MATCHED]: 1,
  [OPPORTUNITY_STAGE.INVITED]: 2,
  [OPPORTUNITY_STAGE.APPLIED]: 3,
  [OPPORTUNITY_STAGE.SHORTLISTED]: 4,
  [OPPORTUNITY_STAGE.NEGOTIATING]: 5,
  [OPPORTUNITY_STAGE.WON]: 6,
  [OPPORTUNITY_STAGE.LOST]: 7,
  [OPPORTUNITY_STAGE.COMPLETED]: 8,
  [OPPORTUNITY_STAGE.ARCHIVED]: 9,
});

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

function compactObject(value = {}) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== null && entry !== ""),
  );
}

function normalizeList(values = [], maxItems = 20, maxLength = 50) {
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

function normalizeValue(value = {}) {
  return compactObject({
    amount: value.amount === undefined ? undefined : Number(value.amount),
    currency: value.currency ? String(value.currency).trim().toUpperCase().slice(0, 10) : "USD",
    type: value.type ?? "unknown",
  });
}

function normalizeNextAction(nextAction = {}) {
  return compactObject({
    completed: nextAction.completed,
    completedAt: nextAction.completedAt,
    description: nextAction.description,
    dueAt: nextAction.dueAt,
    title: nextAction.title,
  });
}

function normalizePayload(payload = {}) {
  return compactObject({
    challengeId: payload.challengeId,
    clientId: payload.clientId,
    nextAction: payload.nextAction === undefined ? undefined : normalizeNextAction(payload.nextAction),
    outcomeOfferId: payload.outcomeOfferId,
    priority: payload.priority,
    source: payload.source,
    stage: payload.stage,
    summary: payload.summary,
    tags: payload.tags === undefined ? undefined : normalizeList(payload.tags, 20, 50),
    title: payload.title,
    value: payload.value === undefined ? undefined : normalizeValue(payload.value),
  });
}

function stageShouldAdvance(currentStage, nextStage) {
  if (!currentStage) return true;
  if (currentStage === OPPORTUNITY_STAGE.ARCHIVED) return false;
  if (currentStage === OPPORTUNITY_STAGE.LOST && nextStage !== OPPORTUNITY_STAGE.WON) return false;
  return (stageRank[nextStage] ?? 0) >= (stageRank[currentStage] ?? 0);
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
    throw new AppError("Only providers can manage opportunity pipeline", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider account is not available", 403);
  }

  return user;
}

async function findProviderProfile(providerId) {
  return ProviderProfile.findOne({ userId: providerId }).select("_id userId title headline");
}

async function getOwnedOpportunity(providerId, opportunityId) {
  assertObjectId(opportunityId, "Opportunity id");

  const item = await OpportunityPipelineItem.findOne({ _id: opportunityId, providerId });

  if (!item) {
    throw new AppError("Opportunity not found", 404);
  }

  return item;
}

function buildQuery(providerId, filters = {}) {
  const query = { providerId };

  if (filters.stage) query.stage = filters.stage;
  if (filters.source) query.source = filters.source;
  if (filters.priority) query.priority = filters.priority;
  if (filters.q) query.$text = { $search: filters.q };

  return query;
}

function buildSort(sort = "last_activity") {
  if (sort === "newest") return { createdAt: -1 };
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "priority") {
    return { priority: -1, lastActivityAt: -1 };
  }
  if (sort === "value") {
    return { "value.amount": -1, lastActivityAt: -1 };
  }
  return { lastActivityAt: -1, updatedAt: -1 };
}

function clientSummary(user, profile) {
  const visibility = profile?.profileVisibility ?? "public";

  if (!user) {
    return null;
  }

  if (visibility !== "public") {
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

function challengeSummary(challenge) {
  if (!challenge) return null;

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

function planSummary(plan) {
  if (!plan) return null;

  return {
    id: normalizeId(plan._id ?? plan.id),
    outcomeOfferId: plan.outcomeOfferId ? normalizeId(plan.outcomeOfferId) : "",
    planScore: plan.planScore ?? { score: 0 },
    price: plan.price ?? {},
    status: plan.status ?? "",
    submittedAt: plan.submittedAt,
    summary: plan.summary ?? "",
    title: plan.title ?? "",
    updatedAt: plan.updatedAt,
  };
}

function matchSummary(match) {
  if (!match) return null;

  return {
    id: normalizeId(match._id ?? match.id),
    matchReasons: match.matchReasons ?? [],
    matchScore: match.matchScore ?? 0,
    recommendedAction: match.recommendedAction ?? "",
    status: match.status ?? "",
    weaknesses: match.weaknesses ?? [],
  };
}

function offerSummary(offer) {
  if (!offer) return null;

  return {
    category: offer.category ?? "",
    id: normalizeId(offer._id ?? offer.id),
    priceRange: offer.priceRange ?? {},
    shortSummary: offer.shortSummary ?? "",
    slug: offer.slug ?? "",
    status: offer.status ?? "",
    title: offer.title ?? "",
    visibility: offer.visibility ?? "",
  };
}

async function buildContextMaps(items = []) {
  const challengeIds = Array.from(new Set(items.map((item) => normalizeId(item.challengeId)).filter(mongoose.isValidObjectId)));
  const clientIds = Array.from(new Set(items.map((item) => normalizeId(item.clientId)).filter(mongoose.isValidObjectId)));
  const planIds = Array.from(new Set(items.map((item) => normalizeId(item.executionPlanId)).filter(mongoose.isValidObjectId)));
  const matchIds = Array.from(new Set(items.map((item) => normalizeId(item.matchRecordId)).filter(mongoose.isValidObjectId)));
  const offerIds = Array.from(new Set(items.map((item) => normalizeId(item.outcomeOfferId)).filter(mongoose.isValidObjectId)));

  const [challenges, users, profiles, plans, matches, offers] = await Promise.all([
    challengeIds.length > 0 ? Challenge.find({ _id: { $in: challengeIds } }).select(challengeSelect).lean() : [],
    clientIds.length > 0 ? User.find({ _id: { $in: clientIds } }).select(publicUserSelect).lean() : [],
    clientIds.length > 0 ? UserProfile.find({ userId: { $in: clientIds } }).select(clientProfileSelect).lean() : [],
    planIds.length > 0 ? ExecutionPlan.find({ _id: { $in: planIds } }).select(planSelect).lean() : [],
    matchIds.length > 0 ? MatchRecord.find({ _id: { $in: matchIds } }).select(matchSelect).lean() : [],
    offerIds.length > 0 ? OutcomeOffer.find({ _id: { $in: offerIds } }).select(offerSelect).lean() : [],
  ]);

  const userMap = new Map(users.map((user) => [normalizeId(user._id), user]));
  const profileMap = new Map(profiles.map((profile) => [normalizeId(profile.userId), profile]));

  return {
    challenges: new Map(challenges.map((challenge) => [normalizeId(challenge._id), challengeSummary(challenge)])),
    clients: new Map(clientIds.map((id) => [id, clientSummary(userMap.get(id), profileMap.get(id))])),
    matches: new Map(matches.map((match) => [normalizeId(match._id), matchSummary(match)])),
    offers: new Map(offers.map((offer) => [normalizeId(offer._id), offerSummary(offer)])),
    plans: new Map(plans.map((plan) => [normalizeId(plan._id), planSummary(plan)])),
  };
}

export function sanitizeOpportunityForOwner(item, context = {}) {
  const data = toPlain(item);
  const challengeId = normalizeId(data.challengeId);
  const clientId = normalizeId(data.clientId);
  const executionPlanId = normalizeId(data.executionPlanId);
  const matchRecordId = normalizeId(data.matchRecordId);
  const outcomeOfferId = normalizeId(data.outcomeOfferId);

  return {
    challenge: context.challenges?.get(challengeId) ?? null,
    challengeId: mongoose.isValidObjectId(challengeId) ? challengeId : "",
    client: context.clients?.get(clientId) ?? null,
    clientId: mongoose.isValidObjectId(clientId) ? clientId : "",
    createdAt: data.createdAt,
    executionPlan: context.plans?.get(executionPlanId) ?? null,
    executionPlanId: mongoose.isValidObjectId(executionPlanId) ? executionPlanId : "",
    id: normalizeId(data._id ?? data.id),
    lastActivityAt: data.lastActivityAt,
    lostInfo: data.lostInfo ?? {},
    match: context.matches?.get(matchRecordId) ?? null,
    matchRecordId: mongoose.isValidObjectId(matchRecordId) ? matchRecordId : "",
    matchScore: data.matchScore ?? 0,
    nextAction: data.nextAction ?? {},
    notes: data.notes ?? [],
    outcomeOffer: context.offers?.get(outcomeOfferId) ?? null,
    outcomeOfferId: mongoose.isValidObjectId(outcomeOfferId) ? outcomeOfferId : "",
    priority: data.priority ?? OPPORTUNITY_PRIORITY.NORMAL,
    source: data.source ?? OPPORTUNITY_SOURCE.MANUAL,
    stage: data.stage ?? OPPORTUNITY_STAGE.MATCHED,
    summary: data.summary ?? "",
    tags: data.tags ?? [],
    title: data.title ?? "",
    updatedAt: data.updatedAt,
    value: data.value ?? { currency: "USD", type: "unknown" },
  };
}

async function enrichOpportunities(items = []) {
  const context = await buildContextMaps(items);
  return items.map((item) => sanitizeOpportunityForOwner(item, context));
}

async function verifyManualReferences(providerId, payload = {}) {
  const references = {};

  if (payload.challengeId) {
    assertObjectId(payload.challengeId, "Challenge id");
    const challenge = await Challenge.findById(payload.challengeId).select(challengeSelect).lean();
    if (!challenge) throw new AppError("Challenge not found", 404);
    references.challenge = challenge;
    references.clientId = challenge.clientId;
  }

  if (payload.outcomeOfferId) {
    assertObjectId(payload.outcomeOfferId, "Outcome offer id");
    const offer = await OutcomeOffer.findOne({ _id: payload.outcomeOfferId, providerId }).select("_id").lean();
    if (!offer) throw new AppError("Outcome offer not found", 404);
  }

  if (payload.clientId) {
    assertObjectId(payload.clientId, "Client id");
  }

  return references;
}

export async function createOpportunity(providerId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const providerProfile = await findProviderProfile(providerId);
  const normalizedPayload = normalizePayload(payload);
  const references = await verifyManualReferences(providerId, normalizedPayload);
  const notes = Array.isArray(payload.notes)
    ? payload.notes
        .map((note) => ({ body: String(note.body ?? "").trim(), createdAt: new Date() }))
        .filter((note) => note.body)
        .slice(0, 20)
    : [];
  const item = await OpportunityPipelineItem.create({
    ...normalizedPayload,
    clientId: references.clientId ?? normalizedPayload.clientId,
    lastActivityAt: new Date(),
    notes,
    providerId,
    providerProfileId: providerProfile?._id ?? null,
    source: normalizedPayload.source ?? OPPORTUNITY_SOURCE.MANUAL,
    stage: normalizedPayload.stage ?? OPPORTUNITY_STAGE.MATCHED,
  });

  return (await enrichOpportunities([item]))[0];
}

export async function getMyOpportunities(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 50);
  const query = buildQuery(providerId, filters);
  const [items, total] = await Promise.all([
    OpportunityPipelineItem.find(query)
      .sort(buildSort(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    OpportunityPipelineItem.countDocuments(query),
  ]);

  return {
    items: await enrichOpportunities(items),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getOpportunityById(providerId, opportunityId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);

  return (await enrichOpportunities([item]))[0];
}

export async function updateOpportunity(providerId, opportunityId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);
  const normalizedPayload = normalizePayload(payload);

  for (const field of ["title", "summary", "priority", "value", "nextAction", "tags"]) {
    if (normalizedPayload[field] !== undefined) {
      item[field] = normalizedPayload[field];
    }
  }

  item.lastActivityAt = new Date();
  await item.save();
  return (await enrichOpportunities([item]))[0];
}

export async function updateOpportunityStage(providerId, opportunityId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);

  if (payload.stage === OPPORTUNITY_STAGE.LOST && !payload.lostReason) {
    throw new AppError("Lost reason is required", 400);
  }

  item.stage = payload.stage;
  item.lastActivityAt = new Date();

  if (payload.stage === OPPORTUNITY_STAGE.LOST) {
    item.lostInfo = {
      note: payload.lostNote ?? payload.note ?? "",
      reason: payload.lostReason ?? LOST_REASON.OTHER,
      recordedAt: new Date(),
    };
  }

  if (payload.stage === OPPORTUNITY_STAGE.COMPLETED) {
    item.nextAction = {
      ...(item.nextAction?.toObject?.() ?? item.nextAction ?? {}),
      completed: true,
      completedAt: item.nextAction?.completedAt ?? new Date(),
    };
  }

  if (payload.note) {
    item.notes.push({ body: payload.note, createdAt: new Date() });
  }

  await item.save();
  return (await enrichOpportunities([item]))[0];
}

export async function addOpportunityNote(providerId, opportunityId, body) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);

  item.notes.push({ body, createdAt: new Date() });
  item.lastActivityAt = new Date();
  await item.save();
  return (await enrichOpportunities([item]))[0];
}

export async function updateNextAction(providerId, opportunityId, nextAction = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);
  const existing = item.nextAction?.toObject?.() ?? item.nextAction ?? {};

  item.nextAction = {
    ...existing,
    ...normalizeNextAction(nextAction),
  };

  if (item.nextAction.completed && !item.nextAction.completedAt) {
    item.nextAction.completedAt = new Date();
  }

  if (!item.nextAction.completed) {
    item.nextAction.completedAt = null;
  }

  item.lastActivityAt = new Date();
  await item.save();
  return (await enrichOpportunities([item]))[0];
}

export async function completeNextAction(providerId, opportunityId, completed) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);

  item.nextAction = {
    ...(item.nextAction?.toObject?.() ?? item.nextAction ?? {}),
    completed: Boolean(completed),
    completedAt: completed ? new Date() : null,
  };
  item.lastActivityAt = new Date();
  await item.save();
  return (await enrichOpportunities([item]))[0];
}

export async function deleteOrArchiveOpportunity(providerId, opportunityId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const item = await getOwnedOpportunity(providerId, opportunityId);

  item.stage = OPPORTUNITY_STAGE.ARCHIVED;
  item.lastActivityAt = new Date();
  await item.save();
  return (await enrichOpportunities([item]))[0];
}

function valueFromChallengeBudget(budget = {}) {
  const amount = Number(budget.max ?? budget.min);
  return {
    amount: Number.isFinite(amount) ? amount : undefined,
    currency: budget.currency ?? "USD",
    type: budget.type ?? "unknown",
  };
}

function valueFromPlanPrice(price = {}) {
  const amount = Number(price.max ?? price.min);
  return {
    amount: Number.isFinite(amount) ? amount : undefined,
    currency: price.currency ?? "USD",
    type: price.type ?? "unknown",
  };
}

async function upsertPipelineItem({ challenge, executionPlan, matchRecord, nextAction, source, stage }) {
  const providerId = normalizeId(executionPlan?.providerId ?? matchRecord?.providerId);

  if (!mongoose.isValidObjectId(providerId)) {
    return null;
  }

  const challengeId = normalizeId(challenge?._id ?? challenge?.id ?? executionPlan?.challengeId ?? matchRecord?.challengeId);
  const query = {
    providerId,
    ...(mongoose.isValidObjectId(challengeId) ? { challengeId } : {}),
  };
  let item = await OpportunityPipelineItem.findOne(query);
  const providerProfile = item ? null : await findProviderProfile(providerId);
  const title = challenge?.title ?? executionPlan?.title ?? "Client opportunity";
  const summary = challenge?.shortSummary ?? executionPlan?.summary ?? "";
  const update = {
    challengeId: mongoose.isValidObjectId(challengeId) ? challengeId : undefined,
    clientId: challenge?.clientId ?? matchRecord?.clientId,
    executionPlanId: executionPlan?._id ?? executionPlan?.id,
    lastActivityAt: new Date(),
    matchRecordId: matchRecord?._id ?? matchRecord?.id,
    matchScore: matchRecord?.matchScore ?? executionPlan?.matchSnapshot?.matchScore,
    outcomeOfferId: executionPlan?.outcomeOfferId ?? matchRecord?.metadata?.matchedOfferIds?.[0],
    source,
    summary,
    title,
    value: executionPlan?.price ? valueFromPlanPrice(executionPlan.price) : valueFromChallengeBudget(challenge?.budget),
  };

  if (!item) {
    item = new OpportunityPipelineItem({
      ...compactObject(update),
      nextAction: nextAction ?? { title: "Review opportunity", completed: false },
      priority: OPPORTUNITY_PRIORITY.NORMAL,
      providerId,
      providerProfileId: providerProfile?._id ?? null,
      stage,
    });
  } else {
    Object.assign(item, compactObject(update));
    if (stageShouldAdvance(item.stage, stage)) {
      item.stage = stage;
      if (stage === OPPORTUNITY_STAGE.LOST) {
        item.lostInfo = {
          reason: LOST_REASON.OTHER,
          recordedAt: new Date(),
        };
      }
    }

    if (nextAction?.title && !item.nextAction?.completed) {
      item.nextAction = {
        ...(item.nextAction?.toObject?.() ?? item.nextAction ?? {}),
        ...nextAction,
      };
    }
  }

  try {
    await item.save();
    return item;
  } catch (error) {
    if (error?.code === 11000) {
      return OpportunityPipelineItem.findOneAndUpdate(
        query,
        { $set: compactObject(update) },
        { new: true },
      );
    }

    throw error;
  }
}

export async function upsertOpportunityFromMatch(matchRecord) {
  ensureDatabaseConnection();
  const match = toPlain(matchRecord);
  const challenge = await Challenge.findById(match.challengeId).select(challengeSelect).lean();

  if (!challenge) {
    return null;
  }

  const isSaved = match.status === "saved";
  const isInvited = match.status === "invited";

  return upsertPipelineItem({
    challenge,
    matchRecord: match,
    nextAction: { completed: false, title: "Submit execution plan" },
    source: isInvited
      ? OPPORTUNITY_SOURCE.CLIENT_INVITE
      : isSaved
        ? OPPORTUNITY_SOURCE.SAVED_MATCH
        : OPPORTUNITY_SOURCE.MATCHED_CHALLENGE,
    stage: isInvited ? OPPORTUNITY_STAGE.INVITED : OPPORTUNITY_STAGE.MATCHED,
  });
}

export async function upsertOpportunityFromExecutionPlan(executionPlan) {
  ensureDatabaseConnection();
  const plan = toPlain(executionPlan);
  const challenge = await Challenge.findById(plan.challengeId).select(challengeSelect).lean();
  const match = await MatchRecord.findOne({ challengeId: plan.challengeId, providerId: plan.providerId })
    .select(matchSelect)
    .lean();

  return upsertPipelineItem({
    challenge,
    executionPlan: plan,
    matchRecord: match,
    nextAction: { completed: false, title: "Follow up on execution plan" },
    source: OPPORTUNITY_SOURCE.EXECUTION_PLAN,
    stage: OPPORTUNITY_STAGE.APPLIED,
  });
}

export async function upsertOpportunityFromShortlist(executionPlan) {
  ensureDatabaseConnection();
  const plan = toPlain(executionPlan);
  const challenge = await Challenge.findById(plan.challengeId).select(challengeSelect).lean();
  const match = await MatchRecord.findOne({ challengeId: plan.challengeId, providerId: plan.providerId })
    .select(matchSelect)
    .lean();

  return upsertPipelineItem({
    challenge,
    executionPlan: plan,
    matchRecord: match,
    nextAction: { completed: false, title: "Prepare negotiation points" },
    source: OPPORTUNITY_SOURCE.SHORTLISTED_PLAN,
    stage: OPPORTUNITY_STAGE.SHORTLISTED,
  });
}

export async function upsertOpportunityFromAcceptedPlan(executionPlan) {
  ensureDatabaseConnection();
  const plan = toPlain(executionPlan);
  const challenge = await Challenge.findById(plan.challengeId).select(challengeSelect).lean();
  const match = await MatchRecord.findOne({ challengeId: plan.challengeId, providerId: plan.providerId })
    .select(matchSelect)
    .lean();

  return upsertPipelineItem({
    challenge,
    executionPlan: plan,
    matchRecord: match,
    nextAction: { completed: false, title: "Prepare kickoff details" },
    source: OPPORTUNITY_SOURCE.ACCEPTED_PLAN,
    stage: OPPORTUNITY_STAGE.WON,
  });
}

export async function calculateOpportunityStats(providerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const now = new Date();
  const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const [byStage, dueSoon, overdue, total] = await Promise.all([
    OpportunityPipelineItem.aggregate([
      { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]),
    OpportunityPipelineItem.countDocuments({
      providerId,
      "nextAction.completed": { $ne: true },
      "nextAction.dueAt": { $gte: now, $lte: soon },
      stage: { $nin: [OPPORTUNITY_STAGE.ARCHIVED, OPPORTUNITY_STAGE.COMPLETED, OPPORTUNITY_STAGE.LOST] },
    }),
    OpportunityPipelineItem.countDocuments({
      providerId,
      "nextAction.completed": { $ne: true },
      "nextAction.dueAt": { $lt: now },
      stage: { $nin: [OPPORTUNITY_STAGE.ARCHIVED, OPPORTUNITY_STAGE.COMPLETED, OPPORTUNITY_STAGE.LOST] },
    }),
    OpportunityPipelineItem.countDocuments({ providerId }),
  ]);
  const stageCounts = Object.fromEntries(byStage.map((item) => [item._id, item.count]));

  return {
    applied: stageCounts[OPPORTUNITY_STAGE.APPLIED] ?? 0,
    archived: stageCounts[OPPORTUNITY_STAGE.ARCHIVED] ?? 0,
    completed: stageCounts[OPPORTUNITY_STAGE.COMPLETED] ?? 0,
    dueSoon,
    invited: stageCounts[OPPORTUNITY_STAGE.INVITED] ?? 0,
    lost: stageCounts[OPPORTUNITY_STAGE.LOST] ?? 0,
    matched: stageCounts[OPPORTUNITY_STAGE.MATCHED] ?? 0,
    negotiating: stageCounts[OPPORTUNITY_STAGE.NEGOTIATING] ?? 0,
    overdue,
    shortlisted: stageCounts[OPPORTUNITY_STAGE.SHORTLISTED] ?? 0,
    total,
    won: stageCounts[OPPORTUNITY_STAGE.WON] ?? 0,
  };
}
