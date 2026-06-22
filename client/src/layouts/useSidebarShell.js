import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebarState } from "../hooks/useSidebarState.js";

export function useSidebarShell() {
  const pathname = useLocation().pathname;
  const sidebarState = useSidebarState();
  const { closeMobileSidebar, isCollapsed, isMobileOpen } = sidebarState;

  useEffect(() => {
    closeMobileSidebar();
  }, [closeMobileSidebar, pathname]);

  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileSidebar, isMobileOpen]);

  return {
    ...sidebarState,
    closeMobileMenu: closeMobileSidebar,
    isMobileMenuOpen: isMobileOpen,
    isSidebarCollapsed: isCollapsed,
  };
}
