// @ts-check

import {
  PROFILE_PRIVACY_LEVEL,
  PROFILE_SECTION_KEY,
} from "../../types/profile.js";
import { PROFILE_ONBOARDING_STEP_IDS } from "./profileSections.js";

function freezeList(list) {
  return Object.freeze(list);
}

function rule(config) {
  return Object.freeze({
    ...config,
    fields: freezeList(config.fields ?? []),
    onboardingSteps: freezeList(config.onboardingSteps ?? []),
    dependsOnRules: freezeList(config.dependsOnRules ?? []),
  });
}

export const PROFILE_COMPLETION_RULE_CATEGORY = Object.freeze({
  REQUIRED_FOR_DRAFT: "requiredForDraft",
  REQUIRED_FOR_PUBLISH: "requiredForPublish",
  RECOMMENDED_FOR_TRUST: "recommendedForTrust",
  RECOMMENDED_FOR_MATCHING: "recommendedForMatching",
  PUBLIC_SAFETY: "publicSafety",
});

export const PROFILE_PUBLISH_REQUIRED_SECTIONS = Object.freeze([
  PROFILE_SECTION_KEY.IDENTITY,
  PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY,
  PROFILE_SECTION_KEY.SKILLS,
  PROFILE_SECTION_KEY.SERVICES,
  PROFILE_SECTION_KEY.REVIEW_PUBLISH,
]);

export const PROFILE_RECOMMENDED_SECTIONS = Object.freeze([
  PROFILE_SECTION_KEY.PROOF,
  PROFILE_SECTION_KEY.BUSINESS_READINESS,
  PROFILE_SECTION_KEY.TRUST_VERIFICATION,
  PROFILE_SECTION_KEY.GROWTH_INTELLIGENCE,
]);

/** @type {import("../../types/profile.js").ProfileCompletionRules} */
export const PROFILE_COMPLETION_RULES = Object.freeze({
  requiredForDraft: freezeList([
    rule({
      id: "profile.identity.account_type",
      label: "Select account type",
      description: "A profile must know whether it represents a provider, client, or future organization account.",
      section: PROFILE_SECTION_KEY.IDENTITY,
      fields: ["ownerType", "role"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.ACCOUNT_TYPE],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.INTERNAL,
      completionWeight: 2,
    }),
    rule({
      id: "profile.identity.personal_information",
      label: "Add personal information",
      description: "Owner-editable identity basics are required before a profile can be reviewed.",
      section: PROFILE_SECTION_KEY.IDENTITY,
      fields: ["identity.displayName", "identity.username"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.PERSONAL_INFORMATION],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.MIXED,
      completionWeight: 4,
    }),
    rule({
      id: "profile.identity.contact_information",
      label: "Confirm contact information",
      description: "Contact details stay private by default but are needed for account support and verification readiness.",
      section: PROFILE_SECTION_KEY.IDENTITY,
      fields: ["identity.email"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.CONTACT_INFORMATION],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PRIVATE,
      completionWeight: 3,
    }),
  ]),
  requiredForPublish: freezeList([
    rule({
      id: "profile.professional.headline",
      label: "Write a professional headline",
      description: "A public profile needs a concise positioning statement before it can be published.",
      section: PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY,
      fields: ["professionalIdentity.headline"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.PROFESSIONAL_HEADLINE],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PUBLIC,
      completionWeight: 3,
    }),
    rule({
      id: "profile.professional.bio",
      label: "Write profile bio",
      description: "The bio establishes expertise, credibility, and provider-market fit.",
      section: PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY,
      fields: ["professionalIdentity.bio"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.BIO],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PUBLIC,
      completionWeight: 4,
    }),
    rule({
      id: "profile.professional.market_positioning",
      label: "Define market positioning",
      description: "Industry, niche, and target client signals prepare the profile for future discovery and matching.",
      section: PROFILE_SECTION_KEY.PROFESSIONAL_IDENTITY,
      fields: [
        "professionalIdentity.industry",
        "professionalIdentity.niche",
        "professionalIdentity.targetClient",
      ],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.INDUSTRY,
        PROFILE_ONBOARDING_STEP_IDS.NICHE,
        PROFILE_ONBOARDING_STEP_IDS.TARGET_CLIENT,
      ],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PUBLIC,
      completionWeight: 5,
    }),
    rule({
      id: "profile.skills.core_skills",
      label: "Add core skills",
      description: "Core skills are required for profile search, matching, and future proof scoring.",
      section: PROFILE_SECTION_KEY.SKILLS,
      fields: ["skillsProfile.skills"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.SKILLS],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PUBLIC,
      completionWeight: 4,
    }),
    rule({
      id: "profile.services.service_categories",
      label: "Select service categories",
      description: "Service categories connect profile positioning with future outcome offers and challenge matching.",
      section: PROFILE_SECTION_KEY.SERVICES,
      fields: ["servicesProfile.serviceCategories"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.SERVICE_CATEGORIES],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PUBLIC,
      completionWeight: 4,
    }),
    rule({
      id: "profile.publish.public_review",
      label: "Complete public-safe review",
      description: "The final publish gate must confirm that private fields, internal checks, and unpublished proof are not exposed.",
      section: PROFILE_SECTION_KEY.REVIEW_PUBLISH,
      fields: ["visibility", "status", "publicProfileReview.completedAt"],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.MISSING_REQUIREMENTS_CHECK,
        PROFILE_ONBOARDING_STEP_IDS.PUBLISH_PROFILE,
      ],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.INTERNAL,
      completionWeight: 6,
    }),
  ]),
  recommendedForTrust: freezeList([
    rule({
      id: "profile.proof.portfolio",
      label: "Prepare portfolio foundation",
      description: "Portfolio and case-study structure will later connect to proof assets, credibility signals, and provider reputation.",
      section: PROFILE_SECTION_KEY.PROOF,
      fields: ["proofProfile.portfolioItems", "proofProfile.caseStudies"],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.PORTFOLIO,
        PROFILE_ONBOARDING_STEP_IDS.CASE_STUDIES,
      ],
      blocking: false,
      privacyLevel: PROFILE_PRIVACY_LEVEL.MIXED,
      completionWeight: 5,
    }),
    rule({
      id: "profile.proof.certifications",
      label: "Add certifications and achievements",
      description: "Certifications and achievements prepare the trust layer without implying verification until later workflows exist.",
      section: PROFILE_SECTION_KEY.PROOF,
      fields: ["proofProfile.certifications", "proofProfile.achievements"],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.CERTIFICATIONS,
        PROFILE_ONBOARDING_STEP_IDS.ACHIEVEMENTS,
      ],
      blocking: false,
      privacyLevel: PROFILE_PRIVACY_LEVEL.MIXED,
      completionWeight: 4,
    }),
    rule({
      id: "profile.verification.identity",
      label: "Prepare identity verification",
      description: "Verification readiness is tracked as status metadata only until verification workflows are implemented.",
      section: PROFILE_SECTION_KEY.TRUST_VERIFICATION,
      fields: [
        "trustVerification.email.status",
        "trustVerification.phone.status",
        "trustVerification.identity.status",
      ],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.EMAIL_VERIFICATION,
        PROFILE_ONBOARDING_STEP_IDS.PHONE_VERIFICATION,
        PROFILE_ONBOARDING_STEP_IDS.ID_VERIFICATION,
      ],
      blocking: false,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PRIVATE,
      completionWeight: 5,
    }),
  ]),
  recommendedForMatching: freezeList([
    rule({
      id: "profile.business.availability",
      label: "Set availability and capacity",
      description: "Availability and capacity will later inform matching, invitations, and workload controls.",
      section: PROFILE_SECTION_KEY.BUSINESS_READINESS,
      fields: ["businessReadiness.availability", "businessReadiness.capacity"],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.AVAILABILITY,
        PROFILE_ONBOARDING_STEP_IDS.CAPACITY,
      ],
      blocking: false,
      privacyLevel: PROFILE_PRIVACY_LEVEL.MIXED,
      completionWeight: 4,
    }),
    rule({
      id: "profile.matching.preferences",
      label: "Define matching preferences",
      description: "Preferred industries, budgets, client types, and project length prepare the profile for future smart matching.",
      section: PROFILE_SECTION_KEY.GROWTH_INTELLIGENCE,
      fields: [
        "matchingPreferences.preferredIndustries",
        "matchingPreferences.preferredBudgetRange",
        "matchingPreferences.preferredClientTypes",
        "matchingPreferences.preferredProjectLength",
      ],
      onboardingSteps: [
        PROFILE_ONBOARDING_STEP_IDS.PREFERRED_INDUSTRIES,
        PROFILE_ONBOARDING_STEP_IDS.PREFERRED_BUDGET_RANGE,
        PROFILE_ONBOARDING_STEP_IDS.PREFERRED_CLIENT_TYPE,
        PROFILE_ONBOARDING_STEP_IDS.PREFERRED_PROJECT_LENGTH,
      ],
      blocking: false,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PRIVATE,
      completionWeight: 6,
    }),
  ]),
  publicSafety: freezeList([
    rule({
      id: "profile.public.no_private_contact",
      label: "Keep private contact fields out of public profile",
      description: "Public profile output must not expose email, phone, tax, billing, or direct payment details.",
      section: PROFILE_SECTION_KEY.REVIEW_PUBLISH,
      fields: [
        "identity.email",
        "identity.phone",
        "businessReadiness.paymentMethods",
        "businessReadiness.taxInformation",
        "businessReadiness.invoiceSettings",
      ],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.PUBLISH_PROFILE],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.PRIVATE,
      completionWeight: 0,
    }),
    rule({
      id: "profile.public.no_unpublished_proof",
      label: "Keep unpublished proof private",
      description: "Proof assets remain private unless later stages explicitly mark them public-safe.",
      section: PROFILE_SECTION_KEY.PROOF,
      fields: ["proofProfile.proofAssets"],
      onboardingSteps: [PROFILE_ONBOARDING_STEP_IDS.PROOF_VAULT],
      blocking: true,
      privacyLevel: PROFILE_PRIVACY_LEVEL.MIXED,
      completionWeight: 0,
    }),
  ]),
});

export const PROFILE_COMPLETION_RULE_CATEGORIES = Object.freeze(
  Object.keys(PROFILE_COMPLETION_RULES),
);
