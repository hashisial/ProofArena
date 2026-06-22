import { useCallback, useMemo } from "react";
import { useUIStore } from "../store/useUIStore.js";

export const SIDEBAR_MODES = Object.freeze({
  COLLAPSED: "collapsed",
  EXPANDED: "expanded",
});

export function useSidebarState() {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const openMobileMenu = useUIStore((state) => state.openMobileMenu);
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  const setSidebarExpanded = useUIStore((state) => state.setSidebarExpanded);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  const setCollapsed = useCallback(() => setSidebarCollapsed(true), [setSidebarCollapsed]);

  return useMemo(
    () => ({
      closeMobileSidebar: closeMobileMenu,
      isCollapsed: isSidebarCollapsed,
      isExpanded: !isSidebarCollapsed,
      isMobileOpen: isMobileMenuOpen,
      mode: isSidebarCollapsed ? SIDEBAR_MODES.COLLAPSED : SIDEBAR_MODES.EXPANDED,
      openMobileSidebar: openMobileMenu,
      setCollapsed,
      setExpanded: setSidebarExpanded,
      toggleMobileSidebar: toggleMobileMenu,
      toggleSidebar,
    }),
    [
      closeMobileMenu,
      isMobileMenuOpen,
      isSidebarCollapsed,
      openMobileMenu,
      setCollapsed,
      setSidebarExpanded,
      toggleMobileMenu,
      toggleSidebar,
    ],
  );
}
