import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanCard } from "../components/executionPlans/ExecutionPlanCard.jsx";
import { ExecutionPlanDecisionModal } from "../components/executionPlans/ExecutionPlanDecisionModal.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { useChallenge } from "../features/challenges/useChallenges.js";
import { formatChallengeTimeline } from "../features/challenges/challengeUtils.js";
import {
  getExecutionPlanApiErrorMessage,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useAcceptExecutionPlan,
  useChallengePlans,
  useRejectExecutionPlan,
  useShortlistExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";
import { ClipboardList } from "lucide-react";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Plan score", value: "score" },
  { label: "Price low", value: "price_low" },
  { label: "Price high", value: "price_high" },
];

export function ChallengePlans() {
  const { challengeId } = useParams();
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [decision, setDecision] = useState({ mode: "shortlist", plan: null });
  const filters = { sort, ...(status === "all" ? {} : { status }) };
  const challengeQuery = useChallenge(challengeId);
  const plansQuery = useChallengePlans(challengeId, filters);
  const shortlistMutation = useShortlistExecutionPlan();
  const rejectMutation = useRejectExecutionPlan();
  const acceptMutation = useAcceptExecutionPlan();
  const challenge = challengeQuery.data;
  const plans = plansQuery.data?.items ?? [];
  const selectedMutation =
    decision.mode === "accept"
      ? acceptMutation
      : decision.mode === "reject"
        ? rejectMutation
        : shortlistMutation;

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

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={<Button as={Link} to={ROUTES.OWNER_CHALLENGE(challengeId)} variant="secondary">View Challenge</Button>}
        backFallback={ROUTES.OWNER_CHALLENGE(challengeId)}
        description="Compare provider plans by approach, milestones, proof plan, timeline, price, and plan quality."
        eyebrow="Client review"
        showBack
        title="Execution Plans"
      />

      <Card padding="lg" variant="muted">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
          <div>
            <Badge variant="primary">Challenge summary</Badge>
            <h2 className="mt-3 text-2xl font-black text-[#1C1917]">
              {challenge?.title || "Loading challenge"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#78716C]">
              {challenge?.targetOutcome?.outcomeStatement || challenge?.shortSummary || "Plans submitted by providers will appear here."}
            </p>
          </div>
          <div className="grid gap-3">
            <Badge variant="outline">{challenge?.status || "challenge"}</Badge>
            <Badge variant="outline">{challenge ? formatChallengeTimeline(challenge.timeline) : "Timeline"}</Badge>
            <Badge variant="outline">{challenge?.applicationStats?.totalPlans ?? plans.length} total plans</Badge>
            <Badge variant="outline">{challenge?.applicationStats?.shortlistedPlans ?? plans.filter((plan) => plan.status === "shortlisted").length} shortlisted</Badge>
          </div>
        </div>
      </Card>

      <Card padding="md" variant="bordered">
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Status" onChange={(event) => setStatus(event.target.value)} options={statusOptions} placeholder="" value={status} />
          <Select label="Sort" onChange={(event) => setSort(event.target.value)} options={sortOptions} placeholder="" value={sort} />
        </div>
      </Card>

      {plansQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)}
        </div>
      ) : plansQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load plans</Badge>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            {getExecutionPlanApiErrorMessage(plansQuery.error, "Execution plans could not be loaded.")}
          </p>
        </Card>
      ) : plans.length === 0 ? (
        <EmptyState
          actionHref={ROUTES.OWNER_CHALLENGE(challengeId)}
          actionText="View Challenge"
          description="Plans submitted by providers will appear here."
          icon={ClipboardList}
          title="No execution plans yet"
          variant="spotlight"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {plans.map((plan) => (
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
