import { Link } from "react-router-dom";
import {
  canDecideExecutionPlan,
  canEditExecutionPlan,
  canShortlistExecutionPlan,
  canWithdrawExecutionPlan,
  formatPlanPrice,
  formatPlanTimeline,
} from "../../features/executionPlans/executionPlanUtils.js";
import {
  getPlanFeedback,
  getProviderPlanNextAction,
} from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";
import { ProviderPlanSummary } from "./ProviderPlanSummary.jsx";
import {
  formatPlanScore,
  getChallengeIdFromPlan,
  getMilestoneCount,
  getPlanId,
  getProofCount,
  getProviderName,
  getRiskCount,
} from "./executionPlanReviewUtils.js";

export function ExecutionPlanCard({
  onAccept,
  onReject,
  onShortlist,
  onWithdraw,
  plan,
  variant = "provider",
}) {
  const isClient = variant === "client";
  const challenge = plan?.challenge ?? {};
  const status = plan?.status ?? "submitted";
  const planId = getPlanId(plan);
  const challengeId = getChallengeIdFromPlan(plan);
  const detailTo = isClient
    ? ROUTES.CLIENT_EXECUTION_PLAN(challengeId || challenge.id || plan.challengeId, planId)
    : ROUTES.EXECUTION_PLAN_DETAIL(planId);
  const editTo = ROUTES.EDIT_EXECUTION_PLAN(planId);
  const feedback = getPlanFeedback(plan);

  return (
    <Card className="h-full" padding="md" variant="default">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <ExecutionPlanStatusBadge status={status} />
          <Badge variant="outline">{formatPlanScore(plan)} plan score</Badge>
          {isClient ? <Badge variant="green">{getProviderName(plan)}</Badge> : null}
        </div>
        <CardTitle className="text-xl">{plan.title}</CardTitle>
        <p className="text-sm leading-6 text-[#78716C]">{plan.summary}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        {isClient ? (
          <ProviderPlanSummary plan={plan} showProfileLink={false} variant="inline" />
        ) : (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Challenge</p>
            <p className="mt-1 font-black text-[#1C1917]">{challenge?.title || "Challenge summary"}</p>
            {challenge?.category ? <p className="mt-2 text-sm font-bold text-[#3F6212]">{challenge.category}</p> : null}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
            <p className="mt-1 font-black text-[#1C1917]">{formatPlanTimeline(plan.timeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Price</p>
            <p className="mt-1 font-black text-[#1C1917]">{formatPlanPrice(plan.price)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{getMilestoneCount(plan)} milestones</Badge>
          <Badge variant="outline">{getProofCount(plan)} proof items</Badge>
          <Badge variant="outline">{getRiskCount(plan)} risks handled</Badge>
          {plan.communicationPlan?.updateFrequency ? (
            <Badge variant="secondary">{plan.communicationPlan.updateFrequency.replaceAll("_", " ")}</Badge>
          ) : null}
          {plan.submittedAt || plan.createdAt ? (
            <Badge variant="gray">Submitted {formatDate(plan.submittedAt || plan.createdAt)}</Badge>
          ) : null}
        </div>
        {!isClient ? (
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Next action</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#44403C]">{getProviderPlanNextAction(plan)}</p>
          </div>
        ) : null}
        {!isClient && feedback ? (
          <div className="rounded-2xl border border-[#A16207]/20 bg-[#FFFBEB] p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#854D0E]">Client feedback</p>
            <p className="mt-2 text-sm leading-6 text-[#57534E]">{feedback}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button as={Link} className="w-full sm:w-auto" to={detailTo}>
          View
        </Button>
        {!isClient && canEditExecutionPlan(status) ? (
          <Button as={Link} className="w-full sm:w-auto" to={editTo} variant="secondary">
            Edit
          </Button>
        ) : null}
        {!isClient && canWithdrawExecutionPlan(status) ? (
          <Button className="w-full sm:w-auto" onClick={() => onWithdraw?.(plan)} type="button" variant="outline">
            Archive
          </Button>
        ) : null}
        {!isClient ? (
          <Button as={Link} className="w-full sm:w-auto" to={`${detailTo}#improvement-tips`} variant="outline">
            Improve Plan
          </Button>
        ) : null}
        {isClient && canDecideExecutionPlan(status) ? (
          <>
            {canShortlistExecutionPlan(status) ? (
              <Button className="w-full sm:w-auto" onClick={() => onShortlist?.(plan)} type="button" variant="secondary">
                Shortlist
              </Button>
            ) : null}
            <Button className="w-full sm:w-auto" onClick={() => onReject?.(plan)} type="button" variant="outline">
              Reject
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => onAccept?.(plan)} type="button">
              Accept
            </Button>
          </>
        ) : null}
      </CardFooter>
    </Card>
  );
}
