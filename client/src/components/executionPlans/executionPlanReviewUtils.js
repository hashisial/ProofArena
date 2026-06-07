import {
  formatPlanPrice,
  formatPlanTimeline,
} from "../../features/executionPlans/executionPlanUtils.js";

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeId(value) {
  return value?._id || value?.id || value || "";
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getProvider(plan) {
  return plan?.provider ?? {};
}

export function getPlanId(plan) {
  return normalizeText(plan?.id || plan?._id);
}

export function getChallengeIdFromPlan(plan) {
  return normalizeText(plan?.challenge?.id || plan?.challenge?._id || plan?.challengeId);
}

export function getProviderName(plan) {
  const provider = getProvider(plan);
  return (
    normalizeText(provider.displayName) ||
    normalizeText(provider.fullName) ||
    normalizeText(provider.name) ||
    normalizeText(provider.username) ||
    "Provider"
  );
}

export function getProviderHeadline(plan) {
  const provider = getProvider(plan);
  return (
    normalizeText(provider.headline) ||
    normalizeText(provider.title) ||
    "Provider summary not available yet."
  );
}

export function getProviderAvatar(plan) {
  const provider = getProvider(plan);
  return normalizeText(provider.avatar || provider.avatarUrl || provider.profilePicture);
}

export function getProviderUsername(plan) {
  return normalizeText(getProvider(plan).username);
}

export function getProviderProfileUrl(plan) {
  const username = getProviderUsername(plan);
  return username ? `/profile/${encodeURIComponent(username)}` : "";
}

export function getProviderVerificationLabel(plan) {
  const status = normalizeText(getProvider(plan).verificationStatus).toLowerCase();

  if (["verified", "approved"].includes(status)) {
    return "Verified";
  }

  if (["pending", "in_review", "reviewing"].includes(status)) {
    return "Verification pending";
  }

  return "Not verified";
}

export function getProviderProofScore(plan) {
  return numberOrNull(getProvider(plan).proofScore);
}

export function getProviderCompletedOutcomes(plan) {
  return numberOrNull(getProvider(plan).completedOutcomes);
}

export function getPlanScoreValue(plan) {
  return numberOrNull(plan?.planScore?.score ?? plan?.score);
}

export function formatPlanScore(plan) {
  const score = getPlanScoreValue(plan);
  return score === null ? "Not available" : `${score}/100`;
}

export function getPlanTimelineDays(plan) {
  const timeline = plan?.timeline ?? {};

  if (timeline.type === "fixed_days") {
    return numberOrNull(timeline.days);
  }

  if (timeline.type === "range_days") {
    return numberOrNull(timeline.maxDays ?? timeline.minDays);
  }

  return null;
}

export function getPlanPriceValue(plan) {
  const price = plan?.price ?? {};
  return numberOrNull(price.min ?? price.max);
}

export function getProofCount(plan) {
  return Array.isArray(plan?.proofPlan) ? plan.proofPlan.length : 0;
}

export function getMilestoneCount(plan) {
  return Array.isArray(plan?.milestones) ? plan.milestones.length : 0;
}

export function getRiskCount(plan) {
  return Array.isArray(plan?.riskHandling) ? plan.riskHandling.length : 0;
}

export function getCommunicationLabel(plan) {
  const frequency = normalizeText(plan?.communicationPlan?.updateFrequency);
  return frequency ? frequency.replaceAll("_", " ") : "Not specified";
}

export function getPlanSubmittedDate(plan) {
  return plan?.submittedAt || plan?.createdAt || plan?.updatedAt || null;
}

export function buildPlanSearchText(plan) {
  const provider = getProvider(plan);
  const searchable = [
    plan?.title,
    plan?.summary,
    plan?.approach,
    plan?.whyThisProvider,
    provider.displayName,
    provider.fullName,
    provider.name,
    provider.username,
    provider.headline,
    ...(plan?.skills ?? []),
    ...(plan?.tools ?? []),
    ...(plan?.milestones ?? []).map((item) => `${item.title ?? ""} ${item.description ?? ""}`),
    ...(plan?.proofPlan ?? []).map((item) => `${item.title ?? ""} ${item.description ?? ""} ${item.proofType ?? ""}`),
    ...(plan?.riskHandling ?? []).map((item) => `${item.risk ?? ""} ${item.mitigation ?? ""}`),
  ];

  return searchable.join(" ").toLowerCase();
}

export function formatReviewMetricValue(plan, key) {
  if (key === "score") return formatPlanScore(plan);
  if (key === "timeline") return formatPlanTimeline(plan?.timeline);
  if (key === "price") return formatPlanPrice(plan?.price);
  if (key === "milestones") return `${getMilestoneCount(plan)} planned`;
  if (key === "proof") return `${getProofCount(plan)} proof item${getProofCount(plan) === 1 ? "" : "s"}`;
  if (key === "risks") return `${getRiskCount(plan)} handled`;
  if (key === "communication") return getCommunicationLabel(plan);
  return "Not available";
}

export function getComparableDateValue(plan) {
  const date = new Date(getPlanSubmittedDate(plan) || 0).getTime();
  return Number.isFinite(date) ? date : 0;
}

export function getComparablePriceValue(plan) {
  return getPlanPriceValue(plan) ?? Number.POSITIVE_INFINITY;
}

export function getComparableTimelineValue(plan) {
  return getPlanTimelineDays(plan) ?? Number.POSITIVE_INFINITY;
}

export function getComparableScoreValue(plan) {
  return getPlanScoreValue(plan) ?? -1;
}

export function isSameProvider(left, right) {
  return normalizeId(left?.provider?.id) === normalizeId(right?.provider?.id);
}
