import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ClipboardList,
  Eye,
  ListChecks,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { formatPlanPrice, formatPlanTimeline } from "../../features/executionPlans/executionPlanUtils.js";
import { buildProviderProfilePath, MATCH_STATUS_LABELS } from "../../features/matches/matchUtils.js";
import { cn } from "../../utils/cn.js";
import { getInitials } from "../../utils/getInitials.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "../executionPlans/ExecutionPlanStatusBadge.jsx";
import { ProviderCompareButton } from "./ProviderCompareButton.jsx";
import { ProviderMatchScoreBadge } from "../matches/ProviderMatchScoreBadge.jsx";
import { ProviderProofSummary } from "./ProviderProofSummary.jsx";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";

function getProviderId(provider = {}) {
  return provider.userId || provider.id || provider._id || "";
}

function getProviderName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Recommended provider";
}

function getOfferCount(entry) {
  return Number(
    entry?.provider?.outcomeOfferCount ??
      entry?.provider?.outcomeOffers?.count ??
      entry?.match?.matchedOffers?.length ??
      0,
  );
}

function metricValue(value, suffix = "") {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  const number = Number(value);
  return Number.isFinite(number) ? `${Math.round(number)}${suffix}` : "Not available";
}

function SelectionMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function ProviderSelectionCard({
  entry,
  isAccepting = false,
  isShortlistBusy = false,
  onRemoveShortlist,
  onSelect,
  onShortlist,
  rank,
  selected = false,
}) {
  const provider = entry.provider ?? {};
  const match = entry.match;
  const plan = entry.plan;
  const savedProvider = entry.savedProvider;
  const providerName = getProviderName(provider);
  const providerId = getProviderId(provider);
  const profilePath = buildProviderProfilePath(provider);
  const avatar = provider.avatar || provider.avatarUrl || provider.profilePicture || "";
  const isShortlisted = savedProvider?.status === "shortlisted";
  const planId = plan?.id || plan?._id;
  const challengeId = plan?.challenge?.id || plan?.challengeId || entry.challengeId;
  const canSelect = Boolean(planId && ["submitted", "shortlisted"].includes(plan?.status));
  const selectedLabel = selected || plan?.status === "accepted";

  return (
    <Card as="article" className={cn("grid gap-5", selectedLabel && "border-[#65A30D] bg-[#F7FEE7]/45")} variant="bordered">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {avatar ? (
            <img alt={`${providerName} profile photo`} className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F7FEE7]" src={avatar} />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1C1917,#3F6212)] text-lg font-black text-white ring-4 ring-[#F7FEE7]">
              {getInitials(providerName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="black">Rank #{rank}</Badge>
              {selectedLabel ? <Badge leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />} variant="green">Selected</Badge> : null}
              {isShortlisted ? <Badge variant="secondary">Shortlisted</Badge> : null}
              {match?.status ? <Badge variant="gray">{MATCH_STATUS_LABELS[match.status] ?? match.status}</Badge> : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h2 className="break-words text-2xl font-black tracking-normal text-[#1C1917]">{providerName}</h2>
              <ProviderVerificationBadge verification={provider.verificationBadge ?? provider.verification} verificationStatus={provider.verificationStatus} />
            </div>
            {provider.username ? <p className="mt-1 text-sm font-bold text-[#78716C]">@{provider.username}</p> : null}
            {provider.headline ? <p className="mt-2 text-sm font-semibold leading-6 text-[#57534E]">{provider.headline}</p> : null}
          </div>
        </div>
        <ProviderMatchScoreBadge score={match?.matchScore} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SelectionMetric label="Proof score" value={metricValue(provider.proofScore, "/100")} />
        <SelectionMetric label="Completed outcomes" value={metricValue(provider.completedOutcomes)} />
        <SelectionMetric label="Approval rate" value={metricValue(provider.approvalRate, "%")} />
        <SelectionMetric label="On-time rate" value={metricValue(provider.onTimeRate, "%")} />
        <SelectionMetric label="Outcome offers" value={metricValue(getOfferCount(entry))} />
        <SelectionMetric label="Availability" value={provider.availability ? String(provider.availability).replaceAll("_", " ") : "Not available"} />
        <SelectionMetric label="Execution plan" value={plan ? <ExecutionPlanStatusBadge status={plan.status} /> : "No plan yet"} />
        <SelectionMetric label="Plan timeline" value={plan ? formatPlanTimeline(plan.timeline) : "Not available"} />
      </div>

      <ProviderProofSummary provider={provider} />

      {plan ? (
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">Execution plan</p>
              <h3 className="mt-2 text-lg font-black text-[#1C1917]">{plan.title || "Execution plan"}</h3>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">{plan.summary || "Structured provider plan for this challenge."}</p>
            </div>
            <Badge variant="outline">{formatPlanPrice(plan.price)}</Badge>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4 text-sm leading-6 text-[#78716C]">
          No execution plan has been submitted by this provider yet. Selection is available after a submitted plan can be accepted.
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-[#E7E5E4] pt-5 sm:flex-row sm:flex-wrap">
        <Button as={Link} to={profilePath} variant="secondary">
          <Eye aria-hidden="true" className="mr-2 h-4 w-4" />
          View Profile
        </Button>
        <ProviderCompareButton provider={provider} />
        {planId && challengeId ? (
          <Button as={Link} to={ROUTES.CLIENT_EXECUTION_PLAN(challengeId, planId)} variant="outline">
            <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
            View Plan
          </Button>
        ) : null}
        {isShortlisted ? (
          <Button isLoading={isShortlistBusy} loadingLabel="Updating..." onClick={() => onRemoveShortlist?.(entry)} type="button" variant="outline">
            <XCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            Remove from Shortlist
          </Button>
        ) : (
          <Button isLoading={isShortlistBusy} loadingLabel="Shortlisting..." onClick={() => onShortlist?.(entry)} type="button" variant="secondary">
            <ListChecks aria-hidden="true" className="mr-2 h-4 w-4" />
            Add to Shortlist
          </Button>
        )}
        <Button
          disabled={!canSelect || selectedLabel || !providerId}
          isLoading={isAccepting}
          loadingLabel="Selecting..."
          onClick={() => onSelect?.(entry)}
          type="button"
        >
          <ShieldCheck aria-hidden="true" className="mr-2 h-4 w-4" />
          {selectedLabel ? "Selected Provider" : "Select Provider"}
        </Button>
      </div>
    </Card>
  );
}
