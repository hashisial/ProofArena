import { MATCH_STATUS_LABELS } from "../../features/matches/matchUtils.js";
import { Badge } from "../ui/Badge.jsx";

const statusVariants = {
  applied: "green",
  dismissed: "gray",
  expired: "gray",
  ignored: "gray",
  invited: "primary",
  new: "primary",
  saved: "secondary",
  viewed: "outline",
};

export function MatchStatusBadge({ status = "new" }) {
  return (
    <Badge size="sm" variant={statusVariants[status] ?? "outline"}>
      {MATCH_STATUS_LABELS[status] ?? "Match"}
    </Badge>
  );
}
