import { API_BASE_URL } from "../../services/apiClient.js";

export const MATCH_STATUS_LABELS = Object.freeze({
  applied: "Applied",
  dismissed: "Dismissed",
  expired: "Expired",
  ignored: "Ignored",
  invited: "Invited",
  new: "New",
  saved: "Saved",
  viewed: "Viewed",
});

export const MATCH_STATUS_OPTIONS = Object.freeze([
  { label: "All statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Viewed", value: "viewed" },
  { label: "Saved", value: "saved" },
  { label: "Ignored", value: "ignored" },
  { label: "Applied", value: "applied" },
  { label: "Dismissed", value: "dismissed" },
]);

export const MATCH_SORT_OPTIONS = Object.freeze([
  { label: "Best match", value: "best" },
  { label: "Newest", value: "newest" },
  { label: "Category", value: "category" },
  { label: "Budget fit", value: "budget_fit" },
]);

export const MATCH_SCORE_OPTIONS = Object.freeze([
  { label: "Any score", value: "" },
  { label: "40%+", value: "40" },
  { label: "70%+", value: "70" },
  { label: "85%+", value: "85" },
]);

export function buildMatchEndpoint(path) {
  const base = String(API_BASE_URL ?? "");

  if (base.endsWith("/api/v1") || base.endsWith("/v1")) {
    return path;
  }

  return `/v1${path}`;
}

export function getMatchApiErrorMessage(error, fallback = "Matches could not be loaded. Please try again.") {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors.map((item) => item.message).filter(Boolean).join(" ");
  }

  return error?.message || fallback;
}

export function getMatchScoreLabel(score = 0) {
  const normalizedScore = Number(score) || 0;

  if (normalizedScore >= 85) return "Best Match";
  if (normalizedScore >= 70) return "Strong Match";
  if (normalizedScore >= 40) return "Possible Match";
  return "Low Match";
}

export function getMatchStats(matches = []) {
  const scores = matches.map((match) => Number(match.matchScore ?? 0)).filter(Number.isFinite);

  return {
    applied: matches.filter((match) => match.status === "applied").length,
    averageScore: scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    new: matches.filter((match) => match.status === "new").length,
    saved: matches.filter((match) => match.status === "saved").length,
    total: matches.length,
  };
}

export function buildExecutionPlanApplyPath(challenge = {}) {
  const params = new URLSearchParams();

  if (challenge.id) params.set("challengeId", challenge.id);
  if (challenge.client?.username) params.set("username", challenge.client.username);
  if (challenge.slug) params.set("slug", challenge.slug);

  const query = params.toString();

  return `/dashboard/plans/new${query ? `?${query}` : ""}`;
}

export function buildPublicChallengePath(challenge = {}) {
  if (challenge.client?.username && challenge.slug) {
    return `/challenges/${encodeURIComponent(challenge.client.username)}/${encodeURIComponent(challenge.slug)}`;
  }

  return "/challenges";
}
