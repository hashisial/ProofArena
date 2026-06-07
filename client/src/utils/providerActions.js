import { ROUTES } from "../constants/index.js";

const PRIORITY_ORDER = Object.freeze({
  high: 0,
  medium: 1,
  low: 2,
});

function opportunityId(opportunity = {}) {
  return opportunity.id || opportunity._id;
}

function isDue(nextAction = {}, now = Date.now()) {
  if (!nextAction.dueAt || nextAction.completed) return false;

  const dueAt = new Date(nextAction.dueAt).getTime();
  return Number.isFinite(dueAt) && dueAt <= now;
}

function sortActions(actions = []) {
  return actions
    .map((action, index) => ({ ...action, order: index }))
    .sort((left, right) => {
      const priorityDifference =
        (PRIORITY_ORDER[left.priority] ?? PRIORITY_ORDER.low) -
        (PRIORITY_ORDER[right.priority] ?? PRIORITY_ORDER.low);

      return priorityDifference || left.order - right.order;
    })
    .map((action) => {
      const normalizedAction = { ...action };
      delete normalizedAction.order;
      return normalizedAction;
    });
}

export function buildProviderActions({
  matches = null,
  offers = null,
  opportunities = null,
  opportunityStats = null,
  plans = null,
  proofAssets = null,
  readiness = {},
  now = Date.now(),
} = {}) {
  const actions = [];
  const profileMissing = (readiness.missingItems ?? []).filter((item) => item.category === "profile");
  const dueOpportunity = opportunities?.find((opportunity) => isDue(opportunity.nextAction, now));
  const dueOpportunityCount = opportunityStats === null
    ? 0
    : Number(opportunityStats.overdue ?? 0) + Number(opportunityStats.dueSoon ?? 0);
  const shortlistedCount = plans?.filter((plan) => plan.status === "shortlisted").length ?? 0;
  const hasSubmittedPlan = plans?.some((plan) =>
    ["accepted", "archived", "expired", "rejected", "shortlisted", "submitted", "viewed", "withdrawn"].includes(plan.status),
  );

  if (profileMissing.length > 0) {
    actions.push({
      ctaLabel: "Complete Profile",
      description: `${profileMissing.length} profile readiness check${profileMissing.length === 1 ? "" : "s"} still need attention before clients can assess your fit.`,
      icon: "profile",
      priority: "high",
      route: ROUTES.PROFILE,
      title: "Complete your profile",
    });
  }

  if (offers !== null && !offers.some((offer) => offer.status === "published")) {
    const hasDraftOffer = offers.some((offer) => offer.status === "draft");
    actions.push({
      ctaLabel: hasDraftOffer ? "Manage Offers" : "Create Outcome Offer",
      description: hasDraftOffer
        ? "Finish and publish an existing draft so clients can understand the measurable result you deliver."
        : "Publish a measurable outcome offer so clients can understand the result you deliver.",
      icon: "offer",
      priority: "high",
      route: hasDraftOffer ? ROUTES.MY_OUTCOME_OFFERS : ROUTES.NEW_OUTCOME_OFFER,
      title: hasDraftOffer ? "Publish an outcome offer" : "Create your first outcome offer",
    });
  }

  if (proofAssets !== null && proofAssets.length === 0) {
    actions.push({
      ctaLabel: "Add Proof",
      description: "Add a reusable result, sample, report, or work record to support future offers and plans.",
      icon: "proof",
      priority: "high",
      route: `${ROUTES.PROOF_VAULT}?new=1`,
      title: "Add proof to your Proof Vault",
    });
  }

  if (dueOpportunity || dueOpportunityCount > 0) {
    const id = opportunityId(dueOpportunity);
    actions.push({
      ctaLabel: "Complete Action",
      description:
        dueOpportunity?.nextAction?.title ||
        `${dueOpportunityCount} provider-owned opportunity action${dueOpportunityCount === 1 ? " is" : "s are"} due soon or overdue.`,
      icon: "opportunity",
      priority: "high",
      route: id ? ROUTES.OPPORTUNITY_DETAIL(id) : ROUTES.OPPORTUNITY_PIPELINE,
      title: "Complete due opportunity action",
    });
  }

  if (shortlistedCount > 0) {
    actions.push({
      ctaLabel: "Open Pipeline",
      description: `${shortlistedCount} execution plan${shortlistedCount === 1 ? " is" : "s are"} shortlisted and ready for focused follow-up.`,
      icon: "shortlist",
      priority: "high",
      route: ROUTES.OPPORTUNITY_PIPELINE,
      title: "Follow up on shortlisted opportunity",
    });
  }

  if (matches !== null && matches.length > 0) {
    actions.push({
      ctaLabel: "Review Matches",
      description: `${matches.length} matched challenge${matches.length === 1 ? " is" : "s are"} available for fit review.`,
      icon: "match",
      priority: "medium",
      route: ROUTES.MATCHED_CHALLENGES,
      title: "Review matched challenges",
    });
  }

  if (plans !== null && !hasSubmittedPlan) {
    actions.push({
      ctaLabel: "Explore Challenges",
      description: "Choose one clear outcome challenge and submit a structured execution plan.",
      icon: "plan",
      priority: "medium",
      route: ROUTES.CHALLENGES,
      title: "Submit your first execution plan",
    });
  }

  return sortActions(actions).slice(0, 5);
}
