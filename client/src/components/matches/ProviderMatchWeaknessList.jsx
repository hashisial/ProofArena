import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";

export function ProviderMatchWeaknessList({ weaknesses = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleWeaknesses = expanded ? weaknesses : weaknesses.slice(0, 3);

  if (!Array.isArray(weaknesses) || weaknesses.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#6D28D9]/20 bg-[#F8F4FF] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6D28D9]">Check before inviting</p>
      <div className="mt-3 grid gap-2">
        {visibleWeaknesses.map((weakness, index) => (
          <div className="flex gap-2 text-sm font-semibold leading-6 text-[#6F657C]" key={`${weakness}-${index}`}>
            <AlertTriangle aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#6D28D9]" />
            <p>{weakness}</p>
          </div>
        ))}
      </div>
      {weaknesses.length > 3 ? (
        <Button className="mt-3 min-h-9 px-3 py-2 text-xs" onClick={() => setExpanded((value) => !value)} type="button" variant="secondary">
          {expanded ? "Show fewer checks" : "View more checks"}
        </Button>
      ) : null}
    </div>
  );
}
