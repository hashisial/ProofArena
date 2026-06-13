import { Lightbulb } from "lucide-react";
import { getPlanImprovementTips } from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { Card } from "../ui/Card.jsx";

export function PlanImprovementTips({ plan }) {
  const tips = getPlanImprovementTips(plan);

  return (
    <Card as="section" aria-labelledby="plan-improvement-title" id="improvement-tips" padding="lg" variant="muted">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ECFCCB] text-[#A16207]">
          <Lightbulb aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-black text-[#1C1917]" id="plan-improvement-title">Rule-based improvement tips</h2>
          <p className="mt-1 text-sm leading-6 text-[#78716C]">Practical checks based only on the visible fields in this execution plan.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3">
        {tips.length > 0 ? tips.map((tip) => (
          <p className="rounded-2xl border border-[#E7E5E4] bg-white p-4 text-sm font-bold leading-6 text-[#44403C]" key={tip}>
            {tip}
          </p>
        )) : (
          <p className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] p-4 text-sm font-bold leading-6 text-[#365314]">
            This plan covers the core proof, risk, communication, and approach checks.
          </p>
        )}
      </div>
    </Card>
  );
}
