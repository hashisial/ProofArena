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

export const RECOMMENDED_PROVIDER_STATUS_OPTIONS = Object.freeze([
  { label: "All statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Viewed", value: "viewed" },
  { label: "Saved", value: "saved" },
  { label: "Invited", value: "invited" },
  { label: "Dismissed", value: "dismissed" },
]);

export const RECOMMENDED_PROVIDER_SORT_OPTIONS = Object.freeze([
  { label: "Best fit", value: "best" },
  { label: "Newest", value: "newest" },
  { label: "Proof score", value: "proof_score" },
  { label: "Availability", value: "availability" },
]);

export const CLIENT_MATCH_STATUS_UPDATES = Object.freeze(["viewed", "saved", "dismissed"]);

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

export function getProviderFitScoreLabel(score = 0) {
  const normalizedScore = Number(score) || 0;

  if (normalizedScore >= 85) return "Best Fit";
  if (normalizedScore >= 70) return "Strong Fit";
  if (normalizedScore >= 40) return "Possible Fit";
  return "Low Fit";
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

export function getBestProviderMatch(matches = []) {
  return [...matches]
    .filter((match) => match?.challenge)
    .sort((left, right) => {
      const scoreDifference = Number(right.matchScore ?? 0) - Number(left.matchScore ?? 0);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      return new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0);
    })[0] ?? null;
}

export function getLatestMatchGeneratedAt(matches = []) {
  return matches
    .map((match) => match?.createdAt)
    .filter(Boolean)
    .sort((left, right) => new Date(right) - new Date(left))[0] ?? null;
}

export function getRecommendedProviderStats(matches = []) {
  const scores = matches.map((match) => Number(match.matchScore ?? 0)).filter(Number.isFinite);

  return {
    averageScore: scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    invited: matches.filter((match) => match.status === "invited").length,
    saved: matches.filter((match) => match.status === "saved").length,
    strong: matches.filter((match) => Number(match.matchScore ?? 0) >= 70).length,
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

export function buildProviderProfilePath(provider = {}) {
  if (provider.username) {
    return `/profile/${encodeURIComponent(provider.username)}`;
  }

  return "/providers";
}

export function buildMatchedOfferPath(provider = {}, offer = {}) {
  if (provider.username && offer.slug) {
    return `/offers/${encodeURIComponent(provider.username)}/${encodeURIComponent(offer.slug)}`;
  }

  return buildProviderProfilePath(provider);
}
