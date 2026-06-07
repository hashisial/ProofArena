import { Award, BadgeCheck, Clock3, Medal, ShieldCheck, Trophy } from "lucide-react";
import { formatPlanTimeline } from "../../features/executionPlans/executionPlanUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";

function numberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getProviderId(provider = {}) {
  return String(provider.userId || provider.id || provider._id || "").trim();
}

function getProviderName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function getPlanTimelineDays(plan = {}) {
  const timeline = plan.timeline ?? {};

  if (timeline.type === "fixed_days") {
    return numberOrNull(timeline.days);
  }

  if (timeline.type === "range_days") {
    return numberOrNull(timeline.maxDays ?? timeline.minDays);
  }

  return null;
}

function bestBy(entries, getValue, compare = Math.max) {
  const values = entries
    .map((entry) => ({
      entry,
      value: getValue(entry),
    }))
    .filter((item) => item.value !== null);

  if (values.length === 0) {
    return null;
  }

  const bestValue = compare(...values.map((item) => item.value));
  return values.find((item) => item.value === bestValue) ?? null;
}

function formatScore(value) {
  return value === null || value === undefined ? "Not available" : `${Math.round(value)}/100`;
}

function formatCount(value) {
  return value === null || value === undefined ? "Not available" : new Intl.NumberFormat("en-US").format(value);
}

function formatRate(value) {
  return value === null || value === undefined ? "Not available" : `${Math.round(value)}%`;
}

function buildSummaryItems(entries = [], selectedProviderId = "") {
  const selectedEntry = entries.find((entry) => {
    const providerId = getProviderId(entry.provider);
    return entry.plan?.status === "accepted" || (selectedProviderId && providerId === selectedProviderId);
  });
  const bestMatch = bestBy(entries, (entry) => numberOrNull(entry.match?.matchScore));
  const highestProof = bestBy(entries, (entry) => numberOrNull(entry.provider?.proofScore));
  const mostOutcomes = bestBy(entries, (entry) => numberOrNull(entry.provider?.completedOutcomes));
  const mostReliable = bestBy(entries, (entry) => {
    const approval = numberOrNull(entry.provider?.approvalRate);
    const onTime = numberOrNull(entry.provider?.onTimeRate);
    if (approval === null && onTime === null) return null;
    return ((approval ?? 0) + (onTime ?? 0)) / (approval !== null && onTime !== null ? 2 : 1);
  });
  const fastestTimeline = bestBy(entries, (entry) => getPlanTimelineDays(entry.plan), Math.min);

  return [
    {
      icon: Trophy,
      label: "Best Match",
      provider: bestMatch?.entry.provider,
      value: formatScore(bestMatch?.value),
    },
    {
      icon: ShieldCheck,
      label: "Highest Proof Score",
      provider: highestProof?.entry.provider,
      value: formatScore(highestProof?.value),
    },
    {
      icon: Award,
      label: "Most Outcomes",
      provider: mostOutcomes?.entry.provider,
      value: formatCount(mostOutcomes?.value),
    },
    {
      icon: BadgeCheck,
      label: "Most Reliable",
      provider: mostReliable?.entry.provider,
      value: formatRate(mostReliable?.value),
    },
    {
      icon: Clock3,
      label: "Fastest Timeline",
      provider: fastestTimeline?.entry.provider,
      value: fastestTimeline?.entry.plan ? formatPlanTimeline(fastestTimeline.entry.plan.timeline) : "Not available",
    },
    {
      icon: Medal,
      label: "Selected Provider",
      provider: selectedEntry?.provider,
      value: selectedEntry ? "Selected" : "Not selected",
    },
  ];
}

export function ProviderSelectionSummary({ entries = [], selectedProviderId = "" }) {
  const items = buildSummaryItems(entries, selectedProviderId);

  return (
    <Card as="section" padding="lg" variant="elevated">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">Provider decision dashboard</Badge>
        <Badge variant="outline">Public signals only</Badge>
      </div>
      <h2 className="mt-3 text-2xl font-black tracking-normal text-[#07030D]">
        Selection Summary
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#6F657C]">
        Highlights are calculated from visible recommendation, proof, shortlist, and execution plan data. No winner is inferred when data is missing.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          const providerName = item.provider ? getProviderName(item.provider) : "Not available";

          return (
            <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={item.label}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{item.label}</p>
                  <p className="mt-1 break-words text-base font-black text-[#07030D]">{providerName}</p>
                  <p className="mt-1 text-sm font-bold text-[#7C3AED]">{item.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
