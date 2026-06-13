import { OPPORTUNITY_STAGE_LABELS } from "../../features/opportunities/opportunityUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { OpportunityCard } from "./OpportunityCard.jsx";

export function OpportunityColumn({
  isArchiving,
  isUpdatingStage,
  onArchive,
  onStageChange,
  onView,
  opportunities = [],
  stage,
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[#1C1917]">
          {OPPORTUNITY_STAGE_LABELS[stage] ?? stage}
        </h2>
        <Badge size="sm" variant="outline">{opportunities.length}</Badge>
      </div>
      <div className="grid gap-3">
        {opportunities.length > 0 ? opportunities.map((opportunity) => (
          <OpportunityCard
            isArchiving={isArchiving}
            isUpdatingStage={isUpdatingStage}
            key={opportunity.id}
            onArchive={onArchive}
            onStageChange={onStageChange}
            onView={onView}
            opportunity={opportunity}
          />
        )) : (
          <div className="rounded-2xl border border-dashed border-[#D6D3D1] bg-white p-4 text-sm leading-6 text-[#78716C]">
            No opportunities in this stage.
          </div>
        )}
      </div>
    </section>
  );
}
