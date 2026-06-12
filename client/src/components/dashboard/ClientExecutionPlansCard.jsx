import { ArrowRight, ClipboardList } from "lucide-react";
import {
  formatPlanScore,
  getPlanId,
  getProviderName,
} from "../executionPlans/executionPlanReviewUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ExecutionPlanStatusBadge } from "../executionPlans/ExecutionPlanStatusBadge.jsx";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

export function ClientExecutionPlansCard({
  activeChallenge,
  isError = false,
  isLoading = false,
  onRetry,
  plans = [],
}) {
  const challengeId = getChallengeId(activeChallenge);
  const recentPlans = plans.slice(0, 4);
  const submittedCount = plans.filter((plan) => plan.status === "submitted").length;
  const shortlistedCount = plans.filter((plan) => plan.status === "shortlisted").length;
  const acceptedCount = plans.filter((plan) => plan.status === "accepted").length;

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Execution Plan Review</CardTitle>
            <CardDescription>
              Recent submitted plans for your active challenge.
            </CardDescription>
          </div>
          {challengeId ? (
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
              Review Plans
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <div className="h-24 animate-pulse rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB]" key={item} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Something went wrong while loading execution plans for this challenge."
            icon={ClipboardList}
            onAction={onRetry}
            size="sm"
            title="Could not load execution plans"
            variant="bordered"
          />
        ) : recentPlans.length > 0 ? (
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{plans.length} total</Badge>
              <Badge variant="primary">{submittedCount} new</Badge>
              <Badge variant="secondary">{shortlistedCount} shortlisted</Badge>
              <Badge variant="green">{acceptedCount} accepted</Badge>
            </div>
            {recentPlans.map((plan) => {
              const planId = getPlanId(plan);

              return (
                <article className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={planId || plan.title}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-base font-black text-[#1C1917]">
                          {plan.title || "Execution plan"}
                        </h3>
                        <ExecutionPlanStatusBadge status={plan.status} />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#78716C]">
                        {getProviderName(plan)} for {activeChallenge?.title || plan.challenge?.title || "your challenge"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 text-sm font-black text-[#3F6212]">
                      Score {formatPlanScore(plan)}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-bold text-[#78716C]">
                      Received {formatDate(plan.submittedAt || plan.createdAt, { fallback: "recently" })}
                    </p>
                    {challengeId && planId ? (
                      <Button
                        as="a"
                        className="min-h-10 px-4 py-2 text-xs"
                        href={ROUTES.CLIENT_EXECUTION_PLAN(challengeId, planId)}
                        variant="outline"
                      >
                        Open Plan
                        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            actionHref={challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES}
            actionText="Review Plans"
            description="Execution plans will appear here after providers apply to your challenges."
            icon={ClipboardList}
            size="sm"
            title="No execution plans yet"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
