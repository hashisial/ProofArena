import { cn } from "../../../utils/cn.js";

export function SidebarBadge({ badge, collapsed = false }) {
  if (!badge) {
    return null;
  }

  const label = typeof badge === "string" || typeof badge === "number"
    ? String(badge)
    : badge.label ?? badge.value ?? "";

  if (!label) {
    return null;
  }

  return (
    <span
      aria-label={`Badge: ${label}`}
      className={cn(
        "ml-auto inline-flex shrink-0 items-center rounded-full border border-[var(--color-warning-border)] bg-[var(--color-warning-soft)] px-2 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.1em] text-[var(--color-warning-strong)]",
        collapsed && "lg:ml-0 lg:h-2 lg:w-2 lg:overflow-hidden lg:border-[var(--color-primary)] lg:bg-[var(--color-primary)] lg:p-0 lg:text-transparent",
      )}
    >
      {label}
    </span>
  );
}
