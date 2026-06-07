import { Badge } from "../ui/Badge.jsx";
import {
  getExecutionPlanStatusLabel,
  isArchivedExecutionPlanStatus,
} from "../../features/executionPlans/executionPlanUtils.js";

const statusVariants = Object.freeze({
  accepted: "green",
  archived: "gray",
  draft: "gray",
  expired: "gray",
  rejected: "secondary",
  shortlisted: "secondary",
  submitted: "primary",
  viewed: "primary",
  withdrawn: "gray",
});

export function ExecutionPlanStatusBadge({ status = "submitted" }) {
  const normalizedStatus = isArchivedExecutionPlanStatus(status) ? "archived" : status;

  return (
    <Badge variant={statusVariants[normalizedStatus] ?? "gray"}>
      {getExecutionPlanStatusLabel(status)}
    </Badge>
  );
}
