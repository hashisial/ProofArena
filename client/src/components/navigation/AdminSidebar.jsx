import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Flag,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import { createElement } from "react";
import { ADMIN_NAV_LINKS, APP_BRAND, ROUTES } from "../../constants/index.js";
import { useRoutePath } from "../../hooks/useRoutePath.js";
import { useUIStore } from "../../store/useUIStore.js";
import { cn } from "../../utils/cn.js";

const iconMap = {
  AlertTriangle,
  BarChart3,
  FileCheck2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Target,
  Users,
};

const adminLinks = ADMIN_NAV_LINKS.map((item) => ({
  href: item.path,
  icon: iconMap[item.iconName],
  label: item.label,
}));

function isActiveAdminPath(path, href) {
  if (href === ROUTES.ADMIN) {
    return path === ROUTES.ADMIN;
  }

  return path === href || path.startsWith(`${href}/`);
}

function AdminSidebarLink({ collapsed = false, href, icon, label }) {
  const path = useRoutePath();
  const closeSidebar = useUIStore((state) => state.closeSidebar);
  const isActive = isActiveAdminPath(path, href);

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
      onClick={closeSidebar}
      title={collapsed ? label : undefined}
    >
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-xl transition",
          isActive ? "bg-[#3F6212] text-white" : "bg-[#FFFBEB] text-[#78716C] group-hover:text-[#3F6212]",
        )}
      >
        {createElement(icon, { "aria-hidden": "true", className: "h-4 w-4" })}
      </span>
      <span className={cn("min-w-0 truncate", collapsed && "lg:hidden")}>{label}</span>
      {isActive && !collapsed ? <span className="ml-auto h-2 w-2 rounded-full bg-[#3F6212]" /> : null}
    </a>
  );
}

export function AdminSidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-1.5rem))] min-w-0 flex-col overflow-y-auto border-r border-[#E7E5E4] bg-white px-4 py-5 shadow-[0_24px_80px_rgba(28, 25, 23, 0.14)] transition-[transform,width,padding] duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none",
        sidebarCollapsed ? "lg:w-[5.25rem] lg:px-3" : "lg:w-[18rem]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <a className="min-w-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3F6212]/12" href={ROUTES.ADMIN}>
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#1C1917] text-white shadow-[0_18px_44px_rgba(10,10,10,0.18)]">
              <Flag aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className={cn("min-w-0", sidebarCollapsed && "lg:hidden")}>
              <span className="block truncate text-lg font-black tracking-[-0.04em] text-[#1C1917]">
                {APP_BRAND.PRODUCT_NAME}
              </span>
              <span className="block truncate text-xs font-bold text-[#78716C]">admin by {APP_BRAND.COMPANY_NAME}</span>
            </span>
          </span>
        </a>
        <button
          aria-label="Close admin sidebar"
          className="grid h-9 w-9 place-items-center rounded-xl border border-[#E7E5E4] text-[#78716C] transition hover:border-[#3F6212]/25 hover:text-[#365314] lg:hidden"
          onClick={closeSidebar}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      <div className={cn("mt-6 rounded-2xl border border-[#3F6212]/16 bg-[#FFFBEB] p-4", sidebarCollapsed && "lg:hidden")}>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Platform controls
        </p>
        <p className="mt-2 text-sm leading-6 text-[#44403C]">
          Manage challenge quality, provider verification, proof review, and trust systems.
        </p>
      </div>

      <nav className="mt-5 grid gap-1.5" aria-label="Admin navigation">
        {adminLinks.map((item) => (
          <AdminSidebarLink collapsed={sidebarCollapsed} key={item.href} {...item} />
        ))}
      </nav>

      <div className={cn("mt-auto rounded-2xl border border-[#E7E5E4] bg-white p-4 shadow-[0_16px_44px_rgba(28, 25, 23, 0.06)]", sidebarCollapsed && "lg:hidden")}>
        <div className="flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#65A30D]" />
          <p className="text-sm font-black text-[#1C1917]">Trust layer</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#78716C]">
          Admin decisions will shape provider quality, proof integrity, and platform reputation.
        </p>
      </div>
    </aside>
  );
}
