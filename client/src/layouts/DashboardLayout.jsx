import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { DashboardContentShell } from "../components/dashboard/DashboardContentShell.jsx";
import { MobileDashboardSidebar } from "../components/dashboard/MobileDashboardSidebar.jsx";
import { DashboardSidebar } from "../components/navigation/DashboardSidebar.jsx";
import { DashboardTopbar } from "../components/navigation/DashboardTopbar.jsx";
import { PageLoadingState } from "../components/states/PageLoadingState.jsx";
import {
  PROVIDER_NAV_LINKS,
  USER_ROLES,
  getRouteMetadataByPath,
} from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import {
  canAccessRoute,
  getUnauthorizedFallback,
  isAuthenticated as hasAuthenticatedUser,
} from "../utils/accessPolicy.js";
import { cn } from "../utils/cn.js";
import { useSidebarShell } from "./useSidebarShell.js";

export function DashboardLayout({
  children,
  className = "",
  contentClassName = "",
  contentMaxWidth = "7xl",
  mainClassName = "",
  title,
}) {
  const { isCollapsed } = useSidebarShell();
  const path = useRoutePath();
  const { isAuthenticated, isAuthChecking, role, user } = useAuth();
  const currentRole = role || user?.role;
  const routeMetadata = useMemo(() => getRouteMetadataByPath(path), [path]);
  const providerNavMatch = useMemo(
    () =>
      currentRole === USER_ROLES.PROVIDER
        ? PROVIDER_NAV_LINKS.find((item) => path === item.href || (item.href !== "/" && path.startsWith(`${item.href}/`)))
        : null,
    [currentRole, path],
  );
  const topbarTitle = title ?? providerNavMatch?.label ?? routeMetadata?.label ?? "Dashboard";
  const topbarDescription =
    providerNavMatch?.description ?? routeMetadata?.description ?? "ProofArena workspace command center.";

  if (isAuthChecking) {
    return (
      <PageLoadingState
        className="min-h-screen max-w-full overflow-x-hidden bg-white p-5 sm:p-8"
        description="Verifying your secure dashboard access before rendering the provider workspace."
        skeletonType="dashboard"
        title="Preparing your dashboard"
      />
    );
  }

  if (!isAuthenticated || !hasAuthenticatedUser(user)) {
    return <Navigate replace to={getUnauthorizedFallback(user, path)} />;
  }

  if (routeMetadata?.isProtected && !canAccessRoute(routeMetadata, user)) {
    return <Navigate replace to={getUnauthorizedFallback(user, path)} />;
  }

  return (
    <div
      className={cn("dashboard-shell-root h-svh w-full max-w-full min-w-0 overflow-hidden", className)}
      data-layout="dashboard"
      style={{
        "--sidebar-collapsed-width": "5.25rem",
        "--sidebar-current-width": isCollapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-expanded-width)",
        "--sidebar-expanded-width": "18rem",
      }}
    >
      <a
        className="shell-skip-link"
        href="#main-content"
      >
        Skip to content
      </a>
      <MobileDashboardSidebar />

      <div
        className="grid h-svh w-full max-w-full min-h-0 min-w-0 transition-[grid-template-columns] duration-300 motion-reduce:transition-none lg:grid-cols-[var(--sidebar-current-width)_minmax(0,1fr)]"
      >
        <DashboardSidebar isCollapsed={isCollapsed} variant="desktop" />
        <div className="flex h-svh w-full max-w-full min-h-0 min-w-0 flex-col overflow-hidden">
          <DashboardTopbar description={topbarDescription} title={topbarTitle} />
          <main
            className={cn(
              "min-h-0 w-full max-w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 overscroll-contain sm:px-6 lg:px-8 lg:py-8",
              mainClassName,
            )}
            id="main-content"
            tabIndex={-1}
          >
            <DashboardContentShell className={contentClassName} maxWidth={contentMaxWidth}>
              {children ?? <Outlet />}
            </DashboardContentShell>
          </main>
        </div>
      </div>
    </div>
  );
}
