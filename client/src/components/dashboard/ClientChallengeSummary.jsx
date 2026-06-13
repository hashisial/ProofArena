import { ArrowRight, ClipboardList, UsersRound } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { ChallengeStatusBadge } from "../challenges/ChallengeStatusBadge.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/index.js";
import { formatChallengeBudget, formatChallengeTimeline } from "../../features/challenges/challengeUtils.js";

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

function getTargetOutcome(challenge) {
  return (
    challenge?.targetOutcome?.outcomeStatement ||
    challenge?.targetOutcome?.metricName ||
    challenge?.shortSummary ||
    "Outcome target not specified"
  );
}

function getPlansCount(challenge) {
  return Number(challenge?.applicationStats?.totalPlans ?? challenge?.stats?.plansReceived ?? 0);
}

function getRecommendationCount(challenge) {
  return Number(challenge?.stats?.matchedProviders ?? challenge?.applicationStats?.invitedProviders ?? 0);
}

export function ClientChallengeSummary({ challenges = [], isLoading = false }) {
  const latestChallenges = challenges.slice(0, 4);

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Challenge Control</CardTitle>
            <CardDescription>
              Latest draft, open, reviewing, and active outcome challenges.
            </CardDescription>
          </div>
          <Button as="a" className="w-full sm:w-auto" href={ROUTES.MY_CHALLENGES} variant="outline">
            Manage Challenges
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <div className="h-28 animate-pulse rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8]" key={item} />
            ))}
          </div>
        ) : latestChallenges.length > 0 ? (
          <div className="grid gap-3">
            {latestChallenges.map((challenge) => {
              const challengeId = getChallengeId(challenge);

              return (
                <article className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={challengeId || challenge.title}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-lg font-black text-[#1C1917]">
                          {challenge.title || "Untitled challenge"}
                        </h3>
                        <ChallengeStatusBadge status={challenge.status} />
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#78716C]">
                        {getTargetOutcome(challenge)}
                      </p>
                    </div>
                    <div className="grid shrink-0 gap-1 text-left text-xs font-bold text-[#78716C] sm:text-right">
                      <span>{formatChallengeBudget(challenge.budget)}</span>
                      <span>{formatChallengeTimeline(challenge.timeline)}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-white px-3 py-2 font-bold text-[#44403C]">
                      {getPlansCount(challenge)} plans received
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2 font-bold text-[#44403C]">
                      {getRecommendationCount(challenge)} recommended providers
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {challengeId ? (
                      <>
                        <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.OWNER_CHALLENGE(challengeId)}>
                          View
                          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                        </Button>
                        <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
                          <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
                          Review Plans
                        </Button>
                        <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.RECOMMENDED_PROVIDERS(challengeId)} variant="secondary">
                          <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
                          Recommended
                        </Button>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            actionHref={ROUTES.NEW_CHALLENGE}
            actionText="Create Challenge"
            description="Create a measurable outcome challenge to start receiving plans and recommendations."
            size="sm"
            title="No challenges yet"
            variant="spotlight"
          />
        )}
      </CardContent>
      {latestChallenges.length > 0 ? (
        <CardFooter>
          <Button as="a" href={ROUTES.NEW_CHALLENGE}>
            Create Challenge
          </Button>
          <Button as="a" href={ROUTES.PROVIDERS} variant="outline">
            Find Providers
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
