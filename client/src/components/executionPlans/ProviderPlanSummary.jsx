import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import {
  getProviderAvatar,
  getProviderCompletedOutcomes,
  getProviderHeadline,
  getProviderName,
  getProviderProfileUrl,
  getProviderProofScore,
  getProviderVerificationLabel,
} from "./executionPlanReviewUtils.js";

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E9E2F3] bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#07030D]">{value}</p>
    </div>
  );
}

export function ProviderPlanSummary({ className = "", plan, showProfileLink = true, variant = "card" }) {
  const providerName = getProviderName(plan);
  const headline = getProviderHeadline(plan);
  const avatar = getProviderAvatar(plan);
  const proofScore = getProviderProofScore(plan);
  const completedOutcomes = getProviderCompletedOutcomes(plan);
  const verificationLabel = getProviderVerificationLabel(plan);
  const profileUrl = getProviderProfileUrl(plan);
  const Wrapper = variant === "inline" ? "div" : Card;
  const wrapperProps = variant === "inline"
    ? { className }
    : { className, padding: "md", variant: "muted" };

  return (
    <Wrapper {...wrapperProps}>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#E9E2F3] bg-[#F5F3FF] text-lg font-black text-[#7C3AED]">
          {avatar ? (
            <img alt={`${providerName} avatar`} className="h-full w-full object-cover" src={avatar} />
          ) : (
            <span aria-hidden="true">{providerName.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-words text-lg font-black text-[#07030D]">{providerName}</h3>
            <Badge
              leftIcon={verificationLabel === "Verified" ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
              variant={verificationLabel === "Verified" ? "green" : "outline"}
            >
              {verificationLabel}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">{headline}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="Proof score" value={proofScore === null ? "Not available" : `${proofScore}/100`} />
            <Metric label="Completed outcomes" value={completedOutcomes === null ? "Not available" : completedOutcomes} />
          </div>
          {showProfileLink && profileUrl ? (
            <Button as={Link} className="mt-4 min-h-10 px-4 py-2 text-xs" to={profileUrl} variant="outline">
              View Provider Profile
            </Button>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}
