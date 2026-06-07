import { createElement } from "react";
import { Card } from "../ui/Card.jsx";
import { formatCompactNumber } from "../../utils/formatNumber.js";

export function AdminStatsCard({ description, icon, label, value }) {
  return (
    <Card className="h-full" variant="bordered">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-black text-[#6F657C]">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-normal text-[#07030D]">
            {formatCompactNumber(value, { fallback: "Not available" })}
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F5F3FF] text-[#7C3AED]">
          {createElement(icon, { "aria-hidden": "true", className: "h-5 w-5" })}
        </span>
      </div>
      {description ? <p className="mt-3 text-sm leading-6 text-[#6F657C]">{description}</p> : null}
    </Card>
  );
}
