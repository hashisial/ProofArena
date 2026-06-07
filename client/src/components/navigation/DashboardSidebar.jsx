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
import { APP_BRAND, DASHBOARD_NAV_LINKS, ROUTES } from "../../constants/index.js";
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

const futureLinks = [
  { href: ROUTES.LEADERBOARD, icon: Medal, label: "Leaderboard" },
];

function SidebarLink({ collapsed = false, href, icon: Icon, label }) {
  const path = useRoutePath();
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const isActive =
    path === href ||
    (href === ROUTES.DASHBOARD && path === ROUTES.PROVIDER_DASHBOARD) ||
    (href !== ROUTES.DASHBOARD && path.startsWith(`${href}/`));

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group flex min-h-11 items-center rounded-2xl border px-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12",
        collapsed ? "gap-3 lg:justify-center lg:gap-0 lg:px-0" : "gap-3",
        isActive
          ? "border-[#7C3AED]/25 bg-[#F5F3FF] text-[#5B21B6] shadow-[0_14px_36px_rgba(124, 58, 237, 0.12)]"
          : "border-transparent text-[#493C5E] hover:border-[#E9E2F3] hover:bg-white hover:text-[#07030D]",
      )}
      href={href}
      onClick={closeSidebar}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition",
          isActive ? "bg-[#7C3AED] text-white" : "bg-[#F8F4FF] text-[#6F657C] group-hover:text-[#7C3AED]",
        )}
      >
        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      </span>
      <span className={cn("min-w-0 truncate", collapsed && "lg:hidden")}>{label}</span>
      {isActive && !collapsed ? <span className="ml-auto h-2 w-2 rounded-full bg-[#7C3AED]" /> : null}
    </a>
  );
}

export function DashboardSidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const { role, user } = useAuth();
  const currentRole = role || user?.role;
  const primaryLinks = DASHBOARD_NAV_LINKS
    .filter((item) => !item.roles || item.roles.includes(currentRole))
    .map((item) => ({
      href: item.path,
      icon: iconMap[item.iconName],
      label: item.label,
    }));

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] min-w-0 flex-col overflow-y-auto border-r border-[#E9E2F3] bg-white px-4 py-5 shadow-[0_24px_80px_rgba(31, 14, 54, 0.14)] transition-[transform,width,padding] duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
        sidebarCollapsed ? "lg:w-[5.25rem] lg:px-3" : "lg:w-[18rem]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <a className="min-w-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12" href={ROUTES.DASHBOARD}>
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#7C3AED] text-white shadow-[0_18px_44px_rgba(124, 58, 237, 0.28)]">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className={cn("min-w-0", sidebarCollapsed && "lg:hidden")}>
              <span className="block truncate text-lg font-black tracking-[-0.04em] text-[#07030D]">
                {APP_BRAND.PRODUCT_NAME}
              </span>
              <span className="block truncate text-xs font-bold text-[#6F657C]">by {APP_BRAND.COMPANY_NAME}</span>
            </span>
          </span>
        </a>
        <button
          aria-label="Close dashboard sidebar"
          className="grid h-9 w-9 place-items-center rounded-xl border border-[#E9E2F3] text-[#6F657C] transition hover:border-[#7C3AED]/25 hover:text-[#5B21B6] lg:hidden"
          onClick={closeSidebar}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className={cn("mt-6 rounded-2xl border border-[#7C3AED]/16 bg-[#F8F4FF] p-4", sidebarCollapsed && "lg:hidden")}>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
          Workspace
        </p>
        <p className="mt-2 text-sm leading-6 text-[#493C5E]">
          Launch outcomes, track milestones, and verify proof before reputation is earned.
        </p>
      </div>

      <nav className="mt-5 grid gap-1.5" aria-label="Dashboard navigation">
        {primaryLinks.map((item) => (
          <SidebarLink collapsed={sidebarCollapsed} key={item.href} {...item} />
        ))}
      </nav>

      <div className={cn("mt-6 border-t border-[#E9E2F3] pt-5", sidebarCollapsed && "lg:hidden")}>
        <p className="px-3 text-xs font-black uppercase tracking-[0.18em] text-[#A69AB5]">
          Future modules
        </p>
        <nav className="mt-3 grid gap-1.5" aria-label="Future dashboard navigation">
          {futureLinks.map((item) => (
            <SidebarLink collapsed={sidebarCollapsed} key={item.href} {...item} />
          ))}
        </nav>
      </div>

      <div className={cn("mt-auto rounded-2xl border border-[#E9E2F3] bg-white p-4 shadow-[0_16px_44px_rgba(31, 14, 54, 0.06)]", sidebarCollapsed && "lg:hidden")}>
        <p className="text-sm font-black text-[#07030D]">Proof-based reputation</p>
        <p className="mt-2 text-xs leading-5 text-[#6F657C]">
          Verified outcomes will power client trust, provider scores, and future leaderboards.
        </p>
      </div>
    </aside>
  );
}
