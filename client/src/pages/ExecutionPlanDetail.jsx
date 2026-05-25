import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanPreview } from "../components/executionPlans/ExecutionPlanPreview.jsx";
import { ExecutionPlanQualityCard } from "../components/executionPlans/ExecutionPlanQualityCard.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
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
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={`${item.title || item.risk}-${index}`}>
            <p className="font-black text-[#1C1917]">{item.title || item.risk}</p>
            {item.description || item.mitigation ? (
              <p className="mt-1 text-sm leading-6 text-[#78716C]">{item.description || item.mitigation}</p>
            ) : null}
            {item.deliverable ? <p className="mt-2 text-sm font-semibold text-[#44403C]">Deliverable: {item.deliverable}</p> : null}
            {type === "proof" && item.proofType ? <Badge className="mt-3" variant="green">{item.proofType.replaceAll("_", " ")}</Badge> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">{empty}</p>
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
        <h1 className="mt-3 text-3xl font-black text-[#1C1917]">Execution plan could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getExecutionPlanApiErrorMessage(planQuery.error, "This execution plan may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.MY_EXECUTION_PLANS}>
          Back to plans
        </Button>
      </Card>
    );
  }

  async function handleWithdraw() {
    if (!window.confirm("Withdraw this execution plan?")) {
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
                Withdraw
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
        <Badge variant="outline">{plan.planScore?.score ?? 0}/100 score</Badge>
        {plan.challenge?.title ? <Badge variant="secondary">{plan.challenge.title}</Badge> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
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

          <Card padding="md" variant="muted">
            <h2 className="text-lg font-black text-[#1C1917]">Communication and availability</h2>
            <p className="mt-2 text-sm leading-6 text-[#78716C]">
              Updates: {plan.communicationPlan?.updateFrequency?.replaceAll("_", " ") || "Milestone based"}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#78716C]">
              Can start: {plan.availability?.canStart?.replaceAll("_", " ") || "This week"}
            </p>
            {plan.clientFeedback?.rejectionReason || plan.clientFeedback?.shortlistNote || plan.clientFeedback?.acceptedNote ? (
              <div className="mt-4 rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="font-black text-[#1C1917]">Client feedback</p>
                <p className="mt-1 text-sm leading-6 text-[#78716C]">
                  {plan.clientFeedback.rejectionReason || plan.clientFeedback.shortlistNote || plan.clientFeedback.acceptedNote}
                </p>
              </div>
            ) : null}
          </Card>
        </div>
        <aside className="grid gap-5">
          <ExecutionPlanPreview plan={plan} />
          <ExecutionPlanQualityCard plan={plan} />
        </aside>
      </div>
    </div>
  );
}
