import { cn } from "../../utils/cn.js";

const sizes = {
  lg: "h-8 w-8 border-2",
  md: "h-5 w-5 border-2",
  sm: "h-4 w-4 border-2",
};

const variants = {
  dark: "text-[var(--color-foreground)]",
  light: "text-white",
  primary: "text-[var(--color-primary)]",
};

export function Spinner({
  className = "",
  label = "Loading",
  size = "md",
  variant = "primary",
  ...props
}) {
  return (
    <span
      aria-label={label || undefined}
      className={cn("inline-block animate-spin rounded-full border-current border-t-transparent", sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className)}
      role={label ? "status" : undefined}
      {...props}
    />
  );
}
