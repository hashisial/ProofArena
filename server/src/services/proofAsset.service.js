import mongoose from "mongoose";
import {
  PROOF_ASSET_VISIBILITY,
  PROOF_SOURCE_TYPE,
  PROOF_VERIFICATION_STATUS,
  PROVIDER_BADGE_KEY,
  USER_ROLES,
} from "../constants/index.js";
import { Challenge } from "../models/Challenge.model.js";
import { ExecutionPlan } from "../models/ExecutionPlan.model.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProofAsset } from "../models/ProofAsset.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { markProviderBadge, syncFirstClientProgress } from "./firstClient.service.js";

const providerProfileSelect = "_id userId title headline categories skills availability moderationStatus";
const editableFields = Object.freeze([
  "assetType",
  "category",
  "description",
  "link",
  "linkedContexts",
  "relatedIndustries",
  "relatedSkills",
  "relatedTools",
  "sourceType",
  "tags",
  "textProof",
  "title",
  "visibility",
]);

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

function normalizeContextList(values = []) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(new Set(values.map(normalizeId).filter(mongoose.isValidObjectId))).slice(0, 50);
}

function normalizePayload(payload = {}, { partial = false } = {}) {
  const normalized = compactObject({
    assetType: payload.assetType,
    category: payload.category,
    description: payload.description,
    link: payload.link,
    relatedIndustries:
      payload.relatedIndustries === undefined ? undefined : normalizeList(payload.relatedIndustries, 20, 80),
    relatedSkills:
      payload.relatedSkills === undefined ? undefined : normalizeList(payload.relatedSkills, 30, 50),
    relatedTools:
      payload.relatedTools === undefined ? undefined : normalizeList(payload.relatedTools, 30, 50),
    sourceType: payload.sourceType,
    tags: payload.tags === undefined ? undefined : normalizeList(payload.tags, 20, 50),
    textProof: payload.textProof,
    title: payload.title,
    visibility: payload.visibility,
  });

  if (payload.linkedContexts !== undefined) {
    normalized.linkedContexts = {
      challengeIds: normalizeContextList(payload.linkedContexts?.challengeIds),
      executionPlanIds: normalizeContextList(payload.linkedContexts?.executionPlanIds),
      outcomeOfferIds: normalizeContextList(payload.linkedContexts?.outcomeOfferIds),
    };
  } else if (!partial) {
    normalized.linkedContexts = {
      challengeIds: [],
      executionPlanIds: [],
      outcomeOfferIds: [],
    };
  }

  return normalized;
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
    throw new AppError("Only providers can manage proof assets", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider account is not available", 403);
  }

  return user;
}

async function findProviderProfile(providerId) {
  return ProviderProfile.findOne({ userId: providerId }).select(providerProfileSelect);
}

function assertSourceData(payload, fileData) {
  if (payload.sourceType === PROOF_SOURCE_TYPE.FILE) {
    if (!fileData) {
      throw new AppError("File upload is not connected yet. Use link or text proof for now.", 400);
    }
  }

  if (payload.sourceType === PROOF_SOURCE_TYPE.LINK && !payload.link?.url) {
    throw new AppError("Proof link URL is required", 400);
  }

  if (payload.sourceType === PROOF_SOURCE_TYPE.TEXT && !payload.textProof?.content) {
    throw new AppError("Text proof content is required", 400);
  }
}

function buildQuery(providerId, filters = {}) {
  const query = { providerId };

  if (filters.assetType) query.assetType = filters.assetType;
  if (filters.sourceType) query.sourceType = filters.sourceType;
  if (filters.visibility) query.visibility = filters.visibility;
  if (filters.verificationStatus) query.verificationStatus = filters.verificationStatus;
  if (filters.category) query.category = new RegExp(`^${String(filters.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  if (filters.skill) query.relatedSkills = new RegExp(`^${String(filters.skill).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  if (filters.tag) query.tags = new RegExp(`^${String(filters.tag).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  if (filters.q) query.$text = { $search: filters.q };

  return query;
}

function sortProofAssets(sort = "newest") {
  if (sort === "oldest") return { createdAt: 1 };
  if (sort === "title") return { title: 1, createdAt: -1 };
  if (sort === "type") return { assetType: 1, createdAt: -1 };
  if (sort === "verified") return { verificationStatus: 1, createdAt: -1 };
  return { createdAt: -1 };
}

async function getOwnedAsset(providerId, assetId) {
  assertObjectId(assetId, "Proof asset id");

  const asset = await ProofAsset.findOne({ _id: assetId, providerId });

  if (!asset) {
    throw new AppError("Proof asset not found", 404);
  }

  return asset;
}

function countLinkedContexts(linkedContexts = {}) {
  return {
    challenges: linkedContexts.challengeIds?.length ?? 0,
    executionPlans: linkedContexts.executionPlanIds?.length ?? 0,
    outcomeOffers: linkedContexts.outcomeOfferIds?.length ?? 0,
    total:
      (linkedContexts.challengeIds?.length ?? 0) +
      (linkedContexts.executionPlanIds?.length ?? 0) +
      (linkedContexts.outcomeOfferIds?.length ?? 0),
  };
}

export function sanitizeProofAssetForOwner(asset) {
  const data = toPlain(asset);

  return {
    aiExtraction: {
      confidence: data.aiExtraction?.confidence,
      detectedFields: data.aiExtraction?.detectedFields ?? [],
      processedAt: data.aiExtraction?.processedAt,
      status: data.aiExtraction?.status ?? "not_started",
      summary: data.aiExtraction?.summary ?? "",
    },
    assetType: data.assetType ?? "",
    category: data.category ?? "",
    createdAt: data.createdAt,
    description: data.description ?? "",
    file: data.file ?? {},
    id: normalizeId(data._id ?? data.id),
    link: data.link ?? {},
    linkedContextCounts: countLinkedContexts(data.linkedContexts),
    linkedContexts: data.linkedContexts ?? {},
    providerId: normalizeId(data.providerId),
    relatedIndustries: data.relatedIndustries ?? [],
    relatedSkills: data.relatedSkills ?? [],
    relatedTools: data.relatedTools ?? [],
    review: {
      note: data.review?.note ?? "",
      rejectionReason: data.review?.rejectionReason ?? "",
      reviewedAt: data.review?.reviewedAt,
    },
    sourceType: data.sourceType ?? "",
    stats: data.stats ?? {},
    tags: data.tags ?? [],
    textProof: data.textProof ?? {},
    title: data.title ?? "",
    updatedAt: data.updatedAt,
    verificationStatus: data.verificationStatus ?? PROOF_VERIFICATION_STATUS.UNVERIFIED,
    visibility: data.visibility ?? PROOF_ASSET_VISIBILITY.PRIVATE,
  };
}

export function sanitizeProofAssetForPublic(asset) {
  const data = toPlain(asset);

  if (data.visibility === PROOF_ASSET_VISIBILITY.PRIVATE) {
    return null;
  }

  return {
    aiExtraction: {
      status: data.aiExtraction?.status ?? "not_started",
      summary: data.aiExtraction?.summary ?? "",
    },
    assetType: data.assetType ?? "",
    category: data.category ?? "",
    createdAt: data.createdAt,
    description: data.description ?? "",
    file: data.sourceType === PROOF_SOURCE_TYPE.FILE ? data.file ?? {} : {},
    id: normalizeId(data._id ?? data.id),
    link: data.sourceType === PROOF_SOURCE_TYPE.LINK ? data.link ?? {} : {},
    relatedSkills: data.relatedSkills ?? [],
    relatedTools: data.relatedTools ?? [],
    sourceType: data.sourceType ?? "",
    tags: data.tags ?? [],
    textProof: data.sourceType === PROOF_SOURCE_TYPE.TEXT ? data.textProof ?? {} : {},
    title: data.title ?? "",
    verificationStatus:
      data.verificationStatus === PROOF_VERIFICATION_STATUS.VERIFIED
        ? PROOF_VERIFICATION_STATUS.VERIFIED
        : PROOF_VERIFICATION_STATUS.UNVERIFIED,
    visibility: data.visibility,
  };
}

export async function createProofAsset(providerId, payload, fileData = null) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const providerProfile = await findProviderProfile(providerId);
  const normalizedPayload = normalizePayload(payload);

  assertSourceData(normalizedPayload, fileData);

  const asset = await ProofAsset.create({
    ...normalizedPayload,
    file: fileData ?? {},
    providerId,
    providerProfileId: providerProfile?._id,
    verificationStatus: PROOF_VERIFICATION_STATUS.UNVERIFIED,
    visibility: normalizedPayload.visibility ?? PROOF_ASSET_VISIBILITY.PRIVATE,
  });

  try {
    await markProviderBadge(providerId, PROVIDER_BADGE_KEY.FIRST_PROOF_ASSET_ADDED, {
      assetId: asset._id,
      source: "proof",
    });
    await syncFirstClientProgress(providerId);
  } catch {
    // First Client Mode is advisory; proof asset creation must not fail if badge sync fails.
  }

  return sanitizeProofAssetForOwner(asset);
}

export async function getMyProofAssets(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 12);
  const query = buildQuery(providerId, filters);

  const [items, total] = await Promise.all([
    ProofAsset.find(query)
      .sort(sortProofAssets(filters.sort))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ProofAsset.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeProofAssetForOwner),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getProofAssetByIdForOwner(providerId, assetId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const asset = await getOwnedAsset(providerId, assetId);

  return sanitizeProofAssetForOwner(asset);
}

export async function updateProofAsset(providerId, assetId, payload) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const asset = await getOwnedAsset(providerId, assetId);
  const normalizedPayload = normalizePayload(payload, { partial: true });
  const nextSourceType = normalizedPayload.sourceType ?? asset.sourceType;

  assertSourceData(
    {
      ...sanitizeProofAssetForOwner(asset),
      ...normalizedPayload,
      sourceType: nextSourceType,
    },
    normalizedPayload.file,
  );

  for (const field of editableFields) {
    if (normalizedPayload[field] !== undefined) {
      asset[field] = normalizedPayload[field];
    }
  }

  await asset.save();
  return sanitizeProofAssetForOwner(asset);
}

export async function deleteProofAsset(providerId, assetId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  const asset = await getOwnedAsset(providerId, assetId);

  await asset.deleteOne();
  return { id: assetId };
}

async function verifyAttachContext(providerId, context = {}) {
  const updates = {};

  if (context.outcomeOfferId) {
    assertObjectId(context.outcomeOfferId, "Outcome offer id");
    const exists = await OutcomeOffer.exists({ _id: context.outcomeOfferId, providerId });
    if (!exists) {
      throw new AppError("Outcome offer not found", 404);
    }
    updates["linkedContexts.outcomeOfferIds"] = context.outcomeOfferId;
  }

  if (context.executionPlanId) {
    assertObjectId(context.executionPlanId, "Execution plan id");
    const exists = await ExecutionPlan.exists({ _id: context.executionPlanId, providerId });
    if (!exists) {
      throw new AppError("Execution plan not found", 404);
    }
    updates["linkedContexts.executionPlanIds"] = context.executionPlanId;
  }

  if (context.challengeId) {
    assertObjectId(context.challengeId, "Challenge id");
    const hasPlan = await ExecutionPlan.exists({ challengeId: context.challengeId, providerId });
    if (!hasPlan) {
      throw new AppError("Challenge proof attachment requires your execution plan for that challenge", 403);
    }
    const challengeExists = await Challenge.exists({ _id: context.challengeId });
    if (!challengeExists) {
      throw new AppError("Challenge not found", 404);
    }
    updates["linkedContexts.challengeIds"] = context.challengeId;
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("Attach context is required", 400);
  }

  return updates;
}

export async function attachProofAssetToContext(providerId, assetId, context = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  await getOwnedAsset(providerId, assetId);
  const contextUpdates = await verifyAttachContext(providerId, context);
  const addToSet = Object.fromEntries(
    Object.entries(contextUpdates).map(([key, value]) => [key, value]),
  );

  const asset = await ProofAsset.findOneAndUpdate(
    { _id: assetId, providerId },
    { $addToSet: addToSet },
    { new: true },
  );

  return sanitizeProofAssetForOwner(asset);
}

export async function detachProofAssetFromContext(providerId, assetId, context = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);
  await getOwnedAsset(providerId, assetId);
  const contextUpdates = await verifyAttachContext(providerId, context);
  const pull = Object.fromEntries(
    Object.entries(contextUpdates).map(([key, value]) => [key, value]),
  );

  const asset = await ProofAsset.findOneAndUpdate(
    { _id: assetId, providerId },
    { $pull: pull },
    { new: true },
  );

  return sanitizeProofAssetForOwner(asset);
}

export async function getPublicProofAsset(_providerIdOrUsername, assetId) {
  ensureDatabaseConnection();
  assertObjectId(assetId, "Proof asset id");

  const asset = await ProofAsset.findOne({
    _id: assetId,
    visibility: { $in: [PROOF_ASSET_VISIBILITY.PUBLIC, PROOF_ASSET_VISIBILITY.UNLISTED] },
  }).lean();

  if (!asset) {
    throw new AppError("Proof asset not found", 404);
  }

  return sanitizeProofAssetForPublic(asset);
}
