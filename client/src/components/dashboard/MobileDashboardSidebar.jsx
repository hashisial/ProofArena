import { useEffect, useRef } from "react";
import { useSidebarState } from "../../hooks/useSidebarState.js";
import { cn } from "../../utils/cn.js";
import { DashboardSidebar } from "../navigation/DashboardSidebar.jsx";

export function MobileDashboardSidebar() {
  const { closeMobileSidebar, isMobileOpen } = useSidebarState();
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      document.getElementById("dashboard-sidebar")?.focus({ preventScroll: true });
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [closeMobileSidebar, isMobileOpen]);

  if (!isMobileOpen) {
    return null;
  }

  return (
    <>
      <button
        aria-controls="dashboard-sidebar"
        aria-label="Close dashboard sidebar"
        className={cn(
          "fixed inset-0 z-40 bg-[#1C1917]/28 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileSidebar}
        type="button"
      />
      <DashboardSidebar isMobileOpen={isMobileOpen} variant="mobile" />
    </>
  );
}
