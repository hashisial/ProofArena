import { CheckCircle2, CircleAlert, CircleDashed, ShieldCheck, UserRoundCheck } from "lucide-react";
import { createElement } from "react";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

function ReadinessItem({ complete, label, points }) {
  const Icon = complete === true ? CheckCircle2 : complete === false ? CircleAlert : CircleDashed;
  const variant = complete === true ? "green" : complete === false ? "primary" : "gray";

  return (
    <li className="flex min-w-0 items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#3F6212]">
        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-black text-[#1C1917]">{label}</p>
        <Badge className="mt-2" size="sm" variant={variant}>
          {complete === true ? "Complete" : complete === false ? `${points} points available` : "Not available"}
        </Badge>
      </div>
    </li>
  );
}

export function ProviderReadinessCard({ isLoading = false, proofReadiness = {}, readiness = {} }) {
  const score = readiness.score;
  const progress = typeof score === "number" ? score : 0;
  const completedItems = readiness.completedItems ?? [];
  const missingItems = readiness.missingItems ?? [];
  const unavailableItems = readiness.unavailableItems ?? [];
  const nextAction = readiness.nextAction ?? {};
  const strongestArea = readiness.strongestArea;
  const weakestArea = readiness.weakestArea;

  return (
    <Card as="section" className="h-full" padding="lg" variant="elevated">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
            <UserRoundCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle as="h2">Provider Readiness</CardTitle>
            <CardDescription>A rule-based score showing what to fix before competing for client work.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-28" />
            {[0, 1, 2].map((item) => <Skeleton className="h-20" key={item} />)}
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#57534E]">Readiness score</p>
                  <p className="mt-1 text-4xl font-black text-[#1C1917]">
                    {typeof score === "number" ? `${score}/100` : "Not available"}
                  </p>
                </div>
                <Badge variant={typeof score === "number" && score >= 70 ? "green" : "primary"}>
                  {readiness.label ?? "Readiness unavailable"}
                </Badge>
              </div>
              <div
                aria-label={typeof score === "number" ? `Provider readiness ${score} out of 100` : "Provider readiness unavailable"}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={typeof score === "number" ? score : undefined}
                className="mt-5 h-3 overflow-hidden rounded-full bg-white"
                role="progressbar"
              >
                <div className="h-full rounded-full bg-[#3F6212] transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs font-bold text-[#57534E]">
                {completedItems.length} of {completedItems.length + missingItems.length} available checks complete
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7FEE7] text-[#3F6212]">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#1C1917]">Proof readiness</p>
                    <Badge variant={Number(proofReadiness?.score ?? 0) >= 70 ? "green" : "secondary"}>
                      {proofReadiness ? `${Number(proofReadiness.score ?? 0)}/100` : "Not available"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#78716C]">
                    {proofReadiness?.label ?? "Proof readiness could not be calculated from the current dashboard data."}
                  </p>
                  <Button as="a" className="mt-3" href={`${ROUTES.PROOF_VAULT}?tab=readiness`} variant="outline">
                    Review Proof Readiness
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Strongest area", strongestArea],
                ["Weakest area", weakestArea],
              ].map(([label, area]) => (
                <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={label}>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
                  <p className="mt-2 text-sm font-black text-[#1C1917]">{area?.label ?? "Not available"}</p>
                  <p className="mt-1 text-xs font-bold text-[#57534E]">
                    {area ? `${area.score}% complete (${area.completed}/${area.total} checks)` : "Current data is unavailable."}
                  </p>
                </div>
              ))}
            </div>

            {missingItems.length > 0 ? (
              <div className="mt-5">
                <h3 className="text-sm font-black text-[#1C1917]">Fix next</h3>
                <ul className="mt-3 grid gap-3">
                  {missingItems.map((item) => <ReadinessItem key={item.key} {...item} />)}
                </ul>
              </div>
            ) : null}

            {completedItems.length > 0 ? (
              <details className="mt-5 rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <summary className="cursor-pointer text-sm font-black text-[#1C1917]">
                  Completed checks ({completedItems.length})
                </summary>
                <ul className="mt-3 grid gap-3">
                  {completedItems.map((item) => <ReadinessItem key={item.key} {...item} />)}
                </ul>
              </details>
            ) : null}

            {unavailableItems.length > 0 ? (
              <p className="mt-4 rounded-2xl border border-[#A16207]/25 bg-[#FEF3C7] p-4 text-sm font-bold text-[#854D0E]">
                Some readiness checks are unavailable because dashboard data could not be loaded.
              </p>
            ) : null}

            {nextAction.label ? (
              <div className="mt-5 rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#3F6212]">Next action</p>
                <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">{nextAction.label}</p>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
      <CardFooter>
        {nextAction.route ? (
          <Button as="a" className="w-full sm:w-auto" href={nextAction.route}>
            {nextAction.ctaLabel || "Review Readiness"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
