import { useEffect, useMemo, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/navigation/AdminSidebar.jsx";
import { AdminTopbar } from "../components/navigation/AdminTopbar.jsx";
import { PageLoadingState } from "../components/states/PageLoadingState.jsx";
import { getRouteMetadataByPath } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import {
  canAccessRoute,
  getUnauthorizedFallback,
  isAuthenticated as hasAuthenticatedUser,
} from "../utils/accessPolicy.js";
import { cn } from "../utils/cn.js";
import { useSidebarShell } from "./useSidebarShell.js";

export function AdminLayout({
  children,
  className = "",
  contentClassName = "",
  mainClassName = "",
  title = "ProofArena Control Center",
}) {
  const { closeMobileMenu, isMobileMenuOpen, isSidebarCollapsed } = useSidebarShell();
  const path = useRoutePath();
  const routeMetadata = useMemo(() => getRouteMetadataByPath(path), [path]);
  const { isAuthenticated, isAuthChecking, user } = useAuth();
  const previousMobileFocusRef = useRef(null);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    previousMobileFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      document.getElementById("admin-sidebar")?.focus({ preventScroll: true });
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousMobileFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [closeMobileMenu, isMobileMenuOpen]);

  if (isAuthChecking) {
    return (
      <PageLoadingState
        className="min-h-screen max-w-full overflow-x-hidden bg-white p-5 sm:p-8"
        description="Verifying admin access before rendering platform controls."
        skeletonType="dashboard"
        title="Preparing admin controls"
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
      data-layout="admin"
      style={{
        "--sidebar-collapsed-width": "5.25rem",
        "--sidebar-current-width": isSidebarCollapsed
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
      {isMobileMenuOpen ? (
        <button
          aria-controls="admin-sidebar"
          aria-label="Close admin sidebar"
          className="fixed inset-0 z-40 bg-[#1C1917]/28 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
          type="button"
        />
      ) : null}

      <div
        className="grid h-svh w-full max-w-full min-h-0 min-w-0 transition-[grid-template-columns] duration-300 motion-reduce:transition-none lg:grid-cols-[var(--sidebar-current-width)_minmax(0,1fr)]"
      >
        <AdminSidebar />
        <div className="flex h-svh w-full max-w-full min-h-0 min-w-0 flex-col overflow-hidden">
          <AdminTopbar title={title} />
          <main
            className={cn(
              "min-h-0 w-full max-w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 overscroll-contain sm:px-6 lg:px-8 lg:py-8",
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
