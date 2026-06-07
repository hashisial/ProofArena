import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";

export function ClientMatchReasonList({ reasons = [] }) {
  const [expanded, setExpanded] = useState(false);
  const visibleReasons = expanded ? reasons : reasons.slice(0, 3);

  if (!Array.isArray(reasons) || reasons.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#7C3AED]/15 bg-[#F5F3FF] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Why this provider matches</p>
      <div className="mt-3 grid gap-2">
        {visibleReasons.map((reason, index) => (
          <div className="flex gap-2 text-sm font-semibold leading-6 text-[#5B21B6]" key={`${reason}-${index}`}>
            <CheckCircle2 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />
            <p>{reason}</p>
          </div>
        ))}
      </div>
      {reasons.length > 3 ? (
        <Button className="mt-3 min-h-9 px-3 py-2 text-xs" onClick={() => setExpanded((value) => !value)} type="button" variant="outline">
          {expanded ? "Show fewer reasons" : "View more reasons"}
        </Button>
      ) : null}
    </div>
  );
}
