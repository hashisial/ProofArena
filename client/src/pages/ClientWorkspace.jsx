import { useMemo } from "react";
import {
  Activity,
  Bookmark,
  BriefcaseBusiness,
  ClipboardList,
  Search,
  Target,
  UsersRound,
} from "lucide-react";
import { ActiveChallengeWorkspaceCard } from "../components/workspace/ActiveChallengeWorkspaceCard.jsx";
import { PendingDecisionsPanel } from "../components/workspace/PendingDecisionsPanel.jsx";
import { WorkspaceActivityTimeline } from "../components/workspace/WorkspaceActivityTimeline.jsx";
import { WorkspaceQuickActions } from "../components/workspace/WorkspaceQuickActions.jsx";
import { WorkspaceSelectionSummary } from "../components/workspace/WorkspaceSelectionSummary.jsx";
import { DashboardStatsCard } from "../components/dashboard/DashboardStatsCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/routes.js";
import { useMyChallenges } from "../features/challenges/useChallenges.js";
import { useChallengePlans } from "../features/executionPlans/useExecutionPlans.js";
import { useChallengeRecommendedProviders } from "../features/matches/useMatches.js";
import { useMySavedProviders } from "../features/savedProviders/useSavedProviders.js";
import {
  buildPendingDecisions,
  buildWorkspaceActivity,
  getActiveWorkspaceChallenges,
  getSavedProviderChallengeId,
  sortChallengesByActivity,
} from "../features/workspace/workspaceUtils.js";
import { formatNumber } from "../utils/formatNumber.js";

function getChallengeId(challenge) {
  return String(challenge?.id || challenge?._id || "").trim();
}

function WorkspaceLoadingState() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-56 w-full" rounded="rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-32 w-full" key={index} />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Skeleton className="h-[34rem] w-full" />
        <Skeleton className="h-[34rem] w-full" />
      </div>
    </div>
  );
}

function WorkspaceNavigation({ focusChallenge }) {
  const challengeId = getChallengeId(focusChallenge);
  const shortcuts = [
    { href: ROUTES.MY_CHALLENGES, label: "Challenges" },
    { href: ROUTES.PROVIDERS, label: "Providers" },
    { href: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES, label: "Plans" },
    { href: ROUTES.CLIENT_WORKSPACE, label: "Workspace" },
    { href: challengeId ? ROUTES.PROVIDER_SELECTION(challengeId) : ROUTES.MY_CHALLENGES, label: "Selection Center" },
  ];

  return (
    <nav aria-label="Client workspace shortcuts" className="flex flex-wrap gap-2">
      {shortcuts.map((shortcut) => (
        <a
          aria-current={shortcut.href === ROUTES.CLIENT_WORKSPACE ? "page" : undefined}
          className="rounded-xl border border-[#E9E2F3] bg-white px-3 py-2 text-xs font-black text-[#493C5E] transition hover:border-[#A78BFA] hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12"
          href={shortcut.href}
          key={shortcut.label}
        >
          {shortcut.label}
        </a>
      ))}
    </nav>
  );
}

export function ClientWorkspace() {
  const challengesQuery = useMyChallenges({ limit: 50, sort: "last_updated" });
  const savedProvidersQuery = useMySavedProviders({ limit: 50, sort: "newest" });
  const challenges = useMemo(() => challengesQuery.data?.items ?? [], [challengesQuery.data?.items]);
  const savedProviders = useMemo(() => savedProvidersQuery.data?.items ?? [], [savedProvidersQuery.data?.items]);
  const activeChallenges = useMemo(() => getActiveWorkspaceChallenges(challenges), [challenges]);
  const focusChallenge = activeChallenges[0] || sortChallengesByActivity(challenges)[0] || null;
  const focusChallengeId = getChallengeId(focusChallenge);
  const plansQuery = useChallengePlans(
    focusChallengeId,
    { limit: 50, sort: "newest" },
    { enabled: Boolean(focusChallengeId) },
  );
  const recommendationsQuery = useChallengeRecommendedProviders(
    focusChallengeId,
    { limit: 50, sort: "best" },
    { enabled: Boolean(focusChallengeId) },
  );
  const focusPlans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const focusRecommendations = useMemo(
    () => recommendationsQuery.data?.items ?? [],
    [recommendationsQuery.data?.items],
  );
  const focusSavedProviders = useMemo(
    () => savedProviders.filter((item) => getSavedProviderChallengeId(item) === focusChallengeId),
    [focusChallengeId, savedProviders],
  );
  const pendingDecisions = useMemo(() => buildPendingDecisions(challenges), [challenges]);
  const activity = useMemo(
    () =>
      buildWorkspaceActivity({
        challenges,
        focusChallenge,
        plans: focusPlans,
        savedProviders,
      }),
    [challenges, focusChallenge, focusPlans, savedProviders],
  );
  const shortlistedCount = savedProvidersQuery.data?.stats?.shortlisted ??
    savedProviders.filter((item) => item.status === "shortlisted").length;
  const selectedChallengeCount = challenges.filter(
    (challenge) => Boolean(challenge.applicationStats?.selectedProviderId),
  ).length;
  const focusHasAcceptedPlan = focusPlans.some((plan) => plan.status === "accepted");
  const selectedProviderCount = selectedChallengeCount +
    (focusHasAcceptedPlan && !focusChallenge?.applicationStats?.selectedProviderId ? 1 : 0);
  const pendingReviews = challenges.filter(
    (challenge) =>
      ["reviewing_plans", "proof_review"].includes(challenge.status) ||
      (Number(challenge.applicationStats?.totalPlans ?? challenge.stats?.plansReceived ?? 0) > 0 &&
        !challenge.applicationStats?.selectedProviderId),
  ).length;
  const stats = [
    {
      detail: "Open, reviewing, selected, in-progress, and review-stage challenges.",
      icon: BriefcaseBusiness,
      label: "Active Challenges",
      value: formatNumber(activeChallenges.length, { fallback: "0" }),
    },
    {
      detail: "Published challenges currently open for provider activity.",
      icon: Target,
      label: "Open Challenges",
      tone: "olive",
      value: formatNumber(challenges.filter((challenge) => challenge.status === "open").length, { fallback: "0" }),
    },
    {
      detail: "Challenge-specific saved-provider records marked shortlisted.",
      icon: Bookmark,
      label: "Providers Shortlisted",
      tone: "bronze",
      value: savedProvidersQuery.isError ? "Not available" : formatNumber(shortlistedCount, { fallback: "0" }),
    },
    {
      detail: "Challenges with a selected provider recorded in current workflow data.",
      icon: UsersRound,
      label: "Selected Providers",
      value: formatNumber(selectedProviderCount, { fallback: "0" }),
    },
    {
      detail: "Known challenge states that require plan or operational review.",
      icon: ClipboardList,
      label: "Pending Reviews",
      tone: "bronze",
      value: formatNumber(pendingReviews, { fallback: "0" }),
    },
    {
      detail: "Recent events assembled from real challenge, plan, and shortlist records.",
      icon: Activity,
      label: "Recent Activities",
      tone: "neutral",
      value: formatNumber(activity.length, { fallback: "0" }),
    },
  ];

  if (challengesQuery.isLoading && challenges.length === 0) {
    return <WorkspaceLoadingState />;
  }

  if (challengesQuery.isError) {
    return (
      <EmptyState
        actionText="Retry"
        description="Something went wrong while loading the client workspace. Try again."
        icon={BriefcaseBusiness}
        onAction={() => challengesQuery.refetch()}
        title="Could not load client workspace"
        variant="spotlight"
      />
    );
  }

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#7C3AED]/16 bg-[linear-gradient(135deg,#ffffff,#F8F4FF)] p-6 shadow-[0_24px_80px_rgba(31,14,54,0.08)] md:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <Badge variant="primary">Operational command center</Badge>
            <h1 className="mt-5 max-w-4xl break-words text-3xl font-black tracking-normal text-[#07030D] sm:text-4xl md:text-5xl">
              Client Workspace
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#493C5E]">
              Monitor active challenges, provider decisions, and next actions from one place.
            </p>
            <div className="mt-5">
              <WorkspaceNavigation focusChallenge={focusChallenge} />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.NEW_CHALLENGE}>
              Create Challenge
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROVIDERS} variant="outline">
              <Search aria-hidden="true" className="mr-2 h-4 w-4" />
              Find Providers
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="workspace-stats">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">Workspace overview</p>
        <h2 id="workspace-stats" className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
          Active client operations
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <DashboardStatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {(savedProvidersQuery.isError || plansQuery.isError || recommendationsQuery.isError) ? (
        <Card padding="md" variant="muted">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-[#07030D]">Some workspace details are unavailable</p>
              <p className="mt-1 text-sm leading-6 text-[#6F657C]">
                Challenge data is loaded, but provider, plan, or recommendation details could not be refreshed.
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                savedProvidersQuery.refetch();
                plansQuery.refetch();
                recommendationsQuery.refetch();
              }}
              type="button"
              variant="outline"
            >
              Retry Details
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="grid min-w-0 gap-5">
          <section aria-labelledby="active-challenges">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">Active challenges</p>
                <h2 id="active-challenges" className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
                  Current outcome work
                </h2>
              </div>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.MY_CHALLENGES} variant="outline">
                Manage Challenges
              </Button>
            </div>
            {activeChallenges.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {activeChallenges.slice(0, 5).map((challenge) => (
                  <ActiveChallengeWorkspaceCard
                    challenge={challenge}
                    focusPlans={focusPlans}
                    isFocus={getChallengeId(challenge) === focusChallengeId}
                    key={getChallengeId(challenge)}
                    savedProviders={savedProviders}
                    savedProvidersAvailable={!savedProvidersQuery.isError}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5">
                <EmptyState
                  actionHref={ROUTES.NEW_CHALLENGE}
                  actionText="Create Challenge"
                  description="Open, reviewing, selected, and in-progress challenges will appear here."
                  icon={Target}
                  secondaryActionHref={ROUTES.MY_CHALLENGES}
                  secondaryActionText="Manage Challenges"
                  title="No active challenges"
                  variant="spotlight"
                />
              </div>
            )}
          </section>

          <WorkspaceSelectionSummary
            challenge={focusChallenge}
            isError={plansQuery.isError || recommendationsQuery.isError || savedProvidersQuery.isError}
            isLoading={plansQuery.isLoading || recommendationsQuery.isLoading || savedProvidersQuery.isLoading}
            plans={focusPlans}
            recommendations={focusRecommendations}
            savedProviders={focusSavedProviders}
          />
          <WorkspaceActivityTimeline events={activity} />
          <WorkspaceQuickActions focusChallenge={focusChallenge} />
        </div>

        <aside className="grid min-w-0 gap-5 xl:sticky xl:top-6">
          <PendingDecisionsPanel challenges={challenges} />
          <Card as="section" padding="md" variant="bordered">
            <Badge variant="outline">Workspace status</Badge>
            <h2 className="mt-3 text-xl font-black text-[#07030D]">Decision coverage</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">
              {pendingDecisions.length > 0
                ? `${pendingDecisions.length} known ${pendingDecisions.length === 1 ? "decision needs" : "decisions need"} client attention.`
                : "No known provider or plan decisions currently require attention."}
            </p>
            <Button as="a" className="mt-5 w-full" href={ROUTES.MY_CHALLENGES} variant="outline">
              Open Challenge Control
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
