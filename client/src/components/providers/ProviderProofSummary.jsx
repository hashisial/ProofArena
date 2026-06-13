import { CheckCircle2, ShieldCheck, Timer, Trophy } from "lucide-react";
import { createElement } from "react";
import { formatCompactNumber, formatPercentage } from "../../utils/formatNumber.js";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";

function ProofStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
      <div className="flex items-center gap-2">
        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4 text-[#3F6212]" })}
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

function formatTrackedRate(value) {
  if (value === undefined || value === null || value === "") {
    return "Not tracked";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Not tracked";
  }

  return formatPercentage(number, { fallback: "Not tracked" });
}

function formatProofScore(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Not available yet";
  }

  return `${Math.max(0, Math.min(100, number))}/100`;
}

export function ProviderProofSummary({ provider = {} }) {
  const metricsAvailable = provider.proofMetricsAvailable !== false;
  const hasProofSignals =
    Number(provider.proofScore) > 0 ||
    Number(provider.completedOutcomes) > 0 ||
    Number(provider.totalProofsApproved) > 0 ||
    Number(provider.totalReviews) > 0 ||
    Number(provider.totalChallengesWon) > 0 ||
    Number(provider.approvalRate) > 0 ||
    Number(provider.onTimeRate) > 0;
  const hasProof = metricsAvailable && hasProofSignals;
  const metricSource = hasProof ? provider : {};
  const completedOutcomes =
    !hasProof || metricSource.completedOutcomes === undefined || metricSource.completedOutcomes === null
      ? "Not available yet"
      : formatCompactNumber(metricSource.completedOutcomes, { fallback: "Not available yet" });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Proof summary
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            {hasProof
              ? "Reputation is based on approved proof and completed outcomes."
              : "Proof metrics will appear as this provider completes verified outcomes."}
          </p>
        </div>
        <ProviderVerificationBadge
          verification={provider.verificationBadge ?? provider.verification}
          verificationStatus={provider.verificationStatus}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ProofStat
          icon={Trophy}
          label="Proof score"
          value={formatProofScore(hasProof ? metricSource.proofScore : undefined)}
        />
        <ProofStat
          icon={ShieldCheck}
          label="Outcomes"
          value={completedOutcomes}
        />
        <ProofStat
          icon={CheckCircle2}
          label="Approval"
          value={formatTrackedRate(hasProof ? metricSource.approvalRate : undefined)}
        />
        <ProofStat
          icon={Timer}
          label="On time"
          value={formatTrackedRate(hasProof ? metricSource.onTimeRate : undefined)}
        />
      </div>
    </div>
  );
}
