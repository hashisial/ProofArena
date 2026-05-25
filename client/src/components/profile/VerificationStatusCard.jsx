import { ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { formatDate } from "../../utils/index.js";

function getStatusContent(status = "none") {
  if (status === "pending") {
    return {
      badge: "Verification pending",
      description: "Your request is waiting for review.",
      title: "Verification pending",
      variant: "yellow",
    };
  }

  if (status === "verified") {
    return {
      badge: "Verified",
      description: "Your profile has a verified trust badge.",
      title: "Profile verified",
      variant: "green",
    };
  }

  if (status === "rejected") {
    return {
      badge: "Needs review",
      description:
        "Your previous request was not approved. You can update your details and request again.",
      title: "Verification needs review",
      variant: "red",
    };
  }

  return {
    badge: "Not verified",
    description: "Request a verification badge to strengthen trust on your ProofArena profile.",
    title: "Get verified",
    variant: "primary",
  };
}

export function VerificationStatusCard({
  isLoading = false,
  onRequest,
  verification = {},
}) {
  const status = verification?.status ?? "none";
  const content = getStatusContent(status);
  const canRequest = status === "none" || status === "rejected";
  const dateLabel =
    status === "verified"
      ? verification.verifiedAt
      : status === "pending"
        ? verification.requestedAt
        : status === "rejected"
          ? verification.rejectedAt
          : null;

  return (
    <Card
      as="aside"
      className="rounded-3xl border-[#E7E5E4] bg-white shadow-[0_20px_54px_rgba(28, 25, 23, 0.08)]"
      padding="lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant={content.variant}>{content.badge}</Badge>
          <h2 className="mt-3 text-xl font-black leading-tight text-[#1C1917]">
            {content.title}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            {isLoading ? "Loading verification status..." : content.description}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>

      {dateLabel ? (
        <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
          {status === "verified" ? "Verified" : status === "pending" ? "Requested" : "Reviewed"}{" "}
          {formatDate(dateLabel, { fallback: "recently" })}
        </p>
      ) : null}

      {status === "rejected" && verification.rejectionReason ? (
        <div className="mt-4 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm font-semibold leading-6 text-[#991B1B]">
          {verification.rejectionReason}
        </div>
      ) : null}

      {canRequest ? (
        <Button className="mt-5 w-full" onClick={onRequest} type="button">
          {status === "rejected" ? "Request again" : "Request verification"}
        </Button>
      ) : null}
    </Card>
  );
}
