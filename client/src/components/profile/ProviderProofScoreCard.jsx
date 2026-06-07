import { Award, CheckCircle2, Clock3, FileCheck2, ShieldCheck, Trophy } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { cn, formatCompactNumber, formatPercentage } from "../../utils/index.js";

function getNumber(...values) {
  const value = values.find((item) => item !== undefined && item !== null && item !== "");
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getProofScore(providerProfile = {}) {
  return Math.max(0, Math.min(100, getNumber(providerProfile.proofScore, providerProfile.proofSummary?.proofScore)));
}

function getRate(value) {
  const number = getNumber(value);

  if (number <= 0) {
    return "0%";
  }

  return formatPercentage(number, { fallback: "0%" });
}

function getScoreLabel(score) {
  if (score >= 90) {
    return "Excellent proof reputation";
  }

  if (score >= 70) {
    return "Strong proof reputation";
  }

  if (score >= 40) {
    return "Growing proof reputation";
  }

  if (score >= 1) {
    return "Early proof reputation";
  }

  return "No verified proof yet";
}

function StatItem({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
      <IconComponent aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
      <p className="mt-3 break-words text-lg font-black tracking-[-0.03em] text-[#07030D]">
        {value}
      </p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
        {label}
      </p>
    </div>
  );
}

export function ProviderProofScoreCard({
  className = "",
  compact = false,
  framed = true,
  isOwner = false,
  providerProfile = null,
}) {
  const provider = providerProfile ?? {};
  const proofScore = getProofScore(provider);
  const completedOutcomes = getNumber(provider.completedOutcomes, provider.completedProjects);
  const approvedProofs = getNumber(provider.totalProofsApproved, provider.approvedProofs);
  const onTimeRate = getRate(provider.onTimeRate);
  const approvalRate = getRate(provider.approvalRate);
  const hasProofSignals = proofScore > 0 || completedOutcomes > 0 || approvedProofs > 0;
  const circumference = 2 * Math.PI * 42;
  const scoreOffset = circumference - (proofScore / 100) * circumference;
  const stats = [
    {
      icon: Trophy,
      label: "Outcomes",
      value: formatCompactNumber(completedOutcomes, { fallback: "0" }),
    },
    {
      icon: FileCheck2,
      label: "Approved proof",
      value: formatCompactNumber(approvedProofs, { fallback: "0" }),
    },
    {
      icon: Clock3,
      label: "On-time",
      value: onTimeRate,
    },
    {
      icon: CheckCircle2,
      label: "Approval",
      value: approvalRate,
    },
  ];
  const breakdownItems = [
    "Approved proof",
    "Completed outcomes",
    "On-time delivery",
    "Client review signals",
    "Challenge wins",
  ];

  const content = (
      <div className={cn("grid gap-5", compact ? "" : "lg:grid-cols-[240px_minmax(0,1fr)]")}>
        <div className="rounded-3xl border border-[#EDE9FE] bg-[linear-gradient(180deg,#F8F4FF_0%,#F5F3FF_100%)] p-5 text-center">
          <div
            aria-label={`Proof Score ${proofScore} out of 100`}
            className="relative mx-auto grid h-32 w-32 place-items-center"
            role="img"
          >
            <svg aria-hidden="true" className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="42"
                stroke="#E9E2F3"
                strokeWidth="9"
              />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="42"
                stroke="#7C3AED"
                strokeDasharray={circumference}
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
                strokeWidth="9"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <p className="text-4xl font-black tracking-[-0.06em] text-[#07030D]">
                  {proofScore}
                </p>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7C3AED]">
                  / 100
                </p>
              </div>
            </div>
          </div>
          <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-[#07030D]">
            Proof Score
          </h3>
          <p className="mt-1 text-sm font-bold text-[#5B21B6]">{getScoreLabel(proofScore)}</p>
        </div>

        <div className="min-w-0">
          <div className="flex min-w-0 items-start gap-3">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]"
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#7C3AED]">
                Proof reputation
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                Proof score is designed to reflect approved proof, completed outcomes,
                delivery reliability, and client review signals.
              </p>
            </div>
          </div>

          <div className={cn("mt-5 grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-4")}>
            {stats.map((item) => (
              <StatItem
                icon={item.icon}
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Award aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
              <p className="text-sm font-black text-[#07030D]">Score breakdown foundation</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {breakdownItems.map((item) => (
                <span
                  className="rounded-full border border-[#EDE9FE] bg-white px-3 py-1.5 text-xs font-black text-[#5B21B6]"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
            {!hasProofSignals ? (
              <p className="mt-3 text-sm leading-6 text-[#6F657C]">
                {isOwner
                  ? "Complete challenges and submit approved proof to build your proof score."
                  : "Verified proof history will appear as this provider completes reviewed outcomes."}
              </p>
            ) : null}
          </div>
        </div>
      </div>
  );

  if (!framed) {
    return (
      <div className={cn("min-w-0", className)}>
        {content}
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "rounded-3xl border-[#E9E2F3] bg-white shadow-[0_18px_58px_rgba(31, 14, 54, 0.07)]",
        className,
      )}
      padding={compact ? "md" : "lg"}
    >
      {content}
    </Card>
  );
}
