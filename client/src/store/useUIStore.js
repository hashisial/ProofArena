import { create } from "zustand";
import { getStorageItem, setStorageItem } from "../utils/storage.js";

export const THEME_PREFERENCES = Object.freeze(["system", "light", "dark"]);
export const SIDEBAR_COLLAPSED_STORAGE_KEY = "scaleops.sidebar.collapsed";

function getInitialSidebarCollapsed() {
  return getStorageItem(SIDEBAR_COLLAPSED_STORAGE_KEY, "false") === "true";
}

function persistSidebarCollapsed(isSidebarCollapsed) {
  setStorageItem(SIDEBAR_COLLAPSED_STORAGE_KEY, isSidebarCollapsed ? "true" : "false");
}

export const useUIStore = create((set) => ({
  activeModal: null,
  commandMenuOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: getInitialSidebarCollapsed(),
  pageTitle: "",
  themePreference: "system",
  closeCommandMenu: () => set({ commandMenuOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeModal: () => set({ activeModal: null }),
  openCommandMenu: () => set({ commandMenuOpen: true }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  openModal: (modalName) => set({ activeModal: modalName }),
  setPageTitle: (pageTitle) => set({ pageTitle }),
  setSidebarCollapsed: (isSidebarCollapsed) => {
    const nextValue = Boolean(isSidebarCollapsed);
    persistSidebarCollapsed(nextValue);
    set({ isSidebarCollapsed: nextValue });
  },
  setSidebarExpanded: () => {
    persistSidebarCollapsed(false);
    set({ isSidebarCollapsed: false });
  },
  setThemePreference: (themePreference) =>
    set({
      themePreference: THEME_PREFERENCES.includes(themePreference)
        ? themePreference
        : "system",
    }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () =>
    set((state) => {
      const nextValue = !state.isSidebarCollapsed;
      persistSidebarCollapsed(nextValue);
      return { isSidebarCollapsed: nextValue };
    }),
}));
