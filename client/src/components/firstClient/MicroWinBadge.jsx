import { Award, LockKeyhole } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../ui/Badge.jsx";

export function MicroWinBadge({ badge, earnedBadge }) {
  const earned = Boolean(earnedBadge);

  return (
    <div className={earned ? "rounded-2xl border border-[#65A30D]/25 bg-[#F7FEE7] p-4" : "rounded-2xl border border-[#E7E5E4] bg-white p-4"}>
      <div className="flex items-start gap-3">
        <span className={earned ? "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#3F6212] text-white" : "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#FFFBEB] text-[#78716C]"}>
          {earned ? <Award aria-hidden="true" className="h-5 w-5" /> : <LockKeyhole aria-hidden="true" className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-[#1C1917]">{badge.label}</p>
            <Badge size="sm" variant={earned ? "green" : "gray"}>
              {earned ? "Earned" : "Unearned"}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            {earnedBadge?.description || badge.description}
          </p>
          {earnedBadge?.earnedAt ? (
            <p className="mt-2 text-xs font-bold text-[#57534E]">Earned {formatDate(earnedBadge.earnedAt)}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
