import { PackagePlus } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { EmptyState } from "../ui/EmptyState.jsx";

export function OutcomeOfferEmptyState() {
  return (
    <EmptyState
      actionHref={ROUTES.NEW_OUTCOME_OFFER}
      actionText="Create Outcome Offer"
      className="border border-[#E9E2F3]"
      description="Outcome offers help clients understand what result you deliver, how long it takes, what proof you provide, and why they should trust you."
      icon={PackagePlus}
      title="Create your first outcome offer"
      variant="spotlight"
    />
  );
}
