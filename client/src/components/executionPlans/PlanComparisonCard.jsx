import { formatPlanPrice, formatPlanTimeline } from "../../features/executionPlans/executionPlanUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";

export function PlanComparisonCard({ plan }) {
  return (
    <Card padding="md" variant="muted">
      <div className="flex flex-wrap items-center gap-2">
        <ExecutionPlanStatusBadge status={plan?.status} />
        <Badge variant="outline">{Number(plan?.planScore?.score ?? 0)}/100</Badge>
      </div>
      <h3 className="mt-3 text-lg font-black text-[#07030D]">{plan?.title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Timeline</p>
          <p className="mt-1 font-bold text-[#07030D]">{formatPlanTimeline(plan?.timeline)}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Price</p>
          <p className="mt-1 font-bold text-[#07030D]">{formatPlanPrice(plan?.price)}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Proof</p>
          <p className="mt-1 font-bold text-[#07030D]">{plan?.proofPlan?.length ?? 0} items</p>
        </div>
      </div>
    </Card>
  );
}
