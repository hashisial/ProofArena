import { Inbox } from "lucide-react";
import { createElement, isValidElement, useId } from "react";
import { Button } from "./Button.jsx";
import { cn } from "../../utils/cn.js";

const variants = {
  bordered: "border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-soft)]",
  default: "bg-[var(--color-card)]",
  minimal: "bg-transparent",
  spotlight: "border border-[var(--color-primary-border)] bg-[var(--color-accent-soft)] shadow-[var(--shadow-primary-glow)]",
};

const sizes = {
  lg: "px-8 py-12",
  md: "px-6 py-10",
  sm: "px-4 py-6",
};

export function EmptyState({
  action,
  actionHref,
  actionText,
  className = "",
  description,
  icon: Icon = Inbox,
  onAction,
  secondaryAction,
  secondaryActionHref,
  secondaryActionText,
  size = "md",
  title,
  variant = "default",
}) {
  const titleId = useId();
  const iconContent = Icon
    ? isValidElement(Icon)
      ? Icon
      : createElement(Icon, { className: "h-5 w-5" })
    : null;

  return (
    <section
      aria-labelledby={titleId}
      className={cn("grid justify-items-center rounded-[var(--radius-card)] text-center", variants[variant] ?? variants.default, sizes[size] ?? sizes.md, className)}
    >
      {iconContent ? (
        <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-[var(--radius-card)] border border-[var(--color-primary-border)] bg-[var(--color-accent-soft)] text-[var(--color-primary)]">
          {iconContent}
        </div>
      ) : null}
      <h2 className="mt-5 text-2xl font-black tracking-normal text-[var(--color-foreground)]" id={titleId}>{title}</h2>
      {description ? <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">{description}</p> : null}
      {(action || actionText || secondaryAction || secondaryActionText) ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {action ?? (actionText ? (
            <Button as={actionHref ? "a" : "button"} className="w-full sm:w-auto" href={actionHref} onClick={onAction}>
              {actionText}
            </Button>
          ) : null)}
          {secondaryAction ?? (secondaryActionText ? (
            <Button as={secondaryActionHref ? "a" : "button"} className="w-full sm:w-auto" href={secondaryActionHref || undefined} variant="outline">
              {secondaryActionText}
            </Button>
          ) : null)}
        </div>
      ) : null}
    </section>
  );
}
