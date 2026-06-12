import { getMatchScoreLabel } from "../../features/matches/matchUtils.js";
import { cn } from "../../utils/cn.js";

function scoreTone(score) {
  if (score >= 85) return "border-[#3F6212]/25 bg-[#F7FEE7] text-[#365314]";
  if (score >= 70) return "border-[#65A30D]/25 bg-[#F7FEE7] text-[#3F6212]";
  if (score >= 40) return "border-[#A16207]/25 bg-[#FFFBEB] text-[#A16207]";
  return "border-[#E7E5E4] bg-[#FAFAFA] text-[#78716C]";
}

export function MatchScoreBadge({ score = 0 }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const label = getMatchScoreLabel(normalizedScore);

  return (
    <div
      aria-label={`${label}, ${normalizedScore} percent`}
      className={cn(
        "inline-flex min-w-[7.5rem] items-center gap-3 rounded-2xl border px-3 py-2",
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
        <span className="block text-xs font-black uppercase tracking-[0.12em]">Match</span>
        <span className="block text-sm font-black">{label}</span>
      </span>
    </div>
  );
}
