import { createElement } from "react";
import { Card } from "../ui/Card.jsx";
import { cn } from "../../utils/cn.js";

const toneClasses = {
  bronze: "bg-[#FEF3C7] text-[#6D28D9]",
  neutral: "bg-[#F8F4FF] text-[#493C5E]",
  olive: "bg-[#F5F3FF] text-[#7C3AED]",
};

export function DashboardStatsCard({
  className = "",
  detail,
  icon: Icon,
  label,
  tone = "olive",
  value,
}) {
  return (
    <Card className={cn("h-full", className)} padding="md" variant="bordered">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#6F657C]">{label}</p>
          <p className="mt-3 break-words text-3xl font-black tracking-normal text-[#07030D]">
            {value}
          </p>
        </div>
        {Icon ? (
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneClasses[tone] ?? toneClasses.olive)}>
            {createElement(Icon, { "aria-hidden": "true", className: "h-5 w-5" })}
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-[#6F657C]">{detail}</p> : null}
    </Card>
  );
}
