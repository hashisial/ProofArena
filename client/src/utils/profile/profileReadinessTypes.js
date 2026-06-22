// @ts-check

import {
  PROFILE_STRENGTH_LEVEL,
  TRUST_READINESS_LEVEL,
} from "../../types/profile.js";

export const PROFILE_SCORE_SOURCE = Object.freeze({
  NOT_CALCULATED: "not_calculated",
  CLIENT_ESTIMATE: "client_estimate",
  SERVER_CALCULATION: "server_calculation",
  AI_AUDIT: "ai_audit",
});

export const PUBLISH_READINESS_STATUS = Object.freeze({
  NOT_EVALUATED: "not_evaluated",
  BLOCKED: "blocked",
  NEEDS_REVIEW: "needs_review",
  READY: "ready",
  PUBLISHED: "published",
});

export const MISSING_REQUIREMENT_SEVERITY = Object.freeze({
  BLOCKING: "blocking",
  WARNING: "warning",
  RECOMMENDED: "recommended",
});

export const RECOMMENDED_IMPROVEMENT_PRIORITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const DEFAULT_PROFILE_SCORE_PLACEHOLDER = Object.freeze({
  value: null,
  level: null,
  calculatedAt: null,
  source: PROFILE_SCORE_SOURCE.NOT_CALCULATED,
  explanation: "Profile scoring is reserved for the future scoring engine.",
});

export const DEFAULT_TRUST_READINESS_PLACEHOLDER = Object.freeze({
  value: null,
  level: null,
  calculatedAt: null,
  source: PROFILE_SCORE_SOURCE.NOT_CALCULATED,
  explanation: "Trust readiness is reserved for the future trust and verification engine.",
});

export const PROFILE_SCORE_LEVELS = Object.freeze(Object.values(PROFILE_STRENGTH_LEVEL));
export const TRUST_READINESS_LEVELS = Object.freeze(Object.values(TRUST_READINESS_LEVEL));

/**
 * Creates a score placeholder without inventing a fake score.
 *
 * @param {Partial<import("../../types/profile.js").ProfileScorePlaceholder>} [overrides]
 * @returns {import("../../types/profile.js").ProfileScorePlaceholder}
 */
export function createProfileScorePlaceholder(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_PROFILE_SCORE_PLACEHOLDER,
    ...overrides,
  });
}

/**
 * Creates a trust readiness placeholder without inventing a fake readiness value.
 *
 * @param {Partial<import("../../types/profile.js").ProfileScorePlaceholder>} [overrides]
 * @returns {import("../../types/profile.js").ProfileScorePlaceholder}
 */
export function createTrustReadinessPlaceholder(overrides = {}) {
  return Object.freeze({
    ...DEFAULT_TRUST_READINESS_PLACEHOLDER,
    ...overrides,
  });
}

/**
 * @param {import("../../types/profile.js").ProfileSectionKey} section
 * @returns {import("../../types/profile.js").SectionCompletionScore}
 */
export function createSectionCompletionPlaceholder(section) {
  return Object.freeze({
    section,
    completedWeight: 0,
    totalWeight: 0,
    percent: null,
    missingRequirements: Object.freeze([]),
  });
}

export function createEmptyProfileReadinessSnapshot() {
  return Object.freeze({
    profileStrengthScore: createProfileScorePlaceholder(),
    trustReadinessScore: createTrustReadinessPlaceholder(),
    publishReadiness: Object.freeze({
      status: PUBLISH_READINESS_STATUS.NOT_EVALUATED,
      blockingRequirements: Object.freeze([]),
      recommendedImprovements: Object.freeze([]),
    }),
  });
}
