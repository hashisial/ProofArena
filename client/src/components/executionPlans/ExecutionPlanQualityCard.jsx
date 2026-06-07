import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  calculateExecutionPlanQuality,
  getExecutionPlanQualityLabel,
} from "../../features/executionPlans/executionPlanUtils.js";
import { Card } from "../ui/Card.jsx";

export function ExecutionPlanQualityCard({ plan }) {
  const quality = calculateExecutionPlanQuality(plan);
  const score = Number(quality.score ?? 0);
  const label = getExecutionPlanQualityLabel(score);
  const missingFields = quality.missingFields ?? [];
  const strengths = quality.strengths ?? [];
  const warnings = quality.warnings ?? [];

  return (
    <Card padding="md" variant="default">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">Plan quality</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-4xl font-black tracking-normal text-[#07030D]">{score}/100</p>
          <p className="mt-1 text-sm font-bold text-[#6F657C]">{label}</p>
        </div>
      </div>
      <div
        aria-label={`Execution plan quality score ${score} out of 100`}
        className="mt-4 h-3 overflow-hidden rounded-full bg-[#E9E2F3]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
      >
        <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <p className="mt-4 text-sm leading-6 text-[#6F657C]">
        Strong plans help clients compare approach, proof, risks, timeline, and delivery confidence.
      </p>
      {strengths.length > 0 ? (
        <div className="mt-4 grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Strengths</p>
          {strengths.slice(0, 4).map((item) => (
            <span className="flex items-center gap-2 text-sm font-semibold text-[#5B21B6]" key={item}>
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {missingFields.length > 0 ? (
        <div className="mt-4 grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Improve next</p>
          {missingFields.slice(0, 5).map((item) => (
            <span className="flex items-center gap-2 text-sm font-semibold text-[#6F657C]" key={item}>
              <CircleAlert aria-hidden="true" className="h-4 w-4 text-[#6D28D9]" />
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {warnings.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-[#6D28D9]/25 bg-[#F8F4FF] p-3 text-sm leading-6 text-[#6F657C]">
          {warnings.slice(0, 2).join(" ")}
        </div>
      ) : null}
    </Card>
  );
}
