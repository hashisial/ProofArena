export const CHALLENGE_STATUS = Object.freeze({
  ARCHIVED: "archived",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  DISPUTED: "disputed",
  DRAFT: "draft",
  FAILED: "failed",
  IN_PROGRESS: "in_progress",
  OPEN: "open",
  PAUSED: "paused",
  PENDING_REVIEW: "pending_review",
  PROVIDER_SELECTED: "provider_selected",
  PROOF_REVIEW: "proof_review",
  REVIEWING_PLANS: "reviewing_plans",
  SHORTLISTING: "shortlisting",
});

export const ENTRY_STATUS = Object.freeze({
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  SHORTLISTED: "shortlisted",
  SUBMITTED: "submitted",
  WITHDRAWN: "withdrawn",
});

export const EXECUTION_PLAN_STATUS = Object.freeze({
  ACCEPTED: "accepted",
  ARCHIVED: "archived",
  DRAFT: "draft",
  EXPIRED: "expired",
  REJECTED: "rejected",
  SHORTLISTED: "shortlisted",
  SUBMITTED: "submitted",
  VIEWED: "viewed",
  WITHDRAWN: "withdrawn",
});

// Applications currently use the execution-plan workflow. Keep one source of
// truth until a distinct application model and route contract exist.
export const APPLICATION_STATUS = EXECUTION_PLAN_STATUS;

export const MILESTONE_STATUS = Object.freeze({
  APPROVED: "approved",
  IN_PROGRESS: "in_progress",
  PENDING: "pending",
  REJECTED: "rejected",
  REVISION_REQUESTED: "revision_requested",
  SUBMITTED: "submitted",
});

export const PROOF_STATUS = Object.freeze({
  APPROVED: "approved",
  REJECTED: "rejected",
  REVISION_REQUIRED: "revision_required",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
});

export const APPLICATION_STATUS_VALUES = Object.freeze(Object.values(APPLICATION_STATUS));
export const CHALLENGE_STATUS_VALUES = Object.freeze(Object.values(CHALLENGE_STATUS));
export const ENTRY_STATUS_VALUES = Object.freeze(Object.values(ENTRY_STATUS));
export const EXECUTION_PLAN_STATUS_VALUES = Object.freeze(Object.values(EXECUTION_PLAN_STATUS));
export const MILESTONE_STATUS_VALUES = Object.freeze(Object.values(MILESTONE_STATUS));
export const PROOF_STATUS_VALUES = Object.freeze(Object.values(PROOF_STATUS));
