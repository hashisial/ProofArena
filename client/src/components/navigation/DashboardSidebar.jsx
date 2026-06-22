import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  Medal,
  MessageSquare,
  PackageCheck,
  PlusCircle,
  Settings,
  Target,
  UserCircle,
  X,
} from "lucide-react";
import { useMemo } from "react";
import {
  APP_BRAND,
  DASHBOARD_FUTURE_NAV_LINKS,
  DASHBOARD_NAV_LINKS,
  PROVIDER_NAV_GROUPS,
  ROUTES,
  USER_ROLES,
} from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useRoutePath } from "../../hooks/useRoutePath.js";
import { getDefaultAuthenticatedRoute } from "../../routes/authRouteUtils.js";
import { useSidebarState } from "../../hooks/useSidebarState.js";
import { cn } from "../../utils/cn.js";
import { SidebarCore } from "./sidebar/SidebarCore.jsx";

const iconMap = {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  Medal,
  MessageSquare,
  PackageCheck,
  PlusCircle,
  Settings,
  Target,
  UserCircle,
};

function normalizeNavigationItem(item, dashboardHref) {
  const isDashboardRoot = item.href === ROUTES.DASHBOARD || item.path === ROUTES.DASHBOARD;
  const href = isDashboardRoot ? dashboardHref : item.href;
  const path = isDashboardRoot ? dashboardHref : item.path;

  return {
    ...item,
    activePatterns: isDashboardRoot
      ? Array.from(new Set([...(item.activePatterns ?? []), ROUTES.DASHBOARD, dashboardHref]))
      : item.activePatterns,
    href,
    id: item.id ?? item.routeId ?? href ?? item.label,
    path,
    type: item.type ?? "link",
    exactMatch: item.exactMatch ?? isDashboardRoot,
    showInMobile: item.showInMobile ?? true,
    showInSidebar: item.showInSidebar ?? true,
  };
}

function normalizeNavigationSection(section, dashboardHref) {
  return {
    ...section,
    id: section.id ?? section.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    links: (section.links ?? section.items ?? []).map((item) =>
      normalizeNavigationItem(item, dashboardHref),
    ),
  };
}

function getDashboardSections({ dashboardHref, isProvider }) {
  if (isProvider) {
    return PROVIDER_NAV_GROUPS.map((section) =>
      normalizeNavigationSection(section, dashboardHref),
    );
  }

  const primarySection = {
    id: "dashboard-primary",
    links: DASHBOARD_NAV_LINKS.map((item) =>
      normalizeNavigationItem(item, dashboardHref),
    ),
    title: "Dashboard",
  };

  const futureSection = {
    id: "dashboard-future",
    links: DASHBOARD_FUTURE_NAV_LINKS.map((item) =>
      normalizeNavigationItem(
        {
          ...item,
          badge: item.badge ?? "Soon",
          disabled: true,
          future: true,
        },
        dashboardHref,
      ),
    ),
    title: "Future modules",
  };

  return [primarySection, futureSection].filter((section) => section.links.length > 0);
}

export function DashboardSidebar({
  isCollapsed,
  isMobileOpen = true,
  variant = "desktop",
}) {
  const { closeMobileSidebar, isCollapsed: storedCollapsed } = useSidebarState();
  const { role, user } = useAuth();
  const currentRole = role || user?.role;
  const dashboardHref = getDefaultAuthenticatedRoute(user ?? { role: currentRole });
  const isProvider = currentRole === USER_ROLES.PROVIDER;
  const isMobile = variant === "mobile";
  const currentPath = useRoutePath();
  const collapsed = !isMobile && (isCollapsed ?? storedCollapsed);
  const sections = useMemo(
    () =>
      getDashboardSections({
        dashboardHref,
        isProvider,
      }),
    [dashboardHref, isProvider],
  );

  return (
    <SidebarCore
      ariaLabel={isProvider ? "Provider dashboard sidebar" : "Dashboard sidebar"}
      collapsed={collapsed}
      currentPath={currentPath}
      footerSlot={
        <div className="sidebar-note-card p-4">
          <p className="text-sm font-black text-[var(--color-foreground)]">Proof-based reputation</p>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            Verified outcomes will power client trust, provider scores, and future leaderboards.
          </p>
        </div>
      }
      headerSlot={
        <div className="flex items-start justify-between gap-3">
          <a
            className="min-w-0 rounded-[var(--radius-lg)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary-ring)]"
            href={dashboardHref}
          >
            <span className="flex items-center gap-3">
              <span className="sidebar-brand-mark">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
              </span>
              <span
                className={cn(
                  "min-w-0 transition-all duration-200",
                  collapsed && "lg:w-0 lg:overflow-hidden lg:opacity-0",
                )}
              >
                <span className="block truncate text-lg font-black tracking-normal text-[var(--color-foreground)]">
                  {APP_BRAND.PRODUCT_NAME}
                </span>
                <span className="block truncate text-xs font-bold text-[var(--color-text-muted)]">
                  by {APP_BRAND.COMPANY_NAME}
                </span>
              </span>
            </span>
          </a>
          <button
            aria-label="Close dashboard sidebar"
            className="topbar-icon-button grid h-9 w-9 place-items-center lg:hidden"
            onClick={closeMobileSidebar}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      }
      iconMap={iconMap}
      id="dashboard-sidebar"
      introSlot={
        <div className="sidebar-intro-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {isProvider
              ? "Manage acquisition, proof, opportunities, and provider readiness from one command center."
              : "Launch outcomes, track milestones, and verify proof before reputation is earned."}
          </p>
        </div>
      }
      isMobileOpen={isMobileOpen}
      onNavigate={closeMobileSidebar}
      role={currentRole}
      sections={sections}
      surface={isProvider ? "providerSidebar" : "sidebar"}
      user={user}
      variant={variant}
    />
  );
}
