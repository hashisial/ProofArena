import { ChevronDown, Folder } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Tooltip } from "../../ui/Tooltip.jsx";
import { hasActiveNavigationChild } from "../../../utils/navigationActive.js";
import { cn } from "../../../utils/cn.js";
import { SidebarNavItem } from "./SidebarNavItem.jsx";

function getGroupPanelId(item) {
  return `sidebar-group-${item.id ?? item.routeId ?? item.href ?? item.label}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function SidebarGroupComponent({
  collapsed = false,
  currentPath,
  iconMap = {},
  item,
  onNavigate,
}) {
  const Icon = iconMap[item.iconKey] ?? iconMap[item.iconName] ?? item.icon ?? Folder;
  const isChildActive = useMemo(
    () => hasActiveNavigationChild(item, currentPath),
    [currentPath, item],
  );
  const [isOpen, setIsOpen] = useState(false);
  const isExpanded = isChildActive || isOpen;
  const panelId = getGroupPanelId(item);

  return (
    <div className="grid gap-1">
      <Tooltip content={item.label} disabled={!collapsed}>
        <button
          aria-controls={!collapsed ? panelId : undefined}
          aria-expanded={isExpanded}
          aria-label={collapsed ? item.label : undefined}
          className={cn(
            "group flex min-h-11 w-full items-center rounded-[var(--radius-lg)] border px-3 text-left text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none",
            collapsed ? "gap-3 lg:justify-center lg:gap-0 lg:px-0" : "gap-3",
            isChildActive
              ? "border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)] shadow-[var(--shadow-soft)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-primary-border)] hover:bg-[var(--color-card)] hover:text-[var(--color-foreground)] hover:shadow-[var(--shadow-soft)]",
          )}
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--radius-md)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-primary-soft)] group-hover:text-[var(--color-primary)]">
            <Icon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className={cn("min-w-0 truncate", collapsed && "lg:hidden")}>{item.label}</span>
          {!collapsed ? <ChevronDown aria-hidden="true" className={cn("ml-auto h-4 w-4 transition", isExpanded && "rotate-180")} /> : null}
        </button>
      </Tooltip>
      {isExpanded && !collapsed ? (
        <div
          aria-label={`${item.label} links`}
          className="ml-4 grid gap-1 border-l border-[var(--color-border)] pl-3"
          id={panelId}
        >
          {item.children.map((child) => (
            <SidebarNavItem
              collapsed={collapsed}
              currentPath={currentPath}
              iconMap={iconMap}
              item={child}
              key={child.id ?? child.routeId ?? child.href ?? child.label}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const SidebarGroup = memo(SidebarGroupComponent);
