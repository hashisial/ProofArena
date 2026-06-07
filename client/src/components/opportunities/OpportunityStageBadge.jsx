import {
  OPPORTUNITY_PRIORITY_LABELS,
  OPPORTUNITY_SOURCE_LABELS,
  OPPORTUNITY_STAGE_LABELS,
} from "../../features/opportunities/opportunityUtils.js";
import { Badge } from "../ui/Badge.jsx";

const stageVariants = {
  applied: "primary",
  archived: "gray",
  completed: "green",
  invited: "secondary",
  lost: "red",
  matched: "gray",
  negotiating: "secondary",
  shortlisted: "yellow",
  won: "green",
};

const priorityVariants = {
  high: "secondary",
  low: "gray",
  normal: "outline",
  urgent: "red",
};

export function OpportunityStageBadge({ stage = "matched" }) {
  return (
    <Badge size="sm" variant={stageVariants[stage] ?? "gray"}>
      {OPPORTUNITY_STAGE_LABELS[stage] ?? stage}
    </Badge>
  );
}

export function OpportunitySourceBadge({ source = "manual" }) {
  return (
    <Badge size="sm" variant="outline">
      {OPPORTUNITY_SOURCE_LABELS[source] ?? source}
    </Badge>
  );
}

export function OpportunityPriorityBadge({ priority = "normal" }) {
  return (
    <Badge size="sm" variant={priorityVariants[priority] ?? "outline"}>
      {OPPORTUNITY_PRIORITY_LABELS[priority] ?? priority}
    </Badge>
  );
}
