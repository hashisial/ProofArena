import {
  Award,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Star,
  Trophy,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { ROUTES } from "../../constants/index.js";
import { formatCompactNumber, formatPercentage } from "../../utils/index.js";
import { ProfileSection } from "./ProfileSection.jsx";
import { ProviderProofScoreCard } from "./ProviderProofScoreCard.jsx";

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function getNumberValue(...values) {
  const value = values.find(hasValue);
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function getRateValue(value) {
  const number = getNumberValue(value);

  return number > 0 ? formatPercentage(number, { fallback: "0%" }) : "0%";
}

function MetricCard({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4 transition hover:-translate-y-0.5 hover:border-[#D9F99D] hover:shadow-[0_16px_42px_rgba(63, 98, 18, 0.1)]">
      <IconComponent aria-hidden="true" className="h-5 w-5 text-[#3F6212]" />
      <p className="mt-3 break-words text-xl font-black tracking-[-0.04em] text-[#1C1917]">
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold text-[#78716C]">{label}</p>
    </div>
  );
}

export function VerifiedOutcomesSection({ isOwner = false, providerProfile = null }) {
  const provider = providerProfile ?? {};
  const proofScore = getNumberValue(provider.proofScore);
  const completedOutcomes = getNumberValue(provider.completedOutcomes, provider.completedProjects);
  const approvedProofs = getNumberValue(provider.totalProofsApproved, provider.approvedProofs);
  const challengesWon = getNumberValue(provider.totalChallengesWon);
  const totalReviews = getNumberValue(provider.totalReviews);
  const hasVerifiedSignals =
    proofScore > 0 ||
    completedOutcomes > 0 ||
    approvedProofs > 0 ||
    challengesWon > 0 ||
    totalReviews > 0;
  const metrics = [
    {
      icon: Trophy,
      label: "Completed outcomes",
      value: formatCompactNumber(completedOutcomes, { fallback: "0" }),
    },
    {
      icon: FileCheck2,
      label: "Approved proofs",
      value: formatCompactNumber(approvedProofs, { fallback: "0" }),
    },
    {
      icon: Award,
      label: "Challenges won",
      value: formatCompactNumber(challengesWon, { fallback: "0" }),
    },
    {
      icon: Clock3,
      label: "On-time rate",
      value: getRateValue(provider.onTimeRate),
    },
    {
      icon: CheckCircle2,
      label: "Approval rate",
      value: getRateValue(provider.approvalRate),
    },
    {
      icon: Star,
      label: "Reviews",
      value: formatCompactNumber(totalReviews, { fallback: "0" }),
    },
  ];
  const previewRows = [
    ["Outcome", "Completed challenge result"],
    ["Proof type", "Screenshots, links, logs, reports, or review artifacts"],
    ["Review status", "Pending, approved, or rejected after review"],
    ["Score impact", "Foundation metric until real proof scoring is connected"],
  ];

  return (
    <ProfileSection
      subtitle="Proof-reviewed results and reputation signals from completed challenges."
      title="Verified outcomes"
    >
      <div className="grid gap-5">
        <ProviderProofScoreCard
          framed={false}
          isOwner={isOwner}
          providerProfile={provider}
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard
              icon={metric.icon}
              key={metric.label}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-dashed border-[#D9F99D] bg-[#FEFCE8] p-5">
          <p className="text-sm font-black text-[#1C1917]">
            {hasVerifiedSignals
              ? "Proof records foundation"
              : isOwner
                ? "Verified outcomes will appear here"
                : "No verified outcomes yet"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            {hasVerifiedSignals
              ? "Detailed proof records will connect here when the proof ledger workflow is available."
              : isOwner
                ? "Verified outcomes will appear here after you complete challenges and submit approved proof."
                : "Verified outcomes will appear after approved proof-reviewed work."}
          </p>

          <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
              Proof record preview
            </p>
            <div className="mt-3 grid gap-2">
              {previewRows.map(([label, value]) => (
                <div
                  className="grid gap-1 rounded-xl bg-[#FEFCE8] px-3 py-2 sm:grid-cols-[140px_minmax(0,1fr)]"
                  key={label}
                >
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-[#44403C]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {isOwner ? (
              <Button as="a" href={ROUTES.CHALLENGES} variant="outline">
                Explore challenges
              </Button>
            ) : (
              <>
                <Button as="a" href={ROUTES.PROVIDERS} variant="outline">
                  Explore providers
                </Button>
                <Button as="a" href={ROUTES.CHALLENGES} variant="secondary">
                  Explore challenges
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}
