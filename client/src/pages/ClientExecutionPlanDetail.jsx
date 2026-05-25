import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanDecisionModal } from "../components/executionPlans/ExecutionPlanDecisionModal.jsx";
import { ExecutionPlanPreview } from "../components/executionPlans/ExecutionPlanPreview.jsx";
import { ExecutionPlanQualityCard } from "../components/executionPlans/ExecutionPlanQualityCard.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import { PlanComparisonCard } from "../components/executionPlans/PlanComparisonCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import {
  canDecideExecutionPlan,
  formatPlanPrice,
  formatPlanTimeline,
  getExecutionPlanApiErrorMessage,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useAcceptExecutionPlan,
  useClientExecutionPlan,
  useRejectExecutionPlan,
  useShortlistExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";

function DetailList({ items = [], title, type }) {
  return (
    <Card padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={`${item.title || item.risk}-${index}`}>
            <p className="font-black text-[#1C1917]">{item.title || item.risk}</p>
            {item.description || item.mitigation ? (
              <p className="mt-1 text-sm leading-6 text-[#78716C]">{item.description || item.mitigation}</p>
            ) : null}
            {item.deliverable ? <p className="mt-2 text-sm font-semibold text-[#44403C]">Deliverable: {item.deliverable}</p> : null}
            {type === "proof" && item.proofType ? <Badge className="mt-3" variant="green">{item.proofType.replaceAll("_", " ")}</Badge> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">Nothing added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ClientExecutionPlanDetail() {
  const { challengeId, planId } = useParams();
  const [decision, setDecision] = useState({ mode: "shortlist", open: false });
  const planQuery = useClientExecutionPlan(planId);
  const shortlistMutation = useShortlistExecutionPlan();
  const rejectMutation = useRejectExecutionPlan();
  const acceptMutation = useAcceptExecutionPlan();
  const plan = planQuery.data;
  const selectedMutation =
    decision.mode === "accept"
      ? acceptMutation
      : decision.mode === "reject"
        ? rejectMutation
        : shortlistMutation;

  if (planQuery.isLoading) {
    return <PageLoader description="Loading execution plan for client review." title="Loading execution plan" />;
  }

  if (planQuery.isError || !plan) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Plan unavailable</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#1C1917]">Execution plan could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getExecutionPlanApiErrorMessage(planQuery.error, "This plan may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.CHALLENGE_PLANS(challengeId)}>
          Back to plans
        </Button>
      </Card>
    );
  }

  async function handleDecision(payload) {
    await selectedMutation.mutateAsync({ id: plan.id, payload });
    setDecision({ mode: "shortlist", open: false });
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          canDecideExecutionPlan(plan.status) ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={() => setDecision({ mode: "shortlist", open: true })} type="button" variant="secondary">
                Shortlist
              </Button>
              <Button onClick={() => setDecision({ mode: "reject", open: true })} type="button" variant="outline">
                Reject
              </Button>
              <Button onClick={() => setDecision({ mode: "accept", open: true })} type="button">
                Accept
              </Button>
            </div>
          ) : null
        }
        backFallback={ROUTES.CHALLENGE_PLANS(challengeId)}
        description={plan.summary}
        eyebrow="Client plan review"
        showBack
        title={plan.title}
      />

      <div className="flex flex-wrap gap-2">
        <ExecutionPlanStatusBadge status={plan.status} />
        <Badge variant="outline">{plan.planScore?.score ?? 0}/100 score</Badge>
        {plan.provider?.fullName ? <Badge variant="green">{plan.provider.fullName}</Badge> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <PlanComparisonCard plan={plan} />
          <Card padding="lg" variant="default">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Approach</p>
            <p className="mt-3 text-sm leading-7 text-[#44403C]">{plan.approach}</p>
            {plan.whyThisProvider ? (
              <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Why this provider</p>
                <p className="mt-2 text-sm leading-6 text-[#44403C]">{plan.whyThisProvider}</p>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatPlanTimeline(plan.timeline)}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Price</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatPlanPrice(plan.price)}</p>
              </div>
            </div>
          </Card>
          <DetailList items={plan.milestones} title="Milestones" />
          <DetailList items={plan.proofPlan} title="Proof plan" type="proof" />
          <DetailList items={plan.riskHandling} title="Risk handling" />
        </div>
        <aside className="grid gap-5">
          <Card padding="md" variant="muted">
            <h2 className="text-lg font-black text-[#1C1917]">Provider summary</h2>
            <p className="mt-2 font-black text-[#1C1917]">{plan.provider?.fullName || "Provider"}</p>
            <p className="mt-1 text-sm leading-6 text-[#78716C]">{plan.provider?.headline || plan.provider?.title || "ProofArena provider"}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{plan.provider?.proofScore ?? 0} proof score</Badge>
              <Badge variant="outline">{plan.provider?.completedOutcomes ?? 0} outcomes</Badge>
            </div>
          </Card>
          <ExecutionPlanQualityCard plan={plan} />
          <ExecutionPlanPreview plan={plan} />
        </aside>
      </div>

      <ExecutionPlanDecisionModal
        isLoading={selectedMutation.isPending}
        isOpen={decision.open}
        mode={decision.mode}
        onClose={() => setDecision({ mode: "shortlist", open: false })}
        onConfirm={handleDecision}
        plan={plan}
      />
    </div>
  );
}
