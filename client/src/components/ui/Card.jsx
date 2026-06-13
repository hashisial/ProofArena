import { createElement } from "react";
import { cn } from "../../utils/cn.js";

const variants = {
  bordered: "border border-[var(--color-border)] bg-[var(--color-card)] shadow-none",
  default: "border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-soft)]",
  elevated: "border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-elevated)]",
  hover:
    "border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-soft)] transition duration-[var(--motion-duration-standard)] hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-primary-glow)] motion-reduce:transform-none",
  interactive:
    "border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-soft)] transition duration-[var(--motion-duration-standard)] hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-primary-glow)] motion-reduce:transform-none",
  muted: "border border-[var(--color-border)] bg-[var(--color-surface-soft)] shadow-none",
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
        "min-w-0 break-words overflow-hidden rounded-[var(--radius-card)]",
        variants[variant] ?? variants.default,
        paddings[padding] ?? paddings.md,
        onClick && "cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)]",
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
      className: cn("card-title min-w-0 break-words", className),
    },
    children,
  );
}

export function CardDescription({ children, className = "" }) {
  return <p className={cn("min-w-0 break-words text-sm leading-6 text-[var(--color-text-muted)]", className)}>{children}</p>;
}

export function CardContent({ children, className = "" }) {
  return <div className={cn("mt-5", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return <div className={cn("mt-6 flex flex-wrap items-center gap-3", className)}>{children}</div>;
}
