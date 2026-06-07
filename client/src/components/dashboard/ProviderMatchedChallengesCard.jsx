import { ArrowRight, CheckCircle2, FileText, Target } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { formatChallengeBudget, formatChallengeTimeline } from "../../features/challenges/challengeUtils.js";
import { buildExecutionPlanApplyPath } from "../../features/matches/matchUtils.js";
import { MatchScoreBadge } from "../matches/MatchScoreBadge.jsx";
import { MatchStatusBadge } from "../matches/MatchStatusBadge.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderMatchedChallengesCard({
  isError = false,
  isLoading = false,
  matches = [],
  onRetry,
}) {
  const visibleMatches = [...matches]
    .sort((left, right) => Number(right.matchScore ?? 0) - Number(left.matchScore ?? 0))
    .slice(0, 3);

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Matched Challenges</CardTitle>
        <CardDescription>Your strongest visible outcome-fit opportunities.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {isLoading ? (
          [0, 1, 2].map((item) => <Skeleton className="h-32" key={item} />)
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Matched challenges could not be loaded. Try again."
            icon={Target}
            onAction={onRetry}
            size="sm"
            title="Could not load matched challenges"
            variant="minimal"
          />
        ) : visibleMatches.length === 0 ? (
          <EmptyState
            actionHref={ROUTES.MATCHED_CHALLENGES}
            actionText="Open Matches"
            description="Matched challenges will appear here after you create outcome offers and refresh matches."
            icon={Target}
            size="sm"
            title="No matched challenges yet"
            variant="minimal"
          />
        ) : (
          visibleMatches.map((match) => {
            const challenge = match.challenge ?? {};

            return (
              <article className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={match.id ?? challenge.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {challenge.category ? <Badge variant="outline">{challenge.category}</Badge> : null}
                    <MatchStatusBadge status={match.status} />
                  </div>
                  <MatchScoreBadge score={match.matchScore} />
                </div>
                <h3 className="mt-3 text-base font-black text-[#1C1917]">{challenge.title || "Matched challenge"}</h3>
                <p className="mt-2 text-sm leading-6 text-[#78716C]">
                  {formatChallengeBudget(challenge.budget)} | {formatChallengeTimeline(challenge.timeline)}
                </p>
                {match.matchReasons?.[0] ? (
                  <p className="mt-3 flex items-start gap-2 break-words text-sm font-bold leading-6 text-[#44403C]">
                    <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#65A30D]" />
                    <span>{match.matchReasons[0]}</span>
                  </p>
                ) : null}
                <div className="mt-4">
                  <Button as="a" className="w-full min-h-10 px-4 py-2 text-xs sm:w-auto" href={buildExecutionPlanApplyPath(challenge)}>
                    <FileText aria-hidden="true" className="mr-2 h-4 w-4" />
                    Submit Plan
                  </Button>
                </div>
              </article>
            );
          })
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.MATCHED_CHALLENGES} variant="secondary">
          View All Matches
          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
