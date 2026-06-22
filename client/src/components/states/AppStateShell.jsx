import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  LockKeyhole,
  Wrench,
} from "lucide-react";
import { createElement, isValidElement } from "react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { cn } from "../../utils/cn.js";
import { isKnownRoute } from "../../utils/routeValidation.js";

const variantConfig = {
  comingSoon: {
    badge: "Planned",
    className: "border-[var(--color-primary-border)] bg-[var(--color-surface-warm)]",
    icon: Clock3,
    iconClassName: "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  },
  empty: {
    badge: "No records",
    className: "border-[var(--color-border)] bg-[var(--color-card)]",
    icon: Inbox,
    iconClassName: "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  error: {
    badge: "Needs attention",
    className: "border-[var(--color-danger-border)] bg-[var(--color-card)]",
    icon: AlertTriangle,
    iconClassName: "border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] text-[var(--color-danger-strong)]",
  },
  loading: {
    badge: "Loading",
    className: "border-[var(--color-border)] bg-[var(--color-card)]",
    icon: Loader2,
    iconClassName: "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  },
  maintenance: {
    badge: "Maintenance",
    className: "border-[var(--color-warning-border)] bg-[var(--color-surface-soft)]",
    icon: Wrench,
    iconClassName: "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  },
  restricted: {
    badge: "Restricted",
    className: "border-[var(--color-warning-border)] bg-[var(--color-card)]",
    icon: LockKeyhole,
    iconClassName: "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  },
  success: {
    badge: "Ready",
    className: "border-[var(--color-accent-border)] bg-[var(--color-card)]",
    icon: CheckCircle2,
    iconClassName: "border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] text-[var(--color-primary-hover)]",
  },
  warning: {
    badge: "Review",
    className: "border-[var(--color-warning-border)] bg-[var(--color-surface-soft)]",
    icon: AlertTriangle,
    iconClassName: "border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  },
};

const sizeClasses = {
  compact: "p-4 sm:p-5",
  default: "p-5 sm:p-7",
  spacious: "p-6 sm:p-8 lg:p-10",
};

const alignmentClasses = {
  center: "items-center text-center",
  left: "items-start text-left",
};

function normalizeActions(actions) {
  if (!actions) {
    return [];
  }

  return Array.isArray(actions) ? actions.filter(Boolean) : [actions].filter(Boolean);
}

function isSafeActionHref(href) {
  if (!href) {
    return false;
  }

  if (!href.startsWith("/") || href.startsWith("//")) {
    return false;
  }

  return isKnownRoute(href);
}

function renderIcon(icon, className) {
  if (!icon) {
    return null;
  }

  return isValidElement(icon)
    ? icon
    : createElement(icon, { "aria-hidden": "true", className });
}

function StateAction({ action, defaultVariant = "primary" }) {
  const href = action.href ?? action.actionHref;
  const onClick = action.onClick ?? action.onAction;
  const label = action.label ?? action.actionLabel ?? action.text;
  const isDisabled = Boolean(action.disabled || action.comingSoon || (href && !isSafeActionHref(href)));

  if (!label) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Button
        as={href && !isDisabled ? "a" : "button"}
        className="w-full sm:w-auto"
        disabled={isDisabled}
        href={href && !isDisabled ? href : undefined}
        onClick={isDisabled ? undefined : onClick}
        type="button"
        variant={action.variant ?? defaultVariant}
      >
        {isDisabled ? action.disabledLabel ?? action.comingSoonLabel ?? label : label}
      </Button>
      {isDisabled && (action.comingSoon || href) ? (
        <span className="text-xs font-bold text-[var(--color-text-muted)]">
          {action.helperText ?? "Coming soon"}
        </span>
      ) : null}
    </div>
  );
}

export function AppStateShell({
  actions,
  alignment = "left",
  badge,
  children,
  className = "",
  description,
  eyebrow,
  icon,
  secondaryActions,
  size = "default",
  title,
  variant = "empty",
}) {
  const config = variantConfig[variant] ?? variantConfig.empty;
  const Icon = icon ?? config.icon;
  const primaryActions = normalizeActions(actions);
  const supportingActions = normalizeActions(secondaryActions);
  const resolvedBadge = badge ?? config.badge;
  const isLoading = variant === "loading";

  return (
    <Card
      aria-busy={isLoading ? "true" : undefined}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-soft)]",
        config.className,
        sizeClasses[size] ?? sizeClasses.default,
        className,
      )}
      padding="none"
      role={isLoading ? "status" : undefined}
      variant="bordered"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,var(--color-primary),transparent)] opacity-35" />
      <div className={cn("relative z-10 flex min-w-0 flex-col gap-5", alignmentClasses[alignment] ?? alignmentClasses.left)}>
        <div className={cn("flex min-w-0 flex-wrap items-center gap-3", alignment === "center" && "justify-center")}>
          {Icon ? (
            <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-lg)] border", config.iconClassName)}>
              {renderIcon(Icon, cn("h-5 w-5", isLoading && "animate-spin"))}
            </span>
          ) : null}
          {resolvedBadge ? <Badge variant={variant === "error" ? "danger" : "primary"}>{resolvedBadge}</Badge> : null}
          {eyebrow ? (
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)]">
              {eyebrow}
            </span>
          ) : null}
        </div>

        <div className={cn("min-w-0", alignment === "center" && "mx-auto max-w-2xl")}>
          <h2 className="section-title max-w-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-[var(--color-text-secondary)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {children ? <div className="min-w-0 w-full">{children}</div> : null}

        {(primaryActions.length || supportingActions.length) ? (
          <div className={cn("flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap", alignment === "center" && "sm:justify-center")}>
            {primaryActions.map((action, index) => (
              <StateAction action={action} defaultVariant="primary" key={`${action.label ?? "action"}-${index}`} />
            ))}
            {supportingActions.map((action, index) => (
              <StateAction action={action} defaultVariant="secondary" key={`${action.label ?? "secondary"}-${index}`} />
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
