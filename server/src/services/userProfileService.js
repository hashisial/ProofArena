import mongoose from "mongoose";
import {
  OUTCOME_OFFER_STATUS,
  OUTCOME_OFFER_VISIBILITY,
} from "../constants/index.js";
import {
  PROFILE_ONBOARDING_STEP_ID_SET,
  PROFILE_OWNER_TYPE,
  PROFILE_RESTRICTED_CLIENT_FIELDS,
  PROFILE_SECTION_KEY,
  PROFILE_SECTION_KEYS,
  PROFILE_STATUS,
  PROFILE_VISIBILITY,
} from "../constants/profile.constants.js";
import { OutcomeOffer } from "../models/OutcomeOffer.model.js";
import { User } from "../models/User.js";
import { Portfolio } from "../models/Portfolio.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { Service } from "../models/Service.js";
import { UserActivity } from "../models/UserActivity.js";
import { UserMedia } from "../models/UserMedia.js";
import { UserProfile } from "../models/UserProfile.js";
import { UserSettings } from "../models/UserSettings.js";
import { AppError } from "../utils/AppError.js";
import {
  buildPublicProfileProjection,
} from "../utils/profileProjection.js";
import { deleteProfileAsset, uploadProfileAsset } from "./cloudinaryService.js";
import { ensureDatabaseConnection } from "./databaseService.js";

const socialLinkKeys = ["linkedin", "twitter", "github", "instagram", "facebook", "website"];
const providerAvailabilities = ["available", "limited", "unavailable"];
const providerExperienceLevels = ["entry", "intermediate", "expert"];
const profileVisibilityValues = ["public", "private", "hidden"];
const businessTypeValues = ["individual", "startup", "agency", "company", "enterprise"];
const serviceDeliveryTypes = [
  "fixed_scope",
  "hourly",
  "milestone",
  "consultation",
  "managed_outcome",
];

const defaultPrivacySettings = Object.freeze({
  allowDiscovery: true,
  allowClientInvites: false,
  allowProviderListing: true,
  allowSearchIndexing: false,
  showActivity: true,
  showAvailability: false,
  showCaseStudies: false,
  showCertifications: false,
  showEducation: true,
  showEmail: false,
  showExperience: true,
  showLocation: false,
  showOpenTo: true,
  showPhone: false,
  showProofHighlights: false,
  showProofScore: true,
  showServices: true,
  showSocialLinks: true,
  showWebsite: true,
});

function getAccountStatus(user = {}) {
  return user.accountStatus ?? (user.isSuspended ? "suspended" : "active");
}

function assertProfileAccountAvailable(user) {
  const accountStatus = getAccountStatus(user);

  if (["banned", "deleted"].includes(accountStatus)) {
    throw new AppError("Profile not found", 404);
  }

  if (accountStatus === "suspended" || user?.isSuspended) {
    throw new AppError("Profile is not available", 403);
  }
}

function normalizeRole(role) {
  return role === "user" ? "client" : role;
}

function trimString(value, maxLength = 1000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTimeValue(value) {
  const date = normalizeDate(value);
  return date ? date.getTime() : 0;
}

function normalizeLocation(location) {
  if (typeof location === "string") {
    return {
      city: trimString(location, 140),
      country: "",
      state: "",
      timezone: "",
    };
  }

  return {
    city: trimString(location?.city, 80),
    country: trimString(location?.country, 80),
    state: trimString(location?.state, 80),
    timezone: trimString(location?.timezone, 80),
  };
}

function getLocationLabel(location) {
  const normalizedLocation = normalizeLocation(location);

  return [normalizedLocation.city, normalizedLocation.state, normalizedLocation.country]
    .filter(Boolean)
    .join(", ");
}

function normalizeMedia(value) {
  if (typeof value === "string") {
    return {
      publicId: "",
      url: value,
    };
  }

  return {
    publicId: trimString(value?.publicId, 240),
    url: trimString(value?.url, 500),
  };
}

function stripMediaPublicId(value) {
  const media = normalizeMedia(value);

  return {
    url: media.url,
  };
}

function normalizeSkills(skills) {
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => trimString(skill, 48))
      .filter(Boolean)
      .slice(0, 30);
  }

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => trimString(typeof skill === "string" ? skill : skill?.name, 48))
    .filter(Boolean)
    .slice(0, 30);
}

function normalizeProfileSkills(skills) {
  return normalizeSkills(skills).map((skill, index) => {
    const source = Array.isArray(skills)
      ? skills.find((item) => (typeof item === "string" ? item : item?.name) === skill)
      : null;

    return {
      endorsementsCount: Number(source?.endorsementsCount ?? 0),
      isFeatured: Boolean(source?.isFeatured),
      name: skill,
      order: Number(source?.order ?? index),
    };
  });
}

function normalizeEditableProfileSkills(skills = [], existingSkills = []) {
  if (!Array.isArray(skills)) {
    return [];
  }

  const existingByName = new Map(
    normalizeProfileSkills(existingSkills).map((skill) => [
      skill.name.trim().toLowerCase(),
      skill,
    ]),
  );
  const normalizedByName = new Map();

  skills.forEach((skill, index) => {
    const name = trimString(typeof skill === "string" ? skill : skill?.name, 50);

    if (!name) {
      return;
    }

    const key = name.toLowerCase();

    if (normalizedByName.has(key)) {
      return;
    }

    const existingSkill = existingByName.get(key);
    const orderValue = Number(typeof skill === "string" ? index : skill?.order ?? index);

    normalizedByName.set(key, {
      endorsementsCount: Number(existingSkill?.endorsementsCount ?? 0),
      isFeatured: Boolean(typeof skill === "string" ? existingSkill?.isFeatured : skill?.isFeatured),
      name,
      order: Number.isFinite(orderValue) && orderValue >= 0 ? orderValue : index,
    });
  });

  return Array.from(normalizedByName.values())
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .slice(0, 30)
    .map((skill, index) => ({
      ...skill,
      order: index,
    }));
}

function normalizeStringList(values, maxItems = 24, maxLength = 80) {
  if (typeof values === "string") {
    return values
      .split(",")
      .map((value) => trimString(value, maxLength))
      .filter(Boolean)
      .slice(0, maxItems);
  }

  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map((value) => trimString(value, maxLength))
        .filter(Boolean),
    ),
  ).slice(0, maxItems);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOwnValue(source, key) {
  return Object.prototype.hasOwnProperty.call(source ?? {}, key);
}

function compactExplicitSectionUpdate(source, update) {
  return Object.entries(update).reduce((result, [key, value]) => {
    if (hasOwnValue(source, key)) {
      result[key] = value;
    }

    return result;
  }, {});
}

function normalizePublicItemList(values, maxItems = 24) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: trimString(item, 160),
          description: "",
          url: "",
          isPublic: false,
        };
      }

      return {
        assetId: item?.assetId ?? null,
        description: trimString(item?.description, 1200),
        isPublic: item?.isPublic === true,
        title: trimString(item?.title ?? item?.name, 160),
        url: trimString(item?.url, 500),
      };
    })
    .filter((item) => item.title)
    .slice(0, maxItems);
}

function normalizeStage4TagList(values, maxItems = 40) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => {
      if (typeof item === "string") {
        return {
          isPublic: true,
          level: "",
          name: trimString(item, 120),
          source: "owner",
        };
      }

      return {
        isPublic: item?.isPublic !== false,
        level: trimString(item?.level, 80),
        name: trimString(item?.name, 120),
        source: ["owner", "system", "admin", "verification", "proof"].includes(item?.source)
          ? item.source
          : "owner",
      };
    })
    .filter((item) => item.name)
    .slice(0, maxItems);
}

const stage4SectionStorageKeyMap = Object.freeze({
  [PROFILE_SECTION_KEY.BUSINESS_READINESS]: "businessReadiness",
  [PROFILE_SECTION_KEY.GROWTH_INTELLIGENCE]: "growthIntelligence",
  [PROFILE_SECTION_KEY.IDENTITY]: "identity",
  [PROFILE_SECTION_KEY.MATCHING_PREFERENCES]: "matchingPreferences",
  [PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY]: "professionalIdentity",
  [PROFILE_SECTION_KEY.PROOF]: "proofProfile",
  [PROFILE_SECTION_KEY.REVIEW_PUBLISH]: "publishState",
  [PROFILE_SECTION_KEY.SERVICES]: "servicesProfile",
  [PROFILE_SECTION_KEY.SKILLS]: "skillsProfile",
  [PROFILE_SECTION_KEY.TRUST_VERIFICATION]: "trustVerification",
});

function getSectionStorageKey(sectionKey) {
  if (!PROFILE_SECTION_KEYS.includes(sectionKey)) {
    throw new AppError("Invalid profile section", 400);
  }

  return stage4SectionStorageKeyMap[sectionKey];
}

function getSectionPayload(payload = {}) {
  if (isPlainObject(payload.data)) {
    return payload.data;
  }

  const {
    currentStepId: _currentStepId,
    data: _data,
    onboardingProgress: _onboardingProgress,
    ...sectionPayload
  } = payload ?? {};

  return sectionPayload;
}

function flattenObjectPaths(value, prefix = "") {
  if (!isPlainObject(value)) {
    return [];
  }

  return Object.entries(value).flatMap(([key, childValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(childValue)) {
      return [path, ...flattenObjectPaths(childValue, path)];
    }

    return [path];
  });
}

function assertNoRestrictedProfileFields(sectionKey, payload = {}) {
  const storageKey = getSectionStorageKey(sectionKey);
  const flattenedPaths = flattenObjectPaths(payload);
  const candidatePaths = [
    ...flattenedPaths,
    ...flattenedPaths.map((path) => `${storageKey}.${path}`),
    storageKey,
  ];

  const restrictedPath = PROFILE_RESTRICTED_CLIENT_FIELDS.find((path) =>
    candidatePaths.some(
      (candidatePath) =>
        candidatePath === path ||
        candidatePath.startsWith(`${path}.`) ||
        path.startsWith(`${candidatePath}.`),
    ),
  );

  if (restrictedPath) {
    throw new AppError("This profile field is system-managed and cannot be updated directly", 400);
  }
}

function normalizeProfileSectionPayload(sectionKey, payload = {}) {
  assertNoRestrictedProfileFields(sectionKey, payload);

  switch (sectionKey) {
    case PROFILE_SECTION_KEY.IDENTITY:
      return compactExplicitSectionUpdate(payload, {
        accountType: trimString(payload.accountType, 80),
        avatarAssetId: trimString(payload.avatarAssetId, 240),
        avatarUrl: trimString(payload.avatarUrl, 500),
        contactEmail: trimString(payload.contactEmail, 180).toLowerCase(),
        contactPhone: trimString(payload.contactPhone, 40),
        coverAssetId: trimString(payload.coverAssetId, 240),
        coverUrl: trimString(payload.coverUrl, 500),
        displayName: trimString(payload.displayName, 120),
        firstName: trimString(payload.firstName, 80),
        language: trimString(payload.language || "en", 20),
        lastName: trimString(payload.lastName, 80),
        location: normalizeLocation(payload.location),
        timezone: trimString(payload.timezone, 100),
        username: trimString(payload.username, 40).toLowerCase(),
      });
    case PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY:
      return compactExplicitSectionUpdate(payload, {
        availabilityStatus: trimString(payload.availabilityStatus, 80),
        bio: trimString(payload.bio, 2400),
        experienceLevel: trimString(payload.experienceLevel, 80),
        headline: trimString(payload.headline, 180),
        industry: trimString(payload.industry, 120),
        niche: trimString(payload.niche, 120),
        openTo: normalizeStringList(payload.openTo, 20, 120),
        targetClient: trimString(payload.targetClient, 240),
        yearsOfExperience:
          payload.yearsOfExperience === null || payload.yearsOfExperience === undefined
            ? null
            : Math.max(0, Math.min(80, Number(payload.yearsOfExperience) || 0)),
      });
    case PROFILE_SECTION_KEY.SKILLS:
      return compactExplicitSectionUpdate(payload, {
        platforms: normalizeStage4TagList(payload.platforms, 40),
        serviceCategories: normalizeStringList(payload.serviceCategories, 24, 120),
        skillLevels: normalizeStage4TagList(payload.skillLevels, 40),
        skills: normalizeStage4TagList(payload.skills, 60),
        tools: normalizeStage4TagList(payload.tools, 60),
      });
    case PROFILE_SECTION_KEY.SERVICES:
      return compactExplicitSectionUpdate(payload, {
        deliveryTimelines: normalizeStringList(payload.deliveryTimelines, 20, 120),
        preferredProjectTypes: normalizeStringList(payload.preferredProjectTypes, 20, 120),
        pricingModels: normalizeStringList(payload.pricingModels, 20, 120),
        revisionPolicies: normalizeStringList(payload.revisionPolicies, 20, 240),
        services: normalizePublicItemList(payload.services, 30),
      });
    case PROFILE_SECTION_KEY.PROOF:
      return compactExplicitSectionUpdate(payload, {
        achievements: normalizePublicItemList(payload.achievements, 30),
        caseStudies: normalizePublicItemList(payload.caseStudies, 30),
        certifications: normalizePublicItemList(payload.certifications, 30),
        portfolioItems: normalizePublicItemList(payload.portfolioItems, 30),
        publicProofHighlights: normalizePublicItemList(payload.publicProofHighlights, 12),
      });
    case PROFILE_SECTION_KEY.BUSINESS_READINESS:
      return compactExplicitSectionUpdate(payload, {
        availability: trimString(payload.availability, 120),
        capacity: trimString(payload.capacity, 120),
        invoiceSettings: isPlainObject(payload.invoiceSettings) ? payload.invoiceSettings : {},
        paymentMethods: normalizeStringList(payload.paymentMethods, 12, 120),
        preferredBudgetRange: trimString(payload.preferredBudgetRange, 120),
        preferredClientType: trimString(payload.preferredClientType, 120),
        preferredProjectLength: trimString(payload.preferredProjectLength, 120),
        taxReadiness: trimString(payload.taxReadiness || "not_started", 80),
      });
    case PROFILE_SECTION_KEY.TRUST_VERIFICATION:
      return compactExplicitSectionUpdate(payload, {
        socialVerification: {
          status: "not_started",
        },
      });
    case PROFILE_SECTION_KEY.MATCHING_PREFERENCES:
      return compactExplicitSectionUpdate(payload, {
        excludedCategories: normalizeStringList(payload.excludedCategories, 30, 120),
        preferredBudgets: normalizeStringList(payload.preferredBudgets, 20, 120),
        preferredChallengeTypes: normalizeStringList(payload.preferredChallengeTypes, 30, 120),
        preferredClientTypes: normalizeStringList(payload.preferredClientTypes, 20, 120),
        preferredIndustries: normalizeStringList(payload.preferredIndustries, 30, 120),
        preferredProjectLengths: normalizeStringList(payload.preferredProjectLengths, 20, 120),
        responsePreference: trimString(payload.responsePreference, 120),
        timezonePreference: trimString(payload.timezonePreference, 120),
      });
    case PROFILE_SECTION_KEY.GROWTH_INTELLIGENCE:
      return compactExplicitSectionUpdate(payload, {
        missingRequirements: normalizeStringList(payload.missingRequirements, 45, 120),
        readinessChecklist: normalizeStringList(payload.readinessChecklist, 45, 120),
      });
    case PROFILE_SECTION_KEY.REVIEW_PUBLISH:
      return {
        lastPublishAttemptAt: new Date(),
        publishBlockedReasons: normalizeStringList(payload.publishBlockedReasons, 20, 240),
        publishReadinessStatus: ["not_evaluated", "blocked", "needs_review", "ready"].includes(
          payload.publishReadinessStatus,
        )
          ? payload.publishReadinessStatus
          : "not_evaluated",
      };
    default:
      throw new AppError("Invalid profile section", 400);
  }
}

function validateOnboardingStepIds(stepIds = []) {
  const invalidStepId = stepIds.find((stepId) => !PROFILE_ONBOARDING_STEP_ID_SET.has(stepId));

  if (invalidStepId) {
    throw new AppError("Invalid onboarding step id", 400);
  }

  return Array.from(new Set(stepIds));
}

function normalizeOnboardingProgressPayload(payload = {}) {
  const normalizedProgress = {
    updatedAt: new Date(),
  };

  if (hasOwnValue(payload, "currentStepId")) {
    const currentStepId = trimString(payload.currentStepId, 120);

    if (currentStepId && !PROFILE_ONBOARDING_STEP_ID_SET.has(currentStepId)) {
      throw new AppError("Invalid current onboarding step", 400);
    }

    normalizedProgress.currentStepId = currentStepId;
  }

  if (hasOwnValue(payload, "lastCompletedStepId")) {
    const lastCompletedStepId = trimString(payload.lastCompletedStepId, 120);

    if (lastCompletedStepId && !PROFILE_ONBOARDING_STEP_ID_SET.has(lastCompletedStepId)) {
      throw new AppError("Invalid completed onboarding step", 400);
    }

    normalizedProgress.lastCompletedStepId = lastCompletedStepId;
  }

  if (hasOwnValue(payload, "lastEditedSection")) {
    normalizedProgress.lastEditedSection = PROFILE_SECTION_KEYS.includes(payload.lastEditedSection)
      ? payload.lastEditedSection
      : "";
  }

  if (hasOwnValue(payload, "completedStepIds")) {
    normalizedProgress.completedStepIds = validateOnboardingStepIds(payload.completedStepIds ?? []);
  }

  if (hasOwnValue(payload, "skippedStepIds")) {
    normalizedProgress.skippedStepIds = validateOnboardingStepIds(payload.skippedStepIds ?? []);
  }

  if (hasOwnValue(payload, "sectionProgress")) {
    normalizedProgress.sectionProgress = Array.isArray(payload.sectionProgress)
      ? payload.sectionProgress
        .filter((item) => PROFILE_SECTION_KEYS.includes(item?.sectionKey))
        .map((item) => ({
          completedStepIds: validateOnboardingStepIds(item.completedStepIds ?? []),
          percent: Math.max(0, Math.min(100, Number(item.percent ?? 0) || 0)),
          sectionKey: item.sectionKey,
          updatedAt: new Date(),
        }))
      : [];
  }

  if (hasOwnValue(payload, "startedAt")) {
    normalizedProgress.startedAt = normalizeDate(payload.startedAt) ?? new Date();
  }

  if (hasOwnValue(payload, "completedAt")) {
    normalizedProgress.completedAt = normalizeDate(payload.completedAt);
  }

  return normalizedProgress;
}

function mergeSectionValue(currentValue = {}, nextValue = {}) {
  const current = typeof currentValue?.toObject === "function"
    ? currentValue.toObject()
    : { ...(currentValue ?? {}) };

  return {
    ...current,
    ...nextValue,
  };
}

function normalizeSocialLinks(socialLinks = {}) {
  return socialLinkKeys.reduce((links, key) => {
    links[key] = trimString(socialLinks[key], 240);
    return links;
  }, {});
}

function normalizeExperience(experience) {
  if (!Array.isArray(experience)) {
    return [];
  }

  return experience
    .map((item, index) => ({
      company: trimString(item?.company, 120),
      description: trimString(item?.description, 1200),
      duration: trimString(item?.duration, 80),
      employmentType: trimString(item?.employmentType, 80),
      endDate: item?.isCurrent ? null : normalizeDate(item?.endDate),
      isCurrent: Boolean(item?.isCurrent),
      location: trimString(item?.location, 120),
      order: Number(item?.order ?? index),
      role: trimString(item?.role ?? item?.title, 120),
      skills: normalizeStringList(item?.skills, 20, 50),
      startDate: normalizeDate(item?.startDate),
      title: trimString(item?.title ?? item?.role, 120),
    }))
    .filter((item) => item.title || item.role || item.description || item.duration)
    .map((item) => {
      if (!item.title && !item.role) {
        throw new AppError("Experience entries require title", 400);
      }

      if (!item.isCurrent && item.startDate && item.endDate && item.endDate < item.startDate) {
        throw new AppError("Experience end date cannot be earlier than start date", 400);
      }

      return item;
    })
    .slice(0, 20);
}

function normalizeEducation(education) {
  if (!Array.isArray(education)) {
    return [];
  }

  return education
    .map((item, index) => ({
      description: trimString(item?.description ?? item?.notes, 1200),
      degree: trimString(item?.degree, 140),
      duration: trimString(item?.duration, 80),
      endDate: normalizeDate(item?.endDate),
      fieldOfStudy: trimString(item?.fieldOfStudy, 140),
      grade: trimString(item?.grade, 80),
      institution: trimString(item?.institution ?? item?.school, 140),
      notes: trimString(item?.notes, 500),
      order: Number(item?.order ?? index),
      school: trimString(item?.school ?? item?.institution, 140),
      startDate: normalizeDate(item?.startDate),
    }))
    .filter((item) => item.degree || item.school || item.institution || item.duration || item.notes || item.description)
    .map((item) => {
      if (!item.school && !item.institution) {
        throw new AppError("Education entries require school", 400);
      }

      if (item.startDate && item.endDate && item.endDate < item.startDate) {
        throw new AppError("Education end date cannot be earlier than start date", 400);
      }

      return item;
    })
    .slice(0, 20);
}

function normalizeExperienceItem(item = {}, fallbackOrder = 0) {
  const [normalizedItem] = normalizeExperience([
    {
      ...item,
      order: item.order ?? fallbackOrder,
    },
  ]);

  if (!normalizedItem) {
    throw new AppError("Experience title is required", 400);
  }

  return normalizedItem;
}

function normalizeEducationItem(item = {}, fallbackOrder = 0) {
  const [normalizedItem] = normalizeEducation([
    {
      ...item,
      order: item.order ?? fallbackOrder,
    },
  ]);

  if (!normalizedItem) {
    throw new AppError("Education school is required", 400);
  }

  return normalizedItem;
}

function normalizeDeliveryType(value) {
  const deliveryType = trimString(value, 40);

  return serviceDeliveryTypes.includes(deliveryType) ? deliveryType : "";
}

function sortExperienceItems(items = []) {
  return items
    .map((item) => {
      const value = item?.toObject?.() ?? item ?? {};

      return {
        ...value,
        _id: item?._id ?? value._id ?? new mongoose.Types.ObjectId(),
      };
    })
    .sort((a, b) => {
      const orderDiff = Number(a.order ?? 0) - Number(b.order ?? 0);

      if (orderDiff !== 0) {
        return orderDiff;
      }

      if (Boolean(a.isCurrent) !== Boolean(b.isCurrent)) {
        return a.isCurrent ? -1 : 1;
      }

      return getTimeValue(b.startDate) - getTimeValue(a.startDate);
    })
    .map((item, index) => ({
      ...item,
      order: index,
    }));
}

function sortEducationItems(items = []) {
  return items
    .map((item) => {
      const value = item?.toObject?.() ?? item ?? {};

      return {
        ...value,
        _id: item?._id ?? value._id ?? new mongoose.Types.ObjectId(),
      };
    })
    .sort((a, b) => {
      const orderDiff = Number(a.order ?? 0) - Number(b.order ?? 0);

      if (orderDiff !== 0) {
        return orderDiff;
      }

      return getTimeValue(b.startDate) - getTimeValue(a.startDate);
    })
    .map((item, index) => ({
      ...item,
      order: index,
    }));
}

function sortServiceItems(items = []) {
  return items
    .map((item) => {
      const value = item?.toObject?.() ?? item ?? {};

      return {
        ...value,
        _id: item?._id ?? value._id ?? new mongoose.Types.ObjectId(),
      };
    })
    .sort((a, b) => {
      const orderDiff = Number(a.order ?? 0) - Number(b.order ?? 0);

      if (orderDiff !== 0) {
        return orderDiff;
      }

      return String(a.title ?? "").localeCompare(String(b.title ?? ""));
    })
    .map((item, index) => ({
      ...item,
      order: index,
    }));
}

function getItemId(item) {
  return item?._id?.toString?.() ?? item?.id?.toString?.() ?? "";
}

function normalizeServices(services) {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service, index) => {
      const itemId = service?._id ?? service?.id;
      const serializedItemId = itemId?.toString?.() ?? itemId;

      return {
        ...(serializedItemId ? { _id: serializedItemId } : {}),
        category: trimString(service?.category, 80),
        currency: trimString(service?.currency || "USD", 10) || "USD",
        deliveryType: normalizeDeliveryType(service?.deliveryType),
        description: trimString(service?.description, 800),
        isActive: service?.isActive !== false,
        order: Number(service?.order ?? index),
        proofRequired: normalizeStringList(service?.proofRequired, 10, 80),
        startingPrice: Math.max(0, Number(service?.startingPrice ?? 0) || 0),
        title: trimString(service?.title, 120),
      };
    })
    .filter((service) => service.title || service.description || service.category)
    .slice(0, 12);
}

function normalizeServiceItem(item = {}, fallbackOrder = 0) {
  const [normalizedItem] = normalizeServices([
    {
      ...item,
      order: item.order ?? fallbackOrder,
    },
  ]);

  if (!normalizedItem?.title || normalizedItem.title.length < 2) {
    throw new AppError("Service title is required", 400);
  }

  return normalizedItem;
}

function normalizeOpenTo(openTo = {}) {
  return {
    categories: normalizeStringList(openTo.categories, 10, 80),
    enabled: Boolean(openTo.enabled),
    note: trimString(openTo.note, 500),
    title: trimString(openTo.title, 120),
  };
}

function normalizePrivacySettings(privacySettings = {}) {
  return Object.keys(defaultPrivacySettings).reduce((settings, key) => {
    settings[key] =
      typeof privacySettings?.[key] === "boolean"
        ? privacySettings[key]
        : defaultPrivacySettings[key];
    return settings;
  }, {});
}

function normalizeAnalytics(profile = {}) {
  const analytics = profile.analytics ?? {};

  return {
    lastViewedAt: analytics.lastViewedAt ?? profile.lastViewedAt ?? null,
    postImpressions: Math.max(0, Number(analytics.postImpressions ?? profile.postImpressions ?? 0) || 0),
    profileViews: Math.max(0, Number(analytics.profileViews ?? profile.profileViews ?? 0) || 0),
    searchAppearances: Math.max(0, Number(analytics.searchAppearances ?? profile.searchAppearances ?? 0) || 0),
  };
}

function normalizeActivitySummary(activitySummary = {}, { includePrivate = true } = {}) {
  const summary = {
    lastActiveAt: activitySummary?.lastActiveAt ?? null,
    milestoneUpdatesCount: Math.max(0, Number(activitySummary?.milestoneUpdatesCount ?? 0) || 0),
    postsCount: Math.max(0, Number(activitySummary?.postsCount ?? 0) || 0),
    proofUpdatesCount: Math.max(0, Number(activitySummary?.proofUpdatesCount ?? 0) || 0),
  };

  if (includePrivate) {
    summary.commentsCount = Math.max(0, Number(activitySummary?.commentsCount ?? 0) || 0);
  }

  return summary;
}

function serializeVerificationBadge(verificationBadge = {}, { includePrivate = true } = {}) {
  const status = trimString(verificationBadge?.status || "none", 24) || "none";
  const badge = {
    label: trimString(verificationBadge?.label || "Verified", 80) || "Verified",
    status,
    verifiedAt: verificationBadge?.verifiedAt ?? null,
  };

  if (!includePrivate) {
    return status === "verified"
      ? badge
      : {
          label: "",
          status: "none",
          verifiedAt: null,
        };
  }

  return {
    ...badge,
    rejectedAt: verificationBadge?.rejectedAt ?? null,
    rejectionReason: trimString(verificationBadge?.rejectionReason, 1000),
    requestNote: trimString(verificationBadge?.requestNote, 1000),
    requestedAt: verificationBadge?.requestedAt ?? null,
    reviewedAt: verificationBadge?.reviewedAt ?? null,
    reviewedBy: verificationBadge?.reviewedBy?.toString?.() ?? verificationBadge?.reviewedBy ?? null,
    supportingLinks: normalizeStringList(verificationBadge?.supportingLinks, 5, 500),
    verificationType: trimString(verificationBadge?.verificationType || "identity", 40),
    website: trimString(verificationBadge?.website, 500),
  };
}

export function getPublicVerificationDisplay(profile = {}, providerProfile = null) {
  const profileBadge = serializeVerificationBadge(profile.verificationBadge, {
    includePrivate: false,
  });
  const providerVerified = providerProfile?.verificationStatus === "verified";

  if (profileBadge.status === "verified") {
    return {
      isVerified: true,
      label: profileBadge.label || "Verified",
      type: "profile",
      verifiedAt: profileBadge.verifiedAt,
    };
  }

  if (providerVerified) {
    return {
      isVerified: true,
      label: "Verified",
      type: "provider",
      verifiedAt: providerProfile?.verifiedAt ?? null,
    };
  }

  return {
    isVerified: false,
    label: "",
    type: "none",
    verifiedAt: null,
  };
}

function serializeExperienceItem(item = {}, index = 0) {
  const title = item.title || item.role || "";

  return {
    _id: item._id?.toString?.() ?? item.id ?? "",
    company: item.company ?? "",
    description: item.description ?? "",
    duration: item.duration ?? "",
    employmentType: item.employmentType ?? "",
    endDate: item.endDate ?? null,
    isCurrent: Boolean(item.isCurrent),
    location: item.location ?? "",
    order: item.order ?? index,
    role: item.role || title,
    skills: item.skills ?? [],
    startDate: item.startDate ?? null,
    title,
  };
}

function serializeEducationItem(item = {}, index = 0) {
  const school = item.school || item.institution || "";

  return {
    _id: item._id?.toString?.() ?? item.id ?? "",
    degree: item.degree ?? "",
    description: item.description ?? item.notes ?? "",
    duration: item.duration ?? "",
    endDate: item.endDate ?? null,
    fieldOfStudy: item.fieldOfStudy ?? "",
    grade: item.grade ?? "",
    institution: item.institution || school,
    notes: item.notes ?? "",
    order: item.order ?? index,
    school,
    startDate: item.startDate ?? null,
  };
}

function serializeSkills(skills = []) {
  if (!Array.isArray(skills)) {
    return [];
  }

  return normalizeProfileSkills(skills);
}

function normalizeCompletionValue(value) {
  if (typeof value === "number") {
    return {
      missingFields: [],
      percentage: Math.max(0, Math.min(100, value)),
    };
  }

  return {
    missingFields: Array.isArray(value?.missingFields) ? value.missingFields : [],
    percentage: Math.max(0, Math.min(100, Number(value?.percentage ?? 0) || 0)),
  };
}

export function calculateProfileCompletion(profile = {}, user = {}, providerProfile = null) {
  const location = normalizeLocation(profile.location);
  const skills = normalizeSkills(profile.skills);
  const hasCover = Boolean(normalizeMedia(profile.coverImage).url);
  const hasCurrentWork = Boolean(profile.currentPosition || profile.currentCompany || profile.companyName);
  const checks = [
    ["avatar", Boolean(user.avatar || profile.profilePicture)],
    ["coverImage", hasCover],
    ["headline", Boolean(profile.headline)],
    ["bio", Boolean(profile.bio)],
    ["location.city", Boolean(location.city)],
    ["currentPositionOrCompany", hasCurrentWork],
    ["skills", skills.length > 0 || (providerProfile?.skills?.length ?? 0) > 0],
    [
      "experienceOrServices",
      (profile.experience?.length ?? 0) > 0 ||
        (profile.services?.length ?? 0) > 0 ||
        Boolean(providerProfile),
    ],
  ];
  const missingFields = checks
    .filter(([, complete]) => !complete)
    .map(([field]) => field);
  const percentage = Math.round(((checks.length - missingFields.length) / checks.length) * 100);

  return {
    missingFields,
    percentage,
  };
}

function serializeProfile(profile, settings = null, options = {}) {
  const companyName = profile.companyName || profile.company || "";
  const currentCompany = profile.currentCompany || companyName;
  const profileVisibility =
    settings?.profileVisibility ?? profile.profileVisibility ?? "public";
  const location = normalizeLocation(profile.location);
  const coverImage = normalizeMedia(profile.coverImage);
  const services = normalizeServices(profile.services);
  const analytics = normalizeAnalytics(profile);
  const privacySettings = normalizePrivacySettings(profile.privacySettings);

  return {
    activitySummary: normalizeActivitySummary(profile.activitySummary, {
      includePrivate: options.includePrivateActivity !== false,
    }),
    analytics,
    availabilityStatus: profile.availabilityStatus,
    bio: profile.bio ?? "",
    company: profile.company ?? "",
    companyName,
    coverImage,
    businessType: profile.businessType ?? "",
    connectionsCount: profile.connectionsCount ?? 0,
    currentCompany,
    currentPosition: profile.currentPosition ?? "",
    education: (profile.education ?? []).map(serializeEducationItem),
    educationHeadline: profile.educationHeadline ?? "",
    experience: (profile.experience ?? []).map(serializeExperienceItem),
    followersCount: profile.followersCount ?? 0,
    headline: profile.headline ?? "",
    industry: profile.industry ?? "",
    location,
    locationLabel: getLocationLabel(profile.location),
    openTo: normalizeOpenTo(profile.openTo),
    phone: profile.phone ?? "",
    postImpressions: analytics.postImpressions,
    profileCompletion: normalizeCompletionValue(profile.profileCompletion),
    profilePicture: profile.profilePicture ?? "",
    profileViews: analytics.profileViews,
    profileVisibility,
    privacySettings,
    ...(options.includePrivateProfileFields === false
      ? {}
      : {
          businessReadiness: profile.businessReadiness ?? {},
          growthIntelligence: profile.growthIntelligence ?? {},
          identity: profile.identity ?? {},
          matchingPreferences: profile.matchingPreferences ?? {},
          onboardingProgress: profile.onboardingProgress ?? {},
          ownerType: profile.ownerType ?? PROFILE_OWNER_TYPE.PROVIDER,
          professionalIdentity: profile.professionalIdentity ?? {},
          proofProfile: profile.proofProfile ?? {},
          publishState: profile.publishState ?? {},
          servicesProfile: profile.servicesProfile ?? {},
          skillsProfile: profile.skillsProfile ?? {},
          status: profile.status ?? PROFILE_STATUS.DRAFT,
          systemMeta: profile.systemMeta ?? {},
          trustVerification: profile.trustVerification ?? {},
          visibility: profile.visibility ?? PROFILE_VISIBILITY.PRIVATE,
        }),
    searchAppearances: analytics.searchAppearances,
    services: options.includeInactiveServices === false
      ? services.filter((service) => service.isActive !== false)
      : services,
    skills: serializeSkills(profile.skills),
    socialLinks: profile.socialLinks ?? normalizeSocialLinks(),
    userId: profile.userId?.toString?.() ?? profile.userId,
    verification: options.publicVerification ?? getPublicVerificationDisplay(profile, null),
    verificationBadge: serializeVerificationBadge(profile.verificationBadge, {
      includePrivate: options.includePrivateVerification !== false,
    }),
    website: profile.website ?? "",
  };
}

function serializeProviderProfile(providerProfile) {
  if (!providerProfile) {
    return null;
  }

  const proofSummary = {
    approvalRate: providerProfile.approvalRate ?? 0,
    completedOutcomes:
      providerProfile.completedOutcomes ?? providerProfile.completedProjects ?? 0,
    onTimeRate: providerProfile.onTimeRate ?? 0,
    proofScore: Math.max(0, Math.min(100, Number(providerProfile.proofScore ?? 0) || 0)),
    ratingAverage:
      providerProfile.ratingAverage ??
      providerProfile.stats?.averageRating ??
      providerProfile.rating ??
      0,
    totalChallengesApplied: providerProfile.totalChallengesApplied ?? 0,
    totalChallengesWon: providerProfile.totalChallengesWon ?? 0,
    totalProofsApproved: providerProfile.totalProofsApproved ?? 0,
    totalReviews: providerProfile.totalReviews ?? providerProfile.stats?.totalReviews ?? 0,
  };

  return {
    availability: providerProfile.availability ?? "available",
    categories: providerProfile.categories ?? [],
    completedOutcomes: proofSummary.completedOutcomes,
    completedProjects: providerProfile.completedProjects ?? 0,
    createdAt: providerProfile.createdAt ?? null,
    experienceLevel: providerProfile.experienceLevel ?? "intermediate",
    fixedStartingPrice: providerProfile.fixedStartingPrice ?? 0,
    headline: providerProfile.headline || providerProfile.title || "",
    hourlyRate: providerProfile.hourlyRate ?? 0,
    id: providerProfile._id?.toString?.() ?? providerProfile.id,
    isAvailableForChallenges: providerProfile.isAvailableForChallenges !== false,
    isFeatured: Boolean(providerProfile.isFeatured ?? providerProfile.featured),
    languages: providerProfile.languages ?? [],
    onTimeRate: proofSummary.onTimeRate,
    approvalRate: proofSummary.approvalRate,
    portfolioItems: (providerProfile.portfolioItems ?? []).map((item) =>
      item?._id?.toString?.() ?? item?.toString?.() ?? item,
    ),
    professionalSummary: providerProfile.professionalSummary ?? "",
    proofScore: proofSummary.proofScore,
    proofMetricsAvailable: true,
    proofSummary,
    rating: providerProfile.rating ?? 0,
    ratingAverage: proofSummary.ratingAverage,
    skills: providerProfile.skills ?? [],
    totalChallengesApplied: proofSummary.totalChallengesApplied,
    totalChallengesWon: proofSummary.totalChallengesWon,
    totalProofsApproved: proofSummary.totalProofsApproved,
    totalReviews: proofSummary.totalReviews,
    title: providerProfile.title ?? "",
    userId: providerProfile.userId?.toString?.() ?? providerProfile.userId,
    verifiedAt: providerProfile.verifiedAt ?? null,
    verificationStatus: providerProfile.verificationStatus ?? "none",
  };
}

function publicPriceRange(priceRange = {}) {
  if (!priceRange || priceRange.type === "hidden") {
    return { type: "hidden" };
  }

  return {
    currency: priceRange.currency ?? "USD",
    customLabel: priceRange.customLabel ?? "",
    max: priceRange.max ?? null,
    min: priceRange.min ?? null,
    type: priceRange.type ?? "hidden",
  };
}

function serializePublicOutcomeOfferPreview(offer = {}) {
  return {
    availability: offer.availability?.status ?? "",
    category: offer.category ?? "",
    deliveryTimeline: offer.deliveryTimeline ?? null,
    id: offer._id?.toString?.() ?? offer.id ?? "",
    priceRange: publicPriceRange(offer.priceRange ?? {}),
    proofIncludedCount: offer.proofIncluded?.length ?? 0,
    qualityScore: offer.qualityScore?.score ?? 0,
    shortSummary: offer.shortSummary ?? "",
    skills: (offer.skills ?? []).slice(0, 6),
    slug: offer.slug ?? "",
    targetOutcome: offer.targetOutcome?.outcomeStatement ?? "",
    title: offer.title ?? "",
    tools: (offer.tools ?? []).slice(0, 6),
  };
}

async function getPublicOutcomeOfferPreviews(userId, { enabled = true } = {}) {
  if (!enabled || !userId) {
    return {
      count: 0,
      offers: [],
      top: null,
    };
  }

  const query = {
    providerId: userId,
    status: OUTCOME_OFFER_STATUS.PUBLISHED,
    visibility: OUTCOME_OFFER_VISIBILITY.PUBLIC,
    $or: [
      { "moderation.status": "approved" },
      { "moderation.status": { $exists: false } },
    ],
  };
  const [offers, count] = await Promise.all([
    OutcomeOffer.find(query)
      .select(
        "availability category deliveryTimeline priceRange proofIncluded qualityScore shortSummary skills slug targetOutcome title tools",
      )
      .sort({ "qualityScore.score": -1, createdAt: -1 })
      .limit(6)
      .lean(),
    OutcomeOffer.countDocuments(query),
  ]);
  const serializedOffers = offers.map(serializePublicOutcomeOfferPreview);

  return {
    count,
    offers: serializedOffers,
    top: serializedOffers[0] ?? null,
  };
}

function serializePortfolioPreview(item) {
  return {
    afterState: item.afterState ?? "",
    beforeState: item.beforeState ?? "",
    clientName: item.clientName ?? "",
    description: item.description ?? "",
    id: item._id?.toString?.() ?? item.id,
    image: item.image ?? "",
    industry: item.industry ?? "",
    mediaType: item.mediaType ?? "image",
    results: item.results ?? [],
    tags: item.tags ?? [],
    testimonial: item.testimonial ?? "",
    title: item.title ?? "",
  };
}

function serializeServicePreview(item) {
  return {
    _id: item._id?.toString?.() ?? item.id,
    category: item.category ?? "",
    coverImage: item.coverImage || item.mediaUrl || item.images?.[0] || "",
    deliveryTime: item.deliveryTime ?? "",
    description: item.description ?? "",
    featured: Boolean(item.featured),
    price: item.price ?? 0,
    pricingType: item.pricingType ?? "fixed",
    slug: item.slug ?? "",
    status: item.status ?? "active",
    tags: item.tags ?? [],
    title: item.title ?? "",
  };
}

function serializeSettings(settings) {
  return {
    darkMode: Boolean(settings.darkMode),
    emailNotifications: Boolean(settings.emailNotifications),
    language: settings.language ?? "en",
    profileVisibility: settings.profileVisibility ?? "public",
    twoFactorEnabled: Boolean(settings.twoFactorEnabled),
    userId: settings.userId?.toString?.() ?? settings.userId,
  };
}

function serializeUser(user) {
  const isEmailVerified = Boolean(
    user.isEmailVerified || user.emailVerified || user.isVerified,
  );
  const verificationStatus =
    user.verificationStatus ??
    (isEmailVerified ? "verified" : "pending");

  return {
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    email: user.email,
    fullName: user.fullName ?? user.name ?? "",
    id: user._id?.toString() ?? user.id,
    emailVerified: isEmailVerified,
    isEmailVerified,
    isVerified: isEmailVerified,
    name: user.name ?? user.fullName ?? "",
    profileId: user.profileId?.toString?.() ?? user.profileId ?? null,
    role: normalizeRole(user.role),
    verificationStatus,
    username: user.username ?? "",
  };
}

function serializePublicUser(user) {
  return {
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    fullName: user.fullName ?? user.name ?? "",
    id: user._id?.toString() ?? user.id,
    isEmailVerified: false,
    isVerified: false,
    name: user.name ?? user.fullName ?? "",
    role: normalizeRole(user.role),
    verificationStatus: "none",
    username: user.username ?? "",
  };
}

function applyPublicPrivacyFilters({
  originalUser,
  profile,
  providerProfile,
  serviceItems,
  user,
}) {
  const privacySettings = normalizePrivacySettings(profile.privacySettings);

  delete profile.privacySettings;
  delete profile.userId;
  profile.coverImage = stripMediaPublicId(profile.coverImage);

  if (privacySettings.showEmail) {
    user.email = originalUser?.email ?? "";
  }

  if (!privacySettings.showPhone) {
    delete profile.phone;
  }

  if (!privacySettings.showWebsite) {
    profile.website = "";
  }

  if (!privacySettings.showSocialLinks) {
    profile.socialLinks = normalizeSocialLinks();
  }

  if (!privacySettings.showServices) {
    profile.services = [];
    serviceItems.length = 0;
  }

  if (!privacySettings.showOpenTo || !profile.openTo?.enabled) {
    profile.openTo = {
      categories: [],
      enabled: false,
      note: "",
      title: "",
    };
  }

  if (!privacySettings.showExperience) {
    profile.experience = [];
  }

  if (!privacySettings.showEducation) {
    profile.education = [];
  }

  if (!privacySettings.showActivity) {
    profile.activitySummary = normalizeActivitySummary({}, { includePrivate: false });
  }

  if (!privacySettings.showProofScore && providerProfile) {
    providerProfile.proofScore = 0;
    providerProfile.proofMetricsAvailable = false;
    providerProfile.proofSummary = {
      approvalRate: 0,
      completedOutcomes: 0,
      onTimeRate: 0,
      proofScore: 0,
      ratingAverage: 0,
      totalChallengesApplied: 0,
      totalChallengesWon: 0,
      totalProofsApproved: 0,
      totalReviews: 0,
    };
    providerProfile.completedOutcomes = 0;
    providerProfile.totalProofsApproved = 0;
    providerProfile.onTimeRate = 0;
    providerProfile.approvalRate = 0;
    providerProfile.ratingAverage = 0;
    providerProfile.totalReviews = 0;
    providerProfile.totalChallengesWon = 0;
    providerProfile.totalChallengesApplied = 0;
  }

  if (providerProfile) {
    const publicVerification = profile.verification ?? {};
    const providerWasVerified = providerProfile.verificationStatus === "verified";

    delete providerProfile.userId;
    providerProfile.verificationStatus =
      publicVerification.isVerified &&
      (publicVerification.type === "provider" || providerWasVerified)
        ? "verified"
        : "none";

    if (providerProfile.verificationStatus !== "verified") {
      providerProfile.verifiedAt = null;
    }
  }

  return {
    profile,
    providerProfile,
    serviceItems,
    user,
  };
}

function buildPublicUploadUrl(file, baseUrl = "") {
  const publicPath = `/uploads/profiles/${file.filename}`;

  if (!baseUrl) {
    return publicPath;
  }

  return `${baseUrl.replace(/\/$/, "")}${publicPath}`;
}

async function ensureProfile(user) {
  let profile = await UserProfile.findOne({ userId: user._id });
  const normalizedRole = normalizeRole(user.role);
  const ownerType =
    normalizedRole === "provider"
      ? PROFILE_OWNER_TYPE.PROVIDER
      : normalizedRole === "client"
        ? PROFILE_OWNER_TYPE.CLIENT
        : PROFILE_OWNER_TYPE.ADMIN_MANAGED;

  if (!profile) {
    profile = await UserProfile.create({
      headline: "",
      profileVisibility: "public",
      ownerType,
      status: PROFILE_STATUS.DRAFT,
      userId: user._id,
      visibility: PROFILE_VISIBILITY.PRIVATE,
    });
  }

  if (!user.profileId || user.profileId.toString() !== profile._id.toString()) {
    user.profileId = profile._id;
    await user.save();
  }

  let needsSectionIdSave = false;
  let needsStage4DefaultSave = false;

  if (!profile.ownerType) {
    profile.ownerType = ownerType;
    needsStage4DefaultSave = true;
  }

  if (!profile.status) {
    profile.status = PROFILE_STATUS.DRAFT;
    needsStage4DefaultSave = true;
  }

  if (!profile.visibility) {
    profile.visibility = PROFILE_VISIBILITY.PRIVATE;
    needsStage4DefaultSave = true;
  }

  const identityUpdates = {
    accountType: user.accountType ?? profile.identity?.accountType,
    avatarUrl: normalizeMedia(user.avatar).url || profile.identity?.avatarUrl,
    contactEmail: user.email ?? profile.identity?.contactEmail,
    displayName: user.fullName ?? user.name ?? profile.identity?.displayName,
    username: user.username ?? profile.identity?.username,
  };

  Object.entries(identityUpdates).forEach(([key, value]) => {
    if (value && !profile.identity?.[key]) {
      profile.set(`identity.${key}`, value);
      needsStage4DefaultSave = true;
    }
  });

  if (Array.isArray(profile.experience)) {
    profile.experience.forEach((item) => {
      if (!item._id) {
        item._id = new mongoose.Types.ObjectId();
        needsSectionIdSave = true;
      }
    });
  }

  if (Array.isArray(profile.education)) {
    profile.education.forEach((item) => {
      if (!item._id) {
        item._id = new mongoose.Types.ObjectId();
        needsSectionIdSave = true;
      }
    });
  }

  if (Array.isArray(profile.services)) {
    profile.services.forEach((item) => {
      if (!item._id) {
        item._id = new mongoose.Types.ObjectId();
        needsSectionIdSave = true;
      }
    });
  }

  if (needsSectionIdSave || needsStage4DefaultSave) {
    await profile.save();
  }

  return profile;
}

async function ensureSettings(userId) {
  let settings = await UserSettings.findOne({ userId });

  if (!settings) {
    settings = await UserSettings.create({ userId });
  }

  return settings;
}

async function ensureProviderProfile(user, profile) {
  if (normalizeRole(user.role) !== "provider") {
    return null;
  }

  let providerProfile = await ProviderProfile.findOne({ userId: user._id });

  if (!providerProfile) {
    const profileSkillNames = normalizeSkills(profile.skills);
    providerProfile = await ProviderProfile.create({
      categories: normalizeStringList(profileSkillNames, 12),
      skills: normalizeStringList(profileSkillNames, 24),
      title:
        trimString(profile.headline, 140) ||
        "Service provider helping teams move faster.",
      userId: user._id,
    });
  }

  return providerProfile;
}

async function getPortfolioPreviews(userId, providerProfile) {
  const portfolioFilters = [{ userId }];
  const linkedPortfolioIds = providerProfile?.portfolioItems ?? [];

  if (linkedPortfolioIds.length > 0) {
    portfolioFilters.push({ _id: { $in: linkedPortfolioIds } });
  }

  const items = await Portfolio.find({ $or: portfolioFilters })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  const seen = new Set();

  return items
    .filter((item) => {
      const id = item._id.toString();

      if (seen.has(id)) {
        return false;
      }

      seen.add(id);
      return true;
    })
    .map(serializePortfolioPreview);
}

async function getServicePreviews(userId, { includePrivate = false } = {}) {
  const query = {
    providerId: userId,
  };

  if (!includePrivate) {
    query.status = "active";
  }

  const services = await Service.find(query)
    .sort({ featured: -1, createdAt: -1 })
    .limit(8)
    .lean();

  return services.map(serializeServicePreview);
}

async function buildProfileResponse({
  includePrivateSettings = true,
  isOwner = includePrivateSettings,
  profile,
  settings,
  user,
}) {
  const providerProfile =
    normalizeRole(user.role) === "provider"
      ? await ensureProviderProfile(user, profile)
      : null;
  const privacySettings = normalizePrivacySettings(profile.privacySettings);
  const canShowPublicOutcomeOffers =
    Boolean(providerProfile) &&
    (includePrivateSettings || privacySettings.showServices !== false);
  const [portfolioItems, serviceItems, publicOutcomeOffers] = await Promise.all([
    getPortfolioPreviews(user._id, providerProfile),
    providerProfile
      ? getServicePreviews(user._id, { includePrivate: includePrivateSettings })
      : [],
    getPublicOutcomeOfferPreviews(user._id, {
      enabled: canShowPublicOutcomeOffers,
    }),
  ]);

  const serializedProfile = serializeProfile(profile, settings, {
    includePrivateActivity: includePrivateSettings,
    includePrivateProfileFields: includePrivateSettings,
    includeInactiveServices: includePrivateSettings,
    includePrivateVerification: includePrivateSettings,
    publicVerification: getPublicVerificationDisplay(profile, providerProfile),
  });
  const profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  serializedProfile.profileCompletion = profileCompletion;
  let serializedProviderProfile = serializeProviderProfile(providerProfile);
  const serializedUser = includePrivateSettings ? serializeUser(user) : serializePublicUser(user);
  const serializedServiceItems = [...serviceItems];

  if (!includePrivateSettings) {
    delete serializedProfile.analytics;
    delete serializedProfile.postImpressions;
    delete serializedProfile.profileCompletion;
    delete serializedProfile.profileViews;
    delete serializedProfile.searchAppearances;

    applyPublicPrivacyFilters({
      originalUser: user,
      profile: serializedProfile,
      providerProfile: serializedProviderProfile,
      serviceItems: serializedServiceItems,
      user: serializedUser,
    });
  }

  return {
    isOwner,
    portfolioItems,
    profile: serializedProfile,
    providerProfile: serializedProviderProfile,
    publicOutcomeOfferCount: publicOutcomeOffers.count,
    publicOutcomeOffers,
    settings: includePrivateSettings
      ? serializeSettings(settings)
      : {
          profileVisibility: settings.profileVisibility,
        },
    serviceItems: serializedServiceItems,
    user: serializedUser,
  };
}

function normalizeProviderProfileData(providerProfileData = {}, profileData = {}) {
  const source = providerProfileData ?? {};
  const updates = {};

  if (source.title !== undefined || profileData.providerTitle !== undefined) {
    updates.title = trimString(source.title ?? profileData.providerTitle, 140);

    if (updates.title.length < 3) {
      throw new AppError("Provider title must be at least 3 characters", 400);
    }
  }

  if (source.headline !== undefined) {
    updates.headline = trimString(source.headline, 160);
  }

  if (source.professionalSummary !== undefined) {
    updates.professionalSummary = trimString(source.professionalSummary, 1200);
  }

  if (source.hourlyRate !== undefined || profileData.hourlyRate !== undefined) {
    const hourlyRate = Number(source.hourlyRate ?? profileData.hourlyRate);

    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      throw new AppError("Hourly rate must be a positive number", 400);
    }

    updates.hourlyRate = hourlyRate;
  }

  if (source.fixedStartingPrice !== undefined) {
    const fixedStartingPrice = Number(source.fixedStartingPrice);

    if (!Number.isFinite(fixedStartingPrice) || fixedStartingPrice < 0) {
      throw new AppError("Fixed starting price must be a positive number", 400);
    }

    updates.fixedStartingPrice = fixedStartingPrice;
  }

  if (source.experienceLevel !== undefined) {
    if (!providerExperienceLevels.includes(source.experienceLevel)) {
      throw new AppError("Invalid provider experience level", 400);
    }

    updates.experienceLevel = source.experienceLevel;
  }

  if (source.availability !== undefined) {
    if (!providerAvailabilities.includes(source.availability)) {
      throw new AppError("Invalid provider availability", 400);
    }

    updates.availability = source.availability;
  }

  if (source.categories !== undefined) {
    updates.categories = normalizeStringList(source.categories, 12, 64);
  }

  if (source.languages !== undefined) {
    updates.languages = normalizeStringList(source.languages, 12, 48);
  }

  if (source.skills !== undefined) {
    updates.skills = normalizeStringList(source.skills, 30, 64);
  }

  if (typeof source.isAvailableForChallenges === "boolean") {
    updates.isAvailableForChallenges = source.isAvailableForChallenges;
  }

  return updates;
}

export async function getUserProfileForUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);

  return buildProfileResponse({ profile, settings, user });
}

function assertProviderProfileOwner(user) {
  if (normalizeRole(user.role) !== "provider") {
    throw new AppError("Provider profile access required", 403);
  }
}

async function updateUserIdentityFromProfileSection(user, sectionPayload = {}) {
  const userUpdates = {};

  if (sectionPayload.displayName !== undefined) {
    const displayName = trimString(sectionPayload.displayName, 120);

    if (displayName && displayName.length < 2) {
      throw new AppError("Display name must be at least 2 characters", 400);
    }

    if (displayName) {
      userUpdates.fullName = displayName;
      userUpdates.name = displayName;
    }
  }

  if (sectionPayload.username !== undefined) {
    const username = trimString(sectionPayload.username, 40).toLowerCase();

    if (username && username.length < 3) {
      throw new AppError("Username must be at least 3 characters", 400);
    }

    if (username) {
      const usernameOwner = await User.findOne({
        _id: { $ne: user._id },
        username,
      }).lean();

      if (usernameOwner) {
        throw new AppError("This username is already taken", 409);
      }

      userUpdates.username = username;
    }
  }

  if (Object.keys(userUpdates).length > 0) {
    Object.assign(user, userUpdates);
    await user.save();
  }
}

function syncLegacyProfileFields(profile, sectionKey, sectionPayload = {}) {
  if (sectionKey === PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY) {
    if (sectionPayload.headline !== undefined) {
      profile.headline = sectionPayload.headline;
    }

    if (sectionPayload.bio !== undefined) {
      profile.bio = sectionPayload.bio;
    }

    if (sectionPayload.industry !== undefined) {
      profile.industry = sectionPayload.industry;
    }

    if (sectionPayload.availabilityStatus !== undefined) {
      profile.availabilityStatus =
        sectionPayload.availabilityStatus === "available"
          ? "available"
          : sectionPayload.availabilityStatus === "busy"
            ? "busy"
            : "unavailable";
    }
  }

  if (sectionKey === PROFILE_SECTION_KEY.SKILLS && sectionPayload.skills !== undefined) {
    profile.skills = normalizeProfileSkills(sectionPayload.skills);
  }
}

function applyOnboardingProgress(profile, onboardingProgress = {}) {
  const normalizedProgress = normalizeOnboardingProgressPayload(onboardingProgress);
  const currentProgress = profile.onboardingProgress?.toObject?.() ?? profile.onboardingProgress ?? {};
  profile.onboardingProgress = {
    ...currentProgress,
    ...normalizedProgress,
  };

  if (normalizedProgress.lastEditedSection) {
    profile.systemMeta = {
      ...(profile.systemMeta?.toObject?.() ?? profile.systemMeta ?? {}),
      lastCompletedStepId: normalizedProgress.lastCompletedStepId,
      lastEditedSection: normalizedProgress.lastEditedSection,
      lastSectionSavedAt: new Date(),
    };
  }
}

export async function updateProfileSectionForUser(userId, sectionKey, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);
  assertProviderProfileOwner(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);
  const storageKey = getSectionStorageKey(sectionKey);
  const sectionPayload = getSectionPayload(payload);
  const normalizedSection = normalizeProfileSectionPayload(sectionKey, sectionPayload);

  if (sectionKey === PROFILE_SECTION_KEY.IDENTITY) {
    await updateUserIdentityFromProfileSection(user, normalizedSection);
  }

  if (Object.keys(normalizedSection).length > 0) {
    profile.set(storageKey, mergeSectionValue(profile[storageKey], normalizedSection));
    syncLegacyProfileFields(profile, sectionKey, normalizedSection);
  }

  if (payload.onboardingProgress || payload.currentStepId) {
    applyOnboardingProgress(profile, {
      ...(payload.onboardingProgress ?? {}),
      currentStepId: payload.currentStepId ?? payload.onboardingProgress?.currentStepId,
      lastEditedSection: sectionKey,
    });
  }

  profile.status =
    profile.status === PROFILE_STATUS.PUBLISHED
      ? PROFILE_STATUS.PUBLISHED
      : PROFILE_STATUS.INCOMPLETE;
  profile.systemMeta = {
    ...(profile.systemMeta?.toObject?.() ?? profile.systemMeta ?? {}),
    lastEditedSection: sectionKey,
    lastSectionSavedAt: new Date(),
  };

  await profile.save();

  await UserActivity.create({
    description: `Updated enhanced profile section: ${sectionKey}`,
    type: "profile_updated",
    userId,
  });

  return buildProfileResponse({ profile, settings, user });
}

export async function updateOnboardingProgressForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);
  assertProviderProfileOwner(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);

  applyOnboardingProgress(profile, payload);
  profile.systemMeta = {
    ...(profile.systemMeta?.toObject?.() ?? profile.systemMeta ?? {}),
    lastCompletedStepId: payload.lastCompletedStepId ?? profile.systemMeta?.lastCompletedStepId ?? "",
    lastEditedSection: payload.lastEditedSection ?? profile.systemMeta?.lastEditedSection ?? "",
  };

  await profile.save();

  return buildProfileResponse({ profile, settings, user });
}

export async function getPublicProfilePreviewForUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);
  assertProviderProfileOwner(user);

  const profile = await ensureProfile(user);
  const projection = buildPublicProfileProjection(profile, { user });

  profile.systemMeta = {
    ...(profile.systemMeta?.toObject?.() ?? profile.systemMeta ?? {}),
    lastPublicPreviewAt: new Date(),
  };
  await profile.save();

  return {
    profile: projection,
  };
}

export async function updateProfilePublishStateForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);
  assertProviderProfileOwner(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);
  const currentPublishState =
    profile.publishState?.toObject?.() ?? profile.publishState ?? {};
  const action = payload.action ?? "save_readiness";
  const nextPublishState = {
    ...currentPublishState,
    lastPublishAttemptAt: new Date(),
    publishBlockedReasons: normalizeStringList(payload.publishBlockedReasons, 20, 240),
    publishReadinessStatus: ["not_evaluated", "blocked", "needs_review", "ready"].includes(
      payload.publishReadinessStatus,
    )
      ? payload.publishReadinessStatus
      : currentPublishState.publishReadinessStatus ?? "not_evaluated",
  };

  if (action === "request_publish_review") {
    profile.status = PROFILE_STATUS.REVIEW_READY;
    nextPublishState.publishReadinessStatus =
      nextPublishState.publishReadinessStatus === "not_evaluated"
        ? "needs_review"
        : nextPublishState.publishReadinessStatus;
  }

  if (action === "unpublish") {
    profile.status = PROFILE_STATUS.DRAFT;
    profile.visibility = PROFILE_VISIBILITY.PRIVATE;
    nextPublishState.isPublished = false;
    nextPublishState.publishedAt = null;
    nextPublishState.unpublishedAt = new Date();
    nextPublishState.publishReadinessStatus = "not_evaluated";
  }

  profile.publishState = nextPublishState;
  await profile.save();

  return buildProfileResponse({ profile, settings, user });
}

export async function getPublishedPublicProfileByIdentifier(identifier) {
  ensureDatabaseConnection();

  const normalizedIdentifier = String(identifier ?? "").trim().toLowerCase();

  if (!normalizedIdentifier) {
    throw new AppError("Profile identifier is required", 400);
  }

  const user = await User.findOne({
    accountStatus: { $nin: ["suspended", "deleted", "banned"] },
    isSuspended: { $ne: true },
    username: normalizedIdentifier,
  });

  if (!user) {
    throw new AppError("Profile not found", 404);
  }

  const profile = await UserProfile.findOne({
    userId: user._id,
    visibility: PROFILE_VISIBILITY.PUBLIC,
    "publishState.isPublished": true,
  });

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return {
    profile: buildPublicProfileProjection(profile, { user }),
  };
}

export async function getPublicProfileByUsername(username, viewerId = null) {
  ensureDatabaseConnection();

  const normalizedUsername = String(username ?? "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new AppError("Username is required", 400);
  }

  const user = await User.findOne({
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
    username: normalizedUsername,
  });

  if (!user) {
    throw new AppError("Profile not found", 404);
  }

  assertProfileAccountAvailable(user);

  const settings = await ensureSettings(user._id);

  const profile = await ensureProfile(user);
  const visibilityValue = settings.profileVisibility ?? profile.profileVisibility ?? "public";
  const visibility = profileVisibilityValues.includes(visibilityValue) ? visibilityValue : "private";
  const isOwner = viewerId && String(viewerId) === String(user._id);

  if (isOwner) {
    return buildProfileResponse({
      includePrivateSettings: true,
      isOwner: true,
      profile,
      settings,
      user,
    });
  }

  if (visibility === "hidden") {
    throw new AppError("Profile not found", 404);
  }

  if (visibility !== "public") {
    throw new AppError("This profile is private", 403);
  }

  return buildProfileResponse({
    includePrivateSettings: false,
    isOwner: false,
    profile,
    settings,
    user,
  });
}

export async function getOwnerAnalyticsForUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;
  const profileCompletion = calculateProfileCompletion(profile, user, providerProfile);

  return {
    activitySummary: normalizeActivitySummary(profile.activitySummary, {
      includePrivate: true,
    }),
    analytics: normalizeAnalytics(profile),
    profileCompletion,
  };
}

export async function getPrivacySettingsForUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);
  const profileVisibility =
    settings.profileVisibility ?? profile.profileVisibility ?? "public";

  return {
    privacySettings: normalizePrivacySettings(profile.privacySettings),
    profileVisibility: profileVisibilityValues.includes(profileVisibility)
      ? profileVisibility
      : "private",
  };
}

export async function updatePrivacySettingsForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const settings = await ensureSettings(user._id);

  if (payload.profileVisibility !== undefined) {
    if (!profileVisibilityValues.includes(payload.profileVisibility)) {
      throw new AppError("Invalid profile visibility", 400);
    }

    profile.profileVisibility = payload.profileVisibility;
    settings.profileVisibility = payload.profileVisibility;
  }

  if (payload.privacySettings !== undefined) {
    profile.privacySettings = normalizePrivacySettings({
      ...normalizePrivacySettings(profile.privacySettings),
      ...payload.privacySettings,
    });
  }

  await Promise.all([profile.save(), settings.save()]);

  await UserActivity.create({
    description: "Updated profile privacy settings",
    type: "settings_updated",
    userId,
  });

  return getPrivacySettingsForUser(userId);
}

export async function getPublicActivityForUsername(username) {
  ensureDatabaseConnection();

  const normalizedUsername = String(username ?? "").trim().toLowerCase();

  if (!normalizedUsername) {
    throw new AppError("Username is required", 400);
  }

  const user = await User.findOne({
    accountStatus: { $nin: ["suspended", "deleted"] },
    isSuspended: { $ne: true },
    username: normalizedUsername,
  });

  if (!user) {
    throw new AppError("Profile not found", 404);
  }

  assertProfileAccountAvailable(user);

  const settings = await ensureSettings(user._id);
  const profile = await ensureProfile(user);
  const visibilityValue = settings.profileVisibility ?? profile.profileVisibility ?? "public";
  const visibility = profileVisibilityValues.includes(visibilityValue) ? visibilityValue : "private";
  const privacySettings = normalizePrivacySettings(profile.privacySettings);

  if (visibility === "hidden") {
    throw new AppError("Profile not found", 404);
  }

  if (visibility !== "public") {
    throw new AppError("This profile is private", 403);
  }

  if (!privacySettings.showActivity) {
    return normalizeActivitySummary({}, {
      includePrivate: false,
    });
  }

  return normalizeActivitySummary(profile.activitySummary, {
    includePrivate: false,
  });
}

export async function getVerificationStatusForUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);

  return serializeVerificationBadge(profile.verificationBadge, {
    includePrivate: true,
  });
}

export async function requestVerificationForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const currentStatus = profile.verificationBadge?.status ?? "none";

  if (currentStatus === "verified") {
    throw new AppError("Profile is already verified", 400);
  }

  profile.verificationBadge = {
    ...(profile.verificationBadge?.toObject?.() ?? profile.verificationBadge ?? {}),
    label: "Verified",
    rejectedAt: null,
    rejectionReason: "",
    requestNote: trimString(payload.requestNote, 1000),
    requestedAt: new Date(),
    reviewedAt: null,
    reviewedBy: null,
    status: "pending",
    supportingLinks: normalizeStringList(payload.supportingLinks, 5, 500),
    verificationType: trimString(payload.verificationType || "identity", 40),
    verifiedAt: null,
    website: trimString(payload.website, 500),
  };

  await profile.save();

  await UserActivity.create({
    description: "Requested profile verification",
    type: "profile_updated",
    userId,
  });

  return serializeVerificationBadge(profile.verificationBadge, {
    includePrivate: true,
  });
}

export async function updateUserProfileAboutForUser(userId, bio) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const normalizedBio = trimString(bio, 2000);

  if (!normalizedBio) {
    throw new AppError("About section cannot be empty", 400);
  }

  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.bio = normalizedBio;
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Updated profile about section",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);

  return buildProfileResponse({ profile, settings, user });
}

export async function updateUserProfileSkillsForUser(userId, skills = []) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const normalizedSkills = normalizeEditableProfileSkills(skills, profile.skills);
  const isProvider = normalizeRole(user.role) === "provider";
  const providerProfile = isProvider ? await ensureProviderProfile(user, profile) : null;

  profile.skills = normalizedSkills;
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  if (providerProfile) {
    providerProfile.skills = normalizedSkills.map((skill) => skill.name);
    providerProfile.categories = normalizeStringList(
      providerProfile.categories?.length ? providerProfile.categories : normalizedSkills.map((skill) => skill.name),
      12,
      64,
    );
    await providerProfile.save();
  }

  await UserActivity.create({
    description: "Updated profile skills",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);

  return buildProfileResponse({ profile, settings, user });
}

export async function addExperienceForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;
  const nextItem = {
    _id: new mongoose.Types.ObjectId(),
    ...normalizeExperienceItem(payload, profile.experience?.length ?? 0),
  };

  profile.experience = sortExperienceItems([...(profile.experience ?? []), nextItem]);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Added profile experience",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function updateExperienceForUser(userId, experienceId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.experience ?? []).findIndex(
    (item) => getItemId(item) === String(experienceId),
  );

  if (itemIndex < 0) {
    throw new AppError("Experience item not found", 404);
  }

  const currentItem = profile.experience[itemIndex];
  const normalizedItem = normalizeExperienceItem(
    {
      ...currentItem.toObject?.(),
      ...payload,
    },
    currentItem.order ?? itemIndex,
  );
  const nextItems = [...profile.experience];
  nextItems[itemIndex] = {
    _id: currentItem._id,
    ...normalizedItem,
  };
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.experience = sortExperienceItems(nextItems);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Updated profile experience",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function deleteExperienceForUser(userId, experienceId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.experience ?? []).findIndex(
    (item) => getItemId(item) === String(experienceId),
  );

  if (itemIndex < 0) {
    throw new AppError("Experience item not found", 404);
  }

  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.experience = sortExperienceItems(
    profile.experience.filter((_, index) => index !== itemIndex),
  );
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Deleted profile experience",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function addEducationForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;
  const nextItem = {
    _id: new mongoose.Types.ObjectId(),
    ...normalizeEducationItem(payload, profile.education?.length ?? 0),
  };

  profile.education = sortEducationItems([...(profile.education ?? []), nextItem]);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Added profile education",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function updateEducationForUser(userId, educationId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.education ?? []).findIndex(
    (item) => getItemId(item) === String(educationId),
  );

  if (itemIndex < 0) {
    throw new AppError("Education item not found", 404);
  }

  const currentItem = profile.education[itemIndex];
  const normalizedItem = normalizeEducationItem(
    {
      ...currentItem.toObject?.(),
      ...payload,
    },
    currentItem.order ?? itemIndex,
  );
  const nextItems = [...profile.education];
  nextItems[itemIndex] = {
    _id: currentItem._id,
    ...normalizedItem,
  };
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.education = sortEducationItems(nextItems);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Updated profile education",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function deleteEducationForUser(userId, educationId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.education ?? []).findIndex(
    (item) => getItemId(item) === String(educationId),
  );

  if (itemIndex < 0) {
    throw new AppError("Education item not found", 404);
  }

  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.education = sortEducationItems(
    profile.education.filter((_, index) => index !== itemIndex),
  );
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Deleted profile education",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function addServiceForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;
  const nextItem = {
    _id: new mongoose.Types.ObjectId(),
    ...normalizeServiceItem(payload, profile.services?.length ?? 0),
  };

  profile.services = sortServiceItems([...(profile.services ?? []), nextItem]);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Added profile service",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function updateServiceForUser(userId, serviceId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.services ?? []).findIndex(
    (item) => getItemId(item) === String(serviceId),
  );

  if (itemIndex < 0) {
    throw new AppError("Service item not found", 404);
  }

  const currentItem = profile.services[itemIndex];
  const normalizedItem = normalizeServiceItem(
    {
      ...currentItem.toObject?.(),
      ...payload,
    },
    currentItem.order ?? itemIndex,
  );
  const nextItems = [...profile.services];
  nextItems[itemIndex] = {
    _id: currentItem._id,
    ...normalizedItem,
  };
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.services = sortServiceItems(nextItems);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Updated profile service",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function deleteServiceForUser(userId, serviceId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const itemIndex = (profile.services ?? []).findIndex(
    (item) => getItemId(item) === String(serviceId),
  );

  if (itemIndex < 0) {
    throw new AppError("Service item not found", 404);
  }

  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.services = sortServiceItems(
    profile.services.filter((_, index) => index !== itemIndex),
  );
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Deleted profile service",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function updateOpenToForUser(userId, payload = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const providerProfile =
    normalizeRole(user.role) === "provider" ? await ensureProviderProfile(user, profile) : null;

  profile.openTo = normalizeOpenTo(payload);
  profile.profileCompletion = calculateProfileCompletion(profile, user, providerProfile);
  await profile.save();

  await UserActivity.create({
    description: "Updated open to preferences",
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  return buildProfileResponse({ profile, settings, user });
}

export async function updateUserProfileForUser(userId, profileData = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertProfileAccountAvailable(user);

  const profile = await ensureProfile(user);
  const userUpdates = {};
  const profileUpdates = {};

  if (profileData.fullName !== undefined || profileData.name !== undefined) {
    const fullName = trimString(profileData.fullName ?? profileData.name, 80);

    if (fullName.length < 2) {
      throw new AppError("Name must be at least 2 characters", 400);
    }

    userUpdates.fullName = fullName;
    userUpdates.name = fullName;
  }

  if (profileData.username !== undefined) {
    const username = trimString(profileData.username, 32).toLowerCase();

    if (username.length < 3) {
      throw new AppError("Username must be at least 3 characters", 400);
    }

    const usernameOwner = await User.findOne({
      _id: { $ne: user._id },
      username,
    }).lean();

    if (usernameOwner) {
      throw new AppError("This username is already taken", 409);
    }

    userUpdates.username = username;
  }

  if (profileData.bio !== undefined) {
    profileUpdates.bio = trimString(profileData.bio, 2000);
  }

  if (profileData.headline !== undefined) {
    profileUpdates.headline = trimString(profileData.headline, 180);
  }

  if (profileData.company !== undefined) {
    profileUpdates.company = trimString(profileData.company, 120);
    profileUpdates.companyName = profileUpdates.company;
    profileUpdates.currentCompany = profileUpdates.company;
  }

  if (profileData.companyName !== undefined) {
    profileUpdates.companyName = trimString(profileData.companyName, 120);
  }

  if (profileData.currentCompany !== undefined) {
    profileUpdates.currentCompany = trimString(profileData.currentCompany, 120);
  }

  if (profileData.currentPosition !== undefined) {
    profileUpdates.currentPosition = trimString(profileData.currentPosition, 120);
  }

  if (profileData.educationHeadline !== undefined) {
    profileUpdates.educationHeadline = trimString(profileData.educationHeadline, 160);
  }

  if (profileData.industry !== undefined) {
    profileUpdates.industry = trimString(profileData.industry, 80);
  }

  if (profileData.businessType !== undefined) {
    if (!businessTypeValues.includes(profileData.businessType)) {
      throw new AppError("Invalid business type", 400);
    }

    profileUpdates.businessType = profileData.businessType;
  }

  if (profileData.location !== undefined) {
    profileUpdates.location = normalizeLocation(profileData.location);
  }

  if (profileData.phone !== undefined) {
    profileUpdates.phone = trimString(profileData.phone, 30);
  }

  if (profileData.website !== undefined) {
    profileUpdates.website = trimString(profileData.website, 240);
  }

  if (profileData.availabilityStatus !== undefined) {
    if (!["available", "busy", "unavailable"].includes(profileData.availabilityStatus)) {
      throw new AppError("Invalid availability status", 400);
    }

    profileUpdates.availabilityStatus = profileData.availabilityStatus;
  }

  if (profileData.skills !== undefined) {
    profileUpdates.skills = normalizeProfileSkills(profileData.skills);
  }

  if (profileData.socialLinks !== undefined) {
    profileUpdates.socialLinks = normalizeSocialLinks(profileData.socialLinks);
  }

  if (profileData.experience !== undefined) {
    profileUpdates.experience = normalizeExperience(profileData.experience);
  }

  if (profileData.education !== undefined) {
    profileUpdates.education = normalizeEducation(profileData.education);
  }

  if (profileData.services !== undefined) {
    profileUpdates.services = normalizeServices(profileData.services);
  }

  if (profileData.openTo !== undefined) {
    profileUpdates.openTo = normalizeOpenTo(profileData.openTo);
  }

  const isProvider = normalizeRole(user.role) === "provider";
  const providerProfileUpdates = isProvider
    ? normalizeProviderProfileData(profileData.providerProfile, profileData)
    : {};

  let settings = await ensureSettings(user._id);

  if (profileData.profileVisibility !== undefined) {
    if (!profileVisibilityValues.includes(profileData.profileVisibility)) {
      throw new AppError("Invalid profile visibility", 400);
    }

    settings.profileVisibility = profileData.profileVisibility;
    profileUpdates.profileVisibility = profileData.profileVisibility;
    await settings.save();
  }

  if (Object.keys(userUpdates).length > 0) {
    Object.assign(user, userUpdates);
    await user.save();
  }

  if (Object.keys(profileUpdates).length > 0) {
    Object.assign(profile, profileUpdates);
    await profile.save();
  }

  if (isProvider) {
    const providerProfile = await ensureProviderProfile(user, profile);

    if (
      profileData.skills !== undefined &&
      profileData.providerProfile?.skills === undefined
    ) {
      providerProfileUpdates.skills = normalizeSkills(profileData.skills);
    }

    if (
      profileData.headline !== undefined &&
      profileData.providerProfile?.title === undefined &&
      !providerProfile.title
    ) {
      providerProfileUpdates.title = profileUpdates.headline;
    }

    if (Object.keys(providerProfileUpdates).length > 0) {
      Object.assign(providerProfile, providerProfileUpdates);
      await providerProfile.save();
    }
  }

  await UserActivity.create({
    description: "Updated profile information",
    type: "profile_updated",
    userId,
  });

  return buildProfileResponse({ profile, settings, user });
}

export async function updateUserProfileForAdmin(userId, profileData = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  const profile = await ensureProfile(user);
  const userUpdates = {};
  const profileUpdates = {};

  if (profileData.fullName !== undefined || profileData.name !== undefined) {
    const fullName = trimString(profileData.fullName ?? profileData.name, 80);

    if (fullName.length < 2) {
      throw new AppError("Name must be at least 2 characters", 400);
    }

    userUpdates.fullName = fullName;
    userUpdates.name = fullName;
  }

  if (profileData.username !== undefined) {
    const username = trimString(profileData.username, 32).toLowerCase();

    if (username.length < 3) {
      throw new AppError("Username must be at least 3 characters", 400);
    }

    userUpdates.username = username;
  }

  if (profileData.bio !== undefined) {
    profileUpdates.bio = trimString(profileData.bio, 1200);
  }

  if (profileData.headline !== undefined) {
    profileUpdates.headline = trimString(profileData.headline, 160);
  }

  if (profileData.company !== undefined) {
    profileUpdates.company = trimString(profileData.company, 140);
    profileUpdates.companyName = profileUpdates.company;
    profileUpdates.currentCompany = profileUpdates.company;
  }

  if (profileData.companyName !== undefined) {
    profileUpdates.companyName = trimString(profileData.companyName, 140);
  }

  if (profileData.currentCompany !== undefined) {
    profileUpdates.currentCompany = trimString(profileData.currentCompany, 140);
  }

  if (profileData.currentPosition !== undefined) {
    profileUpdates.currentPosition = trimString(profileData.currentPosition, 140);
  }

  if (profileData.educationHeadline !== undefined) {
    profileUpdates.educationHeadline = trimString(profileData.educationHeadline, 160);
  }

  if (profileData.industry !== undefined) {
    profileUpdates.industry = trimString(profileData.industry, 120);
  }

  if (profileData.businessType !== undefined) {
    profileUpdates.businessType = trimString(profileData.businessType, 80);
  }

  if (profileData.location !== undefined) {
    profileUpdates.location = trimString(profileData.location, 140);
  }

  if (profileData.phone !== undefined) {
    profileUpdates.phone = trimString(profileData.phone, 80);
  }

  if (profileData.website !== undefined) {
    profileUpdates.website = trimString(profileData.website, 240);
  }

  if (profileData.availabilityStatus !== undefined) {
    if (!["available", "busy", "unavailable"].includes(profileData.availabilityStatus)) {
      throw new AppError("Invalid availability status", 400);
    }

    profileUpdates.availabilityStatus = profileData.availabilityStatus;
  }

  if (profileData.skills !== undefined) {
    profileUpdates.skills = normalizeSkills(profileData.skills);
  }

  if (profileData.socialLinks !== undefined) {
    profileUpdates.socialLinks = normalizeSocialLinks(profileData.socialLinks);
  }

  if (profileData.experience !== undefined) {
    profileUpdates.experience = normalizeExperience(profileData.experience);
  }

  if (profileData.education !== undefined) {
    profileUpdates.education = normalizeEducation(profileData.education);
  }

  if (Object.keys(userUpdates).length > 0) {
    Object.assign(user, userUpdates);
    await user.save();
  }

  if (Object.keys(profileUpdates).length > 0) {
    Object.assign(profile, profileUpdates);
    await profile.save();
  }

  const settings = await ensureSettings(user._id);

  await UserActivity.create({
    description: "Admin updated profile information",
    type: "profile_updated",
    userId,
  });

  return {
    profile: serializeProfile(profile),
    settings: serializeSettings(settings),
    user: serializeUser(user),
  };
}

export async function updateUserSettingsForAdmin(userId, settingsData = {}) {
  ensureDatabaseConnection();

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  const settings = await ensureSettings(user._id);
  const updates = {};

  if (settingsData.profileVisibility !== undefined) {
    if (!profileVisibilityValues.includes(settingsData.profileVisibility)) {
      throw new AppError("Invalid profile visibility", 400);
    }

    updates.profileVisibility = settingsData.profileVisibility;
  }

  if (typeof settingsData.emailNotifications === "boolean") {
    updates.emailNotifications = settingsData.emailNotifications;
  }

  if (typeof settingsData.darkMode === "boolean") {
    updates.darkMode = settingsData.darkMode;
  }

  if (typeof settingsData.twoFactorEnabled === "boolean") {
    updates.twoFactorEnabled = settingsData.twoFactorEnabled;
  }

  if (settingsData.language !== undefined) {
    updates.language = trimString(settingsData.language, 12) || "en";
  }

  Object.assign(settings, updates);
  await settings.save();

  await UserActivity.create({
    description: "Admin updated profile visibility settings",
    type: "settings_updated",
    userId,
  });

  return {
    settings: serializeSettings(settings),
    user: serializeUser(user),
  };
}

export async function removeUserProfileMediaForAdmin(userId, type) {
  ensureDatabaseConnection();

  if (!["avatar", "cover", "document"].includes(type)) {
    throw new AppError("Media type must be avatar, cover, or document", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  const profile = await ensureProfile(user);
  const mediaRecords = await UserMedia.find({ type, userId }).lean();

  await Promise.all(mediaRecords.map((media) => deleteProfileAsset(media.publicId)));

  await UserMedia.deleteMany({ type, userId });

  if (type === "avatar") {
    user.avatar = "";
    profile.profilePicture = "";
  }

  if (type === "cover") {
    profile.coverImage = "";
  }

  await Promise.all([user.save(), profile.save()]);

  await UserActivity.create({
    description: `Admin removed ${type} media`,
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);

  return {
    profile: serializeProfile(profile),
    settings: serializeSettings(settings),
    user: serializeUser(user),
  };
}

export async function updateUserProfileMediaForUser(userId, { baseUrl = "", file, type } = {}) {
  ensureDatabaseConnection();

  if (!file) {
    throw new AppError("Image file is required", 400);
  }

  if (!["avatar", "cover"].includes(type)) {
    throw new AppError("Media type must be avatar or cover", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  if (user.isSuspended) {
    throw new AppError("This account has been suspended", 403);
  }

  const profile = await ensureProfile(user);
  const previousMedia = await UserMedia.find({ type, userId }).lean();
  const existingCoverPublicId =
    type === "cover" ? normalizeMedia(profile.coverImage).publicId : "";
  const previousPublicIds = [
    ...previousMedia.map((media) => media.publicId),
    existingCoverPublicId,
  ].filter(Boolean);

  await Promise.all([...new Set(previousPublicIds)].map((publicId) => deleteProfileAsset(publicId)));
  await UserMedia.deleteMany({ type, userId });

  const cloudinaryUpload = await uploadProfileAsset({
    file,
    type,
    userId,
  });
  const url = cloudinaryUpload?.secureUrl ?? buildPublicUploadUrl(file, baseUrl);
  const media = await UserMedia.create({
    provider: cloudinaryUpload ? "cloudinary" : "local",
    publicId: cloudinaryUpload?.publicId ?? "",
    size: cloudinaryUpload?.bytes ?? file.size,
    type,
    url,
    userId,
  });

  if (type === "avatar") {
    user.avatar = url;
    profile.profilePicture = url;
  }

  if (type === "cover") {
    profile.coverImage = {
      publicId: cloudinaryUpload?.publicId ?? "",
      url,
    };
  }

  await Promise.all([user.save(), profile.save()]);

  await UserActivity.create({
    description: `Updated ${type === "avatar" ? "profile picture" : "cover image"}`,
    type: "profile_updated",
    userId,
  });

  const settings = await ensureSettings(user._id);
  const profileResponse = await buildProfileResponse({ profile, settings, user });

  return {
    ...profileResponse,
    media,
  };
}
