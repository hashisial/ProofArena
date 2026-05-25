import { Badge } from "../ui/Badge.jsx";
import {
  CHALLENGE_STATUS_LABELS,
  CHALLENGE_VISIBILITY_LABELS,
} from "../../features/challenges/challengeUtils.js";

const statusVariants = {
  archived: "gray",
  cancelled: "gray",
  completed: "green",
  draft: "gray",
  in_progress: "primary",
  open: "green",
  paused: "secondary",
  proof_review: "secondary",
  provider_selected: "primary",
  reviewing_plans: "secondary",
};

const visibilityVariants = {
  invite_only: "secondary",
  private: "gray",
  public: "primary",
  unlisted: "secondary",
};

export function ChallengeStatusBadge({ status = "draft" }) {
  return (
    <Badge variant={statusVariants[status] ?? "gray"}>
      {CHALLENGE_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function ChallengeVisibilityBadge({ visibility = "public" }) {
  return (
    <Badge variant={visibilityVariants[visibility] ?? "gray"}>
      {CHALLENGE_VISIBILITY_LABELS[visibility] ?? visibility}
    </Badge>
  );
}
