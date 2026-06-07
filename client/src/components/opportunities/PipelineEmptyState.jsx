import { ClipboardList } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { EmptyState } from "../ui/EmptyState.jsx";

export function PipelineEmptyState({ onAdd }) {
  return (
    <EmptyState
      actionText="Add Opportunity"
      description="Saved matches, submitted plans, and shortlisted chances will appear here. You can also add a manual opportunity."
      icon={ClipboardList}
      onAction={onAdd}
      secondaryActionHref={ROUTES.MATCHED_CHALLENGES}
      secondaryActionText="View Matched Challenges"
      title="No opportunities yet"
      variant="spotlight"
    />
  );
}
