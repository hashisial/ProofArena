import { cn } from "../../utils/cn.js";
import { Spinner } from "./Spinner.jsx";

const columnClasses = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function LoadingState({
  className = "",
  columns = 3,
  count = columns,
  label = "Loading content",
  mode = "skeleton",
  skeletonClassName = "",
}) {
  if (mode === "spinner") {
    return (
      <div
        aria-live="polite"
        className={cn("grid min-h-40 place-items-center rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center", className)}
        role="status"
      >
        <div>
          <Spinner className="mx-auto" label={label} size="lg" />
          <p className="mt-4 text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={label}
      className={cn("grid gap-4", columnClasses[columns] ?? columnClasses[3], className)}
      role="status"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          aria-hidden="true"
          className={cn(
            "h-56 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-primary-border)] bg-[var(--gradient-skeleton)] shadow-[var(--shadow-soft)]",
            skeletonClassName,
          )}
          key={index}
        />
      ))}
    </div>
  );
}
