import mongoose from "mongoose";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { SavedItem } from "../models/SavedItem.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { AppError } from "../utils/AppError.js";
import { recordMarketplaceEvent } from "./analyticsService.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
}

function assertClient(user) {
  if (!user || user.role !== "client") {
    throw new AppError("Only authenticated clients can save marketplace items", 403);
  }
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

function getServicePrice(service = {}) {
  if (service.pricingType === "hourly") {
    return service.hourlyRate ?? 0;
  }

  if (service.pricingType === "fixed") {
    return service.fixedPrice ?? 0;
  }

  return 0;
}

function serializeProvider({ profile, publicProfile, user }) {
  if (!user) {
    return null;
  }

  return {
    _id: normalizeId(user._id),
    avatar: user.avatar || publicProfile?.profilePicture || "",
    availability: profile?.availability ?? "available",
    completedProjects: profile?.completedProjects ?? profile?.stats?.completedProjects ?? 0,
    fullName: user.fullName ?? user.name ?? "",
    headline: publicProfile?.headline || profile?.title || "",
    hourlyRate: profile?.hourlyRate ?? 0,
    isVerified: Boolean(user.isVerified),
    location: publicProfile?.location ?? "",
    name: user.name ?? user.fullName ?? "",
    publicUrl: user.username ? `/providers/${user.username}` : "",
    rating: profile?.rating ?? profile?.stats?.averageRating ?? 0,
    username: user.username ?? "",
  };
}

function serializeService(service, provider) {
  if (!service) {
    return null;
  }

  return {
    _id: normalizeId(service._id),
    category: service.category ?? "",
    coverImage: service.images?.[0] ?? "",
    deliveryTime: service.deliveryTime ?? "",
    fixedPrice: service.fixedPrice ?? 0,
    hourlyRate: service.hourlyRate ?? 0,
    price: getServicePrice(service),
    pricingType: service.pricingType ?? "fixed",
    provider,
    ratingAverage: service.ratingAverage ?? 0,
    slug: service.slug ?? "",
    title: service.title ?? "",
    totalOrders: service.totalOrders ?? 0,
    totalReviews: service.totalReviews ?? 0,
  };
}

function serializeSavedItem(item, { providersById, servicesById }) {
  const service = item.serviceId ? servicesById.get(normalizeId(item.serviceId)) : null;
  const serviceProviderId = service?.providerId ? normalizeId(service.providerId) : "";
  const providerId = normalizeId(item.providerId) || serviceProviderId;
  const provider = providersById.get(providerId) ?? null;

  return {
    _id: normalizeId(item._id),
    createdAt: item.createdAt,
    itemType: item.itemType,
    provider,
    providerId: providerId || null,
    service: serializeService(service, provider),
    serviceId: item.serviceId ? normalizeId(item.serviceId) : null,
  };
}

async function hydrateSavedItems(items) {
  const serviceIds = items
    .filter((item) => item.itemType === "service" && item.serviceId)
    .map((item) => item.serviceId);
  const savedProviderIds = items
    .filter((item) => item.itemType === "provider" && item.providerId)
    .map((item) => item.providerId);
  const services = serviceIds.length
    ? await Service.find({ _id: { $in: serviceIds }, status: "active" }).lean()
    : [];
  const serviceProviderIds = services
    .map((service) => service.providerId)
    .filter(Boolean);
  const providerIds = Array.from(
    new Set([...savedProviderIds, ...serviceProviderIds].map(normalizeId).filter(Boolean)),
  );
  const [users, publicProfiles, providerProfiles] = await Promise.all([
    providerIds.length
      ? User.find({
          _id: { $in: providerIds },
          isSuspended: { $ne: true },
          role: "provider",
        })
          .select("_id avatar fullName isVerified name username")
          .lean()
      : [],
    providerIds.length ? UserProfile.find({ userId: { $in: providerIds } }).lean() : [],
    providerIds.length ? ProviderProfile.find({ userId: { $in: providerIds } }).lean() : [],
  ]);
  const publicProfilesByUserId = new Map(
    publicProfiles.map((profile) => [normalizeId(profile.userId), profile]),
  );
  const providerProfilesByUserId = new Map(
    providerProfiles.map((profile) => [normalizeId(profile.userId), profile]),
  );
  const providersById = new Map(
    users.map((user) => [
      normalizeId(user._id),
      serializeProvider({
        profile: providerProfilesByUserId.get(normalizeId(user._id)),
        publicProfile: publicProfilesByUserId.get(normalizeId(user._id)),
        user,
      }),
    ]),
  );
  const servicesById = new Map(services.map((service) => [normalizeId(service._id), service]));

  return items.map((item) => serializeSavedItem(item, { providersById, servicesById }));
}

export async function createSavedItemForClient(user, payload = {}) {
  ensureDatabaseConnection();
  assertClient(user);

  const itemType = String(payload.itemType ?? "").trim().toLowerCase();

  if (!["service", "provider"].includes(itemType)) {
    throw new AppError("Saved item type must be service or provider", 400);
  }

  const data = {
    itemType,
    userId: user.id,
  };

  if (itemType === "service") {
    assertObjectId(payload.serviceId, "Service id");

    const service = await Service.findOne({
      _id: payload.serviceId,
      status: "active",
    })
      .select("_id providerId")
      .lean();

    if (!service) {
      throw new AppError("Service is not available to save", 404);
    }

    data.providerId = service.providerId;
    data.serviceId = service._id;
  }

  if (itemType === "provider") {
    assertObjectId(payload.providerId, "Provider id");

    const providerExists = await ProviderProfile.exists({
      moderationStatus: "active",
      userId: payload.providerId,
    });

    if (!providerExists) {
      throw new AppError("Provider is not available to save", 404);
    }

    data.providerId = payload.providerId;
  }

  const query =
    itemType === "service"
      ? { itemType, serviceId: data.serviceId, userId: user.id }
      : { itemType, providerId: data.providerId, userId: user.id };
  const savedItem = await SavedItem.findOneAndUpdate(
    query,
    { $setOnInsert: data },
    { new: true, runValidators: true, upsert: true },
  ).lean();
  const [serializedItem] = await hydrateSavedItems([savedItem]);

  void recordMarketplaceEvent({
    entityId:
      itemType === "service"
        ? data.serviceId?.toString?.() ?? ""
        : data.providerId?.toString?.() ?? "",
    entityType: itemType,
    eventType: itemType === "service" ? "saved_service" : "saved_provider",
    metadata: {
      savedItemId: normalizeId(savedItem._id),
    },
    userId: user.id,
  }).catch(() => {});

  return serializedItem;
}

export async function deleteSavedItemForClient(user, savedItemId) {
  ensureDatabaseConnection();
  assertClient(user);
  assertObjectId(savedItemId, "Saved item id");

  const savedItem = await SavedItem.findOneAndDelete({
    _id: savedItemId,
    userId: user.id,
  }).lean();

  if (!savedItem) {
    throw new AppError("Saved item not found", 404);
  }

  return {
    _id: normalizeId(savedItem._id),
    deleted: true,
  };
}

export async function listSavedItemsForClient(user) {
  ensureDatabaseConnection();
  assertClient(user);

  const items = await SavedItem.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean();

  return {
    items: await hydrateSavedItems(items),
  };
}
