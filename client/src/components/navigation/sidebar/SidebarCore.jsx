import { useMemo } from "react";
import { filterNavigationSections } from "../../../utils/navigationFilter.js";
import { cn } from "../../../utils/cn.js";
import { SidebarSection } from "./SidebarSection.jsx";

export function SidebarCore({
  ariaLabel = "Dashboard sidebar",
  className = "",
  collapsed = false,
  currentPath = "/",
  footerSlot,
  headerSlot,
  iconMap = {},
  id = "dashboard-sidebar",
  introSlot,
  isMobileOpen = true,
  onNavigate,
  role,
  sections = [],
  surface,
  user,
  variant = "desktop",
}) {
  const isMobile = variant === "mobile";
  const isResponsive = variant === "responsive";
  const isModalDrawer = isMobile || (isResponsive && isMobileOpen);
  const navigationSurface = surface ?? (isMobile ? "mobile" : "sidebar");
  const filteredSections = useMemo(
    () =>
      filterNavigationSections(sections, {
        includeDisabled: true,
        includeFuture: true,
        isAuthenticated: Boolean(user || role),
        role,
        surface: navigationSurface,
        user,
      }),
    [navigationSurface, role, sections, user],
  );

  return (
    <aside
      aria-hidden={isMobile ? !isMobileOpen : undefined}
      aria-label={ariaLabel}
      aria-modal={isModalDrawer ? "true" : undefined}
      className={cn(
        "dashboard-sidebar-surface min-w-0 flex-col overflow-y-auto overflow-x-hidden overscroll-contain px-4 py-5 transition-[transform,width,padding] duration-300",
        "motion-reduce:transition-none",
        isMobile && "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] translate-x-0 shadow-[var(--shadow-floating)] lg:hidden",
        variant === "desktop" && "hidden lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-full lg:shadow-none",
        isResponsive && "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] shadow-[var(--shadow-floating)] lg:visible lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 lg:shadow-none",
        isResponsive && (isMobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"),
        isResponsive && (collapsed ? "lg:w-[var(--sidebar-collapsed-width)]" : "lg:w-[var(--sidebar-expanded-width)]"),
        collapsed ? "lg:px-3" : "lg:px-4",
        className,
      )}
      id={id}
      role={isModalDrawer ? "dialog" : undefined}
      tabIndex={isModalDrawer ? -1 : undefined}
    >
      {headerSlot}
      {introSlot ? <div className={cn("mt-6", collapsed && "lg:hidden")}>{introSlot}</div> : null}
      <nav className="mt-5 grid gap-5" aria-label={ariaLabel.replace(/sidebar/i, "navigation")}>
        {filteredSections.map((section, index) => (
          <SidebarSection
            collapsed={collapsed}
            currentPath={currentPath}
            iconMap={iconMap}
            index={index}
            key={section.id ?? section.title ?? index}
            onNavigate={onNavigate}
            section={section}
          />
        ))}
      </nav>
      {footerSlot ? <div className={cn("mt-auto", collapsed && "lg:hidden")}>{footerSlot}</div> : null}
    </aside>
  );
}
