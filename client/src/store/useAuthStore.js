import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  authError: null,
  isAuthenticated: false,
  isAuthChecking: true,
  role: null,
  user: null,
  clearAuth: () =>
    set({
      accessToken: null,
      authError: null,
      isAuthenticated: false,
      isAuthChecking: false,
      role: null,
      user: null,
    }),
  clearUser: () =>
    set({
      accessToken: null,
      authError: null,
      isAuthenticated: false,
      isAuthChecking: false,
      role: null,
      user: null,
    }),
  clearAuthError: () => set({ authError: null }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken: accessToken || null,
      isAuthenticated: Boolean(state.user && accessToken),
    })),
  setAuth: ({ user, accessToken }) =>
    set({
      accessToken: accessToken || null,
      authError: null,
      isAuthenticated: Boolean(user && accessToken),
      isAuthChecking: false,
      role: user?.role ?? null,
      user: user ?? null,
    }),
  setAuthChecking: (value) => set({ isAuthChecking: Boolean(value) }),
  setAuthError: (error) =>
    set({
      authError: error
        ? {
            errors: error.errors ?? [],
            message: error.message ?? "Authentication request failed.",
            statusCode: error.statusCode ?? error.status ?? null,
          }
        : null,
    }),
  setUser: (user) =>
    set((state) => ({
      accessToken: user ? state.accessToken : null,
      isAuthenticated: Boolean(user && state.accessToken),
      isAuthChecking: false,
      role: user?.role ?? null,
      user: user ?? null,
    })),
}));

export function getAuthAccessToken() {
  return useAuthStore.getState().accessToken;
}
