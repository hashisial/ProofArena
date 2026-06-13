import { ClipboardList } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { getProviderPlanStats } from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { ExecutionPlanStatusBadge } from "../executionPlans/ExecutionPlanStatusBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderExecutionPlansCard({ isError = false, isLoading = false, onRetry, plans = [], total }) {
  const stats = getProviderPlanStats(plans);
  const latestPlans = [...plans]
    .sort((left, right) => new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0))
    .slice(0, 3);

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Execution Plans</CardTitle>
        <CardDescription>Track submitted plans and client decisions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[0, 1, 2, 3, 4].map((item) => <Skeleton className="h-20" key={item} />)}
            </div>
            <Skeleton className="h-28" />
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Execution plan data could not be loaded. Try again."
            icon={ClipboardList}
            onAction={onRetry}
            size="sm"
            title="Could not load execution plans"
            variant="minimal"
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ["Submitted", stats.submitted],
                ["Shortlisted", stats.shortlisted],
                ["Accepted", stats.accepted],
                ["Rejected", stats.rejected],
                ["Shortlist rate", stats.shortlistRate === null ? "Not available" : `${stats.shortlistRate}%`],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3" key={label}>
                  <p className="text-xs font-bold text-[#78716C]">{label}</p>
                  <p className="mt-1 text-xl font-black text-[#1C1917]">{value}</p>
                </div>
              ))}
            </div>
            {latestPlans.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {latestPlans.map((plan) => (
                  <a className="rounded-2xl border border-[#E7E5E4] bg-white p-3 transition hover:border-[#65A30D]" href={ROUTES.EXECUTION_PLAN_DETAIL(plan.id)} key={plan.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-black text-[#1C1917]">{plan.title || "Execution plan"}</p>
                      <ExecutionPlanStatusBadge status={plan.status} />
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#78716C]">
                      Updated {formatDate(plan.updatedAt || plan.createdAt, { fallback: "recently" })}
                    </p>
                  </a>
                ))}
              </div>
            ) : (
              <EmptyState
                actionHref={ROUTES.CHALLENGES}
                actionText="Explore Challenges"
                description="Submitted execution plans will appear here."
                icon={ClipboardList}
                size="sm"
                title="No execution plans yet"
                variant="minimal"
              />
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.MY_EXECUTION_PLANS}>
          View Plans ({isError ? "Not available" : total ?? plans.length})
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="outline">Explore Challenges</Button>
      </CardFooter>
    </Card>
  );
}
