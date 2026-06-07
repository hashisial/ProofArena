import { API_BASE_URL } from "../../services/apiClient.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export const OPPORTUNITY_STAGE_LABELS = Object.freeze({
  applied: "Applied",
  archived: "Archived",
  completed: "Completed",
  invited: "Invited",
  lost: "Lost",
  matched: "Matched",
  negotiating: "Negotiating",
  shortlisted: "Shortlisted",
  won: "Won",
});

export const OPPORTUNITY_SOURCE_LABELS = Object.freeze({
  accepted_plan: "Accepted Plan",
  client_invite: "Client Invite",
  execution_plan: "Execution Plan",
  manual: "Manual",
  matched_challenge: "Matched Challenge",
  saved_match: "Saved Match",
  shortlisted_plan: "Shortlisted Plan",
});

export const OPPORTUNITY_PRIORITY_LABELS = Object.freeze({
  high: "High",
  low: "Low",
  normal: "Normal",
  urgent: "Urgent",
});

export const LOST_REASON_LABELS = Object.freeze({
  challenge_cancelled: "Challenge cancelled",
  client_chose_other: "Client chose another provider",
  client_unresponsive: "Client unresponsive",
  missing_proof: "Missing proof",
  other: "Other",
  price_too_high: "Price too high",
  provider_withdrew: "Provider withdrew",
  timeline_not_fit: "Timeline did not fit",
  weak_plan: "Weak plan",
});

export const OPPORTUNITY_STAGES = Object.freeze([
  "matched",
  "invited",
  "applied",
  "shortlisted",
  "negotiating",
  "won",
  "lost",
  "completed",
]);

export const OPPORTUNITY_STAGE_OPTIONS = Object.freeze([
  { label: "All stages", value: "all" },
  ...OPPORTUNITY_STAGES.map((value) => ({ label: OPPORTUNITY_STAGE_LABELS[value], value })),
  { label: "Archived", value: "archived" },
]);

export const OPPORTUNITY_STAGE_UPDATE_OPTIONS = Object.freeze(
  OPPORTUNITY_STAGES.map((value) => ({ label: OPPORTUNITY_STAGE_LABELS[value], value })),
);

export const OPPORTUNITY_SOURCE_OPTIONS = Object.freeze([
  { label: "All sources", value: "all" },
  ...Object.entries(OPPORTUNITY_SOURCE_LABELS).map(([value, label]) => ({ label, value })),
]);

export const OPPORTUNITY_PRIORITY_OPTIONS = Object.freeze([
  { label: "All priorities", value: "all" },
  ...Object.entries(OPPORTUNITY_PRIORITY_LABELS).map(([value, label]) => ({ label, value })),
]);

export const OPPORTUNITY_PRIORITY_INPUT_OPTIONS = Object.freeze(
  Object.entries(OPPORTUNITY_PRIORITY_LABELS).map(([value, label]) => ({ label, value })),
);

export const OPPORTUNITY_SORT_OPTIONS = Object.freeze([
  { label: "Last activity", value: "last_activity" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Priority", value: "priority" },
  { label: "Value", value: "value" },
]);

export const LOST_REASON_OPTIONS = Object.freeze(
  Object.entries(LOST_REASON_LABELS).map(([value, label]) => ({ label, value })),
);

export function buildOpportunityEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getOpportunityApiErrorMessage(error, fallback = "Opportunity action failed. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  return error?.message || fallback;
}

export function formatOpportunityValue(value = {}) {
  if (!value?.amount) {
    return "Value unknown";
  }

  return `${formatCurrency(value.amount, value.currency ?? "USD", { compact: true })} ${value.type ?? ""}`.trim();
}

export function opportunityDueState(nextAction = {}) {
  if (!nextAction?.dueAt || nextAction.completed) {
    return "none";
  }

  const due = new Date(nextAction.dueAt).getTime();
  const now = Date.now();
  const soon = now + 7 * 24 * 60 * 60 * 1000;

  if (Number.isNaN(due)) return "none";
  if (due < now) return "overdue";
  if (due <= soon) return "soon";
  return "scheduled";
}
