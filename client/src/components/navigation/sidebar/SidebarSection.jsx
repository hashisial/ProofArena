import { memo } from "react";
import { SidebarGroup } from "./SidebarGroup.jsx";
import { SidebarNavItem } from "./SidebarNavItem.jsx";
import { cn } from "../../../utils/cn.js";

function getSectionId(section, index) {
  return `sidebar-section-${section.id ?? section.title ?? index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function SidebarSectionComponent({
  collapsed = false,
  currentPath,
  iconMap = {},
  index = 0,
  onNavigate,
  section,
}) {
  const sectionId = getSectionId(section, index);
  const items = section.links ?? section.items ?? [];

  return (
    <section aria-labelledby={section.title ? sectionId : undefined} className="grid gap-1.5">
      {section.title ? (
        <p
          className={cn(
            "px-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-light)] transition duration-200 motion-reduce:transition-none",
            "leading-5",
            collapsed && "lg:h-px lg:w-px lg:overflow-hidden lg:px-0 lg:opacity-0",
          )}
          id={sectionId}
        >
          {section.title}
        </p>
      ) : null}
      <div className="grid gap-1.5">
        {items.map((item) => (
          item.children?.length ? (
            <SidebarGroup
              collapsed={collapsed}
              currentPath={currentPath}
              iconMap={iconMap}
              item={item}
              key={item.id ?? item.routeId ?? item.href ?? item.label}
              onNavigate={onNavigate}
            />
          ) : (
            <SidebarNavItem
              collapsed={collapsed}
              currentPath={currentPath}
              iconMap={iconMap}
              item={item}
              key={item.id ?? item.routeId ?? item.href ?? item.label}
              onNavigate={onNavigate}
            />
          )
        ))}
      </div>
    </section>
  );
}

export const SidebarSection = memo(SidebarSectionComponent);
