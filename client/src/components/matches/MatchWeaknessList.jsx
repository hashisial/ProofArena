import { CircleAlert } from "lucide-react";
import { useState } from "react";

export function MatchWeaknessList({ weaknesses = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleWeaknesses = expanded ? weaknesses : weaknesses.slice(0, 3);

  if (!Array.isArray(weaknesses) || weaknesses.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#A16207]/18 bg-[#FFFBEB] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A16207]">Improve your chances</p>
      <ul className="mt-3 grid gap-2">
        {visibleWeaknesses.map((weakness) => (
          <li className="flex gap-2 text-sm leading-6 text-[#57534E]" key={weakness}>
            <CircleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#A16207]" />
            <span>{weakness}</span>
          </li>
        ))}
      </ul>
      {weaknesses.length > 3 ? (
        <button
          className="mt-2 text-sm font-black text-[#A16207] transition hover:text-[#854D0E] focus:outline-none focus:ring-4 focus:ring-[#A16207]/12"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? "Show fewer coaching notes" : "View more coaching notes"}
        </button>
      ) : null}
    </div>
  );
}
