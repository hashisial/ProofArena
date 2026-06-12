import { ArrowRight, CircleAlert, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

export function ProofGapAnalysis({ readiness = {} }) {
  const actions = readiness.suggestedActions ?? [];
  const suggestions = readiness.usageSuggestions ?? [];

  return (
    <Card as="section" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Proof gap analysis</CardTitle>
        <CardDescription>Prioritized improvements based on your current assets, offers, plans, and profile signals.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {actions.length > 0 ? (
          <ol className="grid gap-3">
            {actions.map((action) => (
              <li className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={action.key}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-[#A16207]" />
                      <p className="font-black text-[#1C1917]">{action.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#78716C]">{action.description}</p>
                  </div>
                  <Badge variant={action.priority === "High" ? "secondary" : "gray"}>{action.priority}</Badge>
                </div>
                <Button as={Link} className="mt-4" to={action.route} variant="outline">
                  {action.ctaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] p-4 text-sm font-bold leading-6 text-[#3F6212]">
            Your core proof readiness checks are complete. Keep assets current and relevant to the work you pursue.
          </p>
        )}

        <div>
          <h3 className="text-sm font-black text-[#1C1917]">Suggested places to use proof</h3>
          {suggestions.length > 0 ? (
            <ul className="mt-3 grid gap-3">
              {suggestions.slice(0, 4).map((suggestion) => (
                <li className="flex flex-col gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={`${suggestion.assetId}-${suggestion.contextType}-${suggestion.contextTitle}`}>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-black text-[#1C1917]">
                      <Link2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3F6212]" />
                      {suggestion.assetTitle}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#78716C]">
                      Matches {suggestion.contextType} “{suggestion.contextTitle}” through {suggestion.matches.slice(0, 3).join(", ")}.
                    </p>
                  </div>
                  <Button as={Link} className="shrink-0" to={suggestion.route} variant="secondary">Review</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#78716C]">
              Matching suggestions will appear when proof assets share categories, skills, or tools with an offer or execution plan.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
