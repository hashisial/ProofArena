import { create } from "zustand";

export const NOTIFICATION_TONES = Object.freeze([
  "success",
  "error",
  "warning",
  "info",
]);

function createToastId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useNotificationStore = create((set) => ({
  latestNotification: null,
  notificationPanelOpen: false,
  toasts: [],
  unreadCount: 0,
  addToast: ({ duration = 4500, id = createToastId(), message, type = "success" } = {}) => {
    const toast = {
      duration: Math.max(0, Number(duration) || 0),
      id,
      message: String(message ?? "").trim(),
      type: NOTIFICATION_TONES.includes(type) ? type : "info",
    };

    if (!toast.message) {
      return null;
    }

    set((state) => ({ toasts: [...state.toasts, toast] }));
    return toast;
  },
  clearToasts: () => set({ toasts: [] }),
  closeNotificationPanel: () => set({ notificationPanelOpen: false }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  openNotificationPanel: () => set({ notificationPanelOpen: true }),
  removeToast: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
  setLatestNotification: (latestNotification) => set({ latestNotification }),
  setUnreadCount: (unreadCount) =>
    set({ unreadCount: Math.max(0, Number(unreadCount) || 0) }),
}));
