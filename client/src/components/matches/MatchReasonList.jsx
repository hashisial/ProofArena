import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function MatchReasonList({ reasons = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleReasons = expanded ? reasons : reasons.slice(0, 3);

  if (!Array.isArray(reasons) || reasons.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Why this matched</p>
      <ul className="mt-3 grid gap-2">
        {visibleReasons.map((reason) => (
          <li className="flex gap-2 text-sm leading-6 text-[#493C5E]" key={reason}>
            <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#A78BFA]" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
      {reasons.length > 3 ? (
        <button
          className="mt-2 text-sm font-black text-[#7C3AED] transition hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? "Show fewer reasons" : "View more reasons"}
        </button>
      ) : null}
    </div>
  );
}
