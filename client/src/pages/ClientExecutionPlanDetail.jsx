import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { CalendarClock, FileText, LinkIcon, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ClientPlanReviewPanel } from "../components/executionPlans/ClientPlanReviewPanel.jsx";
import { ExecutionPlanDecisionModal } from "../components/executionPlans/ExecutionPlanDecisionModal.jsx";
import { ExecutionPlanQualityCard } from "../components/executionPlans/ExecutionPlanQualityCard.jsx";
import { ExecutionPlanStatusBadge } from "../components/executionPlans/ExecutionPlanStatusBadge.jsx";
import { PlanComparisonCard } from "../components/executionPlans/PlanComparisonCard.jsx";
import { ProviderPlanSummary } from "../components/executionPlans/ProviderPlanSummary.jsx";
import {
  formatPlanScore,
  getCommunicationLabel,
  getPlanScoreValue,
} from "../components/executionPlans/executionPlanReviewUtils.js";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
} from "../features/challenges/challengeUtils.js";
import {
  formatPlanPrice,
  formatPlanTimeline,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useAcceptExecutionPlan,
  useClientExecutionPlan,
  useRejectExecutionPlan,
  useShortlistExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";
import { formatDate, formatDateTime } from "../utils/formatDate.js";

function DetailList({ emptyText = "Nothing added yet.", items = [], title, type }) {
  return (
    <Card as="section" padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={`${item.title || item.risk || index}-${index}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p className="font-black text-[#1C1917]">{item.title || item.risk || "Review item"}</p>
              {type === "proof" && item.proofType ? (
                <Badge variant={item.required === false ? "outline" : "green"}>
                  {item.required === false ? "Optional" : "Required"} {item.proofType.replaceAll("_", " ")}
                </Badge>
              ) : null}
            </div>
            {item.description || item.mitigation ? (
              <p className="mt-2 text-sm leading-6 text-[#78716C]">{item.description || item.mitigation}</p>
            ) : null}
            {item.deliverable ? <p className="mt-3 text-sm font-semibold text-[#44403C]">Deliverable: {item.deliverable}</p> : null}
            {item.expectedDueDay ? <p className="mt-2 text-sm font-semibold text-[#44403C]">Expected by day {item.expectedDueDay}</p> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}

function TextSection({ children, eyebrow, title }) {
  return (
    <Card as="section" padding="lg" variant="default">
      {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-[#44403C]">{children}</div>
    </Card>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">{label}</p>
      <p className="mt-1 break-words text-base font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

function ChallengeContext({ challenge }) {
  if (!challenge) {
    return null;
  }

  return (
    <Card as="section" padding="md" variant="muted">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">Challenge context</Badge>
        {challenge.status ? <Badge variant="outline">{challenge.status.replaceAll("_", " ")}</Badge> : null}
      </div>
      <h2 className="mt-3 text-xl font-black tracking-normal text-[#1C1917]">{challenge.title || "Outcome challenge"}</h2>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">
        {challenge.targetOutcome?.outcomeStatement || challenge.shortSummary || "Challenge summary not available."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Category" value={challenge.category || "Not specified"} />
        <Metric label="Budget" value={formatChallengeBudget(challenge.budget)} />
        <Metric label="Timeline" value={formatChallengeTimeline(challenge.timeline)} />
      </div>
    </Card>
  );
}

function CommunicationSection({ plan }) {
  const channels = plan?.communicationPlan?.channels ?? [];
  const note = plan?.communicationPlan?.note;

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle className="text-lg">Communication Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Update cadence" value={getCommunicationLabel(plan)} />
          <Metric label="Can start" value={plan?.availability?.canStart?.replaceAll("_", " ") || "Not specified"} />
        </div>
        {channels.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {channels.map((channel) => <Badge key={channel} variant="outline">{channel}</Badge>)}
          </div>
        ) : null}
        {note ? <p className="mt-4 text-sm leading-6 text-[#78716C]">{note}</p> : null}
      </CardContent>
    </Card>
  );
}

function AttachmentsSection({ attachments = [] }) {
  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle className="text-lg">Attachments and References</CardTitle>
      </CardHeader>
      <CardContent>
        {attachments.length > 0 ? (
          <div className="grid gap-3">
            {attachments.map((attachment, index) => (
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={`${attachment.title || attachment.url}-${index}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-black text-[#1C1917]">{attachment.title || "Reference"}</p>
                    {attachment.note ? <p className="mt-1 text-sm leading-6 text-[#78716C]">{attachment.note}</p> : null}
                  </div>
                  {attachment.type ? <Badge variant="outline">{attachment.type.replaceAll("_", " ")}</Badge> : null}
                </div>
                {attachment.url ? (
                  <Button as="a" className="mt-4 min-h-10 px-4 py-2 text-xs" href={attachment.url} rel="noreferrer" target="_blank" variant="outline">
                    <LinkIcon aria-hidden="true" className="mr-2 h-4 w-4" />
                    Open Reference
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#78716C]">No public references were attached to this plan.</p>
        )}
      </CardContent>
    </Card>
  );
}

function DecisionHistory({ plan }) {
  const feedback = plan?.clientFeedback ?? {};
  const items = [
    plan?.shortlistedAt ? ["Shortlisted", plan.shortlistedAt, feedback.shortlistNote] : null,
    plan?.acceptedAt ? ["Accepted", plan.acceptedAt, feedback.acceptedNote] : null,
    plan?.rejectedAt ? ["Rejected", plan.rejectedAt, feedback.rejectionReason] : null,
  ].filter(Boolean);

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle className="text-lg">Decision History</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="grid gap-3">
            {items.map(([label, date, note]) => (
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={`${label}-${date}`}>
                <p className="font-black text-[#1C1917]">{label}</p>
                <p className="mt-1 text-sm font-bold text-[#78716C]">{formatDateTime(date, { fallback: "Recently" })}</p>
                {note ? <p className="mt-2 text-sm leading-6 text-[#44403C]">{note}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#78716C]">
            Shortlist, reject, or accept decisions will appear here. This does not start payments, messaging, or proof review.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function ClientExecutionPlanDetail() {
  const { challengeId, planId } = useParams();
  const [decision, setDecision] = useState({ mode: "shortlist", open: false });
  const planQuery = useClientExecutionPlan(planId);
  const shortlistMutation = useShortlistExecutionPlan();
  const rejectMutation = useRejectExecutionPlan();
  const acceptMutation = useAcceptExecutionPlan();
  const plan = planQuery.data;
  const selectedMutation =
    decision.mode === "accept"
      ? acceptMutation
      : decision.mode === "reject"
        ? rejectMutation
        : shortlistMutation;

  if (planQuery.isLoading) {
    return <PageLoader description="Loading execution plan for client review." title="Loading execution plan" />;
  }

  if (planQuery.isError || !plan) {
    return (
      <EmptyState
        actionHref={ROUTES.CHALLENGE_PLANS(challengeId)}
        actionText="Back to Plans"
        description="This plan may have moved, been withdrawn, or you may no longer have access."
        icon={FileText}
        title="Execution plan could not be loaded"
        variant="spotlight"
      />
    );
  }

  async function handleDecision(payload) {
    await selectedMutation.mutateAsync({ id: plan.id, payload });
    setDecision({ mode: "shortlist", open: false });
  }

  function openDecision(mode) {
    setDecision({ mode, open: true });
  }

  const score = getPlanScoreValue(plan);

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} to={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
              Back to Plans
            </Button>
            <Button as={Link} to={ROUTES.OWNER_CHALLENGE(challengeId)} variant="secondary">
              Challenge Control Panel
            </Button>
          </div>
        }
        backFallback={ROUTES.CHALLENGE_PLANS(challengeId)}
        description={plan.summary || "Review structured provider execution details before making a client decision."}
        eyebrow="Client plan detail"
        showBack
        title={plan.title || "Execution plan"}
      />

      <div className="flex flex-wrap items-center gap-2">
        <ExecutionPlanStatusBadge status={plan.status} />
        <Badge variant="outline">{formatPlanScore(plan)} plan score</Badge>
        <Badge variant="outline">Submitted {formatDate(plan.submittedAt || plan.createdAt, { fallback: "recently" })}</Badge>
        {score !== null && score >= 80 ? (
          <Badge leftIcon={<ShieldCheck className="h-3.5 w-3.5" />} variant="green">Strong plan signal</Badge>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <ChallengeContext challenge={plan.challenge} />
          <ProviderPlanSummary plan={plan} />
          <PlanComparisonCard plan={plan} />
          <TextSection eyebrow="Execution approach" title="How this provider plans to deliver">
            <p>{plan.approach || "No detailed approach was provided."}</p>
            {plan.whyThisProvider ? (
              <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Provider fit note</p>
                <p className="mt-2 text-sm leading-6 text-[#44403C]">{plan.whyThisProvider}</p>
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Metric label="Timeline" value={formatPlanTimeline(plan.timeline)} />
              <Metric label="Price" value={formatPlanPrice(plan.price)} />
            </div>
          </TextSection>
          <DetailList
            emptyText="No milestones were included."
            items={plan.milestones}
            title="Milestones"
          />
          <DetailList
            emptyText="No proof items were included."
            items={plan.proofPlan}
            title="Proof Plan"
            type="proof"
          />
          <DetailList
            emptyText="No risk handling was included."
            items={plan.riskHandling}
            title="Risk Handling"
          />
          <CommunicationSection plan={plan} />
          <AttachmentsSection attachments={plan.attachments} />
          <DecisionHistory plan={plan} />
        </div>
        <aside className="grid gap-5">
          <ClientPlanReviewPanel
            isAccepting={acceptMutation.isPending}
            isRejecting={rejectMutation.isPending}
            isShortlisting={shortlistMutation.isPending}
            onAccept={() => openDecision("accept")}
            onReject={() => openDecision("reject")}
            onShortlist={() => openDecision("shortlist")}
            plan={plan}
            showBackLink
          />
          <ExecutionPlanQualityCard plan={plan} />
          <Card padding="md" variant="bordered">
            <div className="flex items-start gap-3">
              <CalendarClock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#A16207]" />
              <p className="text-sm leading-6 text-[#78716C]">
                Milestone workspace, payment handling, messaging, and proof review will connect in later stages. This page records the client plan decision only.
              </p>
            </div>
          </Card>
        </aside>
      </div>

      <ExecutionPlanDecisionModal
        isLoading={selectedMutation.isPending}
        isOpen={decision.open}
        mode={decision.mode}
        onClose={() => setDecision({ mode: "shortlist", open: false })}
        onConfirm={handleDecision}
        plan={plan}
      />
    </div>
  );
}
