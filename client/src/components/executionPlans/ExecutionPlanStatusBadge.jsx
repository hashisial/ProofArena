import { Badge } from "../ui/Badge.jsx";
import { EXECUTION_PLAN_STATUS_LABELS } from "../../features/executionPlans/executionPlanUtils.js";

const statusVariants = Object.freeze({
  accepted: "green",
  draft: "gray",
  expired: "gray",
  rejected: "secondary",
  shortlisted: "secondary",
  submitted: "primary",
  withdrawn: "gray",
});

export function ExecutionPlanStatusBadge({ status = "submitted" }) {
  return (
    <Badge variant={statusVariants[status] ?? "gray"}>
      {EXECUTION_PLAN_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
