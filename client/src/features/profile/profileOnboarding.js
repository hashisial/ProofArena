import {
  PROFILE_ONBOARDING_STEP_MAP,
  PROFILE_ONBOARDING_STEP_ORDER,
  PROFILE_ONBOARDING_STEPS,
  PROFILE_SECTIONS,
} from "../../config/profile/index.js";
import {
  PROFILE_PRIVACY_LEVEL,
  PROFILE_SECTION_KEY,
} from "../../types/profile.js";

const implementedStepIds = new Set([
  "accountType",
  "personalInformation",
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
  "serviceCategories",
  "outcomeOffers",
  "pricingModels",
  "deliveryTimelines",
  "revisionPolicies",
  "portfolio",
  "caseStudies",
  "certifications",
  "achievements",
]);

const placeholderStepIds = new Set([
  "profilePhoto",
  "coverBanner",
  "skillVerification",
  "proofVault",
]);

export function getStepPath(step) {
  return `/dashboard/profile/onboarding/${step.routeSegment}`;
}

export function getOnboardingStepBySegment(segment) {
  const normalizedSegment = String(segment ?? "").trim();
  return PROFILE_ONBOARDING_STEPS.find((step) => step.routeSegment === normalizedSegment) ?? null;
}

export function getNextStep(stepId) {
  const index = PROFILE_ONBOARDING_STEP_ORDER.indexOf(stepId);
  if (index < 0) {
    return PROFILE_ONBOARDING_STEPS[0] ?? null;
  }

  const nextId = PROFILE_ONBOARDING_STEP_ORDER[index + 1];
  return nextId ? PROFILE_ONBOARDING_STEP_MAP[nextId] : null;
}

export function getPreviousStep(stepId) {
  const index = PROFILE_ONBOARDING_STEP_ORDER.indexOf(stepId);
  if (index <= 0) {
    return null;
  }

  return PROFILE_ONBOARDING_STEP_MAP[PROFILE_ONBOARDING_STEP_ORDER[index - 1]] ?? null;
}

export function isStepImplemented(stepId) {
  return implementedStepIds.has(stepId);
}

export function isStepPlaceholder(stepId) {
  return placeholderStepIds.has(stepId);
}

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getProfilePayload(profileData) {
  return profileData?.profile ?? {};
}

export function getSectionValue(profile, sectionKey) {
  if (!profile) {
    return {};
  }

  if (sectionKey === PROFILE_SECTION_KEY.SKILLS) {
    return profile.skillsProfile ?? profile.skills ?? {};
  }

  if (sectionKey === PROFILE_SECTION_KEY.SERVICES) {
    return profile.servicesProfile ?? profile.services ?? {};
  }

  if (sectionKey === PROFILE_SECTION_KEY.PROOF) {
    return profile.proofProfile ?? profile.proof ?? {};
  }

  return profile[sectionKey] ?? {};
}

export function getCompletedStepIds(profile) {
  const completed = profile?.onboardingProgress?.completedStepIds ?? profile?.onboarding?.completedStepIds;
  return Array.from(new Set(asArray(completed).filter(Boolean)));
}

export function getSkippedStepIds(profile) {
  const skipped = profile?.onboardingProgress?.skippedStepIds ?? profile?.onboarding?.skippedStepIds;
  return Array.from(new Set(asArray(skipped).filter(Boolean)));
}

export function buildCompletedStepIds(profile, stepId) {
  return Array.from(new Set([...getCompletedStepIds(profile), stepId]));
}

export function buildSkippedStepIds(profile, stepId) {
  return Array.from(new Set([...getSkippedStepIds(profile), stepId]));
}

export function calculateSectionProgress(completedStepIds) {
  const completedSet = new Set(completedStepIds);

  return PROFILE_SECTIONS.map((section) => {
    const completedSteps = section.steps.filter((stepId) => completedSet.has(stepId));
    const percent = section.steps.length
      ? Math.round((completedSteps.length / section.steps.length) * 100)
      : 0;

    return {
      completedStepIds: completedSteps,
      percent,
      sectionKey: section.key,
    };
  });
}

export function calculateOverallProgress(profile) {
  const completedSet = new Set(getCompletedStepIds(profile));
  const completedWeight = PROFILE_ONBOARDING_STEPS.reduce(
    (sum, step) => sum + (completedSet.has(step.id) ? step.completionWeight : 0),
    0,
  );
  const totalWeight = PROFILE_ONBOARDING_STEPS.reduce(
    (sum, step) => sum + step.completionWeight,
    0,
  );

  return totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

export function getStepStatus(profile, step) {
  const completedSet = new Set(getCompletedStepIds(profile));
  const skippedSet = new Set(getSkippedStepIds(profile));

  if (completedSet.has(step.id)) {
    return "completed";
  }

  if (skippedSet.has(step.id)) {
    return "skipped";
  }

  return "not_started";
}

export function isPublicFacingStep(step) {
  return [PROFILE_PRIVACY_LEVEL.PUBLIC, PROFILE_PRIVACY_LEVEL.MIXED].includes(step.privacyLevel);
}

export function parseLines(value) {
  return String(value ?? "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatTagList(value) {
  return asArray(value)
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean)
    .join("\n");
}

export function formatStringList(value) {
  return asArray(value)
    .map((item) => (typeof item === "string" ? item : item?.title ?? item?.name))
    .filter(Boolean)
    .join("\n");
}

export function formatPublicAssetList(value) {
  return asArray(value)
    .map((item) => {
      if (typeof item === "string") {
        return item;
      }

      return [item?.title, item?.url, item?.description].filter(Boolean).join(" | ");
    })
    .filter(Boolean)
    .join("\n");
}

export function parseTagList(value) {
  return parseLines(value).map((name) => ({
    isPublic: true,
    name,
    source: "owner",
  }));
}

export function parsePublicAssetList(value) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", url = "", description = ""] = line.split("|").map((part) => part.trim());
      return {
        description,
        isPublic: true,
        title,
        url,
      };
    })
    .filter((item) => item.title);
}

export function validateStepPayload(step, values) {
  const errors = {};
  const required = (field, message) => {
    if (!String(values[field] ?? "").trim()) {
      errors[field] = message;
    }
  };

  switch (step.id) {
    case "accountType":
      required("accountType", "Choose the account type.");
      break;
    case "personalInformation":
      required("displayName", "Display name is required.");
      required("username", "Username is required.");
      break;
    case "contactInformation":
      required("contactEmail", "A private contact email is required.");
      break;
    case "professionalHeadline":
      required("headline", "Write a client-facing headline.");
      break;
    case "bio":
      required("bio", "Write a short professional bio.");
      if (values.bio && String(values.bio).trim().length < 80) {
        errors.bio = "Use at least 80 characters so clients understand your positioning.";
      }
      break;
    case "industry":
      required("industry", "Choose or enter an industry.");
      break;
    case "niche":
      required("niche", "Describe your specific niche.");
      break;
    case "targetClient":
      required("targetClient", "Describe the client segment you serve best.");
      break;
    case "skills":
      if (parseLines(values.skills).length < 3) {
        errors.skills = "Add at least three core skills.";
      }
      break;
    case "experienceLevels":
      if (parseLines(values.skillLevels).length < 1) {
        errors.skillLevels = "Add at least one skill level, for example: SEO | advanced.";
      }
      break;
    case "serviceCategories":
      if (parseLines(values.serviceCategories).length < 1) {
        errors.serviceCategories = "Add at least one service category.";
      }
      break;
    case "deliveryTimelines":
      if (parseLines(values.deliveryTimelines).length < 1) {
        errors.deliveryTimelines = "Add at least one delivery timeline.";
      }
      break;
    default:
      break;
  }

  return errors;
}

export function buildStepSectionPayload(step, values) {
  switch (step.id) {
    case "accountType":
      return { accountType: values.accountType };
    case "personalInformation":
      return {
        displayName: values.displayName,
        firstName: values.firstName,
        language: values.language || "en",
        lastName: values.lastName,
        timezone: values.timezone,
        username: values.username,
      };
    case "contactInformation":
      return {
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        location: {
          city: values.city,
          country: values.country,
          state: values.state,
          timezone: values.timezone,
        },
        timezone: values.timezone,
      };
    case "professionalHeadline":
      return { headline: values.headline };
    case "bio":
      return { bio: values.bio };
    case "industry":
      return { industry: values.industry };
    case "niche":
      return { niche: values.niche };
    case "targetClient":
      return { targetClient: values.targetClient };
    case "skills":
      return { skills: parseTagList(values.skills) };
    case "tools":
      return { tools: parseTagList(values.tools) };
    case "platforms":
      return { platforms: parseTagList(values.platforms) };
    case "experienceLevels":
      return { skillLevels: parseTagList(values.skillLevels) };
    case "serviceCategories":
      return { serviceCategories: parseLines(values.serviceCategories) };
    case "outcomeOffers":
      return { services: parsePublicAssetList(values.services) };
    case "pricingModels":
      return { pricingModels: parseLines(values.pricingModels) };
    case "deliveryTimelines":
      return { deliveryTimelines: parseLines(values.deliveryTimelines) };
    case "revisionPolicies":
      return { revisionPolicies: parseLines(values.revisionPolicies) };
    case "portfolio":
      return { portfolioItems: parsePublicAssetList(values.portfolioItems) };
    case "caseStudies":
      return { caseStudies: parsePublicAssetList(values.caseStudies) };
    case "certifications":
      return { certifications: parsePublicAssetList(values.certifications) };
    case "achievements":
      return { achievements: parsePublicAssetList(values.achievements) };
    default:
      return {};
  }
}
