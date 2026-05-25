import mongoose from "mongoose";
import { Portfolio } from "../models/Portfolio.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { Service } from "../models/Service.js";
import { User } from "../models/User.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { recordMarketplaceEvent } from "./analyticsService.js";
import { requestConnection } from "./connectionService.js";

const providerUserSelect =
  "_id accountType avatar fullName isVerified name role username verificationStatus";
const defaultPrivacySettings = Object.freeze({
  allowProviderListing: true,
  showEducation: true,
  showExperience: true,
  showServices: true,
  showSocialLinks: true,
  showWebsite: true,
});

function normalizeId(value) {
  return value?._id?.toString?.() ?? value?.toString?.() ?? String(value ?? "");
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

function normalizePrivacySettings(settings = {}) {
  return Object.keys(defaultPrivacySettings).reduce((normalized, key) => {
    normalized[key] =
      typeof settings?.[key] === "boolean" ? settings[key] : defaultPrivacySettings[key];
    return normalized;
  }, {});
}

function normalizeMediaUrl(value) {
  if (typeof value === "string") {
    return value;
  }

  return value?.url ?? "";
}

function serializeUser(user) {
  return {
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    fullName: user.fullName ?? user.name ?? "",
    id: normalizeId(user._id),
    isVerified: false,
    name: user.name ?? user.fullName ?? "",
    role: user.role ?? "provider",
    username: user.username ?? "",
    verificationStatus: "none",
  };
}

function serializeProfile(profile = {}, privacySettings = defaultPrivacySettings) {
  return {
    availabilityStatus: profile.availabilityStatus ?? "available",
    bio: profile.bio ?? "",
    company: profile.company ?? "",
    coverImage: normalizeMediaUrl(profile.coverImage),
    education: privacySettings.showEducation ? profile.education ?? [] : [],
    experience: privacySettings.showExperience ? profile.experience ?? [] : [],
    headline: profile.headline ?? "",
    location: profile.location ?? "",
    profilePicture: profile.profilePicture ?? "",
    skills: profile.skills ?? [],
    socialLinks: privacySettings.showSocialLinks ? profile.socialLinks ?? {} : {},
    website: privacySettings.showWebsite ? profile.website ?? "" : "",
  };
}

function serializeProviderProfile(profile) {
  const isVerified = profile.verificationStatus === "verified";

  return {
    availability: profile.availability ?? "available",
    categories: profile.categories ?? [],
    completedProjects: profile.completedProjects ?? 0,
    experienceLevel: profile.experienceLevel ?? "intermediate",
    featured: Boolean(profile.featured),
    hourlyRate: profile.hourlyRate ?? 0,
    id: normalizeId(profile._id),
    languages: profile.languages ?? [],
    rating: profile.rating ?? 0,
    skills: profile.skills ?? [],
    stats: normalizeProviderStats(profile.stats),
    title: profile.title ?? "",
    verificationStatus: isVerified ? "verified" : "none",
    verifiedAt: isVerified ? profile.verifiedAt ?? null : null,
  };
}

function serializeService(service) {
  const price = getDisplayPrice(service);

  return {
    _id: normalizeId(service._id),
    category: service.category ?? "",
    coverImage: service.images?.[0] ?? "",
    deliveryTime: service.deliveryTime ?? "",
    fixedPrice: service.fixedPrice ?? 0,
    hourlyRate: service.hourlyRate ?? 0,
    images: service.images ?? [],
    isFeatured: Boolean(service.isFeatured),
    price,
    pricingType: service.pricingType ?? "fixed",
    ratingAverage: service.ratingAverage ?? 0,
    slug: service.slug ?? "",
    subCategory: service.subCategory ?? "",
    tags: service.tags ?? [],
    title: service.title ?? "",
    totalOrders: service.totalOrders ?? 0,
    totalReviews: service.totalReviews ?? 0,
    viewCount: service.viewCount ?? 0,
  };
}

function serializePortfolio(item) {
  return {
    _id: normalizeId(item._id),
    afterState: item.afterState ?? "",
    beforeState: item.beforeState ?? "",
    clientName: item.clientName ?? "",
    description: item.description ?? "",
    image: item.image ?? "",
    industry: item.industry ?? "",
    mediaType: item.mediaType ?? "image",
    results: item.results ?? [],
    tags: item.tags ?? [],
    testimonial: item.testimonial ?? "",
    title: item.title ?? "",
  };
}

function normalizeProviderStats(stats = {}) {
  return {
    averageRating: stats.averageRating ?? 0,
    completedProjects: stats.completedProjects ?? 0,
    responseTime: stats.responseTime ?? "Usually responds within 24 hours",
    totalReviews: stats.totalReviews ?? 0,
    totalServices: stats.totalServices ?? 0,
  };
}

function buildStats({ portfolioItems, providerProfile, services }) {
  const servicePrices = services.map(getDisplayPrice).filter((price) => price > 0);
  const startingPrice = servicePrices.length ? Math.min(...servicePrices) : 0;
  const serviceReviews = services.reduce(
    (total, service) => total + (service.totalReviews ?? 0),
    0,
  );
  const savedStats = normalizeProviderStats(providerProfile.stats);
  const averageRating =
    providerProfile.rating > 0
      ? providerProfile.rating
      : savedStats.averageRating;
  const completedProjects =
    providerProfile.completedProjects > 0
      ? providerProfile.completedProjects
      : savedStats.completedProjects;

  return {
    activeServices: services.length,
    availability: providerProfile.availability ?? "available",
    averageRating,
    completedProjects,
    hourlyRate: providerProfile.hourlyRate ?? 0,
    portfolioItems: portfolioItems.length,
    rating: averageRating,
    responseTime: savedStats.responseTime,
    startingPrice,
    totalServices: services.length,
    totalOrders: services.reduce((total, service) => total + (service.totalOrders ?? 0), 0),
    totalReviews: serviceReviews || savedStats.totalReviews,
  };
}

async function persistProviderStats(providerProfile, stats) {
  await ProviderProfile.updateOne(
    { _id: providerProfile._id },
    {
      $set: {
        "stats.averageRating": stats.averageRating,
        "stats.completedProjects": stats.completedProjects,
        "stats.responseTime": stats.responseTime,
        "stats.serviceViews": stats.serviceViews,
        "stats.totalReviews": stats.totalReviews,
        "stats.totalServices": stats.totalServices,
      },
    },
  );
}

async function findPublicProvider(username) {
  const normalizedUsername = String(username ?? "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new AppError("Username is required", 400);
  }

  const user = await User.findOne({
    isSuspended: { $ne: true },
    accountStatus: { $nin: ["suspended", "deleted"] },
    role: "provider",
    username: normalizedUsername,
  })
    .select(providerUserSelect)
    .lean();

  if (!user) {
    throw new AppError("Provider not found", 404);
  }

  const providerProfile = await ProviderProfile.findOne(
    {
      moderationStatus: "active",
      userId: user._id,
    },
  ).lean();

  if (!providerProfile) {
    throw new AppError("Provider profile is not active", 404);
  }

  const settings = await UserSettings.findOne({ userId: user._id }).lean();
  const profile = await UserProfile.findOne({ userId: user._id })
    .select("profileVisibility privacySettings")
    .lean();
  const profileVisibility =
    settings?.profileVisibility ?? profile?.profileVisibility ?? "public";
  const privacySettings = normalizePrivacySettings(profile?.privacySettings);

  if (profileVisibility === "hidden") {
    throw new AppError("Provider not found", 404);
  }

  if (profileVisibility !== "public" || !privacySettings.allowProviderListing) {
    throw new AppError("Provider profile is not public", 403);
  }

  await ProviderProfile.updateOne(
    { _id: providerProfile._id },
    {
      $inc: { "stats.profileViews": 1 },
      $setOnInsert: {
        "stats.responseTime": "Usually responds within 24 hours",
      },
    },
  );

  return { providerProfile, user };
}

export async function getPublicProviderByUsername(username, { viewerId } = {}) {
  ensureDatabaseConnection();

  const { providerProfile, user } = await findPublicProvider(username);
  const linkedPortfolioIds = providerProfile.portfolioItems ?? [];
  const portfolioQuery = {
    $or: [
      { userId: user._id },
      ...(linkedPortfolioIds.length
        ? [{ _id: { $in: linkedPortfolioIds } }]
        : []),
    ],
  };
  const [profile, services, portfolioItems] = await Promise.all([
    UserProfile.findOne({ userId: user._id }).lean(),
    Service.find({ providerId: user._id, status: "active" })
      .sort({ isFeatured: -1, totalOrders: -1, publishedAt: -1, createdAt: -1 })
      .limit(12)
      .lean(),
    Portfolio.find(portfolioQuery)
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);
  const privacySettings = normalizePrivacySettings(profile?.privacySettings);
  const publicServices = privacySettings.showServices ? services : [];
  const seenPortfolioIds = new Set();
  const uniquePortfolioItems = portfolioItems.filter((item) => {
    const id = normalizeId(item._id);

    if (seenPortfolioIds.has(id)) {
      return false;
    }

    seenPortfolioIds.add(id);
    return true;
  });
  const stats = buildStats({
    portfolioItems: uniquePortfolioItems,
    providerProfile,
    services: publicServices,
  });

  await persistProviderStats(providerProfile, stats);
  await recordMarketplaceEvent({
    entityId: normalizeId(user._id),
    entityType: "provider",
    eventType: "provider_profile_view",
    metadata: {
      username: user.username,
    },
    userId: viewerId,
  });

  return {
    activeServices: publicServices.map(serializeService),
    portfolioItems: uniquePortfolioItems.map(serializePortfolio),
    profile: serializeProfile(profile, privacySettings),
    providerProfile: serializeProviderProfile(providerProfile),
    stats,
    user: serializeUser(user),
  };
}

export async function requestProviderConnection({ sender, username }) {
  ensureDatabaseConnection();

  if (!sender?.id || !mongoose.Types.ObjectId.isValid(sender.id)) {
    throw new AppError("Authentication is required", 401);
  }

  const { user: receiver } = await findPublicProvider(username);
  const senderId = sender.id;
  const receiverId = normalizeId(receiver._id);

  if (senderId === receiverId) {
    throw new AppError("You cannot connect with yourself", 400);
  }

  const result = await requestConnection({
    receiverId,
    sender,
  });

  return {
    ...result.connection,
    notifications: result.notifications,
  };
}
