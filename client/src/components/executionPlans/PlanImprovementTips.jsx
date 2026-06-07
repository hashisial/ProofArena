import { Lightbulb } from "lucide-react";
import { getPlanImprovementTips } from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { Card } from "../ui/Card.jsx";

export function PlanImprovementTips({ plan }) {
  const tips = getPlanImprovementTips(plan);

  return (
    <Card as="section" aria-labelledby="plan-improvement-title" id="improvement-tips" padding="lg" variant="muted">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEF3C7] text-[#6D28D9]">
          <Lightbulb aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#07030D]" id="plan-improvement-title">Rule-based improvement tips</h2>
          <p className="mt-1 text-sm leading-6 text-[#6F657C]">Practical checks based only on the visible fields in this execution plan.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {tips.length > 0 ? tips.map((tip) => (
          <p className="rounded-2xl border border-[#E9E2F3] bg-white p-4 text-sm font-bold leading-6 text-[#493C5E]" key={tip}>
            {tip}
          </p>
        )) : (
          <p className="rounded-2xl border border-[#A78BFA]/20 bg-[#F5F3FF] p-4 text-sm font-bold leading-6 text-[#5B21B6]">
            This plan covers the core proof, risk, communication, and approach checks.
          </p>
        )}
      </div>
    </Card>
  );
}
