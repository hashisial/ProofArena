import { getProviderFitScoreLabel } from "../../features/matches/matchUtils.js";
import { cn } from "../../utils/cn.js";

function scoreTone(score) {
  if (score >= 85) return "border-[#7C3AED]/25 bg-[#F5F3FF] text-[#5B21B6]";
  if (score >= 70) return "border-[#A78BFA]/25 bg-[#F5F3FF] text-[#7C3AED]";
  if (score >= 40) return "border-[#6D28D9]/25 bg-[#F8F4FF] text-[#6D28D9]";
  return "border-[#E9E2F3] bg-[#FAFAFA] text-[#6F657C]";
}

export function ProviderMatchScoreBadge({ score = 0 }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const label = getProviderFitScoreLabel(normalizedScore);

  return (
    <div
      aria-label={`${label}, ${normalizedScore} percent`}
      className={cn(
        "inline-flex min-w-[7rem] items-center gap-3 rounded-2xl border px-3 py-2",
        scoreTone(normalizedScore),
      )}
      title={`${label}: ${normalizedScore}%`}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 place-items-center rounded-full border border-current/20 bg-white/70 text-sm font-black"
      >
        {normalizedScore}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-black uppercase tracking-[0.12em]">Fit</span>
        <span className="block text-sm font-black">{label}</span>
      </span>
    </div>
  );
}
