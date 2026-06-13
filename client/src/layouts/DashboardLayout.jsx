import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/navigation/DashboardSidebar.jsx";
import { DashboardTopbar } from "../components/navigation/DashboardTopbar.jsx";
import { cn } from "../utils/cn.js";
import { useSidebarShell } from "./useSidebarShell.js";

export function DashboardLayout({
  children,
  className = "",
  contentClassName = "",
  mainClassName = "",
  title = "Dashboard",
}) {
  const { closeMobileMenu, isMobileMenuOpen, isSidebarCollapsed } = useSidebarShell();

  return (
    <div
      className={cn("h-svh min-w-0 overflow-hidden bg-[#FFFFFF] text-[#1C1917]", className)}
      data-layout="dashboard"
    >
      <a
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-[#3F6212] px-4 py-2 text-sm font-bold text-white shadow-lg transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      {isMobileMenuOpen ? (
        <button
          aria-controls="dashboard-sidebar"
          aria-label="Close dashboard sidebar"
          className="fixed inset-0 z-40 bg-[#1C1917]/28 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          type="button"
        />
      ) : null}

      <div
        className={cn(
          "grid h-svh min-h-0 min-w-0 transition-[grid-template-columns] duration-300 lg:grid-cols-[18rem_minmax(0,1fr)]",
          isSidebarCollapsed && "lg:grid-cols-[5.25rem_minmax(0,1fr)]",
        )}
      >
        <DashboardSidebar />
        <div className="flex h-svh min-h-0 min-w-0 flex-col overflow-hidden">
          <DashboardTopbar title={title} />
          <main
            className={cn(
              "min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 overscroll-contain sm:px-6 lg:px-8 lg:py-8",
              mainClassName,
            )}
            id="main-content"
            tabIndex={-1}
          >
            <div className={cn("mx-auto w-full max-w-7xl", contentClassName)}>
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
