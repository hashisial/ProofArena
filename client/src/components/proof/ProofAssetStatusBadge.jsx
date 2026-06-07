import { PROOF_VERIFICATION_LABELS } from "../../features/proofAssets/proofAssetUtils.js";
import { Badge } from "../ui/Badge.jsx";

const statusVariants = {
  flagged: "red",
  pending_review: "secondary",
  rejected: "red",
  unverified: "gray",
  verified: "green",
};

export function ProofAssetStatusBadge({ status = "unverified" }) {
  return (
    <Badge size="sm" variant={statusVariants[status] ?? "gray"}>
      {PROOF_VERIFICATION_LABELS[status] ?? "Unverified"}
    </Badge>
  );
}
