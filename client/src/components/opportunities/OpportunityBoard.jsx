import { OPPORTUNITY_STAGES } from "../../features/opportunities/opportunityUtils.js";
import { OpportunityColumn } from "./OpportunityColumn.jsx";

export function OpportunityBoard({
  isArchiving,
  isUpdatingStage,
  onArchive,
  onStageChange,
  onView,
  opportunities = [],
}) {
  return (
    <div className="grid gap-4 xl:block xl:overflow-x-auto xl:pb-2">
      <div className="grid gap-4 xl:min-w-[92rem] xl:grid-cols-8">
        {OPPORTUNITY_STAGES.map((stage) => (
          <OpportunityColumn
            isArchiving={isArchiving}
            isUpdatingStage={isUpdatingStage}
            key={stage}
            onArchive={onArchive}
            onStageChange={onStageChange}
            onView={onView}
            opportunities={opportunities.filter((opportunity) => opportunity.stage === stage)}
            stage={stage}
          />
        ))}
      </div>
    </div>
  );
}
