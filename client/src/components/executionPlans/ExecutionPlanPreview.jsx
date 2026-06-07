import {
  formatPlanPrice,
  formatPlanTimeline,
} from "../../features/executionPlans/executionPlanUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";

function text(value, fallback) {
  return String(value ?? "").trim() || fallback;
}

export function ExecutionPlanPreview({ plan }) {
  const milestones = plan?.milestones ?? [];
  const proofPlan = plan?.proofPlan ?? [];
  const tools = plan?.tools ?? [];
  const skills = plan?.skills ?? [];
  const status = plan?.status ?? "submitted";

  return (
    <Card padding="lg" variant="elevated">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="secondary">Client preview</Badge>
        <ExecutionPlanStatusBadge status={status} />
      </div>
      <h2 className="mt-4 text-2xl font-black tracking-normal text-[#07030D]">
        {text(plan?.title, "Execution plan title")}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#6F657C]">
        {text(plan?.summary, "A concise summary of how this plan delivers the outcome.")}
      </p>
      {plan?.whyThisProvider ? (
        <div className="mt-4 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Provider match note</p>
          <p className="mt-2 text-sm leading-6 text-[#493C5E]">{plan.whyThisProvider}</p>
        </div>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Timeline</p>
          <p className="mt-1 font-black text-[#07030D]">{formatPlanTimeline(plan?.timeline)}</p>
        </div>
        <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Price</p>
          <p className="mt-1 font-black text-[#07030D]">{formatPlanPrice(plan?.price)}</p>
        </div>
        <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Milestones</p>
          <p className="mt-1 font-black text-[#07030D]">{milestones.length} planned</p>
        </div>
        <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Proof plan</p>
          <p className="mt-1 font-black text-[#07030D]">{proofPlan.length} items</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {[...tools, ...skills].slice(0, 8).map((item) => (
          <Badge key={item} variant="outline">{item}</Badge>
        ))}
        {plan?.communicationPlan?.updateFrequency ? (
          <Badge variant="green">{plan.communicationPlan.updateFrequency.replaceAll("_", " ")}</Badge>
        ) : null}
        {plan?.riskHandling?.length ? (
          <Badge variant="secondary">{plan.riskHandling.length} risks handled</Badge>
        ) : null}
      </div>
    </Card>
  );
}
