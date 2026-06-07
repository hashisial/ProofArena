import { ROUTES } from "../constants/index.js";

const DEFAULT_HEADLINE = "Outcome-driven professional on ProofArena";
const ACTIVE_AVAILABILITY = new Set([
  "available",
  "available_now",
  "available_this_week",
  "available_next_week",
  "limited",
]);
const SUBMITTED_PLAN_STATUSES = new Set([
  "accepted",
  "archived",
  "expired",
  "rejected",
  "shortlisted",
  "submitted",
  "viewed",
  "withdrawn",
]);
const ACTIVE_MATCH_STATUSES = new Set(["applied", "saved"]);
const READINESS_CATEGORY_LABELS = Object.freeze({
  acquisition: "Acquisition",
  availability: "Availability",
  offers: "Outcome offers",
  profile: "Public profile",
  proof: "Proof Vault",
});

const READINESS_ITEMS = Object.freeze([
  {
    category: "profile",
    ctaLabel: "Complete Profile",
    key: "profilePhoto",
    label: "Add a profile photo",
    points: 10,
    route: ROUTES.PROFILE,
  },
  {
    category: "profile",
    ctaLabel: "Complete Profile",
    key: "headline",
    label: "Write a clear provider headline",
    points: 10,
    route: ROUTES.PROFILE,
  },
  {
    category: "profile",
    ctaLabel: "Complete Profile",
    key: "bio",
    label: "Add an About section",
    points: 10,
    route: ROUTES.PROFILE,
  },
  {
    category: "profile",
    ctaLabel: "Complete Profile",
    key: "skills",
    label: "Add provider skills",
    points: 10,
    route: ROUTES.PROFILE,
  },
  {
    category: "offers",
    ctaLabel: "Create Offer",
    key: "publishedOffer",
    label: "Publish an outcome offer",
    points: 20,
    route: ROUTES.NEW_OUTCOME_OFFER,
  },
  {
    category: "proof",
    ctaLabel: "Add Proof",
    key: "proofAsset",
    label: "Add proof to your Proof Vault",
    points: 15,
    route: `${ROUTES.PROOF_VAULT}?new=1`,
  },
  {
    category: "acquisition",
    ctaLabel: "Review Matches",
    key: "savedOrAppliedMatch",
    label: "Save or apply to a matched challenge",
    points: 10,
    route: ROUTES.MATCHED_CHALLENGES,
  },
  {
    category: "acquisition",
    ctaLabel: "Explore Challenges",
    key: "submittedPlan",
    label: "Submit an execution plan",
    points: 10,
    route: ROUTES.CHALLENGES,
  },
  {
    category: "availability",
    ctaLabel: "Set Availability",
    key: "activeAvailability",
    label: "Set active availability",
    points: 5,
    route: ROUTES.PROFILE,
  },
]);

function hasText(value) {
  return Boolean(String(value ?? "").trim());
}

function hasMedia(value) {
  return hasText(typeof value === "string" ? value : value?.url);
}

function hasSkills(profile = {}, providerProfile = {}) {
  return Boolean(
    (Array.isArray(profile.skills) && profile.skills.some((skill) => hasText(skill?.name ?? skill))) ||
    (Array.isArray(providerProfile.skills) && providerProfile.skills.some(hasText)),
  );
}

function readinessLabel(score) {
  if (typeof score !== "number") return "Readiness unavailable";
  if (score >= 90) return "Client-ready provider";
  if (score >= 70) return "Ready to compete";
  if (score >= 40) return "Getting ready";
  return "Not ready yet";
}

function getReadinessAreas(items = []) {
  const areas = Object.entries(
    items.reduce((summary, item) => {
      if (item.complete === null) {
        return summary;
      }

      const current = summary[item.category] ?? {
        category: item.category,
        completed: 0,
        completedPoints: 0,
        total: 0,
        totalPoints: 0,
      };
      current.total += 1;
      current.totalPoints += item.points;

      if (item.complete) {
        current.completed += 1;
        current.completedPoints += item.points;
      }

      summary[item.category] = current;
      return summary;
    }, {}),
  ).map(([category, area]) => ({
    ...area,
    category,
    label: READINESS_CATEGORY_LABELS[category] ?? category,
    score: area.totalPoints > 0
      ? Math.round((area.completedPoints / area.totalPoints) * 100)
      : Math.round((area.completed / Math.max(area.total, 1)) * 100),
  }));

  const strongestArea = [...areas].sort((left, right) =>
    right.score - left.score || right.completedPoints - left.completedPoints,
  )[0] ?? null;
  const weakestArea = [...areas].sort((left, right) =>
    left.score - right.score || right.totalPoints - left.totalPoints,
  )[0] ?? null;

  return { areas, strongestArea, weakestArea };
}

function getChecks({ matches, offers, plans, profileData, proofAssets }) {
  const profile = profileData?.profile ?? {};
  const providerProfile = profileData?.providerProfile ?? {};
  const headline = profile.headline || providerProfile.headline || providerProfile.title;
  const availability = providerProfile.availability;

  return {
    activeAvailability:
      profileData === null
        ? null
        : ACTIVE_AVAILABILITY.has(String(availability ?? "").toLowerCase()) &&
          providerProfile.isAvailableForChallenges !== false,
    bio: profileData === null ? null : hasText(profile.bio),
    headline:
      profileData === null
        ? null
        : hasText(headline) && String(headline).trim() !== DEFAULT_HEADLINE,
    profilePhoto:
      profileData === null
        ? null
        : hasMedia(profileData?.user?.avatar || profile.avatar || profile.profilePicture),
    proofAsset: proofAssets === null ? null : proofAssets.length > 0,
    publishedOffer:
      offers === null ? null : offers.some((offer) => offer?.status === "published"),
    savedOrAppliedMatch:
      matches === null
        ? null
        : matches.some((match) => ACTIVE_MATCH_STATUSES.has(String(match?.status ?? "").toLowerCase())),
    skills: profileData === null ? null : hasSkills(profile, providerProfile),
    submittedPlan:
      plans === null
        ? null
        : plans.some((plan) => SUBMITTED_PLAN_STATUSES.has(String(plan?.status ?? "").toLowerCase())),
  };
}

export function getReadinessNextAction(readiness = {}) {
  const missingItems = readiness.missingItems ?? [];

  if (missingItems.length === 0) {
    return {
      ctaLabel: "Review Matches",
      label: "Keep reviewing matched challenges",
      route: ROUTES.MATCHED_CHALLENGES,
    };
  }

  const categoryGaps = missingItems.reduce((gaps, item) => {
    gaps[item.category] = (gaps[item.category] ?? 0) + item.points;
    return gaps;
  }, {});
  const weakestCategory = Object.entries(categoryGaps)
    .sort((left, right) => right[1] - left[1])[0]?.[0];
  const item = missingItems.find((candidate) => candidate.category === weakestCategory) ?? missingItems[0];

  return {
    ctaLabel: item.ctaLabel,
    label: item.label,
    route: item.route,
  };
}

export function calculateProviderReadiness({
  matches = null,
  offers = null,
  plans = null,
  profileData = null,
  proofAssets = null,
} = {}) {
  const checks = getChecks({ matches, offers, plans, profileData, proofAssets });
  const items = READINESS_ITEMS.map((item) => ({
    ...item,
    complete: checks[item.key],
  }));
  const completedItems = items.filter((item) => item.complete === true);
  const missingItems = items.filter((item) => item.complete === false);
  const unavailableItems = items.filter((item) => item.complete === null);
  const areas = getReadinessAreas(items);
  const score = unavailableItems.length > 0
    ? null
    : completedItems.reduce((total, item) => total + item.points, 0);
  const readiness = {
    completedItems,
    label: readinessLabel(score),
    missingItems,
    score,
    unavailableItems,
    ...areas,
  };

  return {
    ...readiness,
    nextAction: getReadinessNextAction(readiness),
  };
}
