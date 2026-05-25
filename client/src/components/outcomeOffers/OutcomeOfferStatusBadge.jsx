import { Badge } from "../ui/Badge.jsx";
import { OFFER_STATUS_LABELS, OFFER_VISIBILITY_LABELS } from "../../features/outcomeOffers/outcomeOfferUtils.js";

const statusVariants = {
  archived: "gray",
  draft: "gray",
  paused: "secondary",
  published: "green",
};

const visibilityVariants = {
  private: "gray",
  public: "primary",
  unlisted: "secondary",
};

export function OutcomeOfferStatusBadge({ status = "draft" }) {
  return (
    <Badge variant={statusVariants[status] ?? "gray"}>
      {OFFER_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

export function OutcomeOfferVisibilityBadge({ visibility = "public" }) {
  return (
    <Badge variant={visibilityVariants[visibility] ?? "gray"}>
      {OFFER_VISIBILITY_LABELS[visibility] ?? visibility}
    </Badge>
  );
}
