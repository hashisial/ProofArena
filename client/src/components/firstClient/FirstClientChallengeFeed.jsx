import { ArrowRight, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import { getFirstClientApiErrorMessage } from "../../features/firstClient/firstClientUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { StarterChallengeCard } from "./StarterChallengeCard.jsx";

export function FirstClientChallengeFeed({
  actionError,
  challenges = [],
  error,
  isError = false,
  isLoading = false,
  matches = [],
  onSaveMatch,
  onRetry,
  profileSkills = [],
  savingMatchId = "",
}) {
  const matchByChallengeId = new Map(
    matches
      .filter((match) => match?.challenge?.id)
      .map((match) => [String(match.challenge.id), match]),
  );
  const normalizedSkills = new Set(profileSkills.map((skill) => String(skill).toLowerCase()));
  const rankedChallenges = [...challenges].sort((left, right) => {
    const leftMatch = matchByChallengeId.get(String(left.id));
    const rightMatch = matchByChallengeId.get(String(right.id));
    const matchDifference = Number(rightMatch?.matchScore ?? 0) - Number(leftMatch?.matchScore ?? 0);

    if (matchDifference !== 0) return matchDifference;

    const planDifference =
      Number(left?.applicationStats?.totalPlans ?? 0) -
      Number(right?.applicationStats?.totalPlans ?? 0);

    if (planDifference !== 0) return planDifference;

    const countSkillMatches = (challenge) =>
      (challenge?.skillsNeeded ?? []).filter((skill) =>
        normalizedSkills.has(String(skill).toLowerCase()),
      ).length;

    return countSkillMatches(right) - countSkillMatches(left);
  });

  return (
    <Card as="section" aria-labelledby="first-client-challenge-feed-title" variant="bordered">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Badge variant="primary">Beginner-friendly opportunities</Badge>
            <CardTitle className="mt-3" id="first-client-challenge-feed-title">
              First Client Challenges Feed
            </CardTitle>
            <CardDescription>
              Real open starter challenges prioritized for clearer scope, simpler proof requirements, and first-client suitability.
            </CardDescription>
          </div>
          <Button as={Link} to={ROUTES.STARTER_CHALLENGES} variant="outline">
            View All
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {actionError ? (
          <p className="mb-4 rounded-2xl border border-[#DC2626]/20 bg-[#FEF2F2] p-3 text-sm font-bold text-[#B91C1C]" role="alert">
            {actionError}
          </p>
        ) : null}
        {isLoading ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {[0, 1].map((item) => <Skeleton className="h-[28rem]" key={item} />)}
          </div>
        ) : isError ? (
          <Card padding="sm" variant="muted">
            <Badge variant="red">Could not load starter challenges</Badge>
            <p className="mt-3 text-sm leading-6 text-[#78716C]">
              {getFirstClientApiErrorMessage(error)}
            </p>
            <Button className="mt-5" onClick={onRetry} type="button">
              Refresh Challenges
            </Button>
          </Card>
        ) : challenges.length === 0 ? (
          <EmptyState
            actionHref={ROUTES.CHALLENGES}
            actionText="Explore All Challenges"
            description="Starter challenges will appear here when open challenges are marked as beginner-friendly."
            icon={Target}
            size="sm"
            title="No starter challenges yet"
            variant="minimal"
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {rankedChallenges.map((challenge) => (
              <StarterChallengeCard
                challenge={challenge}
                isSaving={savingMatchId === matchByChallengeId.get(String(challenge.id))?.id}
                key={challenge.id}
                match={matchByChallengeId.get(String(challenge.id))}
                onSave={onSaveMatch}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
