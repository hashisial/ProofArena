import mongoose from "mongoose";
import { Favorite } from "../models/Favorite.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { SavedItem } from "../models/SavedItem.js";
import {
  Service,
  servicePricingTypes,
  serviceStatuses,
} from "../models/Service.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { recordMarketplaceEvent } from "./analyticsService.js";
import { uploadServiceAsset } from "./cloudinaryService.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const pricingTypes = new Set(servicePricingTypes);
const statuses = new Set(serviceStatuses);
const providerWritableStatuses = new Set(["draft", "pending_review", "paused"]);
const adminModerationStatuses = new Set(["active", "rejected", "pending_review", "paused"]);
const validSorts = new Set([
  "relevance",
  "featured",
  "newest",
  "price_asc",
  "price_desc",
  "popular",
  "rating_desc",
  "most_ordered",
  "price_low",
  "price_high",
  "rating",
]);
const validAvailabilityFilters = new Set(["available", "limited", "unavailable"]);

function normalizeList(value, maxItems = 24, maxLength = 80) {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((item) => String(item ?? "").trim().slice(0, maxLength))
          .filter(Boolean),
      ),
    ).slice(0, maxItems);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactRegex(value) {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

function normalizeStatus(value, fallback = "draft") {
  const aliases = {
    archived: "paused",
    pending: "pending_review",
  };
  const rawStatus = String(value ?? fallback).trim().toLowerCase();
  const status = aliases[rawStatus] ?? rawStatus;

  if (!statuses.has(status)) {
    throw new AppError("Service status is invalid", 400);
  }

  return status;
}

function normalizePricingType(value, fallback = "fixed") {
  const pricingType = String(value ?? fallback).trim().toLowerCase();

  if (!pricingTypes.has(pricingType)) {
    throw new AppError("Pricing type is invalid", 400);
  }

  return pricingType;
}

function normalizeMoney(value, label) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new AppError(`${label} must be a positive number`, 400);
  }

  return numberValue;
}

function normalizeRating(value, label = "Minimum rating") {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > 5) {
    throw new AppError(`${label} must be between 0 and 5`, 400);
  }

  return numberValue;
}

function normalizeInteger(value, label) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const numberValue = Number.parseInt(value, 10);

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    throw new AppError(`${label} must be a positive integer`, 400);
  }

  return numberValue;
}

function normalizeServicePayload(payload = {}, { isUpdate = false } = {}) {
  const next = {};

  if (!isUpdate || payload.title !== undefined) {
    const title = String(payload.title ?? "").trim();

    if (title.length < 3) {
      throw new AppError("Service title must be at least 3 characters", 400);
    }

    next.title = title.slice(0, 140);
  }

  if (!isUpdate || payload.category !== undefined) {
    const category = String(payload.category ?? "").trim().toLowerCase();

    if (category.length < 2) {
      throw new AppError("Service category is required", 400);
    }

    next.category = category.slice(0, 80);
  }

  if (payload.subCategory !== undefined) {
    next.subCategory = String(payload.subCategory ?? "").trim().toLowerCase().slice(0, 100);
  }

  if (!isUpdate || payload.description !== undefined) {
    const description = String(payload.description ?? "").trim();

    if (description.length < 20) {
      throw new AppError("Service description must be at least 20 characters", 400);
    }

    next.description = description.slice(0, 5000);
  }

  if (!isUpdate || payload.shortDescription !== undefined || payload.description !== undefined) {
    const shortDescription = String(
      payload.shortDescription ?? payload.description ?? "",
    ).trim();

    if (shortDescription.length < 10) {
      throw new AppError("Short description must be at least 10 characters", 400);
    }

    next.shortDescription = shortDescription.slice(0, 280);
  }

  if (!isUpdate || payload.pricingType !== undefined) {
    next.pricingType = normalizePricingType(payload.pricingType);
  }

  if (!isUpdate || payload.fixedPrice !== undefined || payload.price !== undefined) {
    next.fixedPrice = normalizeMoney(payload.fixedPrice ?? payload.price, "Fixed price");
  }

  if (!isUpdate || payload.hourlyRate !== undefined) {
    next.hourlyRate = normalizeMoney(payload.hourlyRate, "Hourly rate");
  }

  if (payload.deliveryTime !== undefined) {
    next.deliveryTime = String(payload.deliveryTime ?? "").trim().slice(0, 80);
  }

  if (payload.revisions !== undefined) {
    next.revisions = normalizeInteger(payload.revisions, "Revisions");
  }

  if (payload.tags !== undefined) {
    next.tags = normalizeList(payload.tags, 24, 64);
  }

  if (payload.skills !== undefined || payload.features !== undefined) {
    next.skills = normalizeList(payload.skills ?? payload.features, 30, 64);
  }

  if (payload.images !== undefined || payload.mediaUrl !== undefined || payload.coverImage !== undefined) {
    next.images = normalizeList(
      payload.images ?? payload.coverImage ?? payload.mediaUrl,
      12,
      3000,
    );
  }

  if (payload.ratingAverage !== undefined) {
    const ratingAverage = Number(payload.ratingAverage);

    if (!Number.isFinite(ratingAverage) || ratingAverage < 0 || ratingAverage > 5) {
      throw new AppError("Average rating must be between 0 and 5", 400);
    }

    next.ratingAverage = ratingAverage;
  }

  if (payload.totalReviews !== undefined) {
    next.totalReviews = normalizeInteger(payload.totalReviews, "Total reviews");
  }

  if (payload.totalOrders !== undefined) {
    next.totalOrders = normalizeInteger(payload.totalOrders, "Total orders");
  }

  return next;
}

function assertValidProvider(user) {
  if (!user || user.role !== "provider") {
    throw new AppError("Only providers can create or manage services", 403);
  }
}

function assertObjectId(value, label = "Service id") {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

function buildSort(sort, hasSearchQuery) {
  if (sort === "price_asc" || sort === "price_low") {
    return { priceForSort: 1, isFeatured: -1, ratingAverage: -1, createdAt: -1 };
  }

  if (sort === "price_desc" || sort === "price_high") {
    return { priceForSort: -1, isFeatured: -1, ratingAverage: -1, createdAt: -1 };
  }

  if (sort === "popular" || sort === "most_ordered") {
    return { totalOrders: -1, totalReviews: -1, isFeatured: -1, createdAt: -1 };
  }

  if (sort === "rating_desc" || sort === "rating") {
    return { ratingAverage: -1, totalReviews: -1, isFeatured: -1, createdAt: -1 };
  }

  if (sort === "newest") {
    return { createdAt: -1 };
  }

  if (sort === "relevance" && hasSearchQuery) {
    return { score: -1, isFeatured: -1, ratingAverage: -1, totalOrders: -1, createdAt: -1 };
  }

  return { isFeatured: -1, publishedAt: -1, createdAt: -1 };
}

function buildDeliveryTimeFilter(value) {
  const deliveryTime = String(value ?? "").trim().toLowerCase();

  if (!deliveryTime) {
    return null;
  }

  const patterns = {
    "24h": "(24|same|overnight|1\\s*day|one\\s*day)",
    "3d": "(72|1\\s*-\\s*3|2\\s*-\\s*3|3\\s*(day|business)|three\\s*day)",
    "7d": "(5\\s*-\\s*7|7\\s*-\\s*10|7\\s*(day|business)|one\\s*week|week)",
    "14d": "(10\\s*-\\s*14|14\\s*(day|business)|2\\s*week|two\\s*week)",
    "30d": "(30\\s*(day|business)|month|4\\s*week|four\\s*week)",
  };

  return new RegExp(patterns[deliveryTime] ?? escapeRegex(deliveryTime), "i");
}

async function findProviderIdsByAvailability(availability) {
  const value = String(availability ?? "").trim().toLowerCase();

  if (!value) {
    return null;
  }

  if (!validAvailabilityFilters.has(value)) {
    throw new AppError("Provider availability filter is invalid", 400);
  }

  const profiles = await ProviderProfile.find({
    availability: value,
    moderationStatus: "active",
  })
    .select("userId")
    .limit(5000)
    .lean();

  return profiles.map((profile) => profile.userId);
}

function buildMarketplaceSort(sort, hasSearchQuery) {
  if (sort === "price_asc" || sort === "price_low") {
    return { priceMissingSort: 1, priceForSort: 1, isFeatured: -1, ratingAverage: -1, createdAt: -1 };
  }

  if (sort === "price_desc" || sort === "price_high") {
    return { priceMissingSort: 1, priceForSort: -1, isFeatured: -1, ratingAverage: -1, createdAt: -1 };
  }

  return buildSort(sort, hasSearchQuery);
}

function getDisplayPrice(service) {
  if (service.pricingType === "hourly") {
    return service.hourlyRate ?? 0;
  }

  if (service.pricingType === "fixed") {
    return service.fixedPrice ?? 0;
  }

  return 0;
}

function buildPublicServiceUploadUrl(file, baseUrl = "") {
  const publicPath = `/uploads/services/${file.filename}`;

  if (!baseUrl) {
    return publicPath;
  }

  return `${baseUrl.replace(/\/$/, "")}${publicPath}`;
}

function serializeProviderUser(user, publicProfile, providerProfile) {
  if (!user) {
    return null;
  }

  return {
    avatar: user.avatar ?? publicProfile?.profilePicture ?? "",
    completedProjects: providerProfile?.completedProjects ?? 0,
    fullName: user.fullName ?? user.name ?? "",
    headline: publicProfile?.headline || providerProfile?.title || "",
    hourlyRate: providerProfile?.hourlyRate ?? 0,
    id: user._id?.toString?.() ?? user.id,
    isVerified: Boolean(
      user.isVerified ||
      user.emailVerified ||
      providerProfile?.verificationStatus === "verified",
    ),
    location: publicProfile?.location ?? "",
    name: user.name ?? user.fullName ?? "",
    publicUrl: user.username ? `/providers/${user.username}` : "",
    rating: providerProfile?.rating ?? 0,
    role: user.role ?? "provider",
    username: user.username ?? "",
    availability: providerProfile?.availability ?? "",
    verificationStatus:
      providerProfile?.verificationStatus ??
      user.verificationStatus ??
      (user.isVerified ? "verified" : "none"),
    verifiedAt: providerProfile?.verifiedAt ?? null,
  };
}

function serializeService(service, providerData = new Map(), savedIds = new Set()) {
  const id = service._id?.toString?.() ?? service.id;
  const providerId = service.providerId?._id?.toString?.() ?? service.providerId?.toString?.() ?? "";
  const provider = providerData.get(providerId) ?? {};

  return {
    _id: id,
    category: service.category,
    coverImage: service.images?.[0] ?? "",
    createdAt: service.createdAt,
    deliveryTime: service.deliveryTime ?? "",
    description: service.description,
    featured: Boolean(service.isFeatured),
    fixedPrice: service.fixedPrice ?? 0,
    hourlyRate: service.hourlyRate ?? 0,
    images: service.images ?? [],
    isFeatured: Boolean(service.isFeatured),
    isSaved: savedIds.has(id),
    price: getDisplayPrice(service),
    pricingType: service.pricingType ?? "fixed",
    provider: serializeProviderUser(provider.user, provider.publicProfile, provider.providerProfile),
    providerId,
    ratingAverage: service.ratingAverage ?? 0,
    revisions: service.revisions ?? 0,
    saveCount: service.saveCount ?? 0,
    shortDescription: service.shortDescription ?? "",
    skills: service.skills ?? [],
    slug: service.slug ?? "",
    status: service.status ?? "draft",
    subCategory: service.subCategory ?? "",
    tags: service.tags ?? [],
    title: service.title,
    totalOrders: service.totalOrders ?? 0,
    totalReviews: service.totalReviews ?? 0,
    updatedAt: service.updatedAt,
    viewCount: service.viewCount ?? 0,
  };
}

async function getProviderData(providerIds) {
  const ids = Array.from(new Set(providerIds.filter(Boolean)));

  if (ids.length === 0) {
    return new Map();
  }

  const [users, publicProfiles, providerProfiles] = await Promise.all([
    User.find({ _id: { $in: ids } })
      .select("_id avatar email fullName isSuspended isVerified name role username verificationStatus")
      .lean(),
    UserProfile.find({ userId: { $in: ids } }).lean(),
    ProviderProfile.find({ userId: { $in: ids } }).lean(),
  ]);
  const publicProfileByUserId = new Map(
    publicProfiles.map((profile) => [profile.userId.toString(), profile]),
  );
  const providerProfileByUserId = new Map(
    providerProfiles.map((profile) => [profile.userId.toString(), profile]),
  );

  return new Map(
    users
      .filter((user) => !user.isSuspended)
      .map((user) => {
        const userId = user._id.toString();
        return [
          userId,
          {
            providerProfile: providerProfileByUserId.get(userId),
            publicProfile: publicProfileByUserId.get(userId),
            user,
          },
        ];
      }),
  );
}

async function getSavedIds(userId, targetType, targetIds) {
  if (!userId || targetIds.length === 0) {
    return new Set();
  }

  const savedItems = await SavedItem.find(
    targetType === "service"
      ? { itemType: "service", serviceId: { $in: targetIds }, userId }
      : { itemType: "provider", providerId: { $in: targetIds }, userId },
  )
    .select(targetType === "service" ? "serviceId" : "providerId")
    .lean();

  return new Set(
    savedItems.map((item) =>
      targetType === "service"
        ? item.serviceId?.toString?.()
        : item.providerId?.toString?.(),
    ).filter(Boolean),
  );
}

export async function createServiceForProvider(provider, serviceData = {}) {
  ensureDatabaseConnection();
  assertValidProvider(provider);

  const payload = normalizeServicePayload(serviceData);
  const status = normalizeStatus(serviceData.status, "pending_review");

  if (!providerWritableStatuses.has(status)) {
    throw new AppError("Providers can only save drafts, submit review, or pause services", 403);
  }

  const service = await Service.create({
    ...payload,
    providerId: provider.id,
    status,
  });

  return serializeService(service.toObject());
}

export async function updateServiceForProvider(provider, serviceId, serviceData = {}) {
  ensureDatabaseConnection();
  assertValidProvider(provider);
  assertObjectId(serviceId);

  const service = await Service.findOne({ _id: serviceId, providerId: provider.id });

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  const updates = normalizeServicePayload(serviceData, { isUpdate: true });

  if (serviceData.status !== undefined) {
    const status = normalizeStatus(serviceData.status, service.status);

    if (!providerWritableStatuses.has(status)) {
      throw new AppError("Providers cannot approve or reject services", 403);
    }

    updates.status = status;
  }

  Object.assign(service, updates);
  await service.save();

  return serializeService(service.toObject());
}

export async function deleteServiceForProvider(provider, serviceId) {
  ensureDatabaseConnection();
  assertValidProvider(provider);
  assertObjectId(serviceId);

  const service = await Service.findOneAndDelete({
    _id: serviceId,
    providerId: provider.id,
  }).lean();

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  await Favorite.deleteMany({ targetId: service._id, targetType: "service" });
  await SavedItem.deleteMany({ itemType: "service", serviceId: service._id });

  return { deleted: true, service: serializeService(service) };
}

export async function uploadServiceImagesForProvider(provider, { baseUrl = "", files = [] } = {}) {
  ensureDatabaseConnection();
  assertValidProvider(provider);

  if (!Array.isArray(files) || files.length === 0) {
    throw new AppError("At least one service image is required", 400);
  }

  const uploadedImages = await Promise.all(
    files.map(async (file) => {
      const cloudinaryUpload = await uploadServiceAsset({
        file,
        userId: provider.id,
      });
      const url = cloudinaryUpload?.secureUrl ?? buildPublicServiceUploadUrl(file, baseUrl);

      return {
        provider: cloudinaryUpload ? "cloudinary" : "local",
        publicId: cloudinaryUpload?.publicId ?? "",
        size: cloudinaryUpload?.bytes ?? file.size,
        url,
      };
    }),
  );

  return { items: uploadedImages };
}

export async function getProviderServices(providerId, { includePrivate = false } = {}) {
  ensureDatabaseConnection();
  assertObjectId(providerId, "Provider id");

  const query = { providerId };

  if (!includePrivate) {
    query.status = "active";
  }

  const services = await Service.find(query)
    .sort({ isFeatured: -1, createdAt: -1 })
    .lean();
  const providerData = await getProviderData([providerId]);

  return { items: services.map((service) => serializeService(service, providerData)) };
}

export async function findServices({ userId } = {}) {
  if (userId) {
    return (await getProviderServices(userId, { includePrivate: true })).items;
  }

  return (await getAllActiveServices()).items;
}

export async function getAllActiveServices(filters = {}, { userId } = {}) {
  ensureDatabaseConnection();

  const queryText = String(filters.q ?? filters.search ?? "").trim();
  const categories = normalizeList(filters.category ?? filters.categories);
  const subCategories = normalizeList(filters.subCategory ?? filters.subCategories);
  const tags = normalizeList(filters.tag ?? filters.tags);
  const skills = normalizeList(filters.skill ?? filters.skills);
  const deliveryTime = String(filters.deliveryTime ?? "").trim();
  const availability = String(filters.availability ?? filters.providerAvailability ?? "").trim().toLowerCase();
  const pricingType = String(filters.pricingType ?? "").trim().toLowerCase();
  const providerId = String(filters.providerId ?? "").trim();
  const minPrice = normalizeMoney(filters.minPrice, "Minimum price");
  const maxPrice = normalizeMoney(filters.maxPrice, "Maximum price");
  const minRating = normalizeRating(filters.rating ?? filters.minRating, "Minimum rating");
  const page = Math.max(Number.parseInt(filters.page ?? "1", 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(filters.limit ?? "12", 10) || 12, 1), 48);
  const hasSearchQuery = queryText.length > 0;
  const sort = validSorts.has(filters.sort) ? filters.sort : hasSearchQuery ? "relevance" : "featured";
  const query = { status: "active" };
  const andConditions = [];

  if (hasSearchQuery) {
    query.$text = { $search: queryText };
  }

  const [availabilityProviderIds] = await Promise.all([
    findProviderIdsByAvailability(availability),
  ]);

  if (providerId) {
    assertObjectId(providerId, "Provider id");
    if (availabilityProviderIds) {
      const allowedProviderIds = new Set(
        availabilityProviderIds.map((id) => id.toString()),
      );
      query.providerId = allowedProviderIds.has(providerId)
        ? new mongoose.Types.ObjectId(providerId)
        : { $in: [] };
    } else {
      query.providerId = new mongoose.Types.ObjectId(providerId);
    }
  } else if (availabilityProviderIds) {
    query.providerId = { $in: availabilityProviderIds };
  }

  if (categories.length > 0) {
    query.category = { $in: categories.map((category) => category.toLowerCase()) };
  }

  if (subCategories.length > 0) {
    query.subCategory = { $in: subCategories.map((subCategory) => subCategory.toLowerCase()) };
  }

  if (tags.length > 0) {
    query.tags = { $in: tags.map(exactRegex) };
  }

  if (skills.length > 0) {
    query.skills = { $in: skills.map(exactRegex) };
  }

  if (pricingType) {
    query.pricingType = normalizePricingType(pricingType);
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceRange = {};

    if (minPrice !== undefined) {
      priceRange.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      priceRange.$lte = maxPrice;
    }

    if (pricingType === "fixed") {
      query.fixedPrice = priceRange;
    } else if (pricingType === "hourly") {
      query.hourlyRate = priceRange;
    } else if (pricingType === "custom") {
      andConditions.push({ pricingType: "custom" });
    } else {
      andConditions.push({
        $or: [
          { fixedPrice: priceRange, pricingType: "fixed" },
          { hourlyRate: priceRange, pricingType: "hourly" },
        ],
      });
    }
  }

  if (minRating !== undefined) {
    query.ratingAverage = { $gte: minRating };
  }

  const deliveryTimeFilter = buildDeliveryTimeFilter(deliveryTime);

  if (deliveryTimeFilter) {
    query.deliveryTime = deliveryTimeFilter;
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  const priceExpression = {
    $switch: {
      branches: [
        { case: { $eq: ["$pricingType", "fixed"] }, then: "$fixedPrice" },
        { case: { $eq: ["$pricingType", "hourly"] }, then: "$hourlyRate" },
      ],
      default: null,
    },
  };
  const projection = hasSearchQuery
    ? {
        category: 1,
        createdAt: 1,
        deliveryTime: 1,
        description: 1,
        fixedPrice: 1,
        hourlyRate: 1,
        images: 1,
        isFeatured: 1,
        pricingType: 1,
        providerId: 1,
        ratingAverage: 1,
        revisions: 1,
        score: { $meta: "textScore" },
        shortDescription: 1,
        skills: 1,
        slug: 1,
        status: 1,
        subCategory: 1,
        tags: 1,
        title: 1,
        totalOrders: 1,
        totalReviews: 1,
        updatedAt: 1,
      }
    : null;
  const pipeline = [
    { $match: query },
    ...(projection ? [{ $project: projection }] : []),
    {
      $addFields: {
        priceForSort: priceExpression,
      },
    },
    {
      $addFields: {
        priceMissingSort: {
          $cond: [{ $eq: ["$priceForSort", null] }, 1, 0],
        },
      },
    },
    { $sort: buildMarketplaceSort(sort, hasSearchQuery) },
    {
      $facet: {
        items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ];
  const [result] = await Service.aggregate(pipeline);
  const services = result?.items ?? [];
  const total = result?.total?.[0]?.count ?? 0;
  const providerIds = services.map((service) => service.providerId?.toString?.() ?? "");
  const providerData = await getProviderData(providerIds);
  const activeServices = services.filter((service) =>
    providerData.has(service.providerId?.toString?.() ?? ""),
  );
  const savedIds = await getSavedIds(
    userId,
    "service",
    activeServices.map((service) => service._id),
  );

  if (hasSearchQuery) {
    void recordMarketplaceEvent({
      entityType: "search",
      eventType: "search_query",
      metadata: {
        category: categories[0] ?? "",
        limit,
        page,
        q: queryText,
        resultCount: total,
        sort,
      },
      userId,
    }).catch(() => {});
  }

  if (categories.length > 0) {
    void recordMarketplaceEvent({
      entityId: categories[0],
      entityType: "category",
      eventType: "category_click",
      metadata: {
        resultCount: total,
        source: "marketplace_services",
      },
      userId,
    }).catch(() => {});
  }

  return {
    filters: {
      availability,
      categories,
      deliveryTime,
      maxPrice,
      minPrice,
      minRating,
      pricingType,
      q: queryText,
      skills,
      sort,
      subCategories,
      tags,
    },
    items: activeServices.map((service) => serializeService(service, providerData, savedIds)),
    pagination: {
      hasMore: page * limit < total,
      limit,
      page,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getServiceBySlug(slug, { userId } = {}) {
  ensureDatabaseConnection();

  const service = await Service.findOne({
    slug: String(slug ?? "").trim().toLowerCase(),
    status: "active",
  }).lean();

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  const [providerData, savedIds] = await Promise.all([
    getProviderData([service.providerId?.toString?.() ?? ""]),
    getSavedIds(userId, "service", [service._id]),
  ]);

  return serializeService(service, providerData, savedIds);
}

export async function findMarketplaceServiceBySlugOrId(slugOrId, { userId } = {}) {
  ensureDatabaseConnection();

  const query = mongoose.isValidObjectId(slugOrId)
    ? { _id: slugOrId, status: "active" }
    : { slug: String(slugOrId ?? "").trim().toLowerCase(), status: "active" };
  const service = await Service.findOneAndUpdate(
    query,
    { $inc: { viewCount: 1 } },
    { new: true },
  ).lean();

  if (!service) {
    throw new AppError("Marketplace service not found", 404);
  }

  void recordMarketplaceEvent({
    entityId: service._id?.toString?.() ?? "",
    entityType: "service",
    eventType: "service_view",
    metadata: {
      category: service.category,
      providerId: service.providerId?.toString?.() ?? "",
      slug: service.slug,
    },
    userId,
  }).catch(() => {});

  const [providerData, savedIds] = await Promise.all([
    getProviderData([service.providerId?.toString?.() ?? ""]),
    getSavedIds(userId, "service", [service._id]),
  ]);

  return serializeService(service, providerData, savedIds);
}

export async function searchMarketplaceServices(filters = {}, { userId } = {}) {
  return getAllActiveServices(filters, { userId });
}

export async function listFavoritesForUser(userId) {
  ensureDatabaseConnection();

  const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 }).lean();

  return {
    items: favorites.map((favorite) => ({
      _id: favorite._id.toString(),
      createdAt: favorite.createdAt,
      targetId: favorite.targetId.toString(),
      targetType: favorite.targetType,
    })),
  };
}

export async function saveFavoriteForUser(userId, { targetId, targetType }) {
  ensureDatabaseConnection();
  assertObjectId(targetId, "Favorite target id");

  if (!["provider", "service"].includes(targetType)) {
    throw new AppError("Favorite target type must be provider or service", 400);
  }

  if (targetType === "service") {
    const serviceExists = await Service.exists({ _id: targetId, status: "active" });

    if (!serviceExists) {
      throw new AppError("Service is not available to save", 404);
    }
  }

  if (targetType === "provider") {
    const providerExists = await ProviderProfile.exists({
      moderationStatus: "active",
      userId: targetId,
    });

    if (!providerExists) {
      throw new AppError("Provider is not available to save", 404);
    }
  }

  const existingFavorite = await Favorite.findOne({ targetId, targetType, userId });
  const favorite =
    existingFavorite ??
    (await Favorite.create({
      targetId,
      targetType,
      userId,
    }));

  return {
    _id: favorite._id.toString(),
    targetId: favorite.targetId.toString(),
    targetType: favorite.targetType,
  };
}

export async function removeFavoriteForUser(userId, { targetId, targetType }) {
  ensureDatabaseConnection();

  const favorite = await Favorite.findOneAndDelete({ targetId, targetType, userId });

  return {
    deleted: Boolean(favorite),
    targetId,
    targetType,
  };
}

export async function listMarketplaceServicesForAdmin(filters = {}) {
  ensureDatabaseConnection();

  const status = String(filters.status ?? "").trim();
  const search = String(filters.q ?? filters.search ?? "").trim();
  const query = {};

  if (status) {
    query.status = normalizeStatus(status);
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { category: regex },
      { description: regex },
      { shortDescription: regex },
      { skills: regex },
      { tags: regex },
      { title: regex },
    ];
  }

  const services = await Service.find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  const providerData = await getProviderData(
    services.map((service) => service.providerId?.toString?.() ?? ""),
  );

  return {
    items: services.map((service) => serializeService(service, providerData)),
  };
}

export async function moderateServiceForAdmin(serviceId, moderation = {}) {
  ensureDatabaseConnection();
  assertObjectId(serviceId);

  const service = await Service.findById(serviceId);

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  if (moderation.status !== undefined) {
    const status = normalizeStatus(moderation.status, service.status);

    if (!adminModerationStatuses.has(status)) {
      throw new AppError("Admin moderation status is invalid", 400);
    }

    service.status = status;
  }

  if (moderation.isFeatured !== undefined || moderation.featured !== undefined) {
    service.isFeatured = Boolean(moderation.isFeatured ?? moderation.featured);
  }

  if (moderation.moderationNote !== undefined) {
    service.moderationNote = String(moderation.moderationNote ?? "").trim().slice(0, 1000);
  }

  await service.save();

  const providerData = await getProviderData([service.providerId?.toString?.() ?? ""]);
  return serializeService(service.toObject(), providerData);
}

export async function approveServiceForAdmin(serviceId) {
  return moderateServiceForAdmin(serviceId, { status: "active" });
}

export async function rejectServiceForAdmin(serviceId, moderationNote = "") {
  return moderateServiceForAdmin(serviceId, {
    moderationNote,
    status: "rejected",
  });
}

export async function updateMarketplaceServiceForAdmin(serviceId, updates = {}) {
  const moderation = {};

  if (updates.status !== undefined) {
    moderation.status = updates.status;
  }

  if (updates.featured !== undefined || updates.isFeatured !== undefined) {
    moderation.isFeatured = updates.isFeatured ?? updates.featured;
  }

  if (updates.moderationNote !== undefined) {
    moderation.moderationNote = updates.moderationNote;
  }

  return moderateServiceForAdmin(serviceId, moderation);
}

export async function deleteMarketplaceServiceForAdmin(serviceId) {
  ensureDatabaseConnection();
  assertObjectId(serviceId);

  const service = await Service.findByIdAndDelete(serviceId).lean();

  if (!service) {
    throw new AppError("Service not found", 404);
  }

  await Favorite.deleteMany({ targetId: service._id, targetType: "service" });
  await SavedItem.deleteMany({ itemType: "service", serviceId: service._id });

  return { deleted: true, service: serializeService(service) };
}
