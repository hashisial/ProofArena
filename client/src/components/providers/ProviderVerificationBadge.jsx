import { ShieldCheck, ShieldQuestion } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";

export function ProviderVerificationBadge({ verification, verificationStatus }) {
  const status = String(
    verificationStatus ?? verification?.status ?? (verification?.isVerified ? "verified" : "none"),
  ).toLowerCase();

  if (status === "verified" || verification?.isVerified) {
    return (
      <Badge leftIcon={<ShieldCheck className="h-4 w-4" />} variant="green">
        {verification?.label || "Verified"}
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge leftIcon={<ShieldQuestion className="h-4 w-4" />} variant="secondary">
        Verification pending
      </Badge>
    );
  }

  return (
    <Badge leftIcon={<ShieldQuestion className="h-4 w-4" />} variant="gray">
      Not verified
    </Badge>
  );
}
