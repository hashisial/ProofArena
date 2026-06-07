import { Link, useNavigate, useParams } from "react-router-dom";
import { ClipboardList, FileCheck2, UsersRound } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ChallengeActions } from "../components/challenges/ChallengeActions.jsx";
import { ChallengePreview } from "../components/challenges/ChallengePreview.jsx";
import { ChallengeQualityCard } from "../components/challenges/ChallengeQualityCard.jsx";
import { ChallengeStatusBadge, ChallengeVisibilityBadge } from "../components/challenges/ChallengeStatusBadge.jsx";
import { ChallengeWorkflowPanel } from "../components/challenges/ChallengeWorkflowPanel.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import {
  formatPlanScore,
  getPlanId,
  getProviderName,
} from "../components/executionPlans/executionPlanReviewUtils.js";
import { ClientRecommendedProvidersPanel } from "../components/matches/ClientRecommendedProvidersPanel.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveChallenge,
  useChallenge,
  useCloseChallenge,
  usePauseChallenge,
  usePublishChallenge,
} from "../features/challenges/useChallenges.js";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
  getChallengeApiErrorMessage,
} from "../features/challenges/challengeUtils.js";
import { useChallengePlans } from "../features/executionPlans/useExecutionPlans.js";
import {
  useChallengeRecommendedProviders,
  useRefreshChallengeMatches,
} from "../features/matches/useMatches.js";
import { useMySavedProviders } from "../features/savedProviders/useSavedProviders.js";
import {
  getChallengeNextAction,
  getPlansCount,
  getRecommendedProvidersCount,
  getShortlistedPlansCount,
} from "../utils/challengeNextAction.js";

function DetailList({ emptyText = "Nothing added yet.", items = [], title }) {
  return (
    <Card as="section" padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={`${item.title}-${index}`}>
            <p className="font-black text-[#1C1917]">{item.title}</p>
            {item.description ? <p className="mt-1 text-sm leading-6 text-[#78716C]">{item.description}</p> : null}
            {item.proofType ? <Badge className="mt-3" variant="green">{item.proofType.replaceAll("_", " ")}</Badge> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">{label}</p>
      <p className="mt-2 break-words text-lg font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

function ChallengeSummary({ challenge }) {
  const proofCount = challenge?.proofRequirements?.length ?? 0;
  const successCount = challenge?.successCriteria?.length ?? 0;
  const milestoneCount = challenge?.milestoneTemplate?.length ?? 0;

  return (
    <Card as="section" padding="lg" variant="default">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="primary">Challenge summary</Badge>
            <CardTitle className="mt-3 text-2xl">Outcome control brief</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <ChallengeStatusBadge status={challenge.status} />
            <ChallengeVisibilityBadge visibility={challenge.visibility} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Target outcome</p>
          <h2 className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
            {challenge.targetOutcome?.outcomeStatement || "Target outcome not specified"}
          </h2>
          {challenge.description ? (
            <p className="mt-4 text-sm leading-7 text-[#44403C]">{challenge.description}</p>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryMetric label="Category" value={challenge.category || "Uncategorized"} />
          <SummaryMetric label="Budget" value={formatChallengeBudget(challenge.budget)} />
          <SummaryMetric label="Timeline" value={formatChallengeTimeline(challenge.timeline)} />
          <SummaryMetric label="Urgency" value={challenge.urgency?.replaceAll("_", " ") || "Normal"} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryMetric label="Success criteria" value={successCount} />
          <SummaryMetric label="Proof requirements" value={proofCount} />
          <SummaryMetric label="Milestones" value={milestoneCount} />
        </div>
      </CardContent>
    </Card>
  );
}

function ExecutionPlansPanel({ challenge, isLoadingPlans = false, recentPlans = [] }) {
  const challengeId = challenge.id;
  const totalPlans = getPlansCount(challenge);
  const shortlistedPlans = getShortlistedPlansCount(challenge);
  const selectedProvider = Boolean(challenge.applicationStats?.selectedProviderId);

  return (
    <Card as="section" padding="md" variant="muted">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="primary">Execution plans</Badge>
            <CardTitle className="mt-3 text-lg">Plan Review Control</CardTitle>
          </div>
          <Button as={Link} className="w-full sm:w-auto" to={ROUTES.CHALLENGE_PLANS(challengeId)}>
            <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
            Review Execution Plans
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryMetric label="Total plans" value={totalPlans} />
          <SummaryMetric label="Shortlisted" value={shortlistedPlans} />
          <SummaryMetric label="Selected provider" value={selectedProvider ? "Selected" : "Not selected"} />
        </div>
        <p className="mt-4 text-sm leading-6 text-[#78716C]">
          Review plan approach, proof plan, timeline, price, and quality before selecting a provider.
        </p>
        {isLoadingPlans ? (
          <div className="mt-4 grid gap-3">
            {[0, 1].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : recentPlans.length > 0 ? (
          <div className="mt-4 grid gap-3">
            {recentPlans.map((plan) => {
              const planId = getPlanId(plan);

              return (
                <article className="rounded-2xl border border-[#E7E5E4] bg-white p-4" key={planId || plan.title}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-[#1C1917]">{plan.title || "Execution plan"}</p>
                        <ExecutionPlanStatusBadge status={plan.status} />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-[#78716C]">
                        {getProviderName(plan)} - {formatPlanScore(plan)}
                      </p>
                    </div>
                    {planId ? (
                      <Button as={Link} className="min-h-10 px-4 py-2 text-xs" to={ROUTES.CLIENT_EXECUTION_PLAN(challengeId, planId)} variant="outline">
                        Open
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ProviderSelectionPanel({
  challenge,
  isLoading = false,
  recommendedCount = 0,
  shortlistedCount = 0,
  selectedProviderName = "",
}) {
  const challengeId = challenge.id;
  const hasSelectedProvider = Boolean(challenge.applicationStats?.selectedProviderId);

  return (
    <Card as="section" padding="md" variant="muted">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="primary">Provider selection</Badge>
            <CardTitle className="mt-3 text-lg">Provider Selection Panel</CardTitle>
          </div>
          <Button as={Link} className="w-full sm:w-auto" to={ROUTES.CHALLENGE_PROVIDERS(challengeId)}>
            <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
            View Providers
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryMetric label="Recommended" value={recommendedCount} />
            <SummaryMetric label="Shortlisted" value={shortlistedCount} />
            <SummaryMetric
              label="Selected provider"
              value={selectedProviderName || (hasSelectedProvider ? "Selected" : "Not selected")}
            />
          </div>
        )}
        <p className="mt-4 text-sm leading-6 text-[#78716C]">
          Compare recommendations, manage the challenge shortlist, and select a provider through the submitted execution plan workflow.
        </p>
      </CardContent>
    </Card>
  );
}

function SelectedProviderPanel({ challenge }) {
  const hasSelectedProvider = Boolean(challenge.applicationStats?.selectedProviderId);

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant={hasSelectedProvider ? "green" : "gray"}>
              {hasSelectedProvider ? "Provider selected" : "No provider selected"}
            </Badge>
            <CardTitle className="mt-3 text-lg">Selected Provider</CardTitle>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
            <UsersRound aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {hasSelectedProvider ? (
          <p className="text-sm leading-6 text-[#78716C]">
            A provider is selected for this challenge. Public-safe provider summary will connect when the milestone workspace is introduced.
          </p>
        ) : (
          <EmptyState
            actionHref={ROUTES.CHALLENGE_PLANS(challenge.id)}
            actionText="Review Plans"
            description="No provider selected yet. Review execution plans or recommended providers before choosing one."
            icon={UsersRound}
            size="sm"
            title="No provider selected yet"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}

function ProofReviewPanel() {
  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="secondary">Later stage</Badge>
            <CardTitle className="mt-3 text-lg">Proof Review</CardTitle>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#FEF3C7] text-[#A16207]">
            <FileCheck2 aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-[#78716C]">
          Proof review will become available after milestone and proof submission stages. This control panel keeps the placeholder visible without enabling unsupported workflow.
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityPlaceholder({ challenge }) {
  const items = [
    challenge.createdAt ? ["Challenge created", challenge.createdAt] : null,
    challenge.publishedAt ? ["Challenge published", challenge.publishedAt] : null,
    challenge.closedAt ? ["Challenge closed", challenge.closedAt] : null,
  ].filter(Boolean);

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle className="text-lg">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ol className="grid gap-3">
            {items.map(([label, date]) => (
              <li className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={`${label}-${date}`}>
                <p className="text-sm font-black text-[#1C1917]">{label}</p>
                <p className="mt-1 text-xs font-bold text-[#78716C]">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date))}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm leading-6 text-[#78716C]">
            Challenge workflow events will appear here as the control center grows.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const challengeQuery = useChallenge(challengeId);
  const publishMutation = usePublishChallenge();
  const pauseMutation = usePauseChallenge();
  const closeMutation = useCloseChallenge();
  const archiveMutation = useArchiveChallenge();
  const recommendedProvidersQuery = useChallengeRecommendedProviders(challengeId, { limit: 4 }, { enabled: Boolean(challengeId) });
  const savedProvidersQuery = useMySavedProviders(
    { challengeId, limit: 50, sort: "newest" },
    { enabled: Boolean(challengeId) },
  );
  const recentPlansQuery = useChallengePlans(
    challengeId,
    { limit: 50, sort: "newest" },
    { enabled: Boolean(challengeId) },
  );
  const refreshRecommendationsMutation = useRefreshChallengeMatches(challengeId);
  const challenge = challengeQuery.data;
  const recommendedProviderMatches = recommendedProvidersQuery.data?.items ?? [];
  const plans = recentPlansQuery.data?.items ?? [];
  const recentPlans = plans.slice(0, 2);
  const acceptedPlan = plans.find((plan) => plan.status === "accepted");
  const selectedProviderName = acceptedPlan ? getProviderName(acceptedPlan) : "";
  const savedProviders = savedProvidersQuery.data?.items ?? [];
  const shortlistedProviderCount =
    Number(savedProvidersQuery.data?.stats?.shortlisted ?? 0) ||
    savedProviders.filter((item) => item.status === "shortlisted").length;
  const nextAction = getChallengeNextAction(challenge);

  async function handleRefreshRecommendations() {
    try {
      await refreshRecommendationsMutation.mutateAsync();
    } catch {
      // The dedicated recommendations page shows full actionable API errors.
    }
  }

  async function handlePublish() {
    if (!challenge?.id) {
      return;
    }

    await publishMutation.mutateAsync(challenge.id);
  }

  if (challengeQuery.isLoading) {
    return <PageLoader description="Loading owner control panel and challenge details." title="Loading challenge" />;
  }

  if (challengeQuery.isError || !challenge) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Challenge unavailable</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#1C1917]">Challenge could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getChallengeApiErrorMessage(challengeQuery.error, "This challenge may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.MY_CHALLENGES}>
          Back to challenges
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            {nextAction.disabled ? (
              <Button disabled type="button" variant="secondary">{nextAction.label}</Button>
            ) : nextAction.action === "publish" ? (
              <Button
                isLoading={publishMutation.isPending}
                loadingLabel={challenge.status === "paused" ? "Resuming..." : "Publishing..."}
                onClick={handlePublish}
                type="button"
              >
                {nextAction.label}
              </Button>
            ) : nextAction.route ? (
              <Button as={Link} to={nextAction.route}>{nextAction.label}</Button>
            ) : null}
            <Button as={Link} to={ROUTES.MY_CHALLENGES} variant="outline">
              Back to Challenges
            </Button>
          </div>
        }
        backFallback={ROUTES.MY_CHALLENGES}
        description={challenge.shortSummary}
        eyebrow="Challenge control panel"
        showBack
        title={challenge.title}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryMetric label="Status" value={<ChallengeStatusBadge status={challenge.status} />} />
        <SummaryMetric label="Visibility" value={<ChallengeVisibilityBadge visibility={challenge.visibility} />} />
        <SummaryMetric label="Quality score" value={`${Number(challenge.qualityScore?.score ?? 0)}/100`} />
        <SummaryMetric label="Plans received" value={getPlansCount(challenge)} />
        <SummaryMetric label="Recommended" value={getRecommendedProvidersCount(challenge)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <ChallengeWorkflowPanel
            challenge={challenge}
            isPublishing={publishMutation.isPending}
            onPublish={handlePublish}
          />
          <ChallengeSummary challenge={challenge} />
          <DetailList
            emptyText="Add success criteria so providers know exactly how the outcome will be judged."
            items={challenge.successCriteria}
            title="Success Criteria"
          />
          <DetailList
            emptyText="Add proof requirements so providers know what evidence must be submitted."
            items={challenge.proofRequirements}
            title="Proof Requirements"
          />
          <DetailList
            emptyText="Milestone workspace will connect later, but templates can guide provider planning now."
            items={challenge.milestoneTemplate}
            title="Milestone Template"
          />
          <ExecutionPlansPanel
            challenge={challenge}
            isLoadingPlans={recentPlansQuery.isFetching}
            recentPlans={recentPlans}
          />
          <ClientRecommendedProvidersPanel
            challengeId={challenge.id}
            isLoading={recommendedProvidersQuery.isLoading}
            isRefreshing={refreshRecommendationsMutation.isPending}
            matches={recommendedProviderMatches}
            onRefresh={handleRefreshRecommendations}
          />
          <ProviderSelectionPanel
            challenge={challenge}
            isLoading={savedProvidersQuery.isLoading}
            recommendedCount={recommendedProviderMatches.length || getRecommendedProvidersCount(challenge)}
            selectedProviderName={selectedProviderName}
            shortlistedCount={shortlistedProviderCount}
          />
          <SelectedProviderPanel challenge={challenge} />
          <ProofReviewPanel />
          <ActivityPlaceholder challenge={challenge} />
        </div>
        <aside className="grid gap-5 xl:sticky xl:top-6">
          <ChallengeActions
            challenge={challenge}
            isArchiving={archiveMutation.isPending}
            isClosing={closeMutation.isPending}
            isPausing={pauseMutation.isPending}
            isPublishing={publishMutation.isPending}
            onArchive={(id) => archiveMutation.mutateAsync(id).then(() => navigate(ROUTES.MY_CHALLENGES))}
            onClose={(id) => closeMutation.mutateAsync(id)}
            onPause={(id) => pauseMutation.mutateAsync(id)}
            onPublish={(id) => publishMutation.mutateAsync(id)}
            showView={false}
          />
          <ChallengeQualityCard challenge={challenge} />
          <ChallengePreview challenge={challenge} />
        </aside>
      </div>
    </div>
  );
}
