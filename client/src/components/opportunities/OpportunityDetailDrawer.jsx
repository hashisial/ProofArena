import { Archive, ExternalLink, Save } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import {
  OPPORTUNITY_STAGE_UPDATE_OPTIONS,
  formatOpportunityValue,
} from "../../features/opportunities/opportunityUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { OpportunityNextActionCard } from "./OpportunityNextActionCard.jsx";
import {
  OpportunityPriorityBadge,
  OpportunitySourceBadge,
  OpportunityStageBadge,
} from "./OpportunityStageBadge.jsx";

function dateInputValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function OpportunityDetailDrawer({
  isArchiving = false,
  isCompletingNextAction = false,
  isOpen,
  isSavingNextAction = false,
  isAddingNote = false,
  isUpdatingStage = false,
  onAddNote,
  onArchive,
  onClose,
  onCompleteNextAction,
  onStageChange,
  onUpdateNextAction,
  opportunity,
}) {
  const [note, setNote] = useState("");
  const [nextAction, setNextAction] = useState(() => ({
    description: opportunity?.nextAction?.description ?? "",
    dueAt: dateInputValue(opportunity?.nextAction?.dueAt),
    title: opportunity?.nextAction?.title ?? "",
  }));

  if (!opportunity) {
    return null;
  }

  async function submitNote(event) {
    event.preventDefault();
    const body = note.trim();
    if (!body) return;
    await onAddNote?.(opportunity, body);
    setNote("");
  }

  async function submitNextAction(event) {
    event.preventDefault();
    await onUpdateNextAction?.(opportunity, {
      description: nextAction.description.trim(),
      dueAt: nextAction.dueAt || null,
      title: nextAction.title.trim(),
    });
  }

  return (
    <Modal
      description="Review context, next action, notes, and stage history for this provider opportunity."
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={opportunity.title}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-5">
          <Card padding="md" variant="bordered">
            <div className="flex flex-wrap gap-2">
              <OpportunityStageBadge stage={opportunity.stage} />
              <OpportunitySourceBadge source={opportunity.source} />
              <OpportunityPriorityBadge priority={opportunity.priority} />
            </div>
            <p className="mt-4 text-sm leading-7 text-[#493C5E]">
              {opportunity.summary || opportunity.challenge?.shortSummary || "No summary added yet."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Value</p>
                <p className="mt-1 font-black text-[#07030D]">{formatOpportunityValue(opportunity.value)}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Match</p>
                <p className="mt-1 font-black text-[#07030D]">{opportunity.matchScore ? `${Math.round(opportunity.matchScore)}%` : "No score"}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Last activity</p>
                <p className="mt-1 font-black text-[#07030D]">{formatDate(opportunity.lastActivityAt)}</p>
              </div>
            </div>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Opportunity context</CardTitle>
              <CardDescription>Public-safe client, challenge, plan, and match context.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-black text-[#07030D]">Challenge</p>
                <p className="mt-1 text-sm leading-6 text-[#6F657C]">{opportunity.challenge?.title || "No challenge linked"}</p>
                {opportunity.challengeId ? (
                  <Button as={Link} className="mt-3" to={ROUTES.CHALLENGES} variant="outline">
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    View Challenge
                  </Button>
                ) : null}
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-black text-[#07030D]">Client</p>
                <p className="mt-1 text-sm leading-6 text-[#6F657C]">{opportunity.client?.fullName || "No client linked"}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-black text-[#07030D]">Execution plan</p>
                <p className="mt-1 text-sm leading-6 text-[#6F657C]">{opportunity.executionPlan?.title || "No execution plan linked"}</p>
                {opportunity.executionPlanId ? (
                  <Button as={Link} className="mt-3" to={ROUTES.EXECUTION_PLAN_DETAIL(opportunity.executionPlanId)} variant="outline">
                    <ExternalLink aria-hidden="true" className="h-4 w-4" />
                    View Plan
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {opportunity.stage === "lost" ? (
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Lost reason</CardTitle>
                <CardDescription>Foundation for future lost-deal analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-black text-[#07030D]">{opportunity.lostInfo?.reason || "No reason recorded"}</p>
                {opportunity.lostInfo?.note ? (
                  <p className="mt-2 text-sm leading-6 text-[#6F657C]">{opportunity.lostInfo.note}</p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Keep lightweight CRM notes without building messaging.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form className="grid gap-3" onSubmit={submitNote}>
                <Textarea label="Add note" onChange={(event) => setNote(event.target.value)} rows={3} value={note} />
                <Button className="justify-self-start" disabled={!note.trim()} isLoading={isAddingNote} type="submit">
                  Add Note
                </Button>
              </form>
              <div className="grid gap-3">
                {(opportunity.notes ?? []).length > 0 ? [...opportunity.notes].reverse().map((item, index) => (
                  <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3" key={`${item.createdAt}-${index}`}>
                    <p className="text-sm leading-6 text-[#493C5E]">{item.body}</p>
                    <p className="mt-2 text-xs font-bold text-[#6F657C]">{formatDate(item.createdAt)}</p>
                  </div>
                )) : (
                  <p className="text-sm leading-6 text-[#6F657C]">No notes yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Stage</CardTitle>
              <CardDescription>Move the opportunity through the acquisition workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                disabled={isUpdatingStage}
                label="Current stage"
                onChange={(event) => onStageChange?.(opportunity, event.target.value)}
                options={OPPORTUNITY_STAGE_UPDATE_OPTIONS}
                placeholder=""
                value={opportunity.stage}
              />
            </CardContent>
          </Card>

          <OpportunityNextActionCard
            isCompleting={isCompletingNextAction}
            nextAction={opportunity.nextAction}
            onComplete={(completed) => onCompleteNextAction?.(opportunity, completed)}
          />

          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Update next action</CardTitle>
              <CardDescription>Track the next provider-owned follow-up.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3" onSubmit={submitNextAction}>
                <Input label="Action title" onChange={(event) => setNextAction((current) => ({ ...current, title: event.target.value }))} value={nextAction.title} />
                <Textarea label="Description" onChange={(event) => setNextAction((current) => ({ ...current, description: event.target.value }))} rows={3} value={nextAction.description} />
                <Input label="Due date" onChange={(event) => setNextAction((current) => ({ ...current, dueAt: event.target.value }))} type="date" value={nextAction.dueAt} />
                <Button isLoading={isSavingNextAction} loadingLabel="Saving..." type="submit">
                  <Save aria-hidden="true" className="h-4 w-4" />
                  Save Next Action
                </Button>
              </form>
            </CardContent>
          </Card>

          <Button isLoading={isArchiving} onClick={() => onArchive?.(opportunity)} type="button" variant="outline">
            <Archive aria-hidden="true" className="h-4 w-4" />
            Archive Opportunity
          </Button>
        </aside>
      </div>
    </Modal>
  );
}
