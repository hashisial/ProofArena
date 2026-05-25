import { create } from "zustand";

export const useSocketStore = create((set) => ({
  activeConversationId: null,
  onlineUsers: [],
  socketConnected: false,
  setActiveConversationId: (activeConversationId) => set({ activeConversationId }),
  setOnlineUsers: (onlineUsers) => set({ onlineUsers: onlineUsers ?? [] }),
  setSocketConnected: (socketConnected) => set({ socketConnected: Boolean(socketConnected) }),
}));
