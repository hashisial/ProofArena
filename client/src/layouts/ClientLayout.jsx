import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ClientContentShell } from "../components/client/ClientContentShell.jsx";
import { MobileClientSidebar } from "../components/client/MobileClientSidebar.jsx";
import { ClientSidebar } from "../components/client/ClientSidebar.jsx";
import { ClientTopbar } from "../components/client/ClientTopbar.jsx";
import { PageLoadingState } from "../components/states/PageLoadingState.jsx";
import { CLIENT_NAV_LINKS, ROUTES, getRouteMetadataByPath } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import {
  canAccessRoute,
  getUnauthorizedFallback,
  isAuthenticated as hasAuthenticatedUser,
} from "../utils/accessPolicy.js";
import { cn } from "../utils/cn.js";
import { useSidebarShell } from "./useSidebarShell.js";

export function ClientLayout({
  children,
  className = "",
  contentClassName = "",
  contentMaxWidth = "7xl",
  mainClassName = "",
  title,
}) {
  const { isCollapsed } = useSidebarShell();
  const path = useRoutePath();
  const { isAuthenticated, isAuthChecking, user } = useAuth();
  const routeMetadata = useMemo(() => getRouteMetadataByPath(path), [path]);
  const clientNavMatch = useMemo(
    () =>
      CLIENT_NAV_LINKS.find(
        (item) =>
          path === item.href ||
          (item.href !== ROUTES.CLIENT.DASHBOARD && path.startsWith(`${item.href}/`)),
      ),
    [path],
  );
  const topbarTitle = title ?? clientNavMatch?.label ?? routeMetadata?.label ?? "Client Overview";
  const topbarDescription =
    clientNavMatch?.description ?? routeMetadata?.description ?? "Buyer workspace for challenges, providers, active work, and next decisions.";

  if (isAuthChecking) {
    return (
      <PageLoadingState
        className="min-h-screen max-w-full overflow-x-hidden bg-white p-5 sm:p-8"
        description="Verifying your secure client access before rendering the buyer workspace."
        skeletonType="dashboard"
        title="Preparing your client workspace"
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
      data-layout="client"
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
      <MobileClientSidebar />

      <div className="grid h-svh w-full max-w-full min-h-0 min-w-0 transition-[grid-template-columns] duration-300 motion-reduce:transition-none lg:grid-cols-[var(--sidebar-current-width)_minmax(0,1fr)]">
        <ClientSidebar isCollapsed={isCollapsed} variant="desktop" />
        <div className="flex h-svh w-full max-w-full min-h-0 min-w-0 flex-col overflow-hidden">
          <ClientTopbar description={topbarDescription} title={topbarTitle} />
          <main
            className={cn(
              "min-h-0 w-full max-w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 overscroll-contain sm:px-6 lg:px-8 lg:py-8",
              mainClassName,
            )}
            id="main-content"
            tabIndex={-1}
          >
            <ClientContentShell className={contentClassName} maxWidth={contentMaxWidth}>
              {children ?? <Outlet />}
            </ClientContentShell>
          </main>
        </div>
      </div>
    </div>
  );
}
