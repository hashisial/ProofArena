import { create } from "zustand";

export const THEME_PREFERENCES = Object.freeze(["system", "light", "dark"]);

export const useUIStore = create((set) => ({
  activeModal: null,
  commandMenuOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  pageTitle: "",
  themePreference: "system",
  closeCommandMenu: () => set({ commandMenuOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeModal: () => set({ activeModal: null }),
  openCommandMenu: () => set({ commandMenuOpen: true }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  openModal: (modalName) => set({ activeModal: modalName }),
  setPageTitle: (pageTitle) => set({ pageTitle }),
  setSidebarCollapsed: (isSidebarCollapsed) =>
    set({ isSidebarCollapsed: Boolean(isSidebarCollapsed) }),
  setThemePreference: (themePreference) =>
    set({
      themePreference: THEME_PREFERENCES.includes(themePreference)
        ? themePreference
        : "system",
    }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
