import { cn } from "../../utils/cn.js";

const sideClasses = {
  bottom: "left-1/2 top-[calc(100%+0.5rem)] -translate-x-1/2",
  left: "right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
  right: "left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
  top: "bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2",
};

export function Tooltip({
  children,
  className = "",
  content,
  disabled = false,
  side = "right",
}) {
  if (disabled || !content) {
    return children;
  }

  return (
    <span className={cn("group/tooltip relative inline-flex w-full min-w-0", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-[80] max-w-64 whitespace-nowrap rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs font-black text-[var(--color-foreground)] opacity-0 shadow-[var(--shadow-floating)] transition duration-150 motion-reduce:transition-none group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          sideClasses[side] ?? sideClasses.right,
        )}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
