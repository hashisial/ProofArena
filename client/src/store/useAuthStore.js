import { create } from "zustand";

export const AUTH_STATUSES = Object.freeze({
  AUTHENTICATED: "authenticated",
  CHECKING: "checking",
  ERROR: "error",
  UNAUTHENTICATED: "unauthenticated",
});

export const useAuthStore = create((set) => ({
  accessToken: null,
  authError: null,
  authStatus: AUTH_STATUSES.CHECKING,
  isAuthenticated: false,
  isAuthChecking: true,
  role: null,
  user: null,
  clearAuth: () =>
    set({
      accessToken: null,
      authError: null,
      authStatus: AUTH_STATUSES.UNAUTHENTICATED,
      isAuthenticated: false,
      isAuthChecking: false,
      role: null,
      user: null,
    }),
  clearUser: () =>
    set({
      accessToken: null,
      authError: null,
      authStatus: AUTH_STATUSES.UNAUTHENTICATED,
      isAuthenticated: false,
      isAuthChecking: false,
      role: null,
      user: null,
    }),
  clearAuthError: () =>
    set((state) => ({
      authError: null,
      authStatus: state.isAuthenticated
        ? AUTH_STATUSES.AUTHENTICATED
        : AUTH_STATUSES.UNAUTHENTICATED,
    })),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken: accessToken || null,
      authStatus:
        state.user && accessToken
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthenticated: Boolean(state.user && accessToken),
    })),
  setAuth: ({ user, accessToken }) =>
    set({
      accessToken: accessToken || null,
      authError: null,
      authStatus:
        user && accessToken
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthenticated: Boolean(user && accessToken),
      isAuthChecking: false,
      role: user?.role ?? null,
      user: user ?? null,
    }),
  setAuthChecking: (value) =>
    set((state) => ({
      authStatus: value
        ? AUTH_STATUSES.CHECKING
        : state.isAuthenticated
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthChecking: Boolean(value),
    })),
  setAuthError: (error) =>
    set({
      authError: error
        ? {
            errors: error.errors ?? [],
            message: error.message ?? "Authentication request failed.",
            statusCode: error.statusCode ?? error.status ?? null,
          }
        : null,
      authStatus: error ? AUTH_STATUSES.ERROR : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthChecking: false,
    }),
  setUser: (user) =>
    set((state) => ({
      accessToken: user ? state.accessToken : null,
      authStatus:
        user && state.accessToken
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthenticated: Boolean(user && state.accessToken),
      isAuthChecking: false,
      role: user?.role ?? null,
      user: user ?? null,
    })),
}));

export function getAuthAccessToken() {
  return useAuthStore.getState().accessToken;
}
