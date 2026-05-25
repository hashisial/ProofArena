import mongoose from "mongoose";
import {
  OFFER_DELIVERY_TYPE,
  OFFER_PRICE_TYPE,
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_VISIBILITY,
  USER_ROLES,
} from "../constants/index.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import { slugify } from "../utils/slugify.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const publicUserSelect = "_id avatar fullName name role username accountStatus isSuspended isVerified emailVerified verificationStatus";
const providerProfileSelect =
  "_id userId title headline categories skills availability moderationStatus verificationStatus proofScore completedOutcomes totalProofsApproved onTimeRate approvalRate";

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

function normalizeOfferPayload(payload = {}) {
  return compactObject({
    availability: payload.availability,
    category: payload.category,
    deliveryTimeline: payload.deliveryTimeline,
    description: payload.description,
    industries: payload.industries === undefined ? undefined : normalizeList(payload.industries, 20, 80),
    milestoneTemplate:
      payload.milestoneTemplate === undefined
        ? undefined
        : normalizeObjectList(payload.milestoneTemplate, 20),
    priceRange: payload.priceRange,
    proofIncluded:
      payload.proofIncluded === undefined
        ? undefined
        : normalizeObjectList(payload.proofIncluded, 20),
    shortSummary: payload.shortSummary,
    skills: payload.skills === undefined ? undefined : normalizeList(payload.skills, 30, 50),
    subCategory: payload.subCategory,
    successCriteria:
      payload.successCriteria === undefined
        ? undefined
        : normalizeObjectList(payload.successCriteria, 20),
    tags: payload.tags === undefined ? undefined : normalizeList(payload.tags, 20, 50),
    targetClient: payload.targetClient,
    targetOutcome: payload.targetOutcome,
    title: payload.title,
    tools: payload.tools === undefined ? undefined : normalizeList(payload.tools, 30, 50),
    visibility: payload.visibility,
  });
}

function assertObjectId(value, label = "Outcome offer id") {
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
    throw new AppError("Only providers can create outcome offers", 403);
  }

  if (user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("Provider account is not available", 403);
  }

  return user;
}

async function findProviderProfile(providerId) {
  return ProviderProfile.findOne({ userId: providerId }).select(providerProfileSelect);
}

async function generateUniqueSlug(providerId, title) {
  const baseSlug = slugify(title, "outcome-offer").slice(0, 96);
  let slug = baseSlug;
  let suffix = 2;

  while (await OutcomeOffer.exists({ providerId, slug })) {
    const suffixText = `-${suffix}`;
    slug = `${baseSlug.slice(0, 96 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  return slug;
}

function hasText(value, minLength = 1) {
  return String(value ?? "").trim().length >= minLength;
}

function hasTimeline(deliveryTimeline = {}) {
  if (!deliveryTimeline?.type) {
    return false;
  }

  if (deliveryTimeline.type === OFFER_DELIVERY_TYPE.FIXED_DAYS) {
    return Number.isFinite(Number(deliveryTimeline.days));
  }

  if (deliveryTimeline.type === OFFER_DELIVERY_TYPE.RANGE_DAYS) {
    return Number.isFinite(Number(deliveryTimeline.minDays)) &&
      Number.isFinite(Number(deliveryTimeline.maxDays));
  }

  if (deliveryTimeline.type === OFFER_DELIVERY_TYPE.CUSTOM) {
    return hasText(deliveryTimeline.customLabel);
  }

  return true;
}

function hasPrice(priceRange = {}) {
  if (!priceRange?.type || priceRange.type === OFFER_PRICE_TYPE.HIDDEN) {
    return false;
  }

  if (priceRange.type === OFFER_PRICE_TYPE.CUSTOM) {
    return hasText(priceRange.customLabel);
  }

  if (priceRange.type === OFFER_PRICE_TYPE.RANGE) {
    return Number.isFinite(Number(priceRange.min)) && Number.isFinite(Number(priceRange.max));
  }

  return Number.isFinite(Number(priceRange.min));
}

export function calculateOfferQualityScore(offer = {}) {
  const missingFields = [];
  const checks = [
    ["title", hasText(offer.title, 8)],
    ["targetOutcome.outcomeStatement", hasText(offer.targetOutcome?.outcomeStatement)],
    ["successCriteria", Array.isArray(offer.successCriteria) && offer.successCriteria.length > 0],
    ["proofIncluded", Array.isArray(offer.proofIncluded) && offer.proofIncluded.length > 0],
    ["deliveryTimeline", hasTimeline(offer.deliveryTimeline)],
    ["priceRange", hasPrice(offer.priceRange)],
    ["skills", Array.isArray(offer.skills) && offer.skills.length > 0],
    ["tools", Array.isArray(offer.tools) && offer.tools.length > 0],
    ["milestoneTemplate", Array.isArray(offer.milestoneTemplate) && offer.milestoneTemplate.length > 0],
    ["description", hasText(offer.description, 120)],
    ["availability", hasText(offer.availability?.status)],
  ];

  for (const [field, passed] of checks) {
    if (!passed) {
      missingFields.push(field);
    }
  }

  return {
    lastCalculatedAt: new Date(),
    missingFields,
    score: Math.round(((checks.length - missingFields.length) / checks.length) * 100),
  };
}

function publicPriceRange(priceRange = {}) {
  if (priceRange.type === OFFER_PRICE_TYPE.HIDDEN) {
    return {
      currency: priceRange.currency ?? "USD",
      type: OFFER_PRICE_TYPE.HIDDEN,
    };
  }

  return {
    currency: priceRange.currency ?? "USD",
    customLabel: priceRange.customLabel ?? "",
    max: priceRange.max,
    min: priceRange.min,
    type: priceRange.type ?? OFFER_PRICE_TYPE.HIDDEN,
  };
}

function toPlainOffer(offer) {
  return typeof offer?.toObject === "function" ? offer.toObject() : { ...(offer ?? {}) };
}

export function sanitizeOfferForOwner(offer) {
  const data = toPlainOffer(offer);

  return {
    id: normalizeId(data._id ?? data.id),
    aiMetadata: {
      generatedByAI: Boolean(data.aiMetadata?.generatedByAI),
      aiVersion: data.aiMetadata?.aiVersion ?? "",
      lastAIImprovedAt: data.aiMetadata?.lastAIImprovedAt ?? null,
    },
    availability: data.availability ?? {},
    category: data.category ?? "",
    createdAt: data.createdAt,
    deliveryTimeline: data.deliveryTimeline ?? {},
    description: data.description ?? "",
    industries: data.industries ?? [],
    milestoneTemplate: data.milestoneTemplate ?? [],
    moderation: {
      reason: data.moderation?.reason ?? "",
      reviewedAt: data.moderation?.reviewedAt ?? null,
      status: data.moderation?.status ?? "approved",
    },
    priceRange: data.priceRange ?? {},
    proofIncluded: data.proofIncluded ?? [],
    providerId: normalizeId(data.providerId),
    providerProfileId: data.providerProfileId ? normalizeId(data.providerProfileId) : null,
    qualityScore: data.qualityScore ?? { missingFields: [], score: 0 },
    shortSummary: data.shortSummary ?? "",
    skills: data.skills ?? [],
    slug: data.slug ?? "",
    stats: data.stats ?? {},
    status: data.status ?? OUTCOME_OFFER_STATUS.DRAFT,
    subCategory: data.subCategory ?? "",
    successCriteria: data.successCriteria ?? [],
    tags: data.tags ?? [],
    targetClient: data.targetClient ?? "",
    targetOutcome: data.targetOutcome ?? {},
    title: data.title ?? "",
    tools: data.tools ?? [],
    updatedAt: data.updatedAt,
    visibility: data.visibility ?? OUTCOME_OFFER_VISIBILITY.PUBLIC,
  };
}

export function sanitizeOfferForPublic(offer, providerSummary = null) {
  const data = toPlainOffer(offer);

  return {
    id: normalizeId(data._id ?? data.id),
    availability: data.availability ?? {},
    category: data.category ?? "",
    createdAt: data.createdAt,
    deliveryTimeline: data.deliveryTimeline ?? {},
    description: data.description ?? "",
    industries: data.industries ?? [],
    milestoneTemplate: data.milestoneTemplate ?? [],
    priceRange: publicPriceRange(data.priceRange ?? {}),
    proofIncluded: data.proofIncluded ?? [],
    provider: providerSummary,
    qualityScore: {
      score: data.qualityScore?.score ?? 0,
    },
    shortSummary: data.shortSummary ?? "",
    skills: data.skills ?? [],
    slug: data.slug ?? "",
    subCategory: data.subCategory ?? "",
    successCriteria: data.successCriteria ?? [],
    tags: data.tags ?? [],
    targetClient: data.targetClient ?? "",
    targetOutcome: data.targetOutcome ?? {},
    title: data.title ?? "",
    tools: data.tools ?? [],
    updatedAt: data.updatedAt,
  };
}

function isPublicProvider({ profile, providerProfile, settings, user }) {
  if (!user || user.role !== USER_ROLES.PROVIDER || user.isSuspended) {
    return false;
  }

  if (["deleted", "suspended"].includes(user.accountStatus)) {
    return false;
  }

  if (!providerProfile || providerProfile.moderationStatus !== "active") {
    return false;
  }

  const visibility = settings?.profileVisibility ?? profile?.profileVisibility ?? "public";

  if (visibility !== "public") {
    return false;
  }

  if (profile?.privacySettings?.allowDiscovery === false) {
    return false;
  }

  if (profile?.privacySettings?.allowProviderListing === false) {
    return false;
  }

  return true;
}

function buildProviderSummary({ profile, providerProfile, user }) {
  return {
    avatar: user.avatar ?? profile?.profilePicture ?? "",
    completedOutcomes: providerProfile.completedOutcomes ?? 0,
    fullName: user.fullName ?? user.name ?? "",
    headline: profile?.headline || providerProfile.headline || providerProfile.title || "",
    id: normalizeId(user._id),
    proofScore: providerProfile.proofScore ?? 0,
    publicUrl: user.username ? `/providers/${user.username}` : "",
    title: providerProfile.title ?? "",
    username: user.username ?? "",
    verificationStatus: providerProfile.verificationStatus ?? user.verificationStatus ?? "none",
  };
}

async function getPublicProviderSummaryMap(providerIds) {
  const ids = Array.from(new Set(providerIds.map(normalizeId).filter(mongoose.isValidObjectId)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, providerProfiles, profiles, settings] = await Promise.all([
    User.find({ _id: { $in: ids } }).select(publicUserSelect).lean(),
    ProviderProfile.find({ userId: { $in: ids } }).select(providerProfileSelect).lean(),
    UserProfile.find({ userId: { $in: ids } })
      .select("headline privacySettings profilePicture profileVisibility userId")
      .lean(),
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
        const context = {
          profile: profilesByUserId.get(id),
          providerProfile: providerProfilesByUserId.get(id),
          settings: settingsByUserId.get(id),
          user: usersById.get(id),
        };

        if (!isPublicProvider(context)) {
          return null;
        }

        return [id, buildProviderSummary(context)];
      })
      .filter(Boolean),
  );
}

async function getEligiblePublicProviderIds() {
  const providerProfiles = await ProviderProfile.find({ moderationStatus: "active" })
    .select("userId")
    .limit(10000)
    .lean();
  const summaries = await getPublicProviderSummaryMap(
    providerProfiles.map((profile) => profile.userId),
  );

  return Array.from(summaries.keys());
}

function buildPublicOfferQuery(filters = {}, eligibleProviderIds = []) {
  const query = {
    "moderation.status": "approved",
    providerId: { $in: eligibleProviderIds },
    status: OUTCOME_OFFER_STATUS.PUBLISHED,
    visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
  };
  const andConditions = [];
  const search = String(filters.q ?? "").trim();

  if (search) {
    query.$text = { $search: search };
  }

  if (filters.category) {
    query.category = new RegExp(`^${String(filters.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }

  if (filters.skill) {
    query.skills = new RegExp(`^${String(filters.skill).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }

  if (filters.tool) {
    query.tools = new RegExp(`^${String(filters.tool).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }

  if (filters.industry) {
    query.industries = new RegExp(`^${String(filters.industry).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
  }

  if (filters.availability) {
    query["availability.status"] = filters.availability;
  }

  if (filters.currency) {
    query["priceRange.currency"] = String(filters.currency).trim().toUpperCase();
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    andConditions.push({ "priceRange.type": { $ne: OFFER_PRICE_TYPE.HIDDEN } });

    if (filters.minPrice !== undefined) {
      andConditions.push({
        $or: [
          { "priceRange.max": { $gte: filters.minPrice } },
          { "priceRange.min": { $gte: filters.minPrice } },
        ],
      });
    }

    if (filters.maxPrice !== undefined) {
      andConditions.push({ "priceRange.min": { $lte: filters.maxPrice } });
    }
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
}

function buildPublicSort(sort, hasSearchQuery) {
  if (sort === "price_low") {
    return { "priceRange.min": 1, createdAt: -1 };
  }

  if (sort === "price_high") {
    return { "priceRange.min": -1, createdAt: -1 };
  }

  if (sort === "quality_score") {
    return { "qualityScore.score": -1, createdAt: -1 };
  }

  if (sort === "most_viewed") {
    return { "stats.views": -1, createdAt: -1 };
  }

  if (sort === "relevance" && hasSearchQuery) {
    return { score: { $meta: "textScore" }, "qualityScore.score": -1, createdAt: -1 };
  }

  return { createdAt: -1 };
}

async function findOwnedOffer(providerId, offerId) {
  assertObjectId(offerId);

  const offer = await OutcomeOffer.findOne({ _id: offerId, providerId });

  if (!offer) {
    throw new AppError("Outcome offer not found", 404);
  }

  return offer;
}

function assertCanEdit(offer) {
  if (offer.status === OUTCOME_OFFER_STATUS.ARCHIVED) {
    throw new AppError("This offer cannot be edited", 400);
  }
}

function assertPublishable(offer) {
  const quality = calculateOfferQualityScore(offer);
  const blockingMissingFields = quality.missingFields.filter((field) =>
    [
      "title",
      "targetOutcome.outcomeStatement",
      "successCriteria",
      "proofIncluded",
      "deliveryTimeline",
      "priceRange",
      "description",
    ].includes(field),
  );

  if (blockingMissingFields.length > 0) {
    throw new AppError("Outcome offer is missing required fields before publishing", 400, {
      missingFields: blockingMissingFields,
    });
  }
}

export async function createOutcomeOffer(providerId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const providerProfile = await findProviderProfile(providerId);
  const normalizedPayload = normalizeOfferPayload(payload);
  const slug = await generateUniqueSlug(providerId, normalizedPayload.title);
  const offer = new OutcomeOffer({
    ...normalizedPayload,
    moderation: { status: "approved" },
    providerId,
    providerProfileId: providerProfile?._id ?? null,
    slug,
    status: OUTCOME_OFFER_STATUS.DRAFT,
  });
  offer.qualityScore = calculateOfferQualityScore(offer);

  try {
    await offer.save();
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError("Outcome offer slug already exists for this provider", 409);
    }

    throw error;
  }

  return sanitizeOfferForOwner(offer);
}

export async function getMyOutcomeOffers(providerId, filters = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const query = { providerId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.visibility) {
    query.visibility = filters.visibility;
  }

  const offers = await OutcomeOffer.find(query).sort({ updatedAt: -1, createdAt: -1 }).lean();

  return {
    items: offers.map(sanitizeOfferForOwner),
  };
}

export async function getPublicOutcomeOffers(filters = {}) {
  ensureDatabaseConnection();

  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 50);
  const eligibleProviderIds = await getEligiblePublicProviderIds();

  if (eligibleProviderIds.length === 0) {
    return {
      items: [],
      pagination: { limit, page, pages: 1, total: 0 },
    };
  }

  const hasSearchQuery = Boolean(String(filters.q ?? "").trim());
  const query = buildPublicOfferQuery(filters, eligibleProviderIds);
  const projection = hasSearchQuery ? { score: { $meta: "textScore" } } : undefined;
  const [items, total] = await Promise.all([
    OutcomeOffer.find(query, projection)
      .sort(buildPublicSort(filters.sort, hasSearchQuery))
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    OutcomeOffer.countDocuments(query),
  ]);
  const providerSummaries = await getPublicProviderSummaryMap(items.map((offer) => offer.providerId));

  return {
    items: items
      .map((offer) => sanitizeOfferForPublic(offer, providerSummaries.get(normalizeId(offer.providerId))))
      .filter((offer) => offer.provider),
    pagination: {
      limit,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total,
    },
  };
}

export async function getOutcomeOfferByIdForOwner(providerId, offerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const offer = await findOwnedOffer(providerId, offerId);
  return sanitizeOfferForOwner(offer);
}

export async function getPublicOutcomeOfferBySlug(username, slug) {
  ensureDatabaseConnection();

  const user = await User.findOne({
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
    role: USER_ROLES.PROVIDER,
    username: String(username ?? "").trim().toLowerCase(),
  })
    .select(publicUserSelect)
    .lean();

  if (!user) {
    throw new AppError("Outcome offer not found", 404);
  }

  const providerSummaries = await getPublicProviderSummaryMap([user._id]);
  const providerSummary = providerSummaries.get(normalizeId(user._id));

  if (!providerSummary) {
    throw new AppError("Private offer is not available publicly", 404);
  }

  const offer = await OutcomeOffer.findOneAndUpdate(
    {
      "moderation.status": "approved",
      providerId: user._id,
      slug: String(slug ?? "").trim().toLowerCase(),
      status: OUTCOME_OFFER_STATUS.PUBLISHED,
      visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    },
    { $inc: { "stats.views": 1 } },
    { new: true },
  ).lean();

  if (!offer) {
    throw new AppError("Outcome offer not found", 404);
  }

  return sanitizeOfferForPublic(offer, providerSummary);
}

export async function updateOutcomeOffer(providerId, offerId, payload = {}) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const offer = await findOwnedOffer(providerId, offerId);
  assertCanEdit(offer);

  Object.assign(offer, normalizeOfferPayload(payload));
  offer.qualityScore = calculateOfferQualityScore(offer);
  await offer.save();

  return sanitizeOfferForOwner(offer);
}

export async function publishOutcomeOffer(providerId, offerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const offer = await findOwnedOffer(providerId, offerId);
  assertCanEdit(offer);

  offer.qualityScore = calculateOfferQualityScore(offer);
  assertPublishable(offer);
  offer.status = OUTCOME_OFFER_STATUS.PUBLISHED;
  if (offer.visibility === OUTCOME_OFFER_VISIBILITY.PRIVATE) {
    offer.visibility = OUTCOME_OFFER_VISIBILITY.UNLISTED;
  }
  await offer.save();

  return sanitizeOfferForOwner(offer);
}

export async function pauseOutcomeOffer(providerId, offerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const offer = await findOwnedOffer(providerId, offerId);

  if (offer.status === OUTCOME_OFFER_STATUS.ARCHIVED) {
    throw new AppError("This offer cannot be edited", 400);
  }

  offer.status = OUTCOME_OFFER_STATUS.PAUSED;
  await offer.save();

  return sanitizeOfferForOwner(offer);
}

export async function archiveOutcomeOffer(providerId, offerId) {
  ensureDatabaseConnection();
  await getProviderUser(providerId);

  const offer = await findOwnedOffer(providerId, offerId);
  offer.status = OUTCOME_OFFER_STATUS.ARCHIVED;
  await offer.save();

  return sanitizeOfferForOwner(offer);
}

export async function deleteOutcomeOffer(providerId, offerId) {
  return archiveOutcomeOffer(providerId, offerId);
}
