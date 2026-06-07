const DECIDED_STATUSES = new Set(["accepted", "rejected"]);
const SHORTLIST_SUCCESS_STATUSES = new Set(["accepted", "shortlisted"]);
const ARCHIVED_STATUSES = new Set(["archived", "expired", "withdrawn"]);

function normalizeText(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getProviderPlanStats(plans = []) {
  const counts = {
    accepted: 0,
    archived: 0,
    draft: 0,
    rejected: 0,
    shortlisted: 0,
    submitted: 0,
    viewed: 0,
  };

  plans.forEach((plan) => {
    if (ARCHIVED_STATUSES.has(plan?.status)) {
      counts.archived += 1;
      return;
    }

    if (Object.hasOwn(counts, plan?.status)) {
      counts[plan.status] += 1;
    }
  });

  const acquisitionPlans = plans.filter((plan) =>
    plan?.status !== "draft" && !ARCHIVED_STATUSES.has(plan?.status),
  );
  const shortlistSuccesses = acquisitionPlans.filter((plan) =>
    SHORTLIST_SUCCESS_STATUSES.has(plan?.status) || Boolean(plan?.shortlistedAt),
  ).length;
  const decidedPlans = acquisitionPlans.filter((plan) => DECIDED_STATUSES.has(plan?.status));

  return {
    ...counts,
    shortlistRate: acquisitionPlans.length > 0
      ? Math.round((shortlistSuccesses / acquisitionPlans.length) * 100)
      : null,
    total: plans.length,
    winRate: decidedPlans.length > 0
      ? Math.round((counts.accepted / decidedPlans.length) * 100)
      : null,
  };
}

export function getPlanFeedback(plan = {}) {
  return (
    plan.clientFeedback?.rejectionReason ||
    plan.clientFeedback?.shortlistNote ||
    plan.clientFeedback?.acceptedNote ||
    ""
  );
}

export function getProviderPlanNextAction(plan = {}) {
  if (plan.status === "accepted") {
    return "Keep the accepted plan available as a reference for future high-fit challenges.";
  }

  if (plan.status === "shortlisted") {
    return "Review the shortlist note and keep your delivery availability current.";
  }

  if (plan.status === "rejected") {
    return getPlanFeedback(plan)
      ? "Use the client feedback to strengthen your next execution plan."
      : "Compare this plan with stronger submissions and improve its proof and delivery clarity.";
  }

  if (ARCHIVED_STATUSES.has(plan.status)) {
    return "Use this plan as a reference before submitting to another relevant challenge.";
  }

  if (plan.status === "draft") {
    return "Complete the plan details before submitting it to the client.";
  }

  if (plan.status === "viewed") {
    return "The client viewed this plan. Keep your availability current while they review options.";
  }

  return "Monitor the client decision and keep your provider profile and proof assets current.";
}

export function getPlanImprovementTips(plan = {}) {
  const tips = [];
  const approach = String(plan.approach ?? "").trim();
  const proofPlan = Array.isArray(plan.proofPlan) ? plan.proofPlan : [];
  const riskHandling = Array.isArray(plan.riskHandling) ? plan.riskHandling : [];
  const updateFrequency = String(plan.communicationPlan?.updateFrequency ?? "").trim();
  const missingFields = new Set(plan.planScore?.missingFields ?? []);

  if (proofPlan.length === 0 || missingFields.has("proofPlan")) {
    tips.push("Add clear proof items for each milestone.");
  }

  if (riskHandling.length === 0 || missingFields.has("riskHandling")) {
    tips.push("Add risk handling to show client confidence.");
  }

  if (!updateFrequency || missingFields.has("communicationPlan")) {
    tips.push("Explain how often you will update the client.");
  }

  if (approach.length < 250 || missingFields.has("approach")) {
    tips.push("Expand your approach with clear delivery steps.");
  }

  if (missingFields.has("whyThisProvider")) {
    tips.push("Explain why your proof, skills, and experience fit this specific challenge.");
  }

  if (missingFields.has("attachments")) {
    tips.push("Attach a relevant proof asset or case study when it strengthens the plan.");
  }

  return tips;
}

function getSubmittedTimestamp(plan) {
  const timestamp = new Date(plan?.submittedAt || plan?.createdAt || plan?.updatedAt || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function matchesScoreRange(score, range) {
  if (!range || range === "all") return true;
  if (range === "90_plus") return score >= 90;
  if (range === "70_89") return score >= 70 && score < 90;
  if (range === "40_69") return score >= 40 && score < 70;
  if (range === "under_40") return score < 40;
  return true;
}

function matchesDateRange(timestamp, range) {
  if (!range || range === "all") return true;

  const days = {
    last_30: 30,
    last_90: 90,
    last_year: 365,
  }[range];

  return days ? timestamp >= Date.now() - days * 24 * 60 * 60 * 1000 : true;
}

export function filterAndSortProviderPlans(plans = [], filters = {}) {
  const search = normalizeText(filters.search);
  const filtered = plans.filter((plan) => {
    const searchable = normalizeText([
      plan?.title,
      plan?.summary,
      plan?.challenge?.title,
      plan?.challenge?.category,
    ].filter(Boolean).join(" "));
    const score = Number(plan?.planScore?.score ?? 0);
    const timestamp = getSubmittedTimestamp(plan);

    return (
      (!search || searchable.includes(search)) &&
      (!filters.status ||
        filters.status === "all" ||
        plan?.status === filters.status ||
        (filters.status === "archived" && ARCHIVED_STATUSES.has(plan?.status))) &&
      (!filters.category || filters.category === "all" || plan?.challenge?.category === filters.category) &&
      matchesScoreRange(score, filters.scoreRange) &&
      matchesDateRange(timestamp, filters.dateRange)
    );
  });

  return filtered.sort((left, right) => {
    const leftScore = Number(left?.planScore?.score ?? 0);
    const rightScore = Number(right?.planScore?.score ?? 0);
    const leftDate = getSubmittedTimestamp(left);
    const rightDate = getSubmittedTimestamp(right);

    if (filters.sort === "score") return rightScore - leftScore || rightDate - leftDate;
    if (filters.sort === "shortlisted") {
      return Number(SHORTLIST_SUCCESS_STATUSES.has(right?.status)) - Number(SHORTLIST_SUCCESS_STATUSES.has(left?.status)) || rightDate - leftDate;
    }
    if (filters.sort === "accepted") {
      return Number(right?.status === "accepted") - Number(left?.status === "accepted") || rightDate - leftDate;
    }
    if (filters.sort === "needs_improvement") return leftScore - rightScore || rightDate - leftDate;
    return rightDate - leftDate;
  });
}
