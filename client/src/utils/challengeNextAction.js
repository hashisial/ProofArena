import { ROUTES } from "../constants/routes.js";

export function getChallengeId(challenge) {
  return challenge?.id ?? challenge?._id ?? "";
}

export function getPlansCount(challenge) {
  return Number(challenge?.applicationStats?.totalPlans ?? challenge?.stats?.plansReceived ?? 0);
}

export function getRecommendedProvidersCount(challenge) {
  return Number(challenge?.stats?.matchedProviders ?? challenge?.applicationStats?.recommendedProviders ?? 0);
}

export function getShortlistedPlansCount(challenge) {
  return Number(challenge?.applicationStats?.shortlistedPlans ?? 0);
}

export function getChallengeNextAction(challenge) {
  const challengeId = getChallengeId(challenge);
  const status = challenge?.status ?? "draft";
  const plansCount = getPlansCount(challenge);
  const selectedProvider = Boolean(challenge?.applicationStats?.selectedProviderId);

  if (status === "draft") {
    return {
      action: "publish",
      description: "Publish this challenge to start receiving execution plans.",
      label: "Publish Challenge",
      priority: "high",
      route: challengeId ? ROUTES.EDIT_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  if (status === "open" && plansCount > 0) {
    return {
      description: "Providers have submitted plans. Compare approach, proof, timeline, and fit.",
      label: "Review Plans",
      priority: "high",
      route: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  if (status === "open") {
    return {
      description: "Refresh recommendations or invite best-fit providers to the challenge.",
      label: "View Recommended Providers",
      priority: "normal",
      route: challengeId ? ROUTES.RECOMMENDED_PROVIDERS(challengeId) : ROUTES.PROVIDERS,
    };
  }

  if (status === "reviewing_plans") {
    return {
      description: "Compare execution plans and shortlist the strongest providers.",
      label: "Compare Execution Plans",
      priority: "high",
      route: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  if (status === "provider_selected") {
    return {
      description: selectedProvider
        ? "A provider is selected. Milestone workspace will connect in a later stage."
        : "Provider selection is in progress. Keep reviewing shortlisted plans.",
      disabled: !selectedProvider,
      label: "View Selected Provider",
      priority: "normal",
      route: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  if (status === "in_progress") {
    return {
      description: "Milestone tracking will become available in a later stage.",
      disabled: true,
      label: "Track Work",
      priority: "normal",
    };
  }

  if (status === "proof_review") {
    return {
      description: "Proof review will become available after milestone and proof submission stages.",
      disabled: true,
      label: "Proof Review Later",
      priority: "normal",
    };
  }

  if (status === "completed") {
    return {
      description: "This challenge is completed. Outcome proof will be connected in a later stage.",
      label: "View Outcome",
      priority: "low",
      route: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  if (status === "paused") {
    return {
      action: "publish",
      description: "Resume this challenge when you are ready to receive provider activity again.",
      label: "Resume Challenge",
      priority: "normal",
    };
  }

  if (status === "archived" || status === "cancelled") {
    return {
      description: "This challenge is no longer active. You can review its record from the control panel.",
      label: "View Record",
      priority: "low",
      route: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
    };
  }

  return {
    description: "Open the challenge control panel to choose the next step.",
    label: "View Control Panel",
    priority: "normal",
    route: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
  };
}
