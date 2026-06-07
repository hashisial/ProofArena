import { AlertCircle, ClipboardList } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

function getOpportunityId(opportunity) {
  return opportunity?.id || opportunity?._id;
}

export function ProviderOpportunityPipelineCard({
  isListError = false,
  isLoading = false,
  isStatsError = false,
  onRetry,
  opportunities = [],
  stats = {},
}) {
  const latestOpportunities = [...opportunities]
    .sort((left, right) => new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0))
    .slice(0, 3);
  const overdue = stats.overdue ?? opportunities.filter((item) => item.nextAction?.isOverdue).length;

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Opportunity Pipeline</CardTitle>
        <CardDescription>Acquisition opportunities, decisions, and provider-owned follow-ups.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => <Skeleton className="h-24" key={item} />)}
            </div>
            <Skeleton className="h-28" />
          </div>
        ) : (
          <>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Total opportunities", isStatsError ? "Not available" : stats.total ?? opportunities.length],
            ["Shortlisted", isStatsError ? "Not available" : stats.shortlisted ?? 0],
            ["Won", isStatsError ? "Not available" : stats.won ?? 0],
            ["Due soon", isStatsError ? "Not available" : stats.dueSoon ?? 0],
          ].map(([label, value]) => (
            <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={label}>
              <p className="text-sm font-bold text-[#6F657C]">{label}</p>
              <p className="mt-2 text-2xl font-black text-[#07030D]">{value}</p>
            </div>
          ))}
        </div>
        {!isStatsError && Number(overdue) > 0 ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#6D28D9]/25 bg-[#FEF3C7] p-4 text-[#4C1D95]">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">
              {overdue} overdue follow-up{Number(overdue) === 1 ? "" : "s"} need attention.
            </p>
          </div>
        ) : null}
        {isListError ? (
          <EmptyState
            actionText="Retry"
            description="Opportunity records could not be loaded. Try again."
            icon={ClipboardList}
            onAction={onRetry}
            size="sm"
            title="Could not load opportunities"
            variant="minimal"
          />
        ) : latestOpportunities.length > 0 ? (
          <div className="mt-4 grid gap-2">
            {latestOpportunities.map((opportunity) => {
              const opportunityId = getOpportunityId(opportunity);

              return (
                <a
                  className="rounded-2xl border border-[#E9E2F3] bg-white p-3 transition hover:border-[#A78BFA] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
                  href={opportunityId ? ROUTES.OPPORTUNITY_DETAIL(opportunityId) : ROUTES.OPPORTUNITY_PIPELINE}
                  key={opportunityId || `${opportunity.title}-${opportunity.updatedAt}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="min-w-0 break-words font-black text-[#07030D]">
                      {opportunity.title || "Provider opportunity"}
                    </p>
                    <Badge variant={opportunity.stage === "won" ? "green" : "gray"}>
                      {String(opportunity.stage || "new").replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs font-bold text-[#6F657C]">
                    Updated {formatDate(opportunity.updatedAt || opportunity.createdAt, { fallback: "recently" })}
                  </p>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyState
            actionHref={ROUTES.MATCHED_CHALLENGES}
            actionText="View Matched Challenges"
            description="Matched challenges and submitted plans can become provider-owned opportunities."
            icon={ClipboardList}
            size="sm"
            title="No opportunities yet"
            variant="minimal"
          />
        )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.OPPORTUNITY_PIPELINE}>Open Pipeline</Button>
      </CardFooter>
    </Card>
  );
}
