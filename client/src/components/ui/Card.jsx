import { createElement } from "react";
import { cn } from "../../utils/cn.js";

const variants = {
  bordered: "border border-[#E9E2F3] bg-white shadow-none",
  default: "border border-[#E9E2F3] bg-white shadow-[0_16px_50px_rgba(31, 14, 54, 0.06)]",
  elevated: "border border-[#E9E2F3] bg-white shadow-[0_24px_80px_rgba(31, 14, 54, 0.1)]",
  interactive:
    "border border-[#E9E2F3] bg-white shadow-[0_16px_50px_rgba(31, 14, 54, 0.06)] transition hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_20px_58px_rgba(124, 58, 237, 0.18)]",
  muted: "border border-[#E9E2F3] bg-[#F8F4FF] shadow-none",
};

const paddings = {
  lg: "p-5 sm:p-8",
  md: "p-4 sm:p-6",
  none: "p-0",
  sm: "p-3 sm:p-4",
};

export function Card({
  as: Component = "div",
  children,
  className = "",
  onClick,
  onKeyDown,
  padding = "md",
  role,
  tabIndex,
  variant = "default",
  ...props
}) {
  function handleKeyDown(event) {
    onKeyDown?.(event);

    if (event.defaultPrevented || !onClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event);
    }
  }

  return createElement(
    Component,
    {
      className: cn(
        "min-w-0 break-words overflow-hidden rounded-2xl",
        variants[variant] ?? variants.default,
        paddings[padding] ?? paddings.md,
        onClick && "cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10",
        className,
      ),
      onClick,
      onKeyDown: handleKeyDown,
      role: role ?? (onClick && Component === "div" ? "button" : undefined),
      tabIndex: tabIndex ?? (onClick ? 0 : undefined),
      ...props,
    },
    children,
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={cn("grid gap-2", className)}>{children}</div>;
}

export function CardTitle({ as: Component = "h3", children, className = "" }) {
  return createElement(
    Component,
    {
      className: cn("min-w-0 break-words text-xl font-black tracking-normal text-[#07030D]", className),
    },
    children,
  );
}

export function CardDescription({ children, className = "" }) {
  return <p className={cn("min-w-0 break-words text-sm leading-6 text-[#6F657C]", className)}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("mt-5", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}
