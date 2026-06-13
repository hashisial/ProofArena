import { CheckCircle2, CircleAlert, Trophy } from "lucide-react";
import { getReadinessLabel } from "../../features/firstClient/firstClientUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

export function FirstClientReadinessScore({ checks = [], score = 0 }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0));
  const label = getReadinessLabel(value);
  const completedChecks = checks.filter((check) => check.complete);
  const missingChecks = checks.filter((check) => !check.complete);
  const ready = value >= 61;

  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
            <Trophy aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <Badge variant={ready ? "green" : "primary"}>{label}</Badge>
            <CardTitle className="mt-3">First Client Readiness Score</CardTitle>
            <CardDescription>
              A rule-based 100-point score from profile, headline, skills, proof, offers, availability, and first execution plan progress.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black tracking-normal text-[#1C1917]">{value}</span>
              <span className="pb-2 text-sm font-black text-[#78716C]">/100</span>
            </div>
            <p className="mt-2 text-sm font-bold text-[#78716C]">
              {completedChecks.length} of {checks.length} readiness checks complete
            </p>
          </div>
          <Badge variant={missingChecks.length === 0 ? "green" : "secondary"}>
            {missingChecks.length === 0 ? "Ready for first win" : `${missingChecks.length} gap${missingChecks.length === 1 ? "" : "s"} left`}
          </Badge>
        </div>

        <div
          aria-label={`First client readiness score ${value} out of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={value}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#E7E5E4]"
          role="progressbar"
        >
          <div className="h-full rounded-full bg-[#3F6212] transition-[width]" style={{ width: `${value}%` }} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {checks.map((check) => {
            const Icon = check.complete ? CheckCircle2 : CircleAlert;

            return (
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={check.key}>
                <div className="flex items-start gap-3">
                  <Icon
                    aria-hidden="true"
                    className={check.complete ? "mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" : "mt-0.5 h-5 w-5 shrink-0 text-[#A16207]"}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#1C1917]">{check.label}</p>
                    <p className="mt-1 text-xs font-bold text-[#78716C]">
                      {check.complete ? "Complete" : `${check.points} points available`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
