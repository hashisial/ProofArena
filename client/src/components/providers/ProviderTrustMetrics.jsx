import { CheckCircle2, Clock3, ShieldCheck, Trophy } from "lucide-react";
import { createElement } from "react";
import { formatCompactNumber, formatPercentage } from "../../utils/formatNumber.js";

function isMissing(value) {
  return value === undefined || value === null || value === "";
}

function formatProofScore(value) {
  if (isMissing(value)) {
    return "Not available";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Not available";
  }

  return `${Math.max(0, Math.min(100, Math.round(number)))}/100`;
}

function formatCount(value) {
  if (isMissing(value)) {
    return "Not available";
  }

  return formatCompactNumber(value, { fallback: "Not available" });
}

function formatRate(value) {
  if (isMissing(value)) {
    return "Not available";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "Not available";
  }

  return formatPercentage(number, { fallback: "Not available" });
}

const metricConfig = [
  {
    icon: Trophy,
    key: "proofScore",
    label: "Proof Score",
    read: (provider) => formatProofScore(provider.proofScore),
  },
  {
    icon: ShieldCheck,
    key: "completedOutcomes",
    label: "Completed Outcomes",
    read: (provider) => formatCount(provider.completedOutcomes),
  },
  {
    icon: CheckCircle2,
    key: "approvalRate",
    label: "Approval Rate",
    read: (provider) => formatRate(provider.approvalRate),
  },
  {
    icon: Clock3,
    key: "onTimeRate",
    label: "On-Time Rate",
    read: (provider) => formatRate(provider.onTimeRate),
  },
];

export function ProviderTrustMetrics({ className = "", provider = {} }) {
  const metricsAvailable = provider.proofMetricsAvailable !== false;
  const hasAnyMetric = metricsAvailable && metricConfig.some((metric) => !isMissing(provider[metric.key]));

  if (!hasAnyMetric) {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Proof metrics
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            Proof metrics will appear after verified outcomes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid min-w-0 grid-cols-2 gap-3 ${className}`}>
      {metricConfig.map((metric) => (
        <div
          className="min-w-0 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-3"
          key={metric.key}
        >
          <div className="flex items-center gap-2">
            {createElement(metric.icon, {
              "aria-hidden": "true",
              className: "h-4 w-4 shrink-0 text-[#3F6212]",
            })}
            <p className="text-[0.67rem] font-black uppercase tracking-[0.12em] text-[#78716C]">
              {metric.label}
            </p>
          </div>
          <p className="mt-2 break-words text-lg font-black leading-6 text-[#1C1917]">
            {metric.read(provider)}
          </p>
        </div>
      ))}
    </div>
  );
}
