import { Link } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { LostReasonModal } from "../components/opportunities/LostReasonModal.jsx";
import { OpportunityBoard } from "../components/opportunities/OpportunityBoard.jsx";
import { OpportunityDetailDrawer } from "../components/opportunities/OpportunityDetailDrawer.jsx";
import { OpportunityFilters } from "../components/opportunities/OpportunityFilters.jsx";
import { OpportunityTable } from "../components/opportunities/OpportunityTable.jsx";
import { PipelineEmptyState } from "../components/opportunities/PipelineEmptyState.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { Textarea } from "../components/ui/Textarea.jsx";
import { ROUTES } from "../constants/index.js";
import {
  OPPORTUNITY_PRIORITY_INPUT_OPTIONS,
  getOpportunityApiErrorMessage,
} from "../features/opportunities/opportunityUtils.js";
import {
  useAddOpportunityNote,
  useArchiveOpportunity,
  useCompleteNextAction,
  useCreateOpportunity,
  useMyOpportunities,
  useOpportunityStats,
  useUpdateNextAction,
  useUpdateOpportunityStage,
} from "../features/opportunities/useOpportunities.js";

const defaultFilters = {
  priority: "all",
  q: "",
  sort: "last_activity",
  source: "all",
  stage: "all",
};

const defaultForm = {
  amount: "",
  currency: "USD",
  nextActionDueAt: "",
  nextActionTitle: "",
  priority: "normal",
  summary: "",
  tagsText: "",
  title: "",
};

function parseTags(value) {
  return Array.from(new Set(String(value ?? "").split(",").map((item) => item.trim()).filter(Boolean))).slice(0, 20);
}

function StatCard({ label, value }) {
  return (
    <Card padding="sm" variant="muted">
      <p className="text-sm font-bold text-[#6F657C]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#07030D]">{value}</p>
    </Card>
  );
}

export function OpportunityPipeline() {
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState("board");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [lostTarget, setLostTarget] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState("");
  const opportunitiesQuery = useMyOpportunities(filters);
  const statsQuery = useOpportunityStats();
  const createMutation = useCreateOpportunity();
  const stageMutation = useUpdateOpportunityStage();
  const noteMutation = useAddOpportunityNote();
  const nextActionMutation = useUpdateNextAction();
  const completeNextActionMutation = useCompleteNextAction();
  const archiveMutation = useArchiveOpportunity();
  const opportunities = useMemo(() => opportunitiesQuery.data?.items ?? [], [opportunitiesQuery.data?.items]);
  const stats = statsQuery.data ?? {};

  function resetFilters() {
    setFilters(defaultFilters);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddModal() {
    setForm(defaultForm);
    setFormError("");
    setIsAddOpen(true);
  }

  async function handleCreateOpportunity(event) {
    event.preventDefault();
    const title = form.title.trim();

    if (!title) {
      setFormError("Opportunity title is required.");
      return;
    }

    const amount = Number(form.amount);
    const payload = {
      nextAction: {
        dueAt: form.nextActionDueAt || undefined,
        title: form.nextActionTitle.trim(),
      },
      priority: form.priority,
      source: "manual",
      summary: form.summary.trim(),
      tags: parseTags(form.tagsText),
      title,
      value: {
        amount: Number.isFinite(amount) ? amount : undefined,
        currency: form.currency.trim() || "USD",
        type: Number.isFinite(amount) ? "fixed" : "unknown",
      },
    };

    try {
      await createMutation.mutateAsync(payload);
      setIsAddOpen(false);
      setForm(defaultForm);
    } catch (error) {
      setFormError(getOpportunityApiErrorMessage(error));
    }
  }

  async function handleStageChange(opportunity, stage) {
    if (!opportunity?.id || stage === opportunity.stage) return;

    if (stage === "lost") {
      setLostTarget(opportunity);
      return;
    }

    const updated = await stageMutation.mutateAsync({ id: opportunity.id, payload: { stage } });
    if (selectedOpportunity?.id === updated?.id) {
      setSelectedOpportunity(updated);
    }
  }

  async function handleLostConfirm(payload) {
    if (!lostTarget?.id) return;
    const updated = await stageMutation.mutateAsync({ id: lostTarget.id, payload });
    if (selectedOpportunity?.id === updated?.id) {
      setSelectedOpportunity(updated);
    }
    setLostTarget(null);
  }

  async function handleArchive(opportunity) {
    if (!opportunity?.id || !window.confirm("Archive this opportunity?")) return;
    const updated = await archiveMutation.mutateAsync(opportunity.id);
    if (selectedOpportunity?.id === updated?.id) {
      setSelectedOpportunity(updated);
    }
  }

  async function handleAddNote(opportunity, body) {
    const updated = await noteMutation.mutateAsync({ id: opportunity.id, payload: { body } });
    setSelectedOpportunity(updated);
  }

  async function handleUpdateNextAction(opportunity, payload) {
    const updated = await nextActionMutation.mutateAsync({ id: opportunity.id, payload });
    setSelectedOpportunity(updated);
  }

  async function handleCompleteNextAction(opportunity, completed) {
    const updated = await completeNextActionMutation.mutateAsync({
      id: opportunity.id,
      payload: { completed },
    });
    setSelectedOpportunity(updated);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <>
            <Button as={Link} to={ROUTES.MATCHED_CHALLENGES} variant="secondary">
              View Matched Challenges
            </Button>
            <Button onClick={openAddModal} type="button">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add Opportunity
            </Button>
          </>
        }
        description="Track matched challenges, invites, submitted plans, shortlisted chances, wins, losses, and follow-ups."
        eyebrow="Provider acquisition CRM"
        title="Opportunity Pipeline"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total opportunities" value={stats.total ?? opportunities.length} />
        <StatCard label="Shortlisted" value={stats.shortlisted ?? 0} />
        <StatCard label="Won" value={stats.won ?? 0} />
        <StatCard label="Lost" value={stats.lost ?? 0} />
        <StatCard label="Due soon" value={stats.dueSoon ?? 0} />
      </div>

      <Card padding="md" variant="bordered">
        <div className="grid gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setViewMode("board")} type="button" variant={viewMode === "board" ? "primary" : "secondary"}>
                Board
              </Button>
              <Button onClick={() => setViewMode("list")} type="button" variant={viewMode === "list" ? "primary" : "secondary"}>
                List
              </Button>
            </div>
            <Badge variant="outline">Drag/drop disabled; use stage controls</Badge>
          </div>
          <OpportunityFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>
      </Card>

      {opportunitiesQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load opportunities</Badge>
          <p className="mt-3 text-sm leading-6 text-[#6F657C]">
            {getOpportunityApiErrorMessage(opportunitiesQuery.error, "Opportunity pipeline could not be loaded.")}
          </p>
          <Button className="mt-5" onClick={() => opportunitiesQuery.refetch()} type="button">
            Retry
          </Button>
        </Card>
      ) : null}

      {opportunitiesQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => <Skeleton className="h-80" key={item} />)}
        </div>
      ) : null}

      {!opportunitiesQuery.isLoading && !opportunitiesQuery.isError && opportunities.length === 0 ? (
        <PipelineEmptyState onAdd={openAddModal} />
      ) : null}

      {!opportunitiesQuery.isLoading && !opportunitiesQuery.isError && opportunities.length > 0 ? (
        viewMode === "board" ? (
          <OpportunityBoard
            isArchiving={archiveMutation.isPending}
            isUpdatingStage={stageMutation.isPending}
            onArchive={handleArchive}
            onStageChange={handleStageChange}
            onView={setSelectedOpportunity}
            opportunities={opportunities}
          />
        ) : (
          <OpportunityTable
            isArchiving={archiveMutation.isPending}
            isUpdatingStage={stageMutation.isPending}
            onArchive={handleArchive}
            onStageChange={handleStageChange}
            onView={setSelectedOpportunity}
            opportunities={opportunities}
          />
        )
      ) : null}

      <Modal
        description="Add a manual opportunity that is not yet linked to a matched challenge or execution plan."
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        size="lg"
        title="Add Opportunity"
      >
        <form className="grid gap-4" onSubmit={handleCreateOpportunity}>
          {formError ? (
            <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] p-4 text-sm font-bold text-[#991B1B]">
              {formError}
            </div>
          ) : null}
          <Input label="Title" onChange={(event) => updateForm("title", event.target.value)} required value={form.title} />
          <Textarea label="Summary" onChange={(event) => updateForm("summary", event.target.value)} rows={4} value={form.summary} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Select label="Priority" onChange={(event) => updateForm("priority", event.target.value)} options={OPPORTUNITY_PRIORITY_INPUT_OPTIONS} placeholder="" value={form.priority} />
            <Input label="Value" min="0" onChange={(event) => updateForm("amount", event.target.value)} type="number" value={form.amount} />
            <Input label="Currency" onChange={(event) => updateForm("currency", event.target.value)} value={form.currency} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Next action" onChange={(event) => updateForm("nextActionTitle", event.target.value)} placeholder="Follow up with client" value={form.nextActionTitle} />
            <Input label="Due date" onChange={(event) => updateForm("nextActionDueAt", event.target.value)} type="date" value={form.nextActionDueAt} />
          </div>
          <Input label="Tags" onChange={(event) => updateForm("tagsText", event.target.value)} placeholder="crm, high intent, follow up" value={form.tagsText} />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setIsAddOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button isLoading={createMutation.isPending} loadingLabel="Saving..." type="submit">
              Save Opportunity
            </Button>
          </div>
        </form>
      </Modal>

      <OpportunityDetailDrawer
        isAddingNote={noteMutation.isPending}
        isArchiving={archiveMutation.isPending}
        isCompletingNextAction={completeNextActionMutation.isPending}
        isOpen={Boolean(selectedOpportunity)}
        isSavingNextAction={nextActionMutation.isPending}
        isUpdatingStage={stageMutation.isPending}
        key={selectedOpportunity?.id ?? "opportunity-detail"}
        onAddNote={handleAddNote}
        onArchive={handleArchive}
        onClose={() => setSelectedOpportunity(null)}
        onCompleteNextAction={handleCompleteNextAction}
        onStageChange={handleStageChange}
        onUpdateNextAction={handleUpdateNextAction}
        opportunity={selectedOpportunity}
      />

      <LostReasonModal
        isOpen={Boolean(lostTarget)}
        isSubmitting={stageMutation.isPending}
        onClose={() => setLostTarget(null)}
        onConfirm={handleLostConfirm}
        opportunity={lostTarget}
      />
    </div>
  );
}
