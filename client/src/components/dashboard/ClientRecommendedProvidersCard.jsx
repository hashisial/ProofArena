import { ArrowRight, UsersRound } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRecommendedProviderStats, MATCH_STATUS_LABELS } from "../../features/matches/matchUtils.js";

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

function getProviderName(match) {
  const provider = match?.provider ?? {};
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function getProviderHeadline(match) {
  return match?.provider?.headline || match?.provider?.bioExcerpt || "Proof-backed provider recommendation";
}

export function ClientRecommendedProvidersCard({
  activeChallenge,
  hasSelectedProvider = false,
  isError = false,
  isLoading = false,
  onRetry,
  recommendations = [],
  shortlistedCount = 0,
}) {
  const challengeId = getChallengeId(activeChallenge);
  const stats = getRecommendedProviderStats(recommendations);
  const topRecommendations = recommendations.slice(0, 3);
  const newRecommendations = recommendations.filter((match) => !match.status || match.status === "new").length;

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Recommended Providers</CardTitle>
            <CardDescription>
              Best-fit providers for {activeChallenge?.title || "your latest active challenge"}.
            </CardDescription>
          </div>
          {challengeId ? (
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGE_PROVIDERS(challengeId)} variant="outline">
              View Providers
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <div className="h-24 animate-pulse rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF]" key={item} />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Something went wrong while loading recommended providers for this challenge."
            icon={UsersRound}
            onAction={onRetry}
            size="sm"
            title="Could not load recommendations"
            variant="bordered"
          />
        ) : topRecommendations.length > 0 ? (
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">New recommendations</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{newRecommendations}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">Shortlisted</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{shortlistedCount}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">Selected provider</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">
                  {hasSelectedProvider ? "Selected" : "None"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <p className="text-sm font-bold text-[#6F657C]">
                  Total recommendations: <span className="text-[#07030D]">{stats.total}</span>
                </p>
                <p className="text-sm font-bold text-[#6F657C]">
                  Best match: <span className="text-[#07030D]">{stats.bestScore}/100</span>
                </p>
                <p className="text-sm font-bold text-[#6F657C]">
                  Strong fits: <span className="text-[#07030D]">{stats.strong}</span>
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {topRecommendations.map((match) => (
                <article className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={match.id || match.provider?.userId || getProviderName(match)}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-base font-black text-[#07030D]">
                          {getProviderName(match)}
                        </h3>
                        <Badge variant="primary">{Number(match.matchScore ?? 0)}% fit</Badge>
                        <Badge variant="gray">{MATCH_STATUS_LABELS[match.status] ?? match.status ?? "New"}</Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F657C]">
                        {getProviderHeadline(match)}
                      </p>
                    </div>
                    {challengeId ? (
                      <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.CHALLENGE_PROVIDERS(challengeId)} variant="outline">
                        Review
                        <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            actionHref={activeChallenge ? (challengeId ? ROUTES.CHALLENGE_PROVIDERS(challengeId) : ROUTES.MY_CHALLENGES) : ROUTES.NEW_CHALLENGE}
            actionText={activeChallenge ? "View Providers" : "Create Challenge"}
            description="Publish a challenge and refresh recommendations to see best-fit providers."
            icon={UsersRound}
            size="sm"
            title="No recommendations yet"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
