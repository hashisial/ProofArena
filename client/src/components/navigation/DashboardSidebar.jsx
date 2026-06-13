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
  Settings,
  Target,
  UserCircle,
  X,
} from "lucide-react";
import { createElement } from "react";
import {
  APP_BRAND,
  DASHBOARD_FUTURE_NAV_LINKS,
  DASHBOARD_NAV_LINKS,
  ROUTES,
  canAccessNavigationItem,
} from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useRoutePath } from "../../hooks/useRoutePath.js";
import { useUIStore } from "../../store/useUIStore.js";
import { cn } from "../../utils/cn.js";

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
  Settings,
  Target,
  UserCircle,
};

function SidebarLink({ collapsed = false, href, icon: Icon, label }) {
  const path = useRoutePath();
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const isActive =
    path === href ||
    (href === ROUTES.DASHBOARD && path === ROUTES.PROVIDER_DASHBOARD) ||
    (href !== ROUTES.DASHBOARD && path.startsWith(`${href}/`));

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group flex min-h-11 items-center rounded-2xl border px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#3F6212]/12",
        collapsed ? "gap-3 lg:justify-center lg:gap-0 lg:px-0" : "gap-3",
        isActive
          ? "border-[#3F6212]/25 bg-[#F7FEE7] text-[#365314] shadow-[0_14px_36px_rgba(63, 98, 18, 0.12)]"
          : "border-transparent text-[#44403C] hover:border-[#E7E5E4] hover:bg-white hover:text-[#1C1917]",
      )}
      href={href}
      onClick={closeMobileMenu}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition",
          isActive ? "bg-[#3F6212] text-white" : "bg-[#FEFCE8] text-[#78716C] group-hover:text-[#3F6212]",
        )}
      >
        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      </span>
      <span className={cn("min-w-0 truncate", collapsed && "lg:hidden")}>{label}</span>
      {isActive && !collapsed ? <span className="ml-auto h-2 w-2 rounded-full bg-[#3F6212]" /> : null}
    </a>
  );
}

export function DashboardSidebar() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const { role, user } = useAuth();
  const currentRole = role || user?.role;
  const primaryLinks = DASHBOARD_NAV_LINKS
    .filter((item) => canAccessNavigationItem(item, currentRole))
    .map((item) => ({
      href: item.href,
      icon: iconMap[item.iconKey],
      label: item.label,
    }));
  const futureLinks = DASHBOARD_FUTURE_NAV_LINKS.map((item) => ({
    href: item.href,
    icon: iconMap[item.iconKey],
    label: item.label,
  }));

  return (
    <aside
      aria-label="Dashboard sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] min-w-0 flex-col overflow-y-auto border-r border-[#E7E5E4] bg-white px-4 py-5 shadow-[0_24px_80px_rgba(28, 25, 23, 0.14)] transition-[transform,width,padding] duration-300 lg:visible lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 lg:shadow-none",
        isSidebarCollapsed ? "lg:w-[5.25rem] lg:px-3" : "lg:w-[18rem]",
        isMobileMenuOpen ? "visible translate-x-0" : "invisible -translate-x-full",
      )}
      id="dashboard-sidebar"
    >
      <div className="flex items-start justify-between gap-3">
        <a className="min-w-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3F6212]/12" href={ROUTES.DASHBOARD}>
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#3F6212] text-white shadow-[0_18px_44px_rgba(63, 98, 18, 0.28)]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className={cn("min-w-0", isSidebarCollapsed && "lg:hidden")}>
              <span className="block truncate text-lg font-black tracking-[-0.04em] text-[#1C1917]">
                {APP_BRAND.PRODUCT_NAME}
              </span>
              <span className="block truncate text-xs font-bold text-[#78716C]">by {APP_BRAND.COMPANY_NAME}</span>
            </span>
          </span>
        </a>
        <button
          aria-label="Close dashboard sidebar"
          className="grid h-9 w-9 place-items-center rounded-xl border border-[#E7E5E4] text-[#78716C] transition hover:border-[#3F6212]/25 hover:text-[#365314] lg:hidden"
          onClick={closeMobileMenu}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className={cn("mt-6 rounded-2xl border border-[#3F6212]/16 bg-[#FEFCE8] p-4", isSidebarCollapsed && "lg:hidden")}>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-[#44403C]">
          Launch outcomes, track milestones, and verify proof before reputation is earned.
        </p>
      </div>

      <nav className="mt-5 grid gap-1.5" aria-label="Dashboard navigation">
        {primaryLinks.map((item) => (
          <SidebarLink collapsed={isSidebarCollapsed} key={item.href} {...item} />
        ))}
      </nav>

      <div className={cn("mt-6 border-t border-[#E7E5E4] pt-5", isSidebarCollapsed && "lg:hidden")}>
        <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-[#A8A29E]">
          Future modules
        </p>
        <nav className="mt-3 grid gap-1.5" aria-label="Future dashboard navigation">
          {futureLinks.map((item) => (
            <SidebarLink collapsed={isSidebarCollapsed} key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className={cn("mt-auto rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-[0_16px_44px_rgba(28, 25, 23, 0.06)]", isSidebarCollapsed && "lg:hidden")}>
        <p className="text-sm font-black text-[#1C1917]">Proof-based reputation</p>
        <p className="mt-2 text-xs leading-5 text-[#78716C]">
          Verified outcomes will power client trust, provider scores, and future leaderboards.
        </p>
      </div>
    </aside>
  );
}
