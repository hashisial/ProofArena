import { create } from "zustand";

export const useUIStore = create((set) => ({
  activeModal: null,
  commandMenuOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  pageTitle: "",
  closeCommandMenu: () => set({ commandMenuOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeModal: () => set({ activeModal: null }),
  openCommandMenu: () => set({ commandMenuOpen: true }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  openModal: (modalName) => set({ activeModal: modalName }),
  setPageTitle: (pageTitle) => set({ pageTitle }),
  setSidebarCollapsed: (isSidebarCollapsed) =>
    set({ isSidebarCollapsed: Boolean(isSidebarCollapsed) }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
