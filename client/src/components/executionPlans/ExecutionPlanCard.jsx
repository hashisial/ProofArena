import { Link } from "react-router-dom";
import {
  canDecideExecutionPlan,
  canEditExecutionPlan,
  canWithdrawExecutionPlan,
  formatPlanPrice,
  formatPlanTimeline,
} from "../../features/executionPlans/executionPlanUtils.js";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";

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
  const provider = plan?.provider ?? {};
  const score = Number(plan?.planScore?.score ?? 0);
  const status = plan?.status ?? "submitted";
  const detailTo = isClient
    ? ROUTES.CLIENT_EXECUTION_PLAN(challenge.id ?? plan.challengeId, plan.id)
    : ROUTES.EXECUTION_PLAN_DETAIL(plan.id);
  const editTo = ROUTES.EDIT_EXECUTION_PLAN(plan.id);

  return (
    <Card className="h-full" padding="md" variant="default">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <ExecutionPlanStatusBadge status={status} />
          <Badge variant="outline">{score}/100 plan score</Badge>
          {isClient && provider?.fullName ? <Badge variant="green">{provider.fullName}</Badge> : null}
        </div>
        <CardTitle className="text-xl">{plan.title}</CardTitle>
        <p className="text-sm leading-6 text-[#78716C]">{plan.summary}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
            {isClient ? "Provider" : "Challenge"}
          </p>
          <p className="mt-1 font-black text-[#1C1917]">
            {isClient ? provider?.headline || provider?.title || "Provider summary" : challenge?.title || "Challenge summary"}
          </p>
        </div>
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
          <Badge variant="outline">{plan.milestones?.length ?? 0} milestones</Badge>
          <Badge variant="outline">{plan.proofPlan?.length ?? 0} proof items</Badge>
          {plan.submittedAt ? (
            <Badge variant="gray">Submitted {new Date(plan.submittedAt).toLocaleDateString()}</Badge>
          ) : null}
        </div>
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
            Withdraw
          </Button>
        ) : null}
        {isClient && canDecideExecutionPlan(status) ? (
          <>
            <Button className="w-full sm:w-auto" onClick={() => onShortlist?.(plan)} type="button" variant="secondary">
              Shortlist
            </Button>
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
