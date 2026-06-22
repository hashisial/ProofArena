export const PROFILE_STATUS = Object.freeze({
  DRAFT: "draft",
  HIDDEN: "hidden",
  INCOMPLETE: "incomplete",
  PUBLISHED: "published",
  REVIEW_READY: "review_ready",
  SUSPENDED: "suspended",
});

export const PROFILE_VISIBILITY = Object.freeze({
  HIDDEN: "hidden",
  LIMITED: "limited",
  PRIVATE: "private",
  PUBLIC: "public",
});

export const PROFILE_OWNER_TYPE = Object.freeze({
  ADMIN_MANAGED: "admin_managed",
  CLIENT: "client",
  ORGANIZATION: "organization",
  PROVIDER: "provider",
});

export const PROFILE_SECTION_KEY = Object.freeze({
  BUSINESS_READINESS: "businessReadiness",
  GROWTH_INTELLIGENCE: "growthIntelligence",
  IDENTITY: "identity",
  MATCHING_PREFERENCES: "matchingPreferences",
  PROFESSIONAL_IDENTITY: "professionalIdentity",
  PROOF: "proof",
  REVIEW_PUBLISH: "reviewPublish",
  SERVICES: "services",
  SKILLS: "skills",
  TRUST_VERIFICATION: "trustVerification",
});

export const PROFILE_SECTION_KEYS = Object.freeze(Object.values(PROFILE_SECTION_KEY));

export const PROFILE_ONBOARDING_STEP_IDS = Object.freeze([
  "accountType",
  "personalInformation",
  "profilePhoto",
  "coverBanner",
  "contactInformation",
  "professionalHeadline",
  "bio",
  "industry",
  "niche",
  "targetClient",
  "skills",
  "tools",
  "platforms",
  "experienceLevels",
  "skillVerification",
  "serviceCategories",
  "outcomeOffers",
  "pricingModels",
  "deliveryTimelines",
  "revisionPolicies",
  "portfolio",
  "caseStudies",
  "proofVault",
  "certifications",
  "achievements",
  "availability",
  "capacity",
  "paymentMethods",
  "taxInformation",
  "invoiceSettings",
  "emailVerification",
  "phoneVerification",
  "idVerification",
  "businessVerification",
  "socialVerification",
  "preferredIndustries",
  "preferredBudgetRange",
  "preferredClientType",
  "preferredProjectLength",
  "matchingPreferences",
  "aiProfileAudit",
  "missingRequirementsCheck",
  "profileStrengthScore",
  "trustReadinessScore",
  "publishProfile",
]);

export const PROFILE_ONBOARDING_STEP_ID_SET = Object.freeze(
  new Set(PROFILE_ONBOARDING_STEP_IDS),
);

export const PROFILE_RESTRICTED_CLIENT_FIELDS = Object.freeze([
  "userId",
  "ownerType",
  "status",
  "visibility",
  "createdAt",
  "updatedAt",
  "systemMeta",
  "skillsProfile.verifiedSkills",
  "publishState.isPublished",
  "publishState.publishedAt",
  "publishState.publicSnapshotVersion",
  "trustVerification.emailVerification.status",
  "trustVerification.phoneVerification.status",
  "trustVerification.idVerification.status",
  "trustVerification.businessVerification.status",
  "trustVerification.verificationBadge",
  "trustVerification.proofScore",
  "trustVerification.trustReadinessScore",
  "trustVerification.profileStrengthScore",
  "growthIntelligence.aiProfileAuditStatus",
  "growthIntelligence.growthSuggestions",
  "growthIntelligence.lastAuditAt",
]);
