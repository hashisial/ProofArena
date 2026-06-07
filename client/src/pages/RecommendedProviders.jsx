import { Link, useLocation, useParams } from "react-router-dom";
import { createElement, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  Scale,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import { RecommendedProviderFilters } from "../components/matches/RecommendedProviderFilters.jsx";
import { ProviderCompareTray } from "../components/providers/ProviderCompareTray.jsx";
import { ProviderComparisonModal } from "../components/providers/ProviderComparisonModal.jsx";
import { ProviderSelectionCard } from "../components/providers/ProviderSelectionCard.jsx";
import { ProviderSelectionSummary } from "../components/providers/ProviderSelectionSummary.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
  getChallengeApiErrorMessage,
} from "../features/challenges/challengeUtils.js";
import { useChallenge } from "../features/challenges/useChallenges.js";
import {
  getExecutionPlanApiErrorMessage,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useAcceptExecutionPlan,
  useChallengePlans,
} from "../features/executionPlans/useExecutionPlans.js";
import {
  getMatchApiErrorMessage,
  getRecommendedProviderStats,
} from "../features/matches/matchUtils.js";
import {
  useChallengeRecommendedProviders,
  useRefreshChallengeMatches,
  useUpdateClientMatchStatus,
} from "../features/matches/useMatches.js";
import {
  useProviderComparisonState,
} from "../features/providers/providerComparisonState.js";
import {
  useMySavedProviders,
  useSaveProvider,
  useUpdateSavedProvider,
} from "../features/savedProviders/useSavedProviders.js";
import { useToast } from "../hooks/useToast.js";

const initialFilters = Object.freeze({
  minScore: "",
  sort: "best",
  status: "all",
});

function getProviderId(provider = {}) {
  return String(provider.userId || provider.id || provider._id || provider.user?.id || provider.user?._id || "").trim();
}

function getProviderName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function normalizeProvider(provider = {}) {
  const providerId = getProviderId(provider);
  const username = provider.username || provider.user?.username || "";
  const profileUrl =
    provider.publicProfileUrl ||
    provider.profileUrl ||
    provider.publicUrl ||
    (username ? `/profile/${encodeURIComponent(username)}` : "");

  return {
    ...provider,
    avatarUrl: provider.avatarUrl || provider.avatar || provider.profilePicture || provider.user?.avatar || "",
    displayName: getProviderName(provider),
    fullName: provider.fullName || provider.displayName || provider.name || "",
    id: providerId,
    outcomeOfferCount:
      provider.outcomeOfferCount ??
      provider.outcomeOffers?.count ??
      provider.outcomeOffersSummary?.count ??
      provider.matchedOffers?.length ??
      0,
    profileUrl,
    publicProfileUrl: profileUrl,
    userId: provider.userId || providerId,
    username,
  };
}

function getPlanProviderId(plan = {}) {
  return getProviderId(plan.provider) || String(plan.providerId || plan.provider?.userId || "").trim();
}

function getPlanId(plan = {}) {
  return String(plan.id || plan._id || "").trim();
}

function comparePlanPriority(plan = {}) {
  const priority = {
    accepted: 5,
    shortlisted: 4,
    submitted: 3,
    draft: 2,
    rejected: 1,
    withdrawn: 0,
  };

  return priority[plan.status] ?? 0;
}

function pickPlan(current, next) {
  if (!current) return next;
  if (!next) return current;

  const currentPriority = comparePlanPriority(current);
  const nextPriority = comparePlanPriority(next);

  if (nextPriority !== currentPriority) {
    return nextPriority > currentPriority ? next : current;
  }

  const currentDate = new Date(current.updatedAt || current.submittedAt || current.createdAt || 0).getTime();
  const nextDate = new Date(next.updatedAt || next.submittedAt || next.createdAt || 0).getTime();

  return nextDate > currentDate ? next : current;
}

function mergeEntry(current = {}, next = {}) {
  const provider = normalizeProvider({
    ...(current.provider ?? {}),
    ...(next.provider ?? {}),
  });

  return {
    challengeId: current.challengeId || next.challengeId,
    match: current.match || next.match,
    plan: pickPlan(current.plan, next.plan),
    provider,
    savedProvider: current.savedProvider || next.savedProvider,
  };
}

function buildSelectionEntries({ challengeId, matches = [], plans = [], savedProviders = [] }) {
  const entries = new Map();

  function upsert(provider, data) {
    const normalizedProvider = normalizeProvider(provider);
    const providerId = getProviderId(normalizedProvider);

    if (!providerId) {
      return;
    }

    entries.set(
      providerId,
      mergeEntry(entries.get(providerId), {
        challengeId,
        provider: normalizedProvider,
        ...data,
      }),
    );
  }

  matches.forEach((match) => upsert(match.provider, { match }));
  savedProviders.forEach((savedProvider) => upsert(savedProvider.provider, { savedProvider }));
  plans.forEach((plan) => upsert(plan.provider, { plan }));

  return Array.from(entries.values());
}

function isSelectedEntry(entry, selectedProviderId = "") {
  const providerId = getProviderId(entry.provider);

  return entry.plan?.status === "accepted" || (Boolean(selectedProviderId) && providerId === selectedProviderId);
}

function isShortlistedEntry(entry) {
  return entry.savedProvider?.status === "shortlisted" || entry.plan?.status === "shortlisted";
}

function rankSelectionEntries(entries = [], { comparedProviderIds = new Set(), selectedProviderId = "" } = {}) {
  return [...entries].sort((left, right) => {
    const leftSelected = isSelectedEntry(left, selectedProviderId) ? 1 : 0;
    const rightSelected = isSelectedEntry(right, selectedProviderId) ? 1 : 0;
    if (leftSelected !== rightSelected) return rightSelected - leftSelected;

    const leftShortlisted = isShortlistedEntry(left) ? 1 : 0;
    const rightShortlisted = isShortlistedEntry(right) ? 1 : 0;
    if (leftShortlisted !== rightShortlisted) return rightShortlisted - leftShortlisted;

    const leftCompared = comparedProviderIds.has(getProviderId(left.provider)) ? 1 : 0;
    const rightCompared = comparedProviderIds.has(getProviderId(right.provider)) ? 1 : 0;
    if (leftCompared !== rightCompared) return rightCompared - leftCompared;

    const leftMatchScore = Number(left.match?.matchScore ?? -1);
    const rightMatchScore = Number(right.match?.matchScore ?? -1);
    if (leftMatchScore !== rightMatchScore) return rightMatchScore - leftMatchScore;

    const leftProofScore = Number(left.provider?.proofScore ?? -1);
    const rightProofScore = Number(right.provider?.proofScore ?? -1);
    if (leftProofScore !== rightProofScore) return rightProofScore - leftProofScore;

    return getProviderName(left.provider).localeCompare(getProviderName(right.provider));
  });
}

function getSelectedProviderId(challenge, plans = []) {
  const challengeSelectedId = String(challenge?.applicationStats?.selectedProviderId || "").trim();

  if (challengeSelectedId) {
    return challengeSelectedId;
  }

  const acceptedPlan = plans.find((plan) => plan.status === "accepted");

  return acceptedPlan ? getPlanProviderId(acceptedPlan) : "";
}

function getStatusLabel(value) {
  if (!value) return "Not available";
  return String(value).replaceAll("_", " ");
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4 shadow-[0_14px_36px_rgba(31,14,54,0.05)]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
          {createElement(Icon, { "aria-hidden": "true", className: "h-5 w-5" })}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{label}</p>
          <p className="mt-1 break-words text-2xl font-black text-[#07030D]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ChallengeSelectionBrief({ challenge, isLoading }) {
  if (isLoading) {
    return <Skeleton className="h-40 w-full" rounded="rounded-3xl" />;
  }

  if (!challenge) {
    return null;
  }

  return (
    <Card as="section" padding="md" variant="muted">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <Badge variant="primary">Challenge context</Badge>
          <h2 className="mt-3 break-words text-2xl font-black tracking-normal text-[#07030D]">
            {challenge.title || "Outcome challenge"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6F657C]">
            {challenge.targetOutcome?.outcomeStatement || challenge.shortSummary || "Use this provider center to compare candidates against the challenge outcome."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[32rem]">
          <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Budget</p>
            <p className="mt-2 text-sm font-black text-[#07030D]">{formatChallengeBudget(challenge.budget)}</p>
          </div>
          <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Timeline</p>
            <p className="mt-2 text-sm font-black text-[#07030D]">{formatChallengeTimeline(challenge.timeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Status</p>
            <p className="mt-2 text-sm font-black capitalize text-[#07030D]">{getStatusLabel(challenge.status)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProviderPipeline({ entries = [], selectedProviderId = "", selectedIdSet = new Set() }) {
  const recommended = entries.filter((entry) => Boolean(entry.match));
  const compared = entries.filter((entry) => selectedIdSet.has(getProviderId(entry.provider)));
  const shortlisted = entries.filter(isShortlistedEntry);
  const selected = entries.filter((entry) => isSelectedEntry(entry, selectedProviderId));
  const stages = [
    {
      description: "Recommended through the challenge match engine.",
      items: recommended,
      label: "Recommended",
    },
    {
      description: "Added to the comparison tray on this device.",
      items: compared,
      label: "Compared",
    },
    {
      description: "Persisted to this challenge shortlist.",
      items: shortlisted,
      label: "Shortlisted",
    },
    {
      description: "Chosen through accepted execution plan workflow.",
      items: selected,
      label: "Selected",
    },
  ];

  return (
    <Card as="section" padding="lg" variant="bordered">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary">Provider pipeline</Badge>
          <h2 className="mt-3 text-2xl font-black tracking-normal text-[#07030D]">Recommendation to selection</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F657C]">
            Move providers through decision stages with explicit actions. Drag and drop is intentionally not required for this foundation.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage, index) => (
          <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={stage.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Step {index + 1}</p>
                <h3 className="mt-1 text-lg font-black text-[#07030D]">{stage.label}</h3>
              </div>
              <Badge variant={stage.items.length > 0 ? "primary" : "gray"}>{stage.items.length}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#6F657C]">{stage.description}</p>
            <div className="mt-4 grid gap-2">
              {stage.items.slice(0, 3).map((entry) => (
                <p className="truncate rounded-full bg-white px-3 py-2 text-xs font-black text-[#07030D]" key={`${stage.label}-${getProviderId(entry.provider)}`}>
                  {getProviderName(entry.provider)}
                </p>
              ))}
              {stage.items.length > 3 ? (
                <p className="text-xs font-bold text-[#6F657C]">+{stage.items.length - 3} more</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SelectionEmptyState({ challengeId, isShortlistedRoute, onRefresh, isRefreshing }) {
  if (isShortlistedRoute) {
    return (
      <EmptyState
        actionHref={ROUTES.CHALLENGE_PROVIDERS(challengeId)}
        actionText="View Recommended Providers"
        description="Add providers to the challenge shortlist from the recommendation list before making a final selection."
        icon={UsersRound}
        title="No shortlisted providers yet"
        variant="spotlight"
      />
    );
  }

  return (
    <EmptyState
      actionText={isRefreshing ? "Refreshing..." : "Refresh Recommendations"}
      description="Refresh recommendations or review submitted execution plans to build the provider selection list."
      icon={UsersRound}
      onAction={onRefresh}
      title="No providers in the selection center yet"
      variant="spotlight"
    />
  );
}

export function RecommendedProviders() {
  const { challengeId } = useParams();
  const location = useLocation();
  const { showToast } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectionEntry, setSelectionEntry] = useState(null);
  const [busyShortlistProviderId, setBusyShortlistProviderId] = useState("");
  const isShortlistedRoute = location.pathname.endsWith("/providers/shortlisted");
  const isSelectionRoute = location.pathname.endsWith("/provider-selection");
  const challengeQuery = useChallenge(challengeId);
  const recommendationsQuery = useChallengeRecommendedProviders(
    challengeId,
    { ...filters, limit: 50 },
    { enabled: Boolean(challengeId) },
  );
  const plansQuery = useChallengePlans(
    challengeId,
    { limit: 50, sort: "newest" },
    { enabled: Boolean(challengeId) },
  );
  const savedProvidersQuery = useMySavedProviders(
    { challengeId, limit: 50, sort: "newest" },
    { enabled: Boolean(challengeId) },
  );
  const refreshRecommendationsMutation = useRefreshChallengeMatches(challengeId);
  const updateMatchStatusMutation = useUpdateClientMatchStatus();
  const saveProviderMutation = useSaveProvider();
  const updateSavedProviderMutation = useUpdateSavedProvider();
  const acceptPlanMutation = useAcceptExecutionPlan();
  const {
    clearComparison,
    removeProvider,
    selectedIdSet,
    selectedProviders,
  } = useProviderComparisonState();
  const challenge = challengeQuery.data || recommendationsQuery.data?.challenge || null;
  const matches = useMemo(() => recommendationsQuery.data?.items ?? [], [recommendationsQuery.data?.items]);
  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const savedProviders = useMemo(() => savedProvidersQuery.data?.items ?? [], [savedProvidersQuery.data?.items]);
  const selectedProviderId = useMemo(() => getSelectedProviderId(challenge, plans), [challenge, plans]);
  const entries = useMemo(
    () => buildSelectionEntries({ challengeId, matches, plans, savedProviders }),
    [challengeId, matches, plans, savedProviders],
  );
  const rankedEntries = useMemo(
    () => rankSelectionEntries(entries, { comparedProviderIds: selectedIdSet, selectedProviderId }),
    [entries, selectedIdSet, selectedProviderId],
  );
  const visibleEntries = isShortlistedRoute
    ? rankedEntries.filter((entry) => isShortlistedEntry(entry) || isSelectedEntry(entry, selectedProviderId))
    : rankedEntries;
  const recommendationStats = getRecommendedProviderStats(matches);
  const shortlistedCount =
    Number(savedProvidersQuery.data?.stats?.shortlisted ?? 0) ||
    savedProviders.filter((item) => item.status === "shortlisted").length;
  const comparedCount = entries.filter((entry) => selectedIdSet.has(getProviderId(entry.provider))).length;
  const selectedCount = selectedProviderId ? 1 : 0;
  const isLoading = recommendationsQuery.isLoading || plansQuery.isLoading || savedProvidersQuery.isLoading;
  const isError = recommendationsQuery.isError || plansQuery.isError || savedProvidersQuery.isError || challengeQuery.isError;

  async function handleRefreshRecommendations() {
    try {
      await refreshRecommendationsMutation.mutateAsync();
      showToast({ message: "Provider recommendations refreshed." });
    } catch (error) {
      showToast({
        message: getMatchApiErrorMessage(error, "Provider recommendations could not be refreshed."),
        type: "error",
      });
    }
  }

  async function markMatchSaved(entry, status = "saved") {
    if (!entry.match?.id) {
      return;
    }

    try {
      await updateMatchStatusMutation.mutateAsync({
        challengeId,
        id: entry.match.id,
        payload: { status },
      });
    } catch {
      // Saved-provider status is the source of truth for the shortlist workflow.
    }
  }

  async function handleShortlist(entry) {
    const providerId = getProviderId(entry.provider);

    if (!providerId) {
      showToast({ message: "This provider cannot be shortlisted yet.", type: "error" });
      return;
    }

    setBusyShortlistProviderId(providerId);

    try {
      let record = entry.savedProvider;

      if (!record?.savedProviderId) {
        record = await saveProviderMutation.mutateAsync({
          challengeId,
          providerId,
          source: "recommended_provider",
          tags: ["challenge-shortlist"],
        });
      }

      if (record?.savedProviderId && record.status !== "shortlisted") {
        await updateSavedProviderMutation.mutateAsync({
          id: record.savedProviderId,
          payload: { status: "shortlisted" },
        });
      }

      await markMatchSaved(entry, "saved");
      showToast({ message: "Provider added to this challenge shortlist." });
    } catch (error) {
      showToast({
        message: error?.message || "Provider could not be shortlisted. Try again.",
        type: "error",
      });
    } finally {
      setBusyShortlistProviderId("");
    }
  }

  async function handleRemoveShortlist(entry) {
    const providerId = getProviderId(entry.provider);

    if (!entry.savedProvider?.savedProviderId) {
      return;
    }

    setBusyShortlistProviderId(providerId);

    try {
      await updateSavedProviderMutation.mutateAsync({
        id: entry.savedProvider.savedProviderId,
        payload: { status: "saved" },
      });
      await markMatchSaved(entry, "viewed");
      showToast({ message: "Provider removed from this challenge shortlist." });
    } catch (error) {
      showToast({
        message: error?.message || "Shortlist status could not be updated. Try again.",
        type: "error",
      });
    } finally {
      setBusyShortlistProviderId("");
    }
  }

  async function handleConfirmSelection() {
    const planId = getPlanId(selectionEntry?.plan);

    if (!planId) {
      return;
    }

    try {
      await acceptPlanMutation.mutateAsync({
        id: planId,
        payload: {
          note: "Selected from the Provider Selection Center.",
        },
      });
      showToast({ message: "Provider selected for this challenge." });
      setSelectionEntry(null);
    } catch (error) {
      showToast({
        message: getExecutionPlanApiErrorMessage(error, "Provider could not be selected. Try again."),
        type: "error",
      });
    }
  }

  if (isError && !isLoading) {
    return (
      <EmptyState
        actionText="Retry"
        description={getChallengeApiErrorMessage(
          challengeQuery.error || recommendationsQuery.error || plansQuery.error || savedProvidersQuery.error,
          "Something went wrong while loading the provider selection center.",
        )}
        icon={UsersRound}
        onAction={() => {
          challengeQuery.refetch();
          recommendationsQuery.refetch();
          plansQuery.refetch();
          savedProvidersQuery.refetch();
        }}
        title="Could not load provider selection"
        variant="spotlight"
      />
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              isLoading={refreshRecommendationsMutation.isPending}
              loadingLabel="Refreshing..."
              onClick={handleRefreshRecommendations}
              type="button"
              variant="secondary"
            >
              <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
              Refresh Recommendations
            </Button>
            <Button as={Link} to={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
              <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
              Review Plans
            </Button>
          </div>
        }
        backFallback={ROUTES.OWNER_CHALLENGE(challengeId)}
        description="Review, compare, shortlist, and select the strongest providers for this challenge."
        eyebrow="Client provider selection center"
        showBack
        title="Recommended Providers"
      />

      <ChallengeSelectionBrief challenge={challenge} isLoading={challengeQuery.isLoading} />

      <section aria-label="Provider selection stats" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={UsersRound} label="Total recommendations" value={recommendationStats.total} />
        <StatCard icon={Target} label="Shortlisted" value={shortlistedCount} />
        <StatCard icon={Scale} label="Compared" value={comparedCount} />
        <StatCard icon={ShieldCheck} label="Selected" value={selectedCount} />
        <StatCard icon={CheckCircle2} label="Average match score" value={`${recommendationStats.averageScore}/100`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="grid gap-6">
          {isSelectionRoute ? (
            <ProviderSelectionSummary entries={rankedEntries} selectedProviderId={selectedProviderId} />
          ) : null}

          <ProviderPipeline
            entries={rankedEntries}
            selectedIdSet={selectedIdSet}
            selectedProviderId={selectedProviderId}
          />

          {!isSelectionRoute ? (
            <ProviderSelectionSummary entries={rankedEntries} selectedProviderId={selectedProviderId} />
          ) : null}

          <Card as="section" padding="lg" variant="bordered">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge variant="primary">Provider ranking</Badge>
                <h2 className="mt-3 text-2xl font-black tracking-normal text-[#07030D]">
                  {isShortlistedRoute ? "Shortlisted providers" : "Ranked provider candidates"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F657C]">
                  Rankings prioritize selected, shortlisted, compared, match score, proof score, and provider name. Missing data stays visible as not available.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  as={Link}
                  to={ROUTES.CHALLENGE_PROVIDERS(challengeId)}
                  variant={isShortlistedRoute ? "secondary" : "outline"}
                >
                  All Providers
                </Button>
                <Button
                  as={Link}
                  to={ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS(challengeId)}
                  variant={isShortlistedRoute ? "outline" : "secondary"}
                >
                  Shortlisted
                </Button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
              <RecommendedProviderFilters
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(initialFilters)}
              />
            </div>

            {isLoading ? (
              <div className="mt-5 grid gap-4">
                {[0, 1, 2].map((item) => (
                  <Skeleton className="h-80 w-full" key={item} rounded="rounded-3xl" />
                ))}
              </div>
            ) : visibleEntries.length > 0 ? (
              <div className="mt-5 grid gap-4">
                {visibleEntries.map((entry, index) => {
                  const providerId = getProviderId(entry.provider);

                  return (
                    <ProviderSelectionCard
                      entry={entry}
                      isAccepting={acceptPlanMutation.isPending && getPlanId(selectionEntry?.plan) === getPlanId(entry.plan)}
                      isShortlistBusy={busyShortlistProviderId === providerId}
                      key={providerId}
                      onRemoveShortlist={handleRemoveShortlist}
                      onSelect={setSelectionEntry}
                      onShortlist={handleShortlist}
                      rank={index + 1}
                      selected={isSelectedEntry(entry, selectedProviderId)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="mt-5">
                <SelectionEmptyState
                  challengeId={challengeId}
                  isRefreshing={refreshRecommendationsMutation.isPending}
                  isShortlistedRoute={isShortlistedRoute}
                  onRefresh={handleRefreshRecommendations}
                />
              </div>
            )}
          </Card>
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-6">
          <Card padding="md" variant="elevated">
            <CardHeader>
              <Badge variant="secondary">Decision controls</Badge>
              <CardTitle className="mt-3 text-lg">Selection Workflow</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button as={Link} to={ROUTES.PROVIDER_SELECTION(challengeId)}>
                Open Decision Summary
              </Button>
              <Button as={Link} to={ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS(challengeId)} variant="outline">
                Manage Shortlist
              </Button>
              <Button
                disabled={selectedProviders.length < 2}
                onClick={() => setComparisonOpen(true)}
                type="button"
                variant="secondary"
              >
                Compare Selected Providers
              </Button>
              <p className="text-sm leading-6 text-[#6F657C]">
                Selection is confirmed by accepting a submitted execution plan. Contracts, payments, and milestone workspace are intentionally not enabled here.
              </p>
            </CardContent>
          </Card>

          <Card padding="md" variant="bordered">
            <CardHeader>
              <Badge variant={selectedProviderId ? "green" : "gray"}>
                {selectedProviderId ? "Selected" : "No selection"}
              </Badge>
              <CardTitle className="mt-3 text-lg">Selected Provider</CardTitle>
            </CardHeader>
            <CardContent>
              {rankedEntries
                .filter((entry) => isSelectedEntry(entry, selectedProviderId))
                .slice(0, 1)
                .map((entry) => (
                  <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={getProviderId(entry.provider)}>
                    <p className="font-black text-[#07030D]">{getProviderName(entry.provider)}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6F657C]">{entry.provider.headline || "Selected execution partner."}</p>
                    {entry.plan ? <ExecutionPlanStatusBadge className="mt-3" status={entry.plan.status} /> : null}
                  </div>
                ))}
              {!selectedProviderId ? (
                <p className="text-sm leading-6 text-[#6F657C]">
                  Select a provider only after reviewing their execution plan and proof-backed signals.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>

      <ProviderCompareTray
        onClear={clearComparison}
        onCompare={() => setComparisonOpen(true)}
        onRemove={removeProvider}
        providers={selectedProviders}
      />
      <ProviderComparisonModal
        isOpen={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        providers={selectedProviders}
      />
      <Modal
        description="You are selecting this provider as the preferred execution partner for this challenge."
        footer={
          <>
            <Button onClick={() => setSelectionEntry(null)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button
              isLoading={acceptPlanMutation.isPending}
              loadingLabel="Selecting..."
              onClick={handleConfirmSelection}
              type="button"
            >
              Confirm Selection
            </Button>
          </>
        }
        isOpen={Boolean(selectionEntry)}
        onClose={() => setSelectionEntry(null)}
        title="Select provider"
      >
        <div className="grid gap-4">
          <p className="text-sm leading-6 text-[#6F657C]">
            This accepts the provider execution plan and marks the provider as the preferred execution partner. This does not create a contract, process payment, open messaging, or start milestone tracking.
          </p>
          {selectionEntry ? (
            <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
              <p className="font-black text-[#07030D]">{getProviderName(selectionEntry.provider)}</p>
              <p className="mt-2 text-sm text-[#6F657C]">{selectionEntry.plan?.title || "Execution plan"}</p>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
