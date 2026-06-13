import { Link } from "react-router-dom";
import { CheckCircle2, ClipboardList, ListChecks, ShieldAlert, XCircle } from "lucide-react";
import {
  canDecideExecutionPlan,
  canShortlistExecutionPlan,
} from "../../features/executionPlans/executionPlanUtils.js";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";
import {
  formatReviewMetricValue,
  getChallengeIdFromPlan,
  getPlanId,
  getPlanScoreValue,
} from "./executionPlanReviewUtils.js";

function ReviewMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">{label}</p>
      <p className="mt-1 break-words text-base font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function ClientPlanReviewPanel({
  isAccepting = false,
  isRejecting = false,
  isShortlisting = false,
  onAccept,
  onReject,
  onShortlist,
  plan,
  showBackLink = false,
}) {
  const status = plan?.status ?? "submitted";
  const canDecide = canDecideExecutionPlan(status);
  const score = getPlanScoreValue(plan);
  const challengeId = getChallengeIdFromPlan(plan);
  const planId = getPlanId(plan);

  return (
    <Card as="aside" className="xl:sticky xl:top-6" padding="md" variant="elevated">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="primary">Decision center</Badge>
        <ExecutionPlanStatusBadge status={status} />
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-normal text-[#1C1917]">Review this plan</h2>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">
        Compare execution confidence, proof structure, price, timeline, and provider fit before making a client decision.
      </p>

      <div className="mt-5 grid gap-3">
        <ReviewMetric label="Plan score" value={score === null ? "Not available" : `${score}/100`} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <ReviewMetric label="Timeline" value={formatReviewMetricValue(plan, "timeline")} />
          <ReviewMetric label="Price" value={formatReviewMetricValue(plan, "price")} />
          <ReviewMetric label="Milestones" value={formatReviewMetricValue(plan, "milestones")} />
          <ReviewMetric label="Proof plan" value={formatReviewMetricValue(plan, "proof")} />
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#A16207]/25 bg-[#FEFCE8] p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#A16207]" />
          <p className="text-sm leading-6 text-[#57534E]">
            Accepting selects the provider for this challenge. Payments, milestone workspace, messaging, and proof review are later-stage workflows.
          </p>
        </div>
      </div>

      {canDecide ? (
        <div className="mt-6 grid gap-3">
          <Button isLoading={isAccepting} loadingLabel="Accepting..." onClick={onAccept} type="button">
            <CheckCircle2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Accept Plan
          </Button>
          {canShortlistExecutionPlan(status) ? (
            <Button isLoading={isShortlisting} loadingLabel="Shortlisting..." onClick={onShortlist} type="button" variant="secondary">
              <ListChecks aria-hidden="true" className="mr-2 h-4 w-4" />
              Shortlist
            </Button>
          ) : null}
          <Button isLoading={isRejecting} loadingLabel="Rejecting..." onClick={onReject} type="button" variant="outline">
            <XCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4 text-sm leading-6 text-[#78716C]">
          This plan already has a decision. You can still review the details and compare the decision history.
        </div>
      )}

      {showBackLink && challengeId ? (
        <Button as={Link} className="mt-4 w-full" to={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
          <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      ) : null}

      {challengeId && planId ? (
        <p className="mt-4 text-xs font-bold leading-5 text-[#78716C]">
          Plan record: {planId.slice(0, 8)} for challenge {challengeId.slice(0, 8)}
        </p>
      ) : null}
    </Card>
  );
}
