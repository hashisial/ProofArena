import { Lock, Radio, Unlock } from "lucide-react";
import { PROOF_VISIBILITY_LABELS } from "../../features/proofAssets/proofAssetUtils.js";
import { Badge } from "../ui/Badge.jsx";

const visibilityConfig = {
  private: { icon: Lock, variant: "gray" },
  public: { icon: Unlock, variant: "green" },
  unlisted: { icon: Radio, variant: "secondary" },
};

export function ProofAssetVisibilityBadge({ visibility = "private" }) {
  const config = visibilityConfig[visibility] ?? visibilityConfig.private;
  const Icon = config.icon;

  return (
    <Badge leftIcon={<Icon className="h-3.5 w-3.5" />} size="sm" variant={config.variant}>
      {PROOF_VISIBILITY_LABELS[visibility] ?? "Private"}
    </Badge>
  );
}
