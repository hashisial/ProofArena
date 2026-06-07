import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanPreview } from "../components/executionPlans/ExecutionPlanPreview.jsx";
import { ExecutionPlanQualityCard } from "../components/executionPlans/ExecutionPlanQualityCard.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import { PlanImprovementTips } from "../components/executionPlans/PlanImprovementTips.jsx";
import { ProviderPlanPerformancePanel } from "../components/executionPlans/ProviderPlanPerformancePanel.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { formatDate } from "../utils/formatDate.js";
import {
  canEditExecutionPlan,
  canWithdrawExecutionPlan,
  formatPlanPrice,
  formatPlanTimeline,
  getExecutionPlanApiErrorMessage,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useExecutionPlan,
  useWithdrawExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";

function DetailList({ empty = "Nothing added yet.", items = [], title, type }) {
  return (
    <Card padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={`${item.title || item.risk}-${index}`}>
            <p className="font-black text-[#07030D]">{item.title || item.risk}</p>
            {item.description || item.mitigation ? (
              <p className="mt-1 text-sm leading-6 text-[#6F657C]">{item.description || item.mitigation}</p>
            ) : null}
            {item.deliverable ? <p className="mt-2 text-sm font-semibold text-[#493C5E]">Deliverable: {item.deliverable}</p> : null}
            {type === "proof" && item.proofType ? <Badge className="mt-3" variant="green">{item.proofType.replaceAll("_", " ")}</Badge> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#6F657C]">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function ExecutionPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const planQuery = useExecutionPlan(planId);
  const withdrawMutation = useWithdrawExecutionPlan();
  const plan = planQuery.data;

  if (planQuery.isLoading) {
    return <PageLoader description="Loading execution plan details." title="Loading execution plan" />;
  }

  if (planQuery.isError || !plan) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Plan unavailable</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#07030D]">Execution plan could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#6F657C]">
          {getExecutionPlanApiErrorMessage(planQuery.error, "This execution plan may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.MY_EXECUTION_PLANS}>
          Back to plans
        </Button>
      </Card>
    );
  }

  async function handleWithdraw() {
    if (!window.confirm("Archive this execution plan?")) {
      return;
    }

    await withdrawMutation.mutateAsync(plan.id);
    navigate(ROUTES.MY_EXECUTION_PLANS);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {canEditExecutionPlan(plan.status) ? (
              <Button as={Link} to={ROUTES.EDIT_EXECUTION_PLAN(plan.id)} variant="secondary">Edit</Button>
            ) : null}
            {canWithdrawExecutionPlan(plan.status) ? (
              <Button isLoading={withdrawMutation.isPending} onClick={handleWithdraw} type="button" variant="outline">
                Archive
              </Button>
            ) : null}
          </div>
        }
        backFallback={ROUTES.MY_EXECUTION_PLANS}
        description={plan.summary}
        eyebrow="Provider execution plan"
        showBack
        title={plan.title}
      />

      <div className="flex flex-wrap gap-2">
        <ExecutionPlanStatusBadge status={plan.status} />
        <Badge variant="outline">
          {plan.planScore?.score === undefined || plan.planScore?.score === null
            ? "Plan score not available"
            : `${plan.planScore.score}/100 score`}
        </Badge>
        {plan.challenge?.title ? <Badge variant="secondary">{plan.challenge.title}</Badge> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card padding="md" variant="muted">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Challenge summary</p>
              <h2 className="mt-3 text-xl font-black text-[#07030D]">{plan.challenge?.title || "Challenge not available"}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                {plan.challenge?.shortSummary || plan.challenge?.targetOutcome?.outcomeStatement || "The public challenge summary is not available."}
              </p>
              {plan.challenge?.category ? <Badge className="mt-4" variant="outline">{plan.challenge.category}</Badge> : null}
            </Card>
            <Card padding="md" variant="bordered">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Status and decision history</p>
              <div className="mt-4 grid gap-3 text-sm">
                <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Submitted</span><span className="font-black text-[#07030D]">{formatDate(plan.submittedAt || plan.createdAt)}</span></p>
                {plan.viewedAt ? <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Viewed</span><span className="font-black text-[#07030D]">{formatDate(plan.viewedAt)}</span></p> : null}
                {plan.shortlistedAt ? <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Shortlisted</span><span className="font-black text-[#07030D]">{formatDate(plan.shortlistedAt)}</span></p> : null}
                {plan.acceptedAt ? <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Accepted</span><span className="font-black text-[#07030D]">{formatDate(plan.acceptedAt)}</span></p> : null}
                {plan.rejectedAt ? <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Rejected</span><span className="font-black text-[#07030D]">{formatDate(plan.rejectedAt)}</span></p> : null}
                {plan.archivedAt || plan.withdrawnAt ? <p className="flex flex-wrap justify-between gap-2"><span className="font-bold text-[#6F657C]">Archived</span><span className="font-black text-[#07030D]">{formatDate(plan.archivedAt || plan.withdrawnAt)}</span></p> : null}
              </div>
            </Card>
          </div>

          <ProviderPlanPerformancePanel plan={plan} />

          <Card padding="lg" variant="default">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">Approach</p>
            <p className="mt-3 text-sm leading-7 text-[#493C5E]">{plan.approach}</p>
            {plan.whyThisProvider ? (
              <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Why this provider</p>
                <p className="mt-2 text-sm leading-6 text-[#493C5E]">{plan.whyThisProvider}</p>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Timeline</p>
                <p className="mt-1 font-black text-[#07030D]">{formatPlanTimeline(plan.timeline)}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Price</p>
                <p className="mt-1 font-black text-[#07030D]">{formatPlanPrice(plan.price)}</p>
              </div>
            </div>
          </Card>

          <DetailList items={plan.milestones} title="Milestones" />
          <DetailList items={plan.proofPlan} title="Proof plan" type="proof" />
          <DetailList items={plan.riskHandling} title="Risk handling" />

          <Card padding="md" variant="muted">
            <h2 className="text-lg font-black text-[#07030D]">Communication and availability</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">
              Updates: {plan.communicationPlan?.updateFrequency?.replaceAll("_", " ") || "Milestone based"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#6F657C]">
              Can start: {plan.availability?.canStart?.replaceAll("_", " ") || "This week"}
            </p>
            {plan.clientFeedback?.rejectionReason || plan.clientFeedback?.shortlistNote || plan.clientFeedback?.acceptedNote ? (
              <div className="mt-4 rounded-2xl border border-[#E9E2F3] bg-white p-4">
                <p className="font-black text-[#07030D]">Client feedback</p>
                <p className="mt-1 text-sm leading-6 text-[#6F657C]">
                  {plan.clientFeedback.rejectionReason || plan.clientFeedback.shortlistNote || plan.clientFeedback.acceptedNote}
                </p>
              </div>
            ) : null}
          </Card>
          <PlanImprovementTips plan={plan} />
        </div>
        <aside className="grid gap-5">
          <ExecutionPlanPreview plan={plan} />
          <ExecutionPlanQualityCard plan={plan} />
        </aside>
      </div>
    </div>
  );
}
