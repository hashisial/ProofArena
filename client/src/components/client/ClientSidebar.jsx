import {
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  LayoutDashboard,
  Search,
  Settings,
  Target,
  X,
} from "lucide-react";
import { APP_BRAND, CLIENT_NAV_GROUPS, ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useRoutePath } from "../../hooks/useRoutePath.js";
import { useSidebarState } from "../../hooks/useSidebarState.js";
import { cn } from "../../utils/cn.js";
import { SidebarCore } from "../navigation/sidebar/SidebarCore.jsx";

const iconMap = {
  Bookmark,
  BriefcaseBusiness,
  LayoutDashboard,
  Search,
  Settings,
  Target,
};

export function ClientSidebar({
  isCollapsed,
  isMobileOpen = true,
  variant = "desktop",
}) {
  const { closeMobileSidebar, isCollapsed: storedCollapsed } = useSidebarState();
  const { role, user } = useAuth();
  const currentRole = role || user?.role;
  const currentPath = useRoutePath();
  const isMobile = variant === "mobile";
  const collapsed = !isMobile && (isCollapsed ?? storedCollapsed);

  return (
    <SidebarCore
      ariaLabel="Client dashboard sidebar"
      collapsed={collapsed}
      currentPath={currentPath}
      footerSlot={
        <div className="sidebar-note-card p-4">
          <p className="text-sm font-black text-[var(--color-foreground)]">Buyer trust layer</p>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            Challenge quality, provider proof, and verified outcomes will drive better decisions.
          </p>
        </div>
      }
      headerSlot={
        <div className="flex items-start justify-between gap-3">
          <a
            className="min-w-0 rounded-[var(--radius-lg)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary-ring)]"
            href={ROUTES.CLIENT.DASHBOARD}
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
                  client by {APP_BRAND.COMPANY_NAME}
                </span>
              </span>
            </span>
          </a>
          <button
            aria-label="Close client sidebar"
            className="topbar-icon-button grid h-9 w-9 place-items-center lg:hidden"
            onClick={closeMobileSidebar}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      }
      iconMap={iconMap}
      id="client-sidebar"
      introSlot={
        <div className="sidebar-intro-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Buyer workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Define challenges, evaluate proof-backed providers, and manage outcome decisions.
          </p>
        </div>
      }
      isMobileOpen={isMobileOpen}
      onNavigate={closeMobileSidebar}
      role={currentRole}
      sections={CLIENT_NAV_GROUPS}
      surface="clientSidebar"
      user={user}
      variant={variant}
    />
  );
}
