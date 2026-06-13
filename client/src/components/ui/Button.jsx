import { cn } from "../../utils/cn.js";
import { Spinner } from "./Spinner.jsx";

const variantClasses = {
  danger:
    "border border-[var(--color-danger)] bg-[var(--color-danger)] text-white shadow-[var(--shadow-danger)] hover:border-[var(--color-danger-strong)] hover:bg-[var(--color-danger-strong)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-text-secondary)] shadow-none hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-hover)]",
  outline:
    "border border-[var(--color-primary-border)] bg-[var(--color-card)] text-[var(--color-primary)] shadow-none hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-hover)]",
  primary:
    "border border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-primary-glow)] hover:border-[var(--color-primary-hover)] hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-primary-strong)]",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[var(--shadow-soft)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] hover:shadow-[var(--shadow-primary-glow)]",
};

const sizeClasses = {
  lg: "min-h-14 px-6 py-3.5 text-base",
  md: "min-h-12 px-5 py-3 text-sm",
  sm: "min-h-10 px-4 py-2 text-sm",
};

export function Button({
  as: Element = "button",
  children,
  className = "",
  disabled = false,
  iconLeft,
  iconRight,
  isLoading = false,
  leftIcon,
  loadingLabel = "Loading...",
  onClick,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  const isDisabled = disabled || isLoading;
  const resolvedLeftIcon = iconLeft ?? leftIcon;
  const resolvedRightIcon = iconRight ?? rightIcon;
  const elementProps =
    Element === "button"
      ? { disabled: isDisabled, type }
      : {
          "aria-disabled": isDisabled ? "true" : undefined,
          tabIndex: isDisabled ? -1 : props.tabIndex,
        };

  function handleClick(event) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <Element
      {...props}
      {...elementProps}
      aria-busy={isLoading ? "true" : undefined}
      className={cn(
        "group relative inline-flex min-w-0 max-w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] text-center font-bold leading-5 tracking-normal whitespace-normal transition duration-[var(--motion-duration-standard)] [overflow-wrap:anywhere] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 motion-reduce:transform-none disabled:cursor-not-allowed disabled:opacity-55",
        sizeClasses[size] ?? sizeClasses.md,
        variantClasses[variant] ?? variantClasses.primary,
        isDisabled && "pointer-events-none opacity-60",
        className,
      )}
      onClick={handleClick}
    >
      {isLoading ? (
        <Spinner
          aria-hidden="true"
          className="shrink-0"
          label=""
          size="sm"
          variant={variant === "primary" || variant === "danger" ? "light" : "primary"}
        />
      ) : resolvedLeftIcon ? (
        <span aria-hidden="true" className="shrink-0">
          {resolvedLeftIcon}
        </span>
      ) : null}
      <span className="inline-flex min-w-0 max-w-full items-center justify-center gap-2 break-words [overflow-wrap:anywhere] [&_svg]:shrink-0">
        {isLoading ? loadingLabel : children}
      </span>
      {!isLoading && resolvedRightIcon ? (
        <span aria-hidden="true" className="shrink-0">
          {resolvedRightIcon}
        </span>
      ) : null}
    </Element>
  );
}
