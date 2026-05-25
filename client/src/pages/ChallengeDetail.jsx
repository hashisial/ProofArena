import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ChallengeActions } from "../components/challenges/ChallengeActions.jsx";
import { ChallengePreview } from "../components/challenges/ChallengePreview.jsx";
import { ChallengeQualityCard } from "../components/challenges/ChallengeQualityCard.jsx";
import { ChallengeStatusBadge, ChallengeVisibilityBadge } from "../components/challenges/ChallengeStatusBadge.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
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

function DetailList({ items = [], title }) {
  return (
    <Card padding="md" variant="default">
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
          <p className="text-sm leading-6 text-[#78716C]">Nothing added yet.</p>
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
  const challenge = challengeQuery.data;

  if (challengeQuery.isLoading) {
    return <PageLoader description="Loading owner preview and challenge details." title="Loading challenge" />;
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
        }
        backFallback={ROUTES.MY_CHALLENGES}
        description={challenge.shortSummary}
        eyebrow="Owner challenge preview"
        showBack
        title={challenge.title}
      />

      <div className="flex flex-wrap gap-2">
        <ChallengeStatusBadge status={challenge.status} />
        <ChallengeVisibilityBadge visibility={challenge.visibility} />
        <Badge variant="outline">{challenge.category}</Badge>
        <Badge variant="secondary">{challenge.urgency}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <Card padding="lg" variant="default">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Target outcome</p>
            <h2 className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
              {challenge.targetOutcome?.outcomeStatement}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatChallengeTimeline(challenge.timeline)}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Budget</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatChallengeBudget(challenge.budget)}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Plans</p>
                <p className="mt-1 font-black text-[#1C1917]">{Number(challenge.applicationStats?.totalPlans ?? 0)} submitted</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#44403C]">{challenge.description}</p>
          </Card>
          <DetailList items={challenge.successCriteria} title="Success criteria" />
          <DetailList items={challenge.proofRequirements} title="Proof requirements" />
          <DetailList items={challenge.milestoneTemplate} title="Milestone template" />
          <Card padding="md" variant="muted">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-[#1C1917]">Execution Plans</h2>
                <p className="mt-2 text-sm leading-6 text-[#78716C]">
                  Plans submitted by providers will appear here for review, shortlisting, and selection.
                </p>
              </div>
              <Button as={Link} className="w-full sm:w-auto" to={ROUTES.CHALLENGE_PLANS(challenge.id)}>
                Review Plans
              </Button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Total plans</p>
                <p className="mt-1 text-2xl font-black text-[#1C1917]">{challenge.applicationStats?.totalPlans ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Shortlisted</p>
                <p className="mt-1 text-2xl font-black text-[#1C1917]">{challenge.applicationStats?.shortlistedPlans ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Selected provider</p>
                <p className="mt-1 text-sm font-black text-[#1C1917]">
                  {challenge.applicationStats?.selectedProviderId ? "Selected" : "Not selected"}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#78716C]">
              Execution plan details do not include payments or milestone workspace yet.
            </p>
          </Card>
        </div>
        <aside className="grid gap-5">
          <ChallengePreview challenge={challenge} />
          <ChallengeQualityCard challenge={challenge} />
        </aside>
      </div>
    </div>
  );
}
