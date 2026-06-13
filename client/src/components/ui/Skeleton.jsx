import { cn } from "../../utils/cn.js";

export function Skeleton({ animate = true, className = "", rounded = "rounded-[var(--radius-card)]" }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-[var(--color-border)]", animate && "animate-pulse", rounded, className)}
    />
  );
}
