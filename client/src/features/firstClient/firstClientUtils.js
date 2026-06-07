import { API_BASE_URL } from "../../services/apiClient.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const READINESS_LABELS = Object.freeze([
  { label: "Strong first-client setup", min: 90 },
  { label: "Ready to apply", min: 70 },
  { label: "Getting ready", min: 40 },
  { label: "Not ready yet", min: 0 },
]);

export const STARTER_LEVEL_LABELS = Object.freeze({
  beginner: "Beginner",
  easy: "Easy",
  standard: "Standard",
});

export const PROOF_SIMPLICITY_LABELS = Object.freeze({
  advanced: "Advanced proof",
  moderate: "Moderate proof",
  simple: "Simple proof",
});

export const MICRO_WIN_BADGES = Object.freeze([
  {
    description: "Create a repeatable outcome offer clients can understand.",
    key: "first_offer_created",
    label: "First Offer Created",
  },
  {
    description: "Add reusable proof that can support offers and plans.",
    key: "first_proof_asset_added",
    label: "First Proof Asset Added",
  },
  {
    description: "Submit a structured plan with milestones, proof, and price.",
    key: "first_execution_plan_submitted",
    label: "First Execution Plan Submitted",
  },
  {
    description: "Get shortlisted by a client for a submitted plan.",
    key: "first_shortlist",
    label: "First Shortlist",
  },
  {
    description: "Win the first client challenge.",
    key: "first_challenge_won",
    label: "First Challenge Won",
  },
  {
    description: "Future badge awarded after proof review verifies the outcome.",
    key: "first_verified_outcome",
    label: "First Verified Outcome",
  },
]);

export function buildFirstClientEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getReadinessLabel(score = 0) {
  const value = Number(score) || 0;
  return READINESS_LABELS.find((item) => value >= item.min)?.label ?? "Not ready yet";
}

export function getFirstClientApiErrorMessage(error, fallback = "First Client Mode could not load. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  return error?.message || fallback;
}

export function formatStarterBudget(budget = {}) {
  if (!budget?.type || budget.type === "hidden") {
    return "Budget hidden";
  }

  if (budget.type === "negotiable") {
    return "Negotiable";
  }

  if (budget.type === "range" && budget.min !== undefined && budget.max !== undefined) {
    return `${formatCurrency(budget.min, budget.currency, { compact: true })} - ${formatCurrency(budget.max, budget.currency, { compact: true })}`;
  }

  const amount = budget.min ?? budget.max;
  return amount !== undefined ? formatCurrency(amount, budget.currency, { compact: true }) : budget.customLabel || "Budget scoped";
}

export function formatStarterTimeline(timeline = {}) {
  if (timeline.customLabel) return timeline.customLabel;
  if (timeline.durationDays) return `${timeline.durationDays} days`;
  if (timeline.days) return `${timeline.days} days`;
  if (timeline.minDays && timeline.maxDays) return `${timeline.minDays}-${timeline.maxDays} days`;
  if (timeline.type) return String(timeline.type).replaceAll("_", " ");
  return "Timeline scoped";
}

export function buildChallengeViewPath(challenge = {}) {
  if (challenge.client?.username && challenge.slug) {
    return `/challenges/${encodeURIComponent(challenge.client.username)}/${encodeURIComponent(challenge.slug)}`;
  }

  return "/challenges";
}

export function buildPlanApplyPath(challenge = {}) {
  return `/dashboard/plans/new?challengeId=${encodeURIComponent(challenge.id ?? challenge._id ?? "")}`;
}
