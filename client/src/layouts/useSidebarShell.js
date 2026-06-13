import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUIStore } from "../store/useUIStore.js";

export function useSidebarShell() {
  const pathname = useLocation().pathname;
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu, isMobileMenuOpen]);

  return {
    closeMobileMenu,
    isMobileMenuOpen,
    isSidebarCollapsed,
  };
}
