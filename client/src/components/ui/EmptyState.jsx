import { Inbox } from "lucide-react";
import { createElement } from "react";
import { Button } from "./Button.jsx";
import { cn } from "../../utils/cn.js";

const variants = {
  bordered: "border border-[#E9E2F3] bg-white shadow-[0_16px_50px_rgba(31, 14, 54, 0.06)]",
  default: "bg-white",
  minimal: "bg-transparent",
  spotlight: "border border-[#7C3AED]/20 bg-[#F5F3FF]/45 shadow-[0_20px_58px_rgba(124, 58, 237, 0.16)]",
};

const sizes = {
  lg: "px-8 py-12",
  md: "px-6 py-10",
  sm: "px-4 py-6",
};

export function EmptyState({
  actionHref,
  actionText,
  className = "",
  description,
  icon: Icon = Inbox,
  onAction,
  secondaryActionHref,
  secondaryActionText,
  size = "md",
  title,
  variant = "default",
}) {
  return (
    <section className={cn("grid justify-items-center rounded-2xl text-center", variants[variant] ?? variants.default, sizes[size] ?? sizes.md, className)}>
      <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF] text-[#7C3AED]">
        {createElement(Icon, { className: "h-5 w-5" })}
      </div>
      <h2 className="mt-5 text-2xl font-black tracking-normal text-[#07030D]">{title}</h2>
      {description ? <p className="mt-3 max-w-md text-sm leading-6 text-[#6F657C]">{description}</p> : null}
      {(actionText || secondaryActionText) ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {actionText ? (
            <Button as={actionHref ? "a" : "button"} className="w-full sm:w-auto" href={actionHref} onClick={onAction}>
              {actionText}
            </Button>
          ) : null}
          {secondaryActionText ? (
            <Button as="a" className="w-full sm:w-auto" href={secondaryActionHref} variant="outline">
              {secondaryActionText}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
