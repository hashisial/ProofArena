import { cn } from "../../utils/cn.js";

const variants = {
  black: "border-[var(--color-black)] bg-[var(--color-black)] text-white",
  blue: "border-[var(--color-info)] bg-[var(--color-info-soft)] text-[var(--color-info)]",
  danger: "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger-strong)]",
  default: "border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-text-secondary)]",
  gray: "border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-text-secondary)]",
  green: "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success-strong)]",
  outline: "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-secondary)]",
  primary: "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  proof: "border-[var(--color-proof)] bg-[var(--color-proof-soft)] text-[var(--color-proof-strong)]",
  purple: "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  secondary: "border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary)]",
  red: "border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  success: "border-[var(--color-success)] bg-[var(--color-success-soft)] text-[var(--color-success-strong)]",
  warning: "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning-strong)]",
  verified: "border-[var(--color-verified)] bg-[var(--color-verified-soft)] text-[var(--color-verified-strong)]",
  yellow: "border-[var(--color-warning)] bg-[var(--color-warning-soft)] text-[var(--color-warning-strong)]",
};

const sizes = {
  lg: "min-h-8 px-3.5 text-sm",
  md: "min-h-7 px-3 text-xs",
  sm: "min-h-6 px-2.5 text-xs",
};

export function Badge({
  children,
  className = "",
  leftIcon,
  rightIcon,
  rounded = "full",
  size = "md",
  variant = "default",
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 break-words border text-center font-black leading-tight whitespace-normal [overflow-wrap:anywhere]",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.md,
        rounded === "md" ? "rounded-[var(--radius-sm)]" : "rounded-[var(--radius-full)]",
        className,
      )}
    >
      {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </span>
  );
}
