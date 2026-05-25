import { ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { cn } from "../../utils/cn.js";

function normalizeStatus(status) {
  return String(status ?? "").trim().toLowerCase() || "none";
}

export function VerificationBadge({
  className = "",
  isOwner = false,
  isVerified = false,
  label = "Verified",
  onRequest,
  size = "md",
  status = "none",
}) {
  const normalizedStatus = isVerified ? "verified" : normalizeStatus(status);

  if (normalizedStatus === "verified") {
    return (
      <Badge
        className={className}
        leftIcon={<ShieldCheck className="h-3.5 w-3.5" />}
        size={size}
        variant="green"
      >
        {label || "Verified"}
      </Badge>
    );
  }

  if (!isOwner) {
    return null;
  }

  if (normalizedStatus === "pending") {
    return (
      <Badge className={className} size={size} variant="yellow">
        Verification pending
      </Badge>
    );
  }

  if (normalizedStatus === "rejected") {
    return (
      <button
        className={cn(
          "inline-flex min-h-7 max-w-full items-center justify-center rounded-full border border-[#DC2626]/20 bg-[#FEE2E2] px-3 text-xs font-black leading-tight text-[#DC2626] transition hover:border-[#DC2626]/40 hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10",
          className,
        )}
        onClick={onRequest}
        type="button"
      >
        Verification needs review
      </button>
    );
  }

  return (
    <Button
      className={cn("min-h-7 px-3 py-1 text-xs", className)}
      onClick={onRequest}
      type="button"
      variant="secondary"
    >
      Add verification badge
    </Button>
  );
}
