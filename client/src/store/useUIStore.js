import { create } from "zustand";

export const useUIStore = create((set) => ({
  activeModal: null,
  commandMenuOpen: false,
  mobileMenuOpen: false,
  pageTitle: "",
  sidebarCollapsed: false,
  sidebarOpen: false,
  closeCommandMenu: () => set({ commandMenuOpen: false }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  closeModal: () => set({ activeModal: null }),
  closeSidebar: () => set({ sidebarOpen: false }),
  openCommandMenu: () => set({ commandMenuOpen: true }),
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  openModal: (modalName) => set({ activeModal: modalName }),
  openSidebar: () => set({ sidebarOpen: true }),
  setPageTitle: (pageTitle) => set({ pageTitle }),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
