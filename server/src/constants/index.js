import {
  PUBLIC_REGISTER_ROLE_VALUES,
  USER_ROLES,
  USER_ROLE_VALUES,
} from "./roles.js";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_VALUES,
  CHALLENGE_STATUS,
  CHALLENGE_STATUS_VALUES,
  ENTRY_STATUS,
  ENTRY_STATUS_VALUES,
  EXECUTION_PLAN_STATUS,
  EXECUTION_PLAN_STATUS_VALUES,
  MILESTONE_STATUS,
  MILESTONE_STATUS_VALUES,
  PROOF_STATUS,
  PROOF_STATUS_VALUES,
} from "./statuses.js";

export {
  APPLICATION_STATUS,
  APPLICATION_STATUS_VALUES,
  CHALLENGE_STATUS,
  CHALLENGE_STATUS_VALUES,
  ENTRY_STATUS,
  ENTRY_STATUS_VALUES,
  EXECUTION_PLAN_STATUS,
  EXECUTION_PLAN_STATUS_VALUES,
  MILESTONE_STATUS,
  MILESTONE_STATUS_VALUES,
  PROOF_STATUS,
  PROOF_STATUS_VALUES,
  PUBLIC_REGISTER_ROLE_VALUES,
  USER_ROLES,
  USER_ROLE_VALUES,
};

export const ACCOUNT_STATUS = Object.freeze({
  ACTIVE: "active",
  BANNED: "banned",
  DELETED: "deleted",
  PENDING: "pending",
  SUSPENDED: "suspended",
});

export const PROFILE_VISIBILITY = Object.freeze({
  HIDDEN: "hidden",
  PRIVATE: "private",
  PUBLIC: "public",
});

export const VERIFICATION_BADGE_STATUS = Object.freeze({
  NONE: "none",
  PENDING: "pending",
  REJECTED: "rejected",
  VERIFIED: "verified",
});

export const BUSINESS_TYPE = Object.freeze({
  AGENCY: "agency",
  COMPANY: "company",
  ENTERPRISE: "enterprise",
  INDIVIDUAL: "individual",
  STARTUP: "startup",
});

export const OPEN_TO_STATUS = Object.freeze({
  AVAILABLE: "available",
  NOT_AVAILABLE: "not_available",
});

export const PROVIDER_VERIFICATION_STATUS = Object.freeze({
  NONE: "none",
  PENDING: "pending",
  REJECTED: "rejected",
  VERIFIED: "verified",
});

export const CHALLENGE_VISIBILITY = Object.freeze({
  ANONYMOUS_PUBLIC: "anonymous_public",
  INVITE_ONLY: "invite_only",
  PRIVATE: "private",
  PUBLIC: "public",
  UNLISTED: "unlisted",
});

export const CHALLENGE_URGENCY = Object.freeze({
  HIGH: "high",
  LOW: "low",
  NORMAL: "normal",
  URGENT: "urgent",
});

export const CHALLENGE_MODE = Object.freeze({
  ADMIN_MATCHED: "admin_matched",
  CURATED_ASSIGNMENT: "curated_assignment",
  OPEN_COMPETITION: "open_competition",
  PRIVATE_INVITE: "private_invite",
});

export const CHALLENGE_BUDGET_TYPES = Object.freeze({
  FIXED: "fixed",
  MILESTONE_BASED: "milestone_based",
  PRIZE_BASED: "prize_based",
  RANGE: "range",
});

export const CHALLENGE_BUDGET_TYPE = Object.freeze({
  FIXED: "fixed",
  HIDDEN: "hidden",
  HOURLY: "hourly",
  MILESTONE: "milestone",
  NEGOTIABLE: "negotiable",
  RANGE: "range",
});

export const CHALLENGE_TIMELINE_TYPE = Object.freeze({
  CUSTOM: "custom",
  DURATION_DAYS: "duration_days",
  FIXED_DEADLINE: "fixed_deadline",
  MONTHLY: "monthly",
  ONGOING: "ongoing",
  RANGE_DAYS: "range_days",
  WEEKLY: "weekly",
});

export const ADMIN_REVIEW_STATUS = Object.freeze({
  APPROVED: "approved",
  NOT_SUBMITTED: "not_submitted",
  PENDING: "pending",
  REJECTED: "rejected",
});

export const PLAN_TIMELINE_TYPE = Object.freeze({
  CUSTOM: "custom",
  FIXED_DAYS: "fixed_days",
  MONTHLY: "monthly",
  RANGE_DAYS: "range_days",
  WEEKLY: "weekly",
});

export const PLAN_PRICE_TYPE = Object.freeze({
  CUSTOM: "custom",
  FIXED: "fixed",
  HOURLY: "hourly",
  MILESTONE: "milestone",
  RANGE: "range",
});

export const PLAN_CAN_START = Object.freeze({
  CUSTOM: "custom",
  IMMEDIATELY: "immediately",
  NEXT_WEEK: "next_week",
  THIS_WEEK: "this_week",
});

export const PLAN_UPDATE_FREQUENCY = Object.freeze({
  CUSTOM: "custom",
  DAILY: "daily",
  EVERY_2_DAYS: "every_2_days",
  MILESTONE_BASED: "milestone_based",
  WEEKLY: "weekly",
});

export const MATCH_STATUS = Object.freeze({
  APPLIED: "applied",
  DISMISSED: "dismissed",
  EXPIRED: "expired",
  IGNORED: "ignored",
  INVITED: "invited",
  NEW: "new",
  SAVED: "saved",
  VIEWED: "viewed",
});

export const MATCH_SOURCE = Object.freeze({
  AI_LATER: "ai_later",
  CHALLENGE_CREATED: "challenge_created",
  MANUAL_REFRESH: "manual_refresh",
  OFFER_CREATED: "offer_created",
  PROFILE_UPDATED: "profile_updated",
  RULE_BASED: "rule_based",
});

export const MATCH_DIRECTION = Object.freeze({
  BOTH: "both",
  CHALLENGE_TO_PROVIDER: "challenge_to_provider",
  PROVIDER_TO_CHALLENGE: "provider_to_challenge",
});

export const PROOF_TYPES = Object.freeze({
  ANALYTICS_REPORT: "analytics_report",
  ANALYTICS_SCREENSHOT: "analytics_screenshot",
  APPOINTMENT_CONFIRMATION: "appointment_confirmation",
  BEFORE_AFTER: "before_after",
  CALL_RECORDING: "call_recording",
  CLIENT_CONFIRMATION: "client_confirmation",
  CONFIRMATION_RECORD: "confirmation_record",
  CRM_EXPORT: "crm_export",
  CRM_SCREENSHOT: "crm_screenshot",
  DASHBOARD_ACCESS: "dashboard_access",
  DOCUMENT: "document",
  GIT_COMMIT: "git_commit",
  GITHUB_COMMIT: "github_commit",
  LIVE_URL: "live_url",
  LEAD_SHEET: "lead_sheet",
  LIVE_LINK: "live_link",
  OTHER: "other",
  SCREENSHOT: "screenshot",
  SUPPORT_REPORT: "support_report",
  VIDEO: "video",
  VIDEO_WALKTHROUGH: "video_walkthrough",
  WORK_LOG: "work_log",
});

export const PROOF_ASSET_TYPE = Object.freeze({
  ANALYTICS_REPORT: "analytics_report",
  CASE_STUDY: "case_study",
  CERTIFICATE: "certificate",
  CRM_EXPORT: "crm_export",
  DOCUMENT: "document",
  GITHUB_LINK: "github_link",
  LIVE_URL: "live_url",
  OTHER: "other",
  PDF_REPORT: "pdf_report",
  PORTFOLIO_SAMPLE: "portfolio_sample",
  SCREENSHOT: "screenshot",
  VIDEO_WALKTHROUGH: "video_walkthrough",
  WORK_LOG: "work_log",
});

export const PROOF_SOURCE_TYPE = Object.freeze({
  FILE: "file",
  LINK: "link",
  TEXT: "text",
});

export const PROOF_ASSET_VISIBILITY = Object.freeze({
  PRIVATE: "private",
  PUBLIC: "public",
  UNLISTED: "unlisted",
});

export const PROOF_VERIFICATION_STATUS = Object.freeze({
  FLAGGED: "flagged",
  PENDING_REVIEW: "pending_review",
  REJECTED: "rejected",
  UNVERIFIED: "unverified",
  VERIFIED: "verified",
});

export const AI_EXTRACTION_STATUS = Object.freeze({
  COMPLETED: "completed",
  FAILED: "failed",
  NOT_STARTED: "not_started",
  PENDING: "pending",
});

export const OPPORTUNITY_STAGE = Object.freeze({
  APPLIED: "applied",
  ARCHIVED: "archived",
  COMPLETED: "completed",
  INVITED: "invited",
  LOST: "lost",
  MATCHED: "matched",
  NEGOTIATING: "negotiating",
  SHORTLISTED: "shortlisted",
  WON: "won",
});

export const OPPORTUNITY_SOURCE = Object.freeze({
  ACCEPTED_PLAN: "accepted_plan",
  CLIENT_INVITE: "client_invite",
  EXECUTION_PLAN: "execution_plan",
  MANUAL: "manual",
  MATCHED_CHALLENGE: "matched_challenge",
  SAVED_MATCH: "saved_match",
  SHORTLISTED_PLAN: "shortlisted_plan",
});

export const OPPORTUNITY_PRIORITY = Object.freeze({
  HIGH: "high",
  LOW: "low",
  NORMAL: "normal",
  URGENT: "urgent",
});

export const LOST_REASON = Object.freeze({
  CHALLENGE_CANCELLED: "challenge_cancelled",
  CLIENT_CHOSE_OTHER: "client_chose_other",
  CLIENT_UNRESPONSIVE: "client_unresponsive",
  MISSING_PROOF: "missing_proof",
  OTHER: "other",
  PRICE_TOO_HIGH: "price_too_high",
  PROVIDER_WITHDREW: "provider_withdrew",
  TIMELINE_NOT_FIT: "timeline_not_fit",
  WEAK_PLAN: "weak_plan",
});

export const STARTER_CHALLENGE_LEVEL = Object.freeze({
  BEGINNER: "beginner",
  EASY: "easy",
  STANDARD: "standard",
});

export const PROOF_SIMPLICITY = Object.freeze({
  ADVANCED: "advanced",
  MODERATE: "moderate",
  SIMPLE: "simple",
});

export const PROVIDER_BADGE_KEY = Object.freeze({
  FAST_STARTER: "fast_starter",
  FIRST_CHALLENGE_WON: "first_challenge_won",
  FIRST_EXECUTION_PLAN_SUBMITTED: "first_execution_plan_submitted",
  FIRST_OFFER_CREATED: "first_offer_created",
  FIRST_PROOF_ASSET_ADDED: "first_proof_asset_added",
  FIRST_SHORTLIST: "first_shortlist",
  FIRST_VERIFIED_OUTCOME: "first_verified_outcome",
  PROFILE_READY: "profile_ready",
});

export const SAVED_PROVIDER_SOURCE = Object.freeze({
  COMPARISON: "comparison",
  MANUAL: "manual",
  PROVIDER_DISCOVERY: "provider_discovery",
  PUBLIC_PROFILE: "public_profile",
  RECOMMENDED_PROVIDER: "recommended_provider",
});

export const SAVED_PROVIDER_STATUS = Object.freeze({
  DISMISSED: "dismissed",
  INVITED_LATER: "invited_later",
  SAVED: "saved",
  SHORTLISTED: "shortlisted",
});

export const OUTCOME_OFFER_STATUS = Object.freeze({
  ARCHIVED: "archived",
  DRAFT: "draft",
  PAUSED: "paused",
  PUBLISHED: "published",
});

export const OUTCOME_OFFER_VISIBILITY = Object.freeze({
  PRIVATE: "private",
  PUBLIC: "public",
  UNLISTED: "unlisted",
});

export const OFFER_AVAILABILITY_STATUS = Object.freeze({
  AVAILABLE_NEXT_WEEK: "available_next_week",
  AVAILABLE_NOW: "available_now",
  AVAILABLE_THIS_WEEK: "available_this_week",
  FULLY_BOOKED: "fully_booked",
  LIMITED: "limited",
  PAUSED: "paused",
});

export const OFFER_PRICE_TYPE = Object.freeze({
  CUSTOM: "custom",
  FIXED: "fixed",
  HIDDEN: "hidden",
  RANGE: "range",
  STARTING_AT: "starting_at",
});

export const OFFER_DELIVERY_TYPE = Object.freeze({
  CUSTOM: "custom",
  FIXED_DAYS: "fixed_days",
  MONTHLY: "monthly",
  RANGE_DAYS: "range_days",
  WEEKLY: "weekly",
});

export const MESSAGE_TYPES = Object.freeze({
  FILE: "file",
  IMAGE: "image",
  SYSTEM: "system",
  TEXT: "text",
});

export const CONVERSATION_TYPES = Object.freeze({
  CHALLENGE: "challenge",
  DIRECT: "direct",
  SUPPORT: "support",
  TEAM: "team",
});

export const NOTIFICATION_TYPES = Object.freeze({
  ADMIN_UPDATE: "admin_update",
  CHALLENGE_UPDATE: "challenge_update",
  CONNECTION_ACCEPTED: "connection_accepted",
  CONNECTION_REQUEST: "connection_request",
  MESSAGE: "message",
  PROOF_APPROVED: "proof_approved",
  PROOF_REJECTED: "proof_rejected",
  PROOF_SUBMITTED: "proof_submitted",
  PROVIDER_ACCEPTED: "provider_accepted",
  SYSTEM: "system",
});

export const DISPUTE_STATUS = Object.freeze({
  CLOSED: "closed",
  OPEN: "open",
  REJECTED: "rejected",
  RESOLVED: "resolved",
  UNDER_REVIEW: "under_review",
});

export const PAYMENT_STATUS = Object.freeze({
  CANCELLED: "cancelled",
  FAILED: "failed",
  PAID: "paid",
  PENDING: "pending",
  REFUNDED: "refunded",
  RELEASED: "released",
});

export const TOKEN_TYPES = Object.freeze({
  ACCESS: "access",
  REFRESH: "refresh",
});

export const AUTH_COOKIE_NAMES = Object.freeze({
  ACCESS_TOKEN: "proofarena_access",
  REFRESH_TOKEN: "proofarena_refresh",
});

export const PLATFORM_ROUTES = Object.freeze({
  API_BASE: "/api",
  API_V1: "/api/v1",
});

export const ACCOUNT_STATUS_VALUES = Object.freeze(Object.values(ACCOUNT_STATUS));
export const PROFILE_VISIBILITY_VALUES = Object.freeze(Object.values(PROFILE_VISIBILITY));
export const VERIFICATION_BADGE_STATUS_VALUES = Object.freeze(Object.values(VERIFICATION_BADGE_STATUS));
export const BUSINESS_TYPE_VALUES = Object.freeze(Object.values(BUSINESS_TYPE));
export const OPEN_TO_STATUS_VALUES = Object.freeze(Object.values(OPEN_TO_STATUS));
export const PROVIDER_VERIFICATION_STATUS_VALUES = Object.freeze(Object.values(PROVIDER_VERIFICATION_STATUS));
export const CHALLENGE_VISIBILITY_VALUES = Object.freeze(Object.values(CHALLENGE_VISIBILITY));
export const CLIENT_CHALLENGE_STATUS_VALUES = Object.freeze([
  CHALLENGE_STATUS.DRAFT,
  CHALLENGE_STATUS.OPEN,
  CHALLENGE_STATUS.REVIEWING_PLANS,
  CHALLENGE_STATUS.PROVIDER_SELECTED,
  CHALLENGE_STATUS.IN_PROGRESS,
  CHALLENGE_STATUS.PROOF_REVIEW,
  CHALLENGE_STATUS.COMPLETED,
  CHALLENGE_STATUS.PAUSED,
  CHALLENGE_STATUS.CANCELLED,
  CHALLENGE_STATUS.ARCHIVED,
]);
export const CLIENT_CHALLENGE_VISIBILITY_VALUES = Object.freeze([
  CHALLENGE_VISIBILITY.PUBLIC,
  CHALLENGE_VISIBILITY.PRIVATE,
  CHALLENGE_VISIBILITY.INVITE_ONLY,
  CHALLENGE_VISIBILITY.UNLISTED,
]);
export const CHALLENGE_URGENCY_VALUES = Object.freeze(Object.values(CHALLENGE_URGENCY));
export const CHALLENGE_MODE_VALUES = Object.freeze(Object.values(CHALLENGE_MODE));
export const CHALLENGE_BUDGET_TYPE_VALUES = Object.freeze(Object.values(CHALLENGE_BUDGET_TYPES));
export const CLIENT_CHALLENGE_BUDGET_TYPE_VALUES = Object.freeze(Object.values(CHALLENGE_BUDGET_TYPE));
export const CHALLENGE_TIMELINE_TYPE_VALUES = Object.freeze(Object.values(CHALLENGE_TIMELINE_TYPE));
export const ADMIN_REVIEW_STATUS_VALUES = Object.freeze(Object.values(ADMIN_REVIEW_STATUS));
export const PLAN_TIMELINE_TYPE_VALUES = Object.freeze(Object.values(PLAN_TIMELINE_TYPE));
export const PLAN_PRICE_TYPE_VALUES = Object.freeze(Object.values(PLAN_PRICE_TYPE));
export const PLAN_CAN_START_VALUES = Object.freeze(Object.values(PLAN_CAN_START));
export const PLAN_UPDATE_FREQUENCY_VALUES = Object.freeze(Object.values(PLAN_UPDATE_FREQUENCY));
export const MATCH_STATUS_VALUES = Object.freeze(Object.values(MATCH_STATUS));
export const MATCH_SOURCE_VALUES = Object.freeze(Object.values(MATCH_SOURCE));
export const MATCH_DIRECTION_VALUES = Object.freeze(Object.values(MATCH_DIRECTION));
export const PROOF_TYPE_VALUES = Object.freeze(Object.values(PROOF_TYPES));
export const PROOF_ASSET_TYPE_VALUES = Object.freeze(Object.values(PROOF_ASSET_TYPE));
export const PROOF_SOURCE_TYPE_VALUES = Object.freeze(Object.values(PROOF_SOURCE_TYPE));
export const PROOF_ASSET_VISIBILITY_VALUES = Object.freeze(Object.values(PROOF_ASSET_VISIBILITY));
export const PROOF_VERIFICATION_STATUS_VALUES = Object.freeze(Object.values(PROOF_VERIFICATION_STATUS));
export const AI_EXTRACTION_STATUS_VALUES = Object.freeze(Object.values(AI_EXTRACTION_STATUS));
export const OPPORTUNITY_STAGE_VALUES = Object.freeze(Object.values(OPPORTUNITY_STAGE));
export const OPPORTUNITY_SOURCE_VALUES = Object.freeze(Object.values(OPPORTUNITY_SOURCE));
export const OPPORTUNITY_PRIORITY_VALUES = Object.freeze(Object.values(OPPORTUNITY_PRIORITY));
export const LOST_REASON_VALUES = Object.freeze(Object.values(LOST_REASON));
export const STARTER_CHALLENGE_LEVEL_VALUES = Object.freeze(Object.values(STARTER_CHALLENGE_LEVEL));
export const PROOF_SIMPLICITY_VALUES = Object.freeze(Object.values(PROOF_SIMPLICITY));
export const PROVIDER_BADGE_KEY_VALUES = Object.freeze(Object.values(PROVIDER_BADGE_KEY));
export const SAVED_PROVIDER_SOURCE_VALUES = Object.freeze(Object.values(SAVED_PROVIDER_SOURCE));
export const SAVED_PROVIDER_STATUS_VALUES = Object.freeze(Object.values(SAVED_PROVIDER_STATUS));
export const OUTCOME_OFFER_STATUS_VALUES = Object.freeze(Object.values(OUTCOME_OFFER_STATUS));
export const OUTCOME_OFFER_VISIBILITY_VALUES = Object.freeze(Object.values(OUTCOME_OFFER_VISIBILITY));
export const OFFER_AVAILABILITY_STATUS_VALUES = Object.freeze(Object.values(OFFER_AVAILABILITY_STATUS));
export const OFFER_PRICE_TYPE_VALUES = Object.freeze(Object.values(OFFER_PRICE_TYPE));
export const OFFER_DELIVERY_TYPE_VALUES = Object.freeze(Object.values(OFFER_DELIVERY_TYPE));
export const MESSAGE_TYPE_VALUES = Object.freeze(Object.values(MESSAGE_TYPES));
export const CONVERSATION_TYPE_VALUES = Object.freeze(Object.values(CONVERSATION_TYPES));
export const NOTIFICATION_TYPE_VALUES = Object.freeze(Object.values(NOTIFICATION_TYPES));
export const DISPUTE_STATUS_VALUES = Object.freeze(Object.values(DISPUTE_STATUS));
export const PAYMENT_STATUS_VALUES = Object.freeze(Object.values(PAYMENT_STATUS));
