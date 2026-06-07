import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ClipboardList, RefreshCcw } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanCard } from "../components/executionPlans/ExecutionPlanCard.jsx";
import { ExecutionPlanComparisonTable } from "../components/executionPlans/ExecutionPlanComparisonTable.jsx";
import { ExecutionPlanDecisionModal } from "../components/executionPlans/ExecutionPlanDecisionModal.jsx";
import { ExecutionPlanFilters } from "../components/executionPlans/ExecutionPlanFilters.jsx";
import {
  buildPlanSearchText,
  getComparableDateValue,
  getComparablePriceValue,
  getComparableScoreValue,
  getComparableTimelineValue,
} from "../components/executionPlans/executionPlanReviewUtils.js";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { useChallenge } from "../features/challenges/useChallenges.js";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
} from "../features/challenges/challengeUtils.js";
import {
  useAcceptExecutionPlan,
  useChallengePlans,
  useRejectExecutionPlan,
  useShortlistExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";

const initialFilters = {
  minPlanScore: "0",
  q: "",
  sort: "newest",
  status: "all",
  viewMode: "cards",
};

function PlanStatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">{value}</p>
    </div>
  );
}

function countPlans(plans, status) {
  return plans.filter((plan) => plan.status === status).length;
}

function sortPlans(plans, sort) {
  const sorted = [...plans];

  if (sort === "highest_score") {
    return sorted.sort((left, right) => getComparableScoreValue(right) - getComparableScoreValue(left));
  }

  if (sort === "lowest_price") {
    return sorted.sort((left, right) => getComparablePriceValue(left) - getComparablePriceValue(right));
  }

  if (sort === "fastest_timeline") {
    return sorted.sort((left, right) => getComparableTimelineValue(left) - getComparableTimelineValue(right));
  }

  if (sort === "shortlisted_first") {
    return sorted.sort((left, right) => {
      const leftRank = left.status === "shortlisted" ? 0 : 1;
      const rightRank = right.status === "shortlisted" ? 0 : 1;
      return leftRank - rightRank || getComparableDateValue(right) - getComparableDateValue(left);
    });
  }

  return sorted.sort((left, right) => getComparableDateValue(right) - getComparableDateValue(left));
}

function filterPlans(plans, filters) {
  const query = filters.q.trim().toLowerCase();
  const minScore = Number(filters.minPlanScore || 0);

  return plans.filter((plan) => {
    if (filters.status !== "all" && plan.status !== filters.status) {
      return false;
    }

    if (minScore > 0 && getComparableScoreValue(plan) < minScore) {
      return false;
    }

    if (query && !buildPlanSearchText(plan).includes(query)) {
      return false;
    }

    return true;
  });
}

function getActiveFilterCount(filters) {
  return [
    filters.q.trim(),
    filters.status !== "all",
    Number(filters.minPlanScore || 0) > 0,
  ].filter(Boolean).length;
}

export function ChallengePlans() {
  const { challengeId } = useParams();
  const [filters, setFilters] = useState(initialFilters);
  const [decision, setDecision] = useState({ mode: "shortlist", plan: null });
  const challengeQuery = useChallenge(challengeId);
  const plansQuery = useChallengePlans(
    challengeId,
    {
      limit: 50,
    },
  );
  const shortlistMutation = useShortlistExecutionPlan();
  const rejectMutation = useRejectExecutionPlan();
  const acceptMutation = useAcceptExecutionPlan();
  const challenge = challengeQuery.data;
  const allPlans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const visiblePlans = useMemo(
    () => sortPlans(filterPlans(allPlans, filters), filters.sort),
    [allPlans, filters],
  );
  const activeFilterCount = getActiveFilterCount(filters);
  const selectedMutation =
    decision.mode === "accept"
      ? acceptMutation
      : decision.mode === "reject"
        ? rejectMutation
        : shortlistMutation;

  const stats = [
    ["Total plans", plansQuery.data?.pagination?.total ?? allPlans.length],
    ["New", countPlans(allPlans, "submitted")],
    ["Shortlisted", countPlans(allPlans, "shortlisted")],
    ["Accepted", countPlans(allPlans, "accepted")],
    ["Rejected", countPlans(allPlans, "rejected")],
  ];

  function openDecision(mode, plan) {
    setDecision({ mode, plan });
  }

  async function handleDecision(payload) {
    await selectedMutation.mutateAsync({
      id: decision.plan.id,
      payload,
    });
    setDecision({ mode: "shortlist", plan: null });
  }

  function clearFilters() {
    setFilters(initialFilters);
  }

  const hasNoPlans = !plansQuery.isLoading && !plansQuery.isError && allPlans.length === 0;
  const hasNoFilteredPlans = !plansQuery.isLoading && !plansQuery.isError && allPlans.length > 0 && visiblePlans.length === 0;

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={<Button as={Link} to={ROUTES.OWNER_CHALLENGE(challengeId)} variant="secondary">View Challenge</Button>}
        backFallback={ROUTES.OWNER_CHALLENGE(challengeId)}
        description="Review provider plans side by side by score, provider fit, approach, milestones, proof plan, timeline, price, and decision status."
        eyebrow="Client review center"
        showBack
        title="Execution Plans"
      />

      <Card padding="lg" variant="muted">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-center">
          <div>
            <Badge variant="primary">Challenge context</Badge>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-[#07030D]">
              {challenge?.title || "Loading challenge"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">
              {challenge?.targetOutcome?.outcomeStatement || challenge?.shortSummary || "Structured provider plans will appear here."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Badge variant="outline">{challenge?.status?.replaceAll("_", " ") || "challenge"}</Badge>
            <Badge variant="outline">{challenge ? formatChallengeBudget(challenge.budget) : "Budget"}</Badge>
            <Badge variant="outline">{challenge ? formatChallengeTimeline(challenge.timeline) : "Timeline"}</Badge>
            <Badge variant="outline">{challenge?.category || "Category not set"}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([label, value]) => (
          <PlanStatCard key={label} label={label} value={value} />
        ))}
      </div>

      <ExecutionPlanFilters
        activeFilterCount={activeFilterCount}
        filters={filters}
        onChange={setFilters}
        onClear={clearFilters}
        resultCount={visiblePlans.length}
        totalCount={allPlans.length}
        viewMode={filters.viewMode}
      />

      {plansQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <Skeleton className="h-80" key={item} />)}
        </div>
      ) : plansQuery.isError ? (
        <EmptyState
          actionText="Retry"
          description="Something went wrong while loading execution plans. Try again."
          icon={RefreshCcw}
          onAction={() => plansQuery.refetch()}
          title="Could not load execution plans"
          variant="spotlight"
        />
      ) : hasNoPlans ? (
        <EmptyState
          actionHref={ROUTES.OWNER_CHALLENGE(challengeId)}
          actionText="View Challenge"
          description="Providers will appear here after they submit structured execution plans to this challenge."
          icon={ClipboardList}
          title="No execution plans yet"
          variant="spotlight"
        />
      ) : hasNoFilteredPlans ? (
        <EmptyState
          actionText="Clear filters"
          description="Try a broader search, lower the plan score filter, or review all statuses."
          icon={ClipboardList}
          onAction={clearFilters}
          title="No plans matched your filters"
          variant="bordered"
        />
      ) : filters.viewMode === "comparison" ? (
        <ExecutionPlanComparisonTable
          onAccept={(nextPlan) => openDecision("accept", nextPlan)}
          onReject={(nextPlan) => openDecision("reject", nextPlan)}
          onShortlist={(nextPlan) => openDecision("shortlist", nextPlan)}
          plans={visiblePlans}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visiblePlans.map((plan) => (
            <ExecutionPlanCard
              key={plan.id}
              onAccept={(nextPlan) => openDecision("accept", nextPlan)}
              onReject={(nextPlan) => openDecision("reject", nextPlan)}
              onShortlist={(nextPlan) => openDecision("shortlist", nextPlan)}
              plan={plan}
              variant="client"
            />
          ))}
        </div>
      )}

      <ExecutionPlanDecisionModal
        isLoading={selectedMutation.isPending}
        isOpen={Boolean(decision.plan)}
        mode={decision.mode}
        onClose={() => setDecision({ mode: "shortlist", plan: null })}
        onConfirm={handleDecision}
        plan={decision.plan}
      />
    </div>
  );
}
