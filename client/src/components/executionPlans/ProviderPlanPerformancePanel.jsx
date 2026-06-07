import { CheckCircle2, CircleAlert, MessageSquareText } from "lucide-react";
import { getExecutionPlanQualityLabel } from "../../features/executionPlans/executionPlanUtils.js";
import { getPlanFeedback } from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { Card } from "../ui/Card.jsx";

export function ProviderPlanPerformancePanel({ plan }) {
  const score = plan?.planScore?.score;
  const hasScore = score !== undefined && score !== null;
  const strengths = plan?.planScore?.strengths ?? [];
  const missingFields = plan?.planScore?.missingFields ?? [];
  const warnings = plan?.planScore?.warnings ?? [];
  const feedback = getPlanFeedback(plan);
  const feedbackLabel = plan?.status === "rejected"
    ? "Rejection reason"
    : plan?.status === "shortlisted"
      ? "Shortlist note"
      : plan?.status === "accepted"
        ? "Accepted note"
        : "Client feedback";

  return (
    <Card as="section" aria-labelledby="plan-performance-title" padding="lg" variant="bordered">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">Performance</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#07030D]" id="plan-performance-title">Plan performance</h2>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">
            {hasScore ? getExecutionPlanQualityLabel(Number(score)) : "Plan score will appear when available."}
          </p>
        </div>
        <p className="text-4xl font-black text-[#07030D]">{hasScore ? `${score}/100` : "Not available"}</p>
      </div>
      {hasScore ? (
        <div
          aria-label={`Plan score ${score} out of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={score}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#E9E2F3]"
          role="progressbar"
        >
          <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${Math.min(Number(score), 100)}%` }} />
        </div>
      ) : null}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black text-[#07030D]">Strengths</p>
          <div className="mt-3 grid gap-2">
            {strengths.length > 0 ? strengths.map((item) => (
              <p className="flex items-start gap-2 text-sm leading-6 text-[#5B21B6]" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
                {item}
              </p>
            )) : <p className="text-sm leading-6 text-[#6F657C]">Strengths will appear as the plan becomes more complete.</p>}
          </div>
        </div>
        <div>
          <p className="text-sm font-black text-[#07030D]">Missing fields and warnings</p>
          <div className="mt-3 grid gap-2">
            {[...missingFields, ...warnings].length > 0 ? [...missingFields, ...warnings].map((item, index) => (
              <p className="flex items-start gap-2 text-sm leading-6 text-[#6F657C]" key={`${item}-${index}`}>
                <CircleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#6D28D9]" />
                {String(item).replaceAll("_", " ")}
              </p>
            )) : <p className="text-sm leading-6 text-[#6F657C]">No missing fields or warnings are currently recorded.</p>}
          </div>
        </div>
      </div>
      {feedback ? (
        <div className="mt-6 rounded-2xl border border-[#6D28D9]/20 bg-[#F8F4FF] p-4">
          <p className="flex items-center gap-2 text-sm font-black text-[#4C1D95]">
            <MessageSquareText aria-hidden="true" className="h-4 w-4" />
            {feedbackLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">{feedback}</p>
        </div>
      ) : null}
    </Card>
  );
}
