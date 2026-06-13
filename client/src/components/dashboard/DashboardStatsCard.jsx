import { createElement } from "react";
import { Card } from "../ui/Card.jsx";
import { cn } from "../../utils/cn.js";

const toneClasses = {
  bronze: "bg-[#ECFCCB] text-[#A16207]",
  neutral: "bg-[#FEFCE8] text-[#44403C]",
  olive: "bg-[#F7FEE7] text-[#3F6212]",
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
          <p className="text-sm font-bold text-[#78716C]">{label}</p>
          <p className="mt-3 break-words text-3xl font-black tracking-normal text-[#1C1917]">
            {value}
          </p>
        </div>
        {Icon ? (
          <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", toneClasses[tone] ?? toneClasses.olive)}>
            {createElement(Icon, { "aria-hidden": "true", className: "h-5 w-5" })}
          </span>
        ) : null}
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-[#78716C]">{detail}</p> : null}
    </Card>
  );
}
