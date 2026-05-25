import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/navigation/DashboardSidebar.jsx";
import { DashboardTopbar } from "../components/navigation/DashboardTopbar.jsx";
import { useUIStore } from "../store/useUIStore.js";
import { cn } from "../utils/cn.js";

export function DashboardLayout({ children, title = "Dashboard" }) {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <div className="h-screen overflow-hidden bg-[#FEFCE8] text-[#1C1917]">
      {sidebarOpen ? (
        <button
          aria-label="Close dashboard sidebar"
          className="fixed inset-0 z-40 bg-[#1C1917]/28 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
          type="button"
        />
      ) : null}

      <div
        className={cn(
          "grid h-screen min-h-0 min-w-0 transition-[grid-template-columns] duration-300 lg:grid-cols-[18rem_minmax(0,1fr)]",
          sidebarCollapsed && "lg:grid-cols-[5.25rem_minmax(0,1fr)]",
        )}
      >
        <DashboardSidebar />
        <div className="flex h-screen min-h-0 min-w-0 flex-col overflow-hidden">
          <DashboardTopbar title={title} />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">{children ?? <Outlet />}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
