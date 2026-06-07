import { useMemo } from "react";
import {
  Bookmark,
  ClipboardList,
  FileCheck2,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { ClientChallengeSummary } from "./ClientChallengeSummary.jsx";
import { ClientExecutionPlansCard } from "./ClientExecutionPlansCard.jsx";
import { ClientNextActions } from "./ClientNextActions.jsx";
import { ClientRecentActivity } from "./ClientRecentActivity.jsx";
import { ClientRecommendedProvidersCard } from "./ClientRecommendedProvidersCard.jsx";
import { DashboardStatsCard } from "./DashboardStatsCard.jsx";
import { ROUTES } from "../../constants/index.js";
import { useMyChallenges } from "../../features/challenges/useChallenges.js";
import { useChallengePlans } from "../../features/executionPlans/useExecutionPlans.js";
import { useChallengeRecommendedProviders } from "../../features/matches/useMatches.js";
import { useMySavedProviders } from "../../features/savedProviders/useSavedProviders.js";
import { formatDate } from "../../utils/formatDate.js";
import { formatNumber } from "../../utils/formatNumber.js";

const activeChallengeStatuses = new Set([
  "open",
  "reviewing_plans",
  "provider_selected",
  "in_progress",
  "proof_review",
]);

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

function getProviderName(savedProvider) {
  const provider = savedProvider?.provider ?? {};
  return provider.displayName || provider.fullName || provider.name || provider.username || "Saved provider";
}

function getProviderHeadline(savedProvider) {
  return savedProvider?.provider?.headline || "Provider saved for future outcome work";
}

function sortByNewest(items = []) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
    return rightDate - leftDate;
  });
}

function pickActiveChallenge(challenges = []) {
  const newest = sortByNewest(challenges);
  return (
    newest.find((challenge) => activeChallengeStatuses.has(challenge.status)) ||
    newest.find((challenge) => challenge.status !== "draft") ||
    newest[0] ||
    null
  );
}

function sumChallengeValue(challenges, getter) {
  return challenges.reduce((sum, challenge) => sum + Number(getter(challenge) ?? 0), 0);
}

function DashboardLoadingState() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-56 w-full" rounded="rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <Skeleton className="h-36 w-full" key={item} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export function ClientDashboard() {
  const challengesQuery = useMyChallenges({ limit: 12, sort: "newest" });
  const savedProvidersQuery = useMySavedProviders({ limit: 4, sort: "newest" });
  const challenges = useMemo(() => challengesQuery.data?.items ?? [], [challengesQuery.data?.items]);
  const activeChallenge = useMemo(() => pickActiveChallenge(challenges), [challenges]);
  const activeChallengeId = getChallengeId(activeChallenge);
  const plansQuery = useChallengePlans(
    activeChallengeId,
    { limit: 5, sort: "newest" },
    { enabled: Boolean(activeChallengeId) },
  );
  const recommendationsQuery = useChallengeRecommendedProviders(
    activeChallengeId,
    { limit: 4, sort: "best" },
    { enabled: Boolean(activeChallengeId) },
  );
  const activeChallengeSavedProvidersQuery = useMySavedProviders(
    { challengeId: activeChallengeId, limit: 50, sort: "newest" },
    { enabled: Boolean(activeChallengeId) },
  );

  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const recommendations = useMemo(() => recommendationsQuery.data?.items ?? [], [recommendationsQuery.data?.items]);
  const savedProviders = useMemo(() => savedProvidersQuery.data?.items ?? [], [savedProvidersQuery.data?.items]);
  const activeChallengeSavedProviders = useMemo(
    () => activeChallengeSavedProvidersQuery.data?.items ?? [],
    [activeChallengeSavedProvidersQuery.data?.items],
  );
  const savedStats = savedProvidersQuery.data?.stats ?? {};
  const activeChallengeSavedStats = activeChallengeSavedProvidersQuery.data?.stats ?? {};
  const totalChallenges = challengesQuery.data?.pagination?.total ?? challenges.length;
  const plansReceived = sumChallengeValue(
    challenges,
    (challenge) => challenge.applicationStats?.totalPlans ?? challenge.stats?.plansReceived,
  ) || plans.length;
  const recommendedTotal = sumChallengeValue(
    challenges,
    (challenge) => challenge.stats?.matchedProviders ?? challenge.applicationStats?.recommendedProviders,
  ) || recommendations.length;
  const shortlistedProviders =
    Number(savedStats.shortlisted ?? 0) ||
    savedProviders.filter((item) => item.status === "shortlisted").length;
  const activeChallengeShortlistedProviders =
    Number(activeChallengeSavedStats.shortlisted ?? 0) ||
    activeChallengeSavedProviders.filter((item) => item.status === "shortlisted").length;
  const activeChallengeHasSelectedProvider =
    Boolean(activeChallenge?.applicationStats?.selectedProviderId) ||
    plans.some((plan) => plan.status === "accepted");
  const proofReviewsPending = challenges.filter((challenge) => challenge.status === "proof_review").length;

  const stats = [
    {
      detail: "All client-owned outcome challenges available from existing challenge data.",
      icon: Target,
      label: "Total Challenges",
      value: formatNumber(totalChallenges, { fallback: "0" }),
    },
    {
      detail: "Challenges currently published and open for provider response.",
      icon: ShieldCheck,
      label: "Open Challenges",
      tone: "olive",
      value: formatNumber(challenges.filter((challenge) => challenge.status === "open").length, { fallback: "0" }),
    },
    {
      detail: "Plans counted from challenge stats and the active challenge plan feed.",
      icon: ClipboardList,
      label: "Execution Plans Received",
      tone: "bronze",
      value: formatNumber(plansReceived, { fallback: "0" }),
    },
    {
      detail: "Client-owned saved-provider records marked shortlisted.",
      icon: Bookmark,
      label: "Shortlisted Providers",
      value: formatNumber(shortlistedProviders, { fallback: "0" }),
    },
    {
      detail: "Recommended providers from challenge match signals.",
      icon: UsersRound,
      label: "Recommended Providers",
      value: formatNumber(recommendedTotal, { fallback: "0" }),
    },
    {
      detail: "Proof review workflow is a later stage; this shows known proof-review challenges only.",
      icon: FileCheck2,
      label: "Proof Reviews Pending",
      tone: "neutral",
      value: formatNumber(proofReviewsPending, { fallback: "0" }),
    },
  ];

  if (challengesQuery.isLoading && challenges.length === 0) {
    return <DashboardLoadingState />;
  }

  if (challengesQuery.isError) {
    return (
      <EmptyState
        actionText="Retry"
        description="Something went wrong while loading the client dashboard. Try again."
        icon={Target}
        onAction={() => challengesQuery.refetch()}
        title="Could not load client dashboard"
        variant="spotlight"
      />
    );
  }

  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#7C3AED]/16 bg-[linear-gradient(135deg,#ffffff,#F8F4FF)] p-6 shadow-[0_24px_80px_rgba(31,14,54,0.08)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Badge variant="primary">Client control center</Badge>
            <h1 className="mt-5 max-w-4xl break-words text-3xl font-black tracking-normal text-[#07030D] sm:text-4xl md:text-5xl">
              Client Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#493C5E]">
              Manage outcome challenges, review execution plans, compare providers, and track proof-based work.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CLIENT_WORKSPACE}>
              Open Workspace
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.NEW_CHALLENGE} variant="secondary">
              Create Challenge
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS} variant="outline">
              Find Providers
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="client-dashboard-stats">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
              Overview
            </p>
            <h2 id="client-dashboard-stats" className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
              Workflow at a glance
            </h2>
          </div>
          {activeChallenge ? (
            <p className="text-sm font-bold text-[#6F657C]">
              Active focus: {activeChallenge.title || "Outcome challenge"}
            </p>
          ) : null}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <DashboardStatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="grid min-w-0 gap-5">
          <ClientChallengeSummary challenges={challenges} isLoading={challengesQuery.isFetching} />
          <ClientExecutionPlansCard
            activeChallenge={activeChallenge}
            isError={plansQuery.isError}
            isLoading={plansQuery.isFetching}
            onRetry={() => plansQuery.refetch()}
            plans={plans}
          />
          <ClientRecommendedProvidersCard
            activeChallenge={activeChallenge}
            hasSelectedProvider={activeChallengeHasSelectedProvider}
            isError={recommendationsQuery.isError || activeChallengeSavedProvidersQuery.isError}
            isLoading={recommendationsQuery.isFetching || activeChallengeSavedProvidersQuery.isFetching}
            onRetry={() => {
              recommendationsQuery.refetch();
              activeChallengeSavedProvidersQuery.refetch();
            }}
            recommendations={recommendations}
            shortlistedCount={activeChallengeShortlistedProviders}
          />
          <Card as="section" padding="md" variant="bordered">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Saved Providers</CardTitle>
                  <CardDescription>
                    Providers you may want to compare or invite to future outcome challenges.
                  </CardDescription>
                </div>
                <Button as="a" className="w-full sm:w-auto" href={ROUTES.SAVED_PROVIDERS} variant="outline">
                  View Saved Providers
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {savedProvidersQuery.isLoading ? (
                <div className="grid gap-3">
                  {[0, 1].map((item) => (
                    <Skeleton className="h-24 w-full" key={item} />
                  ))}
                </div>
              ) : savedProvidersQuery.isError ? (
                <EmptyState
                  actionText="Retry"
                  description="Something went wrong while loading saved providers. Try again."
                  icon={Bookmark}
                  onAction={() => savedProvidersQuery.refetch()}
                  size="sm"
                  title="Could not load saved providers"
                  variant="bordered"
                />
              ) : savedProviders.length > 0 ? (
                <div className="grid gap-3">
                  {savedProviders.map((item) => (
                    <article className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={item.savedProviderId || item.id || getProviderName(item)}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="min-w-0 break-words text-base font-black text-[#07030D]">
                              {getProviderName(item)}
                            </h3>
                            <Badge variant={item.status === "shortlisted" ? "green" : "primary"}>
                              {item.status === "shortlisted" ? "Shortlisted" : "Saved"}
                            </Badge>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F657C]">
                            {getProviderHeadline(item)}
                          </p>
                          <p className="mt-2 text-xs font-bold text-[#6F657C]">
                            Saved {formatDate(item.createdAt, { fallback: "recently" })}
                          </p>
                        </div>
                        <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={ROUTES.SAVED_PROVIDERS} variant="outline">
                          Open
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  actionHref={ROUTES.PROVIDERS}
                  actionText="Explore Providers"
                  description="Saved providers will appear here when you start comparing and shortlisting providers."
                  icon={Search}
                  size="sm"
                  title="No saved providers yet"
                  variant="minimal"
                />
              )}
            </CardContent>
            <CardFooter>
              <Button as="a" href={ROUTES.PROVIDERS} variant="outline">
                Explore Providers
              </Button>
            </CardFooter>
          </Card>
        </div>

        <aside className="grid min-w-0 gap-5 xl:sticky xl:top-6">
          <ClientNextActions
            activeChallenge={activeChallenge}
            challenges={challenges}
            plans={plans}
            recommendations={recommendations}
          />
          <ClientRecentActivity
            activeChallenge={activeChallenge}
            challenges={challenges}
            plans={plans}
            recommendations={recommendations}
            savedProviders={savedProviders}
          />
        </aside>
      </div>
    </div>
  );
}
