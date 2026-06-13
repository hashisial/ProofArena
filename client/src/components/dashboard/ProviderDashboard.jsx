import { useMemo } from "react";
import {
  BriefcaseBusiness,
  ClipboardList,
  FileCheck2,
  PackagePlus,
  ShieldCheck,
  Target,
} from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { useMyExecutionPlans } from "../../features/executionPlans/useExecutionPlans.js";
import { useFirstClientStatus, useRefreshFirstClientStatus } from "../../features/firstClient/useFirstClient.js";
import { getBestProviderMatch } from "../../features/matches/matchUtils.js";
import { useMyMatchedChallenges, useRefreshMyMatches } from "../../features/matches/useMatches.js";
import { useMyOutcomeOffers } from "../../features/outcomeOffers/useOutcomeOffers.js";
import { useMyOpportunities, useOpportunityStats } from "../../features/opportunities/useOpportunities.js";
import { useMyProfile } from "../../features/profile/useProfile.js";
import { useMyProofAssets } from "../../features/proofAssets/useProofAssets.js";
import { formatNumber } from "../../utils/formatNumber.js";
import { calculateProviderReadiness } from "../../utils/providerReadiness.js";
import { calculateProofReadiness } from "../../utils/proofReadiness.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { DashboardStatsCard } from "./DashboardStatsCard.jsx";
import { ProviderBestMatchHighlight } from "./ProviderBestMatchHighlight.jsx";
import { ProviderExecutionPlansCard } from "./ProviderExecutionPlansCard.jsx";
import { ProviderFirstClientCard } from "./ProviderFirstClientCard.jsx";
import { ProviderMatchedChallengesCard } from "./ProviderMatchedChallengesCard.jsx";
import { ProviderOpportunityPipelineCard } from "./ProviderOpportunityPipelineCard.jsx";
import { ProviderOutcomeOffersCard } from "./ProviderOutcomeOffersCard.jsx";
import { ProviderProofVaultCard } from "./ProviderProofVaultCard.jsx";
import { ProviderReadinessCard } from "./ProviderReadinessCard.jsx";
import { ProviderRecentActivity } from "./ProviderRecentActivity.jsx";
import { ProviderTodayActions } from "./ProviderTodayActions.jsx";
import { ProviderWarmLeadsCard } from "./ProviderWarmLeadsCard.jsx";

function ProviderDashboardLoadingState() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-56 w-full" rounded="rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton className="h-36 w-full" key={item} />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {[0, 1, 2, 3].map((item) => <Skeleton className="h-96 w-full" key={item} />)}
      </div>
    </div>
  );
}

export function ProviderDashboard() {
  const plansQuery = useMyExecutionPlans({ limit: 50, sort: "newest" });
  const offersQuery = useMyOutcomeOffers({ limit: 50, sort: "newest" });
  const matchesQuery = useMyMatchedChallenges({ limit: 50, sort: "best" });
  const opportunitiesQuery = useMyOpportunities({ limit: 10, sort: "last_activity" });
  const opportunityStatsQuery = useOpportunityStats();
  const proofAssetsQuery = useMyProofAssets({ limit: 50, sort: "newest" });
  const firstClientQuery = useFirstClientStatus();
  const profileQuery = useMyProfile();
  const refreshMatchesMutation = useRefreshMyMatches();
  const refreshFirstClientMutation = useRefreshFirstClientStatus();

  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const offers = useMemo(() => offersQuery.data?.items ?? [], [offersQuery.data?.items]);
  const matches = useMemo(() => matchesQuery.data?.items ?? [], [matchesQuery.data?.items]);
  const opportunities = useMemo(() => opportunitiesQuery.data?.items ?? [], [opportunitiesQuery.data?.items]);
  const proofAssets = useMemo(() => proofAssetsQuery.data?.items ?? [], [proofAssetsQuery.data?.items]);
  const opportunityStats = opportunityStatsQuery.data ?? {};
  const firstClientStatus = firstClientQuery.data ?? {};
  const profileData = profileQuery.data ?? {};
  const matchCount = matchesQuery.isError ? null : matchesQuery.data?.pagination?.total ?? matches.length;
  const planCount = plansQuery.isError ? null : plansQuery.data?.pagination?.total ?? plans.length;
  const offerCount = offersQuery.isError ? null : offersQuery.data?.pagination?.total ?? offers.length;
  const proofAssetCount = proofAssetsQuery.isError ? null : proofAssetsQuery.data?.pagination?.total ?? proofAssets.length;
  const bestMatch = getBestProviderMatch(matches);
  const submittedPlanCount = plansQuery.isError
    ? null
    : plans.filter((plan) => !["archived", "draft", "expired", "withdrawn"].includes(plan.status)).length;
  const shortlistedPlanCount = plansQuery.isError
    ? null
    : plans.filter((plan) => plan.status === "shortlisted").length;
  const readiness = calculateProviderReadiness({
    matches: matchesQuery.isError || !matchesQuery.data ? null : matches,
    offers: offersQuery.isError || !offersQuery.data ? null : offers,
    plans: plansQuery.isError || !plansQuery.data ? null : plans,
    profileData: profileQuery.isError || !profileQuery.data ? null : profileData,
    proofAssets: proofAssetsQuery.isError || !proofAssetsQuery.data ? null : proofAssets,
  });
  const proofReadiness = [proofAssetsQuery, offersQuery, plansQuery, profileQuery].some((query) => query.isError)
    ? null
    : calculateProofReadiness({
        assets: proofAssets,
        offers,
        plans,
        profileData,
      });
  const queries = [
    plansQuery,
    offersQuery,
    matchesQuery,
    opportunitiesQuery,
    opportunityStatsQuery,
    proofAssetsQuery,
    firstClientQuery,
    profileQuery,
  ];
  const hasError = queries.some((query) => query.isError);
  const isInitialLoading =
    queries.some((query) => query.isLoading) &&
    plans.length === 0 &&
    offers.length === 0 &&
    matches.length === 0 &&
    opportunities.length === 0 &&
    proofAssets.length === 0 &&
    !firstClientQuery.data &&
    !profileQuery.data;

  const stats = [
    {
      detail: "Challenge matches generated from your current acquisition signals.",
      icon: Target,
      label: "Matched Challenges",
      value: formatNumber(matchCount, { fallback: "Not available" }),
    },
    {
      detail: "Plans submitted or already moved into a client decision state.",
      icon: ClipboardList,
      label: "Submitted Plans",
      tone: "bronze",
      value: formatNumber(submittedPlanCount, { fallback: "Not available" }),
    },
    {
      detail: "Execution plans currently shortlisted by clients.",
      icon: ShieldCheck,
      label: "Shortlisted Plans",
      value: formatNumber(shortlistedPlanCount, { fallback: "Not available" }),
    },
    {
      detail: "Provider-owned acquisition opportunities currently tracked.",
      icon: BriefcaseBusiness,
      label: "Opportunities",
      value: formatNumber(opportunityStatsQuery.isError ? null : opportunityStats.total ?? opportunities.length, { fallback: "Not available" }),
    },
    {
      detail: "Reusable evidence available in your Proof Vault.",
      icon: FileCheck2,
      label: "Proof Assets",
      value: formatNumber(proofAssetCount, { fallback: "Not available" }),
    },
    {
      detail: "Measurable outcome offers available to manage.",
      icon: PackagePlus,
      label: "Outcome Offers",
      value: formatNumber(offerCount, { fallback: "Not available" }),
    },
  ];

  async function handleRefreshMatches() {
    try {
      await refreshMatchesMutation.mutateAsync();
    } catch {
      // The full matched-challenges page surfaces actionable refresh errors.
    }
  }

  async function handleRefreshFirstClient() {
    try {
      await refreshFirstClientMutation.mutateAsync();
    } catch {
      // The First Client Mode page surfaces actionable refresh errors.
    }
  }

  if (isInitialLoading) {
    return <ProviderDashboardLoadingState />;
  }

  const todayActionsData = {
    firstClientStatus: firstClientQuery.isError || !firstClientQuery.data ? null : firstClientStatus,
    matches: matchesQuery.isError || !matchesQuery.data ? null : matches,
    offers: offersQuery.isError || !offersQuery.data ? null : offers,
    opportunities: opportunitiesQuery.isError || !opportunitiesQuery.data ? null : opportunities,
    opportunityStats: opportunityStatsQuery.isError || !opportunityStatsQuery.data ? null : opportunityStats,
    plans: plansQuery.isError || !plansQuery.data ? null : plans,
    proofAssets: proofAssetsQuery.isError || !proofAssetsQuery.data ? null : proofAssets,
    readiness,
  };
  const isReadinessLoading = [matchesQuery, offersQuery, plansQuery, profileQuery, proofAssetsQuery]
    .some((query) => query.isFetching && !query.data);

  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[linear-gradient(135deg,#ffffff,#FEFCE8)] p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Badge variant="primary">Provider acquisition home</Badge>
            <h1 className="mt-5 max-w-4xl break-words text-3xl font-black tracking-normal text-[#1C1917] sm:text-4xl md:text-5xl">
              Provider Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#44403C]">
              Track matched challenges, execution plans, proof assets, opportunities, and next actions from one acquisition home.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.MATCHED_CHALLENGES}>
              View Matched Challenges
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.NEW_OUTCOME_OFFER} variant="outline">
              Create Outcome Offer
            </Button>
          </div>
        </div>
      </section>

      {hasError ? (
        <Card className="flex flex-col gap-3 border-[#A16207]/25 bg-[#ECFCCB] sm:flex-row sm:items-center sm:justify-between" padding="sm" variant="bordered">
          <div>
            <p className="font-black text-[#365314]">Some acquisition data could not be refreshed.</p>
            <p className="mt-1 text-sm text-[#365314]">Available dashboard data is still shown below.</p>
          </div>
          <Button onClick={() => queries.filter((query) => query.isError).forEach((query) => query.refetch())} type="button" variant="outline">
            Retry failed sections
          </Button>
        </Card>
      ) : null}

      <section aria-labelledby="provider-priority-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">Provider priority center</p>
          <h2 id="provider-priority-center" className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
            Know what to fix and do next
          </h2>
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
          <ProviderReadinessCard isLoading={isReadinessLoading} proofReadiness={proofReadiness} readiness={readiness} />
          <ProviderTodayActions data={todayActionsData} />
        </div>
      </section>

      <ProviderBestMatchHighlight match={bestMatch} />

      <section aria-labelledby="provider-dashboard-stats">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">Acquisition overview</p>
          <h2 id="provider-dashboard-stats" className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
            Pipeline at a glance
          </h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => <DashboardStatsCard key={stat.label} {...stat} />)}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
        <aside className="min-w-0">
          <ProviderWarmLeadsCard
            isError={matchesQuery.isError}
            isLoading={matchesQuery.isFetching && matches.length === 0}
            isRefreshing={refreshMatchesMutation.isPending}
            matches={matches}
            onRefresh={handleRefreshMatches}
            onRetry={() => matchesQuery.refetch()}
          />
        </aside>
        <ProviderMatchedChallengesCard
          isError={matchesQuery.isError}
          isLoading={matchesQuery.isFetching && matches.length === 0}
          matches={matches}
          onRetry={() => matchesQuery.refetch()}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ProviderOpportunityPipelineCard
          isListError={opportunitiesQuery.isError}
          isLoading={
            (opportunitiesQuery.isFetching && opportunities.length === 0) ||
            (opportunityStatsQuery.isFetching && !opportunityStatsQuery.data)
          }
          isStatsError={opportunityStatsQuery.isError}
          onRetry={() => {
            opportunitiesQuery.refetch();
            opportunityStatsQuery.refetch();
          }}
          opportunities={opportunities}
          stats={opportunityStats}
        />
        <ProviderExecutionPlansCard
          isError={plansQuery.isError}
          isLoading={plansQuery.isFetching && plans.length === 0}
          onRetry={() => plansQuery.refetch()}
          plans={plans}
          total={planCount ?? undefined}
        />
        <ProviderOutcomeOffersCard
          isError={offersQuery.isError}
          isLoading={offersQuery.isFetching && offers.length === 0}
          offers={offers}
          onRetry={() => offersQuery.refetch()}
          total={offerCount ?? undefined}
        />
        <ProviderProofVaultCard
          assets={proofAssets}
          isError={proofAssetsQuery.isError || proofReadiness === null}
          isLoading={isReadinessLoading}
          onRetry={() => [proofAssetsQuery, offersQuery, plansQuery, profileQuery]
            .filter((query) => query.isError)
            .forEach((query) => query.refetch())}
          readiness={proofReadiness}
          total={proofAssetCount ?? undefined}
        />
        <ProviderFirstClientCard
          isError={firstClientQuery.isError}
          isLoading={firstClientQuery.isFetching && !firstClientQuery.data}
          isRefreshing={refreshFirstClientMutation.isPending}
          onRefresh={handleRefreshFirstClient}
          status={firstClientStatus}
        />
      </div>

      <div className="grid gap-5">
        <ProviderRecentActivity
          isLoading={
            plans.length === 0 &&
            offers.length === 0 &&
            matches.length === 0 &&
            opportunities.length === 0 &&
            proofAssets.length === 0 &&
            [plansQuery, offersQuery, matchesQuery, opportunitiesQuery, proofAssetsQuery].some((query) => query.isFetching)
          }
          matches={matches}
          offers={offers}
          opportunities={opportunities}
          plans={plans}
          proofAssets={proofAssets}
        />
      </div>
    </div>
  );
}
