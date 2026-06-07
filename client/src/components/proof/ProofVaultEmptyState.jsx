import { ShieldCheck } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { EmptyState } from "../ui/EmptyState.jsx";

export function ProofVaultEmptyState({ onAdd }) {
  return (
    <EmptyState
      actionText="Add Proof Asset"
      description="Save screenshots, reports, links, case studies, certificates, and work samples so you can prove your skills faster when applying to challenges."
      icon={ShieldCheck}
      onAction={onAdd}
      secondaryActionHref={ROUTES.NEW_OUTCOME_OFFER}
      secondaryActionText="Create Outcome Offer"
      title="Add your first proof asset"
      variant="spotlight"
    />
  );
}
