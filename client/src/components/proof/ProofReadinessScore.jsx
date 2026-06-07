import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";

export function ProofReadinessScore({ readiness = {} }) {
  const score = Number(readiness.score ?? 0);
  const nextAction = readiness.suggestedActions?.[0];

  return (
    <Card as="section" className="h-full" padding="lg" variant="elevated">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>Proof readiness</CardTitle>
            <CardDescription>A rule-based view of how prepared your evidence is for client decisions.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-[#57534E]">Readiness score</p>
              <p className="mt-1 text-4xl font-black text-[#1C1917]">{score}/100</p>
            </div>
            <Badge variant={score >= 70 ? "green" : "primary"}>{readiness.label ?? "Weak proof setup"}</Badge>
          </div>
          <div
            aria-label={`Proof readiness ${score} out of 100`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={score}
            className="mt-5 h-3 overflow-hidden rounded-full bg-white"
            role="progressbar"
          >
            <div className="h-full rounded-full bg-[#3F6212]" style={{ width: `${score}%` }} />
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-[#57534E]">{readiness.verificationNote}</p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-sm font-bold text-[#78716C]">Completed checks</p>
            <p className="mt-1 text-2xl font-black text-[#1C1917]">{readiness.completedItems?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-sm font-bold text-[#78716C]">Priority gaps</p>
            <p className="mt-1 text-2xl font-black text-[#1C1917]">{readiness.suggestedActions?.length ?? 0}</p>
          </div>
        </div>

        {readiness.completedItems?.length ? (
          <details className="mt-5 rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <summary className="cursor-pointer text-sm font-black text-[#1C1917]">Completed readiness checks</summary>
            <ul className="mt-3 grid gap-2">
              {readiness.completedItems.map((item) => (
                <li className="flex items-start gap-2 text-sm leading-6 text-[#44403C]" key={item.key}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#3F6212]" />
                  {item.label}
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        {readiness.missingItems?.length ? (
          <details className="mt-3 rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <summary className="cursor-pointer text-sm font-black text-[#1C1917]">Missing readiness checks</summary>
            <ul className="mt-3 grid gap-2">
              {readiness.missingItems.map((item) => (
                <li className="flex items-start gap-2 text-sm leading-6 text-[#44403C]" key={item.key}>
                  <CircleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#A16207]" />
                  {item.label}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </CardContent>
      {nextAction?.route ? (
        <CardFooter>
          <Button as={Link} to={nextAction.route}>{nextAction.ctaLabel}</Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
