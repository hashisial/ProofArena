// @ts-check

import { USER_ROLES } from "../constants/statuses.js";

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

export const PROFILE_SECTION_KEY = Object.freeze({
  BUSINESS_READINESS: "businessReadiness",
  GROWTH_INTELLIGENCE: "growthIntelligence",
  IDENTITY: "identity",
  PROFESSIONAL_IDENTITY: "professionalIdentity",
  PROOF: "proof",
  REVIEW_PUBLISH: "reviewPublish",
  SERVICES: "services",
  SKILLS: "skills",
  TRUST_VERIFICATION: "trustVerification",
});

export const ONBOARDING_STEP_STATUS = Object.freeze({
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  LOCKED: "locked",
  NEEDS_REVIEW: "needs_review",
  NOT_STARTED: "not_started",
  SKIPPED: "skipped",
});

export const VERIFICATION_STATUS = Object.freeze({
  EXPIRED: "expired",
  NOT_STARTED: "not_started",
  PENDING: "pending",
  REJECTED: "rejected",
  UNAVAILABLE: "unavailable",
  VERIFIED: "verified",
});

export const PROFILE_STRENGTH_LEVEL = Object.freeze({
  BASIC: "basic",
  EXCELLENT: "excellent",
  GOOD: "good",
  STRONG: "strong",
  WEAK: "weak",
});

export const TRUST_READINESS_LEVEL = Object.freeze({
  DEVELOPING: "developing",
  LOW: "low",
  READY: "ready",
  TRUSTED: "trusted",
  VERIFIED: "verified",
});

export const PROFILE_OWNER_TYPE = Object.freeze({
  ADMIN_MANAGED: "adminManaged",
  CLIENT: USER_ROLES.CLIENT,
  ORGANIZATION: "organization",
  PROVIDER: USER_ROLES.PROVIDER,
});

export const PROFILE_PRIVACY_LEVEL = Object.freeze({
  INTERNAL: "internal",
  MIXED: "mixed",
  PRIVATE: "private",
  PUBLIC: "public",
});

export const PROFILE_STATUS_VALUES = Object.freeze(Object.values(PROFILE_STATUS));
export const PROFILE_VISIBILITY_VALUES = Object.freeze(Object.values(PROFILE_VISIBILITY));
export const PROFILE_SECTION_KEY_VALUES = Object.freeze(Object.values(PROFILE_SECTION_KEY));
export const ONBOARDING_STEP_STATUS_VALUES = Object.freeze(Object.values(ONBOARDING_STEP_STATUS));
export const VERIFICATION_STATUS_VALUES = Object.freeze(Object.values(VERIFICATION_STATUS));
export const PROFILE_STRENGTH_LEVEL_VALUES = Object.freeze(Object.values(PROFILE_STRENGTH_LEVEL));
export const TRUST_READINESS_LEVEL_VALUES = Object.freeze(Object.values(TRUST_READINESS_LEVEL));
export const PROFILE_OWNER_TYPE_VALUES = Object.freeze(Object.values(PROFILE_OWNER_TYPE));
export const PROFILE_PRIVACY_LEVEL_VALUES = Object.freeze(Object.values(PROFILE_PRIVACY_LEVEL));

/**
 * @typedef {typeof PROFILE_STATUS[keyof typeof PROFILE_STATUS]} ProfileStatus
 * @typedef {typeof PROFILE_VISIBILITY[keyof typeof PROFILE_VISIBILITY]} ProfileVisibility
 * @typedef {typeof PROFILE_SECTION_KEY[keyof typeof PROFILE_SECTION_KEY]} ProfileSectionKey
 * @typedef {typeof ONBOARDING_STEP_STATUS[keyof typeof ONBOARDING_STEP_STATUS]} OnboardingStepStatus
 * @typedef {typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS]} VerificationStatus
 * @typedef {typeof PROFILE_STRENGTH_LEVEL[keyof typeof PROFILE_STRENGTH_LEVEL]} ProfileStrengthLevel
 * @typedef {typeof TRUST_READINESS_LEVEL[keyof typeof TRUST_READINESS_LEVEL]} TrustReadinessLevel
 * @typedef {typeof PROFILE_OWNER_TYPE[keyof typeof PROFILE_OWNER_TYPE]} ProfileOwnerType
 * @typedef {typeof PROFILE_PRIVACY_LEVEL[keyof typeof PROFILE_PRIVACY_LEVEL]} ProfilePrivacyLevel
 */

/**
 * @typedef {Readonly<{
 *   city?: string,
 *   country?: string,
 *   state?: string,
 *   timezone?: string,
 * }>} ProfileLocation
 */

/**
 * @typedef {Readonly<{
 *   userId: string,
 *   accountType: ProfileOwnerType,
 *   displayName: string,
 *   firstName?: string,
 *   lastName?: string,
 *   username: string,
 *   avatarUrl?: string,
 *   coverUrl?: string,
 *   contactEmail?: string,
 *   contactPhone?: string,
 *   location?: ProfileLocation,
 *   timezone?: string,
 *   language?: string,
 *   visibility: ProfileVisibility,
 * }>} UserProfileIdentity
 */

/**
 * @typedef {Readonly<{
 *   headline?: string,
 *   bio?: string,
 *   industry?: string,
 *   niche?: string,
 *   targetClient?: string,
 *   yearsOfExperience?: number,
 *   experienceLevel?: string,
 *   openTo?: readonly string[],
 *   availabilityStatus?: string,
 * }>} ProfessionalIdentity
 */

/**
 * @typedef {Readonly<{
 *   skills: readonly string[],
 *   tools: readonly string[],
 *   platforms: readonly string[],
 *   skillLevels: Readonly<Record<string, string>>,
 *   verifiedSkills: readonly string[],
 *   serviceCategories: readonly string[],
 * }>} SkillsProfile
 */

/**
 * @typedef {Readonly<{
 *   services: readonly string[],
 *   outcomeOfferRefs: readonly string[],
 *   pricingModels: readonly string[],
 *   deliveryTimelines: readonly string[],
 *   revisionPolicies: readonly string[],
 *   preferredProjectTypes: readonly string[],
 * }>} ServicesProfile
 */

/**
 * @typedef {Readonly<{
 *   portfolioItems: readonly string[],
 *   caseStudies: readonly string[],
 *   proofAssetRefs: readonly string[],
 *   certifications: readonly string[],
 *   achievements: readonly string[],
 *   publicProofHighlights: readonly string[],
 * }>} ProofProfile
 */

/**
 * @typedef {Readonly<{
 *   availability?: string,
 *   capacity?: string,
 *   paymentMethods: readonly string[],
 *   taxReadiness?: VerificationStatus,
 *   invoiceSettings?: Readonly<Record<string, unknown>>,
 *   preferredBudgetRange?: string,
 *   preferredClientType?: string,
 *   preferredProjectLength?: string,
 * }>} BusinessReadinessProfile
 */

/**
 * @typedef {Readonly<{
 *   emailVerification: VerificationStatus,
 *   phoneVerification: VerificationStatus,
 *   idVerification: VerificationStatus,
 *   businessVerification: VerificationStatus,
 *   socialVerification: VerificationStatus,
 *   verificationBadge: VerificationStatus,
 *   proofScore?: ProfileScorePlaceholder,
 *   trustReadinessScore?: ProfileScorePlaceholder,
 *   profileStrengthScore?: ProfileScorePlaceholder,
 * }>} TrustVerificationProfile
 */

/**
 * @typedef {Readonly<{
 *   preferredIndustries: readonly string[],
 *   preferredBudgets: readonly string[],
 *   preferredClientTypes: readonly string[],
 *   preferredProjectLengths: readonly string[],
 *   preferredChallengeTypes: readonly string[],
 *   excludedCategories: readonly string[],
 *   timezonePreference?: string,
 *   responsePreference?: string,
 * }>} MatchingPreferencesProfile
 */

/**
 * @typedef {Readonly<{
 *   aiProfileAuditStatus: "not_started" | "queued" | "completed" | "unavailable",
 *   missingRequirements: readonly MissingRequirement[],
 *   growthSuggestions: readonly RecommendedImprovement[],
 *   readinessChecklist: readonly string[],
 *   lastAuditAt?: string | null,
 * }>} GrowthIntelligenceProfile
 */

/**
 * @typedef {Readonly<{
 *   id: string,
 *   userId: string,
 *   status: ProfileStatus,
 *   visibility: ProfileVisibility,
 *   identity: UserProfileIdentity,
 *   professionalIdentity: ProfessionalIdentity,
 *   skills: SkillsProfile,
 *   services: ServicesProfile,
 *   proof: ProofProfile,
 *   businessReadiness: BusinessReadinessProfile,
 *   trustVerification: TrustVerificationProfile,
 *   matchingPreferences: MatchingPreferencesProfile,
 *   growthIntelligence: GrowthIntelligenceProfile,
 *   onboarding: ProfileOnboardingState,
 *   updatedAt?: string,
 *   publishedAt?: string | null,
 * }>} FullProviderProfileDraft
 */

/**
 * PublicProviderProfile must stay public-safe. Do not add private contact,
 * tax, payment, invoice, internal verification, unpublished proof, or private
 * matching preference fields here.
 *
 * @typedef {Readonly<{
 *   id: string,
 *   username: string,
 *   displayName: string,
 *   avatarUrl?: string,
 *   coverUrl?: string,
 *   headline?: string,
 *   bio?: string,
 *   industry?: string,
 *   niche?: string,
 *   skills: readonly string[],
 *   tools: readonly string[],
 *   platforms: readonly string[],
 *   services: readonly string[],
 *   certifications: readonly string[],
 *   achievements: readonly string[],
 *   caseStudies: readonly string[],
 *   publicProofHighlights: readonly string[],
 *   verificationBadge: VerificationStatus,
 *   proofScore?: ProfileScorePlaceholder,
 *   availabilityStatus?: string,
 *   visibility: Extract<ProfileVisibility, "public" | "limited">,
 *   publishedAt?: string | null,
 * }>} PublicProviderProfile
 */

/**
 * @typedef {Readonly<{
 *   currentStepId?: string,
 *   completedStepIds: readonly string[],
 *   skippedStepIds: readonly string[],
 *   requiredMissingStepIds: readonly string[],
 *   sectionProgress: Readonly<Record<string, SectionCompletionScore>>,
 *   status: ProfileStatus,
 *   lastUpdatedAt?: string | null,
 *   profileStrength?: ProfileScorePlaceholder,
 *   trustReadiness?: ProfileScorePlaceholder,
 * }>} ProfileOnboardingState
 */

/**
 * @typedef {Readonly<{
 *   id: string,
 *   order: number,
 *   section: ProfileSectionKey,
 *   title: string,
 *   description: string,
 *   shortLabel: string,
 *   routeSegment: string,
 *   required: boolean,
 *   skippable: boolean,
 *   dependsOn: readonly string[],
 *   unlocks: readonly string[],
 *   estimatedMinutes: number,
 *   fields: readonly string[],
 *   privacyLevel: ProfilePrivacyLevel,
 *   futureFeature?: string,
 *   stageDependency?: string,
 *   completionWeight: number,
 * }>} ProfileOnboardingStep
 */

/**
 * @typedef {Readonly<{
 *   key: ProfileSectionKey,
 *   label: string,
 *   description: string,
 *   order: number,
 *   requiredForPublish: boolean,
 *   steps: readonly string[],
 *   completionWeight: number,
 *   publicImpact: "none" | "low" | "medium" | "high",
 *   trustImpact: "none" | "low" | "medium" | "high",
 *   matchingImpact: "none" | "low" | "medium" | "high",
 * }>} ProfileSectionConfig
 */

/**
 * @typedef {Readonly<{
 *   id: string,
 *   label: string,
 *   section: ProfileSectionKey,
 *   fields: readonly string[],
 *   blocking: boolean,
 *   privacyLevel: ProfilePrivacyLevel,
 * }>} ProfileRequirementRule
 */

/**
 * @typedef {Readonly<{
 *   identityRequired: readonly ProfileRequirementRule[],
 *   professionalRequired: readonly ProfileRequirementRule[],
 *   skillsRequired: readonly ProfileRequirementRule[],
 *   servicesRequired: readonly ProfileRequirementRule[],
 *   proofRecommended: readonly ProfileRequirementRule[],
 *   verificationRecommended: readonly ProfileRequirementRule[],
 *   matchingRecommended: readonly ProfileRequirementRule[],
 *   publishBlocking: readonly ProfileRequirementRule[],
 * }>} ProfileCompletionRules
 */

/**
 * @typedef {Readonly<{
 *   value: number | null,
 *   level: ProfileStrengthLevel | TrustReadinessLevel | null,
 *   calculatedAt: string | null,
 *   source: "not_calculated" | "manual_review" | "automated_placeholder" | "future_engine",
 * }>} ProfileScorePlaceholder
 */

/**
 * @typedef {Readonly<{
 *   section: ProfileSectionKey,
 *   completedWeight: number,
 *   totalWeight: number,
 *   requiredMissingFields: readonly string[],
 *   optionalMissingFields: readonly string[],
 * }>} SectionCompletionScore
 */

/**
 * @typedef {Readonly<{
 *   id: string,
 *   section: ProfileSectionKey,
 *   field: string,
 *   label: string,
 *   severity: "blocking" | "recommended" | "optional",
 *   privacyLevel: ProfilePrivacyLevel,
 * }>} MissingRequirement
 */

/**
 * @typedef {Readonly<{
 *   id: string,
 *   section: ProfileSectionKey,
 *   label: string,
 *   description: string,
 *   priority: "low" | "medium" | "high",
 * }>} RecommendedImprovement
 */
