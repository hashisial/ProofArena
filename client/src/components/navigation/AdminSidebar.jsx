import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  FileSearch,
  Flag,
  LayoutDashboard,
  PackageCheck,
  Settings,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import { ADMIN_NAV_LINKS, APP_BRAND, ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useRoutePath } from "../../hooks/useRoutePath.js";
import { useUIStore } from "../../store/useUIStore.js";
import { cn } from "../../utils/cn.js";
import { SidebarCore } from "./sidebar/SidebarCore.jsx";

const iconMap = {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  FileCheck2,
  FileSearch,
  LayoutDashboard,
  PackageCheck,
  Settings,
  ShieldCheck,
  Target,
  Users,
};

const adminSections = Object.freeze([
  Object.freeze({
    id: "admin-platform-controls",
    links: ADMIN_NAV_LINKS.map((item) =>
      Object.freeze({
        ...item,
        exactMatch: item.href === ROUTES.ADMIN,
        id: item.id ?? item.routeId ?? item.href,
        showInMobile: item.showInMobile ?? true,
        showInSidebar: item.showInSidebar ?? true,
        type: item.type ?? "link",
      }),
    ),
    title: "Platform controls",
  }),
]);

export function AdminSidebar() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const { role, user } = useAuth();
  const currentPath = useRoutePath();
  const currentRole = role || user?.role;

  return (
    <SidebarCore
      ariaLabel="Admin dashboard sidebar"
      collapsed={isSidebarCollapsed}
      currentPath={currentPath}
      footerSlot={
        <div className="sidebar-note-card p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--color-accent)]" />
            <p className="text-sm font-black text-[var(--color-foreground)]">Trust layer</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
            Admin decisions will shape provider quality, proof integrity, and platform reputation.
          </p>
        </div>
      }
      headerSlot={
        <div className="flex items-start justify-between gap-3">
          <a
            className="min-w-0 rounded-[var(--radius-lg)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary-ring)]"
            href={ROUTES.ADMIN}
          >
            <span className="flex items-center gap-3">
              <span className="sidebar-brand-mark bg-[var(--color-foreground)] shadow-[var(--shadow-control)]">
                <Flag aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className={cn("min-w-0", isSidebarCollapsed && "lg:hidden")}>
                <span className="block truncate text-lg font-black tracking-normal text-[var(--color-foreground)]">
                  {APP_BRAND.PRODUCT_NAME}
                </span>
                <span className="block truncate text-xs font-bold text-[var(--color-text-muted)]">
                  admin by {APP_BRAND.COMPANY_NAME}
                </span>
              </span>
            </span>
          </a>
          <button
            aria-label="Close admin sidebar"
            className="topbar-icon-button grid h-9 w-9 place-items-center lg:hidden"
            onClick={closeMobileMenu}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      }
      iconMap={iconMap}
      id="admin-sidebar"
      introSlot={
        <div className="sidebar-intro-card p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Platform controls
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Manage challenge quality, provider verification, proof review, and trust systems.
          </p>
        </div>
      }
      isMobileOpen={isMobileMenuOpen}
      onNavigate={closeMobileMenu}
      role={currentRole}
      sections={adminSections}
      surface="adminSidebar"
      user={user}
      variant="responsive"
    />
  );
}
