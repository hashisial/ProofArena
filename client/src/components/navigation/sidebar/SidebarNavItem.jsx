import { createElement, memo } from "react";
import { LayoutDashboard } from "lucide-react";
import { Tooltip } from "../../ui/Tooltip.jsx";
import { isNavigationItemActive } from "../../../utils/navigationActive.js";
import { cn } from "../../../utils/cn.js";
import { SidebarBadge } from "./SidebarBadge.jsx";

function getHref(item) {
  return item.href || item.path || "";
}

function getBadge(item) {
  if (item.badge) {
    return item.badge;
  }

  if (item.future || item.comingSoon) {
    return "Soon";
  }

  return null;
}

function SidebarNavItemComponent({
  collapsed = false,
  currentPath,
  iconMap = {},
  item,
  onNavigate,
}) {
  const href = getHref(item);
  const Icon = iconMap[item.iconKey] ?? iconMap[item.iconName] ?? item.icon ?? LayoutDashboard;
  const disabled = item.disabled || item.future || item.comingSoon || !href;
  const isActive = !disabled && isNavigationItemActive(item, currentPath);
  const badge = getBadge(item);
  const tooltipContent = disabled ? `${item.label} coming soon` : item.label;
  const content = (
    <>
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-md)] transition",
          isActive
            ? "bg-[var(--color-primary)] text-white"
            : disabled
              ? "border border-dashed border-[var(--color-border)] bg-[var(--color-muted-surface)] text-[var(--color-text-light)]"
              : "bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-primary-soft)] group-hover:text-[var(--color-primary)]",
        )}
      >
        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      </span>
      <span
        className={cn(
          "min-w-0 truncate whitespace-nowrap transition-all duration-200",
          collapsed && "lg:w-0 lg:overflow-hidden lg:opacity-0",
        )}
      >
        {item.label}
      </span>
      {isActive && !collapsed ? <span className="ml-auto h-2 w-2 rounded-full bg-[var(--color-primary)]" /> : null}
      {!isActive ? <SidebarBadge badge={badge} collapsed={collapsed} /> : null}
    </>
  );

  if (disabled) {
    return (
      <Tooltip content={tooltipContent} disabled={!collapsed}>
        <div
          aria-label={`${item.label} is not available yet`}
          aria-disabled="true"
          className={cn(
            "group flex min-h-11 w-full items-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-3 text-sm font-bold text-[var(--color-text-light)]",
            "bg-[var(--color-card)]/72",
            collapsed ? "gap-3 lg:justify-center lg:gap-0 lg:px-0" : "gap-3",
          )}
          title={collapsed ? tooltipContent : undefined}
        >
          {content}
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip content={item.label} disabled={!collapsed}>
      <a
        aria-current={isActive ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        className={cn(
          "group flex min-h-11 w-full items-center rounded-[var(--radius-lg)] border px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none",
          collapsed ? "gap-3 lg:justify-center lg:gap-0 lg:px-0" : "gap-3",
          isActive
            ? "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)] shadow-[var(--shadow-soft)]"
            : "border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-primary-border)] hover:bg-[var(--color-card)] hover:text-[var(--color-foreground)] hover:shadow-[var(--shadow-soft)]",
        )}
        href={href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
      >
        {content}
      </a>
    </Tooltip>
  );
}

export const SidebarNavItem = memo(SidebarNavItemComponent);
