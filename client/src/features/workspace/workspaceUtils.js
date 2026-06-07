import { ROUTES } from "../../constants/routes.js";
import {
  getChallengeId,
  getChallengeNextAction,
  getPlansCount,
  getRecommendedProvidersCount,
} from "../../utils/challengeNextAction.js";

export const ACTIVE_WORKSPACE_STATUSES = new Set([
  "open",
  "reviewing_plans",
  "provider_selected",
  "in_progress",
  "proof_review",
]);

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
};

function getDateTime(value) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

export function getProviderId(provider = {}) {
  return String(provider.userId || provider.id || provider._id || provider.user?.id || provider.user?._id || "").trim();
}

export function getProviderName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

export function getSavedProviderChallengeId(savedProvider = {}) {
  return String(savedProvider.challenge?.id || savedProvider.challengeId || "").trim();
}

export function getSelectedProviderId(challenge = {}, plans = []) {
  const challengeProviderId = String(challenge.applicationStats?.selectedProviderId || "").trim();
  if (challengeProviderId) return challengeProviderId;

  const acceptedPlan = plans.find((plan) => plan.status === "accepted");
  return String(acceptedPlan?.providerId || getProviderId(acceptedPlan?.provider) || "").trim();
}

export function getSelectedProviderName(challenge = {}, plans = [], savedProviders = []) {
  const selectedProviderId = getSelectedProviderId(challenge, plans);
  if (!selectedProviderId) return "";

  const acceptedPlan = plans.find((plan) => plan.status === "accepted");
  if (acceptedPlan?.provider) return getProviderName(acceptedPlan.provider);

  const savedProvider = savedProviders.find((item) => getProviderId(item.provider) === selectedProviderId);
  return savedProvider?.provider ? getProviderName(savedProvider.provider) : "Provider selected";
}

export function getChallengeShortlistCount(challenge, savedProviders = []) {
  const challengeId = String(getChallengeId(challenge));

  return savedProviders.filter(
    (item) => getSavedProviderChallengeId(item) === challengeId && item.status === "shortlisted",
  ).length;
}

export function getChallengeHealth(challenge = {}) {
  const status = challenge.status || "draft";
  const plansCount = getPlansCount(challenge);
  const selectedProviderId = String(challenge.applicationStats?.selectedProviderId || "").trim();

  if (status === "completed") {
    return {
      description: "The challenge is complete and remains available as an outcome record.",
      key: "completed",
      label: "Completed",
      tone: "green",
    };
  }

  if (status === "proof_review" || status === "reviewing_plans" || (plansCount > 0 && !selectedProviderId)) {
    return {
      description: "Client review or provider decision activity is waiting for attention.",
      key: "awaiting_review",
      label: "Awaiting Review",
      tone: "bronze",
    };
  }

  if (status === "open" && !selectedProviderId && plansCount === 0) {
    return {
      description: "The challenge is open, but no provider has been selected yet.",
      key: "no_provider",
      label: "No Provider Yet",
      tone: "neutral",
    };
  }

  if (["draft", "paused", "archived", "cancelled"].includes(status)) {
    return {
      description: "The challenge needs a workflow decision before it can move forward.",
      key: "needs_attention",
      label: "Needs Attention",
      tone: "bronze",
    };
  }

  return {
    description: "The challenge has a clear operational state and no immediate blocker.",
    key: "healthy",
    label: "Healthy",
    tone: "olive",
  };
}

export function sortChallengesByActivity(challenges = []) {
  return [...challenges].sort(
    (left, right) =>
      getDateTime(right.updatedAt || right.publishedAt || right.createdAt) -
      getDateTime(left.updatedAt || left.publishedAt || left.createdAt),
  );
}

export function getActiveWorkspaceChallenges(challenges = []) {
  return sortChallengesByActivity(
    challenges.filter((challenge) => ACTIVE_WORKSPACE_STATUSES.has(challenge.status)),
  );
}

export function buildPendingDecisions(challenges = []) {
  return challenges
    .flatMap((challenge) => {
      const challengeId = getChallengeId(challenge);
      const plansCount = getPlansCount(challenge);
      const recommendedCount = getRecommendedProvidersCount(challenge);
      const hasSelectedProvider = Boolean(challenge.applicationStats?.selectedProviderId);
      const base = {
        challengeId,
        challengeTitle: challenge.title || "Outcome challenge",
      };

      if (challenge.status === "proof_review") {
        return [{
          ...base,
          description: "This challenge is marked for review. Open the control panel for the current operational status.",
          href: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
          label: "Open Challenge",
          priority: "medium",
          title: "Challenge awaiting review",
        }];
      }

      if (!hasSelectedProvider && plansCount > 0) {
        return [{
          ...base,
          description: `${plansCount} execution ${plansCount === 1 ? "plan is" : "plans are"} ready for comparison and a provider decision.`,
          href: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
          label: "Review Plans",
          priority: "high",
          title: "Provider selection needed",
        }];
      }

      if (!hasSelectedProvider && ["open", "reviewing_plans"].includes(challenge.status)) {
        return [{
          ...base,
          description: recommendedCount > 0
            ? `${recommendedCount} recommended ${recommendedCount === 1 ? "provider is" : "providers are"} available to review.`
            : "Review provider discovery and recommendations before making a selection.",
          href: challengeId ? ROUTES.CHALLENGE_PROVIDERS(challengeId) : ROUTES.PROVIDERS,
          label: "View Providers",
          priority: "medium",
          title: "No provider selected",
        }];
      }

      return [];
    })
    .sort((left, right) => priorityRank[right.priority] - priorityRank[left.priority])
    .slice(0, 6);
}

export function buildWorkspaceActivity({
  challenges = [],
  focusChallenge = null,
  plans = [],
  savedProviders = [],
}) {
  const events = [];
  const focusChallengeId = String(getChallengeId(focusChallenge));

  challenges.forEach((challenge) => {
    const challengeId = getChallengeId(challenge);
    const href = challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES;

    if (challenge.createdAt) {
      events.push({
        date: challenge.createdAt,
        href,
        kind: "challenge",
        label: "Challenge created",
        title: challenge.title || "Outcome challenge",
      });
    }

    if (challenge.publishedAt) {
      events.push({
        date: challenge.publishedAt,
        href,
        kind: "published",
        label: "Challenge published",
        title: challenge.title || "Outcome challenge",
      });
    }
  });

  plans.forEach((plan) => {
    const planId = plan.id || plan._id;
    const href = focusChallengeId && planId
      ? ROUTES.CLIENT_EXECUTION_PLAN(focusChallengeId, planId)
      : ROUTES.MY_CHALLENGES;
    const providerName = getProviderName(plan.provider);

    events.push({
      date: plan.acceptedAt || plan.shortlistedAt || plan.submittedAt || plan.createdAt,
      href,
      kind: plan.status === "accepted" ? "selected" : "plan",
      label: plan.status === "accepted" ? "Provider selected" : "Execution plan received",
      title: plan.status === "accepted" ? providerName : plan.title || `${providerName} execution plan`,
    });
  });

  savedProviders
    .filter((item) => item.status === "shortlisted")
    .forEach((item) => {
      const challengeId = getSavedProviderChallengeId(item);
      events.push({
        date: item.updatedAt || item.createdAt,
        href: challengeId ? ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS(challengeId) : ROUTES.SAVED_PROVIDERS,
        kind: "shortlist",
        label: "Provider shortlisted",
        title: getProviderName(item.provider),
      });
    });

  return events
    .filter((event) => event.date)
    .sort((left, right) => getDateTime(right.date) - getDateTime(left.date))
    .slice(0, 10);
}

export function getWorkspaceNextAction(challenge) {
  return getChallengeNextAction(challenge);
}
