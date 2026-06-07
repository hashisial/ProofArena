import { CheckCircle2, CircleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import {
  calculateOutcomeOfferQuality,
  getQualityLabel,
  outcomeOfferToForm,
} from "../../features/outcomeOffers/outcomeOfferUtils.js";
import { cn } from "../../utils/cn.js";

function getScoreColor(score) {
  if (score >= 90) return "bg-[#7C3AED]";
  if (score >= 70) return "bg-[#A78BFA]";
  if (score >= 40) return "bg-[#6D28D9]";
  return "bg-[#DC2626]";
}

export function OutcomeOfferQualityCard({ form, offer }) {
  const backendScore = offer?.qualityScore?.score;
  const backendMissing = offer?.qualityScore?.missingFields;
  const localQuality = calculateOutcomeOfferQuality(form ?? outcomeOfferToForm(offer));
  const score = Number.isFinite(Number(backendScore)) && !form ? Number(backendScore) : localQuality.score;
  const missingFields = Array.isArray(backendMissing) && !form ? backendMissing : localQuality.missingFields;
  const label = getQualityLabel(score);

  return (
    <Card padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">Offer quality</CardTitle>
        <CardDescription>
          Strong outcome offers are easier for clients to understand, compare, and invite to challenges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-black tracking-[-0.06em] text-[#07030D]">{score}</p>
            <p className="text-sm font-bold text-[#6F657C]">out of 100</p>
          </div>
          <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] px-3 py-2 text-sm font-black text-[#5B21B6]">
            {label}
          </div>
        </div>
        <div
          aria-label={`Outcome offer quality score ${score} out of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={score}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#E9E2F3]"
          role="progressbar"
        >
          <div className={cn("h-full rounded-full transition-all", getScoreColor(score))} style={{ width: `${Math.max(0, Math.min(score, 100))}%` }} />
        </div>
        <div className="mt-5 grid gap-2">
          {missingFields.length > 0 ? (
            missingFields.slice(0, 6).map((field) => (
              <div className="flex items-start gap-2 text-sm font-semibold text-[#6F657C]" key={field}>
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#6D28D9]" />
                <span>{String(field).replaceAll(".", " ")}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2 text-sm font-semibold text-[#5B21B6]">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Core offer fields are ready.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
