import { createElement } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";

const priorityVariants = {
  high: "secondary",
  low: "gray",
  medium: "primary",
};

const priorityLabels = {
  high: "High priority",
  low: "Low priority",
  medium: "Medium priority",
};

export function DashboardActionCard({
  ctaLabel,
  description,
  href,
  icon: Icon,
  priority = "medium",
  title,
}) {
  return (
    <article className="h-full rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
            {createElement(Icon, { "aria-hidden": "true", className: "h-5 w-5" })}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-words text-base font-black text-[#07030D]">{title}</h3>
            <Badge size="sm" variant={priorityVariants[priority] ?? "primary"}>
              {priorityLabels[priority] ?? "Next action"}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">{description}</p>
        </div>
      </div>
      {href && ctaLabel ? (
        <div className="mt-4">
          <Button as="a" className="w-full min-h-10 px-4 py-2 text-xs sm:w-auto" href={href} variant="outline">
            {ctaLabel}
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </article>
  );
}
