import { CheckCircle2, CircleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import {
  calculateChallengeQuality,
  challengeToForm,
  getChallengeQualityLabel,
} from "../../features/challenges/challengeUtils.js";
import { cn } from "../../utils/cn.js";

function getScoreColor(score) {
  if (score >= 90) return "bg-[#3F6212]";
  if (score >= 70) return "bg-[#65A30D]";
  if (score >= 40) return "bg-[#A16207]";
  return "bg-[#DC2626]";
}

export function ChallengeQualityCard({ challenge, form }) {
  const backendScore = challenge?.qualityScore?.score;
  const backendMissing = challenge?.qualityScore?.missingFields;
  const backendWarnings = challenge?.qualityScore?.warnings;
  const localQuality = calculateChallengeQuality(form ?? challengeToForm(challenge));
  const score = Number.isFinite(Number(backendScore)) && !form ? Number(backendScore) : localQuality.score;
  const missingFields = Array.isArray(backendMissing) && !form ? backendMissing : localQuality.missingFields;
  const warnings = Array.isArray(backendWarnings) && !form ? backendWarnings : localQuality.warnings;
  const label = getChallengeQualityLabel(score);

  return (
    <Card padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">Challenge quality</CardTitle>
        <CardDescription>
          Clear challenges help providers submit stronger execution plans with less back-and-forth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-black tracking-[-0.06em] text-[#1C1917]">{score}</p>
            <p className="text-sm font-bold text-[#78716C]">out of 100</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] px-3 py-2 text-sm font-black text-[#365314]">
            {label}
          </div>
        </div>
        <div
          aria-label={`Challenge quality score ${score} out of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={score}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#E7E5E4]"
          role="progressbar"
        >
          <div className={cn("h-full rounded-full transition-all", getScoreColor(score))} style={{ width: `${Math.max(0, Math.min(score, 100))}%` }} />
        </div>
        <div className="mt-5 grid gap-2">
          {missingFields.length > 0 ? (
            missingFields.slice(0, 6).map((field) => (
              <div className="flex items-start gap-2 text-sm font-semibold text-[#78716C]" key={field}>
                <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" />
                <span>{String(field).replaceAll(".", " ")}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2 text-sm font-semibold text-[#365314]">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Core challenge fields are ready.</span>
            </div>
          )}
          {warnings.slice(0, 3).map((warning) => (
            <div className="flex items-start gap-2 text-sm font-semibold text-[#78716C]" key={warning}>
              <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#A16207]" />
              <span>{String(warning).replaceAll("_", " ")}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
