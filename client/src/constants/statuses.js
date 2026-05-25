export const USER_ROLES = Object.freeze({
  CLIENT: "client",
  PROVIDER: "provider",
  ADMIN: "admin",
});

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
  DELETED: "deleted",
});

export const CHALLENGE_STATUS = Object.freeze({
  ARCHIVED: "archived",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  DRAFT: "draft",
  IN_PROGRESS: "in_progress",
  OPEN: "open",
  PAUSED: "paused",
  PROVIDER_SELECTED: "provider_selected",
  PROOF_REVIEW: "proof_review",
  REVIEWING_PLANS: "reviewing_plans",
  PENDING_REVIEW: "pending_review",
  SHORTLISTING: "shortlisting",
  FAILED: "failed",
  DISPUTED: "disputed",
});

export const PROOF_STATUS = Object.freeze({
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVISION_REQUIRED: "revision_required",
});

export const PROVIDER_VERIFICATION_STATUS = Object.freeze({
  NONE: "none",
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
});

export const USER_ROLE_VALUES = Object.freeze(Object.values(USER_ROLES));
export const CHALLENGE_STATUS_VALUES = Object.freeze(Object.values(CHALLENGE_STATUS));
export const PROOF_STATUS_VALUES = Object.freeze(Object.values(PROOF_STATUS));
export const PROVIDER_VERIFICATION_STATUS_VALUES = Object.freeze(
  Object.values(PROVIDER_VERIFICATION_STATUS),
);
