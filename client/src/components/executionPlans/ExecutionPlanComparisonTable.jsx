import { Link } from "react-router-dom";
import { CheckCircle2, Eye, ListChecks, XCircle } from "lucide-react";
import {
  canDecideExecutionPlan,
  canShortlistExecutionPlan,
} from "../../features/executionPlans/executionPlanUtils.js";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";
import { ProviderPlanSummary } from "./ProviderPlanSummary.jsx";
import {
  formatPlanScore,
  formatReviewMetricValue,
  getChallengeIdFromPlan,
  getPlanId,
  getProviderName,
} from "./executionPlanReviewUtils.js";

function PlanActions({ onAccept, onReject, onShortlist, plan }) {
  const challengeId = getChallengeIdFromPlan(plan);
  const planId = getPlanId(plan);
  const detailTo = challengeId && planId ? ROUTES.CLIENT_EXECUTION_PLAN(challengeId, planId) : "";

  return (
    <div className="flex flex-col gap-2">
      {detailTo ? (
        <Button as={Link} className="min-h-10 px-4 py-2 text-xs" to={detailTo} variant="outline">
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          Open
        </Button>
      ) : null}
      {canDecideExecutionPlan(plan?.status) ? (
        <>
          {canShortlistExecutionPlan(plan?.status) ? (
            <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => onShortlist?.(plan)} type="button" variant="secondary">
              <ListChecks aria-hidden="true" className="mr-2 h-4 w-4" />
              Shortlist
            </Button>
          ) : null}
          <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => onAccept?.(plan)} type="button">
            <CheckCircle2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button className="min-h-10 px-4 py-2 text-xs" onClick={() => onReject?.(plan)} type="button" variant="outline">
            <XCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </>
      ) : null}
    </div>
  );
}

function MobileComparisonCard({ onAccept, onReject, onShortlist, plan }) {
  return (
    <Card padding="md" variant="default">
      <div className="flex flex-wrap items-center gap-2">
        <ExecutionPlanStatusBadge status={plan?.status} />
        <Badge variant="outline">{formatPlanScore(plan)}</Badge>
      </div>
      <h3 className="mt-3 text-lg font-black text-[#07030D]">{plan?.title || "Execution plan"}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6F657C]">{plan?.summary || "No summary provided."}</p>
      <ProviderPlanSummary className="mt-4" plan={plan} showProfileLink={false} variant="inline" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["Timeline", "timeline"],
          ["Price", "price"],
          ["Proof", "proof"],
          ["Risks", "risks"],
        ].map(([label, key]) => (
          <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3" key={key}>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{label}</p>
            <p className="mt-1 text-sm font-black text-[#07030D]">{formatReviewMetricValue(plan, key)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <PlanActions onAccept={onAccept} onReject={onReject} onShortlist={onShortlist} plan={plan} />
      </div>
    </Card>
  );
}

export function ExecutionPlanComparisonTable({
  onAccept,
  onReject,
  onShortlist,
  plans = [],
}) {
  if (plans.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:hidden">
        {plans.map((plan) => (
          <MobileComparisonCard
            key={getPlanId(plan) || `${plan?.title}-${getProviderName(plan)}`}
            onAccept={onAccept}
            onReject={onReject}
            onShortlist={onShortlist}
            plan={plan}
          />
        ))}
      </div>

      <Card className="hidden lg:block" padding="none" variant="default">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] border-collapse text-left">
            <caption className="sr-only">Execution plan comparison table</caption>
            <thead className="bg-[#F8F4FF]">
              <tr className="border-b border-[#E9E2F3]">
                {["Provider and plan", "Score", "Timeline", "Price", "Proof", "Risks", "Status", "Actions"].map((heading) => (
                  <th className="px-4 py-4 text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]" key={heading} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr className="border-b border-[#E9E2F3] align-top last:border-b-0" key={getPlanId(plan) || `${plan?.title}-${getProviderName(plan)}`}>
                  <td className="max-w-[20rem] px-4 py-4">
                    <p className="font-black text-[#07030D]">{plan?.title || "Execution plan"}</p>
                    <p className="mt-1 text-sm font-semibold text-[#6F657C]">{getProviderName(plan)}</p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#6F657C]">{plan?.summary || "No summary provided."}</p>
                  </td>
                  <td className="px-4 py-4 font-black text-[#07030D]">{formatPlanScore(plan)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#493C5E]">{formatReviewMetricValue(plan, "timeline")}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#493C5E]">{formatReviewMetricValue(plan, "price")}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#493C5E]">{formatReviewMetricValue(plan, "proof")}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#493C5E]">{formatReviewMetricValue(plan, "risks")}</td>
                  <td className="px-4 py-4"><ExecutionPlanStatusBadge status={plan?.status} /></td>
                  <td className="w-44 px-4 py-4">
                    <PlanActions onAccept={onAccept} onReject={onReject} onShortlist={onShortlist} plan={plan} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
