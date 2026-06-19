import { create } from "zustand";

export const AUTH_STATUSES = Object.freeze({
  AUTHENTICATED: "authenticated",
  CHECKING: "checking",
  ERROR: "error",
  UNAUTHENTICATED: "unauthenticated",
});

export const AUTH_SESSION_EVENT_KEY = "proofarena:auth-session-event";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emitAuthSessionEvent(type) {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      AUTH_SESSION_EVENT_KEY,
      JSON.stringify({
        id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type,
      }),
    );
  } catch {
    // Session sync is best-effort and must not block local logout.
  }
}

export function subscribeToAuthSessionEvents(handler) {
  if (typeof window === "undefined" || typeof handler !== "function") {
    return () => {};
  }

  const onStorage = (event) => {
    if (event.key !== AUTH_SESSION_EVENT_KEY || !event.newValue) {
      return;
    }

    try {
      handler(JSON.parse(event.newValue));
    } catch {
      // Ignore malformed cross-tab events.
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

function normalizeAuthError(error) {
  if (!error) {
    return null;
  }

  return {
    code: error.code ?? null,
    errors: error.errors ?? error.details ?? [],
    message: error.message ?? "Authentication request failed.",
    statusCode: error.statusCode ?? error.status ?? null,
  };
}

function getSessionState({ accessToken, user } = {}) {
  const hasSession = Boolean(user && accessToken);

  return {
    accessToken: accessToken || null,
    authError: null,
    authStatus: hasSession
      ? AUTH_STATUSES.AUTHENTICATED
      : AUTH_STATUSES.UNAUTHENTICATED,
    error: null,
    isAuthenticated: hasSession,
    isAuthChecking: false,
    isLoading: false,
    role: user?.role ?? null,
    user: user ?? null,
  };
}

const unauthenticatedState = Object.freeze({
  accessToken: null,
  authError: null,
  authStatus: AUTH_STATUSES.UNAUTHENTICATED,
  error: null,
  isAuthenticated: false,
  isAuthChecking: false,
  isLoading: false,
  role: null,
  user: null,
});

export const useAuthStore = create((set) => ({
  accessToken: null,
  authError: null,
  authStatus: AUTH_STATUSES.CHECKING,
  error: null,
  isAuthenticated: false,
  isAuthChecking: true,
  isLoading: true,
  role: null,
  user: null,
  clearAuth: (options = {}) => {
    set(unauthenticatedState);

    if (options.broadcast !== false) {
      emitAuthSessionEvent("logout");
    }
  },
  clearAuthError: () =>
    set((state) => ({
      authError: null,
      authStatus: state.isAuthenticated
        ? AUTH_STATUSES.AUTHENTICATED
        : AUTH_STATUSES.UNAUTHENTICATED,
      error: null,
    })),
  clearUser: () => set(unauthenticatedState),
  hydrateAuth: (session) => set(getSessionState(session)),
  logoutLocal: () => set(unauthenticatedState),
  setAccessToken: (accessToken) =>
    set((state) => {
      const hasSession = Boolean(state.user && accessToken);

      return {
        accessToken: accessToken || null,
        authStatus: hasSession
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
        isAuthenticated: hasSession,
      };
    }),
  setAuth: (session) => set(getSessionState(session)),
  setAuthChecking: (value) =>
    set((state) => ({
      authStatus: value
        ? AUTH_STATUSES.CHECKING
        : state.isAuthenticated
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthChecking: Boolean(value),
      isLoading: Boolean(value),
    })),
  setAuthError: (error) => {
    const normalizedError = normalizeAuthError(error);

    set({
      authError: normalizedError,
      authStatus: normalizedError ? AUTH_STATUSES.ERROR : AUTH_STATUSES.UNAUTHENTICATED,
      error: normalizedError,
      isAuthChecking: false,
      isLoading: false,
    });
  },
  setError: (error) => {
    const normalizedError = normalizeAuthError(error);

    set({
      authError: normalizedError,
      authStatus: normalizedError ? AUTH_STATUSES.ERROR : AUTH_STATUSES.UNAUTHENTICATED,
      error: normalizedError,
      isAuthChecking: false,
      isLoading: false,
    });
  },
  setLoading: (value) =>
    set((state) => ({
      authStatus: value
        ? AUTH_STATUSES.CHECKING
        : state.isAuthenticated
          ? AUTH_STATUSES.AUTHENTICATED
          : AUTH_STATUSES.UNAUTHENTICATED,
      isAuthChecking: Boolean(value),
      isLoading: Boolean(value),
    })),
  setUser: (user) =>
    set((state) =>
      getSessionState({
        accessToken: user ? state.accessToken : null,
        user,
      }),
    ),
}));

export function getAuthAccessToken() {
  return useAuthStore.getState().accessToken;
}
