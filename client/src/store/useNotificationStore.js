import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  latestNotification: null,
  notificationPanelOpen: false,
  unreadCount: 0,
  closeNotificationPanel: () => set({ notificationPanelOpen: false }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  openNotificationPanel: () => set({ notificationPanelOpen: true }),
  resetUnreadCount: () => set({ unreadCount: 0 }),
  setLatestNotification: (latestNotification) => set({ latestNotification }),
  setUnreadCount: (unreadCount) =>
    set({ unreadCount: Math.max(0, Number(unreadCount) || 0) }),
}));
