import { CircleAlert } from "lucide-react";
import { useState } from "react";

export function MatchWeaknessList({ weaknesses = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleWeaknesses = expanded ? weaknesses : weaknesses.slice(0, 3);

  if (!Array.isArray(weaknesses) || weaknesses.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#6D28D9]/18 bg-[#F8F4FF] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6D28D9]">Improve your chances</p>
      <ul className="mt-3 grid gap-2">
        {visibleWeaknesses.map((weakness) => (
          <li className="flex gap-2 text-sm leading-6 text-[#6F657C]" key={weakness}>
            <CircleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#6D28D9]" />
            <span>{weakness}</span>
          </li>
        ))}
      </ul>
      {weaknesses.length > 3 ? (
        <button
          className="mt-2 text-sm font-black text-[#6D28D9] transition hover:text-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-[#6D28D9]/12"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? "Show fewer coaching notes" : "View more coaching notes"}
        </button>
      ) : null}
    </div>
  );
}
