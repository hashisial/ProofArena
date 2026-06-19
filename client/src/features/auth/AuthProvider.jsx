import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  subscribeToAuthSessionEvents,
  useAuthStore,
} from "../../store/useAuthStore.js";
import { authService } from "./authService.js";
import { AuthContext } from "./useAuth.js";
import { getRolePermissions, hasPermission, hasRole } from "./roleAccess.js";

function getAuthPayload(authData = {}) {
  return {
    accessToken: authData.accessToken ?? authData.token ?? "",
    user: authData.user ?? null,
  };
}

export function AuthProvider({ children }) {
  const hasInitializedRef = useRef(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const authError = useAuthStore((state) => state.authError);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAuthChecking = useAuthStore((state) => state.setAuthChecking);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const setUser = useAuthStore((state) => state.setUser);

  const applySession = useCallback(
    (authData = {}) => {
      const nextSession = getAuthPayload(authData);

      if (nextSession.user && nextSession.accessToken) {
        setAuth(nextSession);
      }

      return nextSession.user;
    },
    [setAuth],
  );

  const syncCurrentUser = useCallback(
    async (accessToken) => {
      const response = await authService.getCurrentUser();
      const nextUser = response.user ?? response;
      const currentAccessToken = useAuthStore.getState().accessToken ?? accessToken;

      if (!nextUser || !currentAccessToken) {
        clearAuth();
        return null;
      }

      setAuth({ accessToken: currentAccessToken, user: nextUser });
      return nextUser;
    },
    [clearAuth, setAuth],
  );

  const initializeAuth = useCallback(async () => {
    setAuthChecking(true);

    try {
      const currentAccessToken = useAuthStore.getState().accessToken;

      if (currentAccessToken) {
        return await syncCurrentUser(currentAccessToken);
      }

      const authData = await authService.refreshAccessToken();
      const nextSession = getAuthPayload(authData);

      if (nextSession.user && nextSession.accessToken) {
        setAuth(nextSession);
        return await syncCurrentUser(nextSession.accessToken);
      }

      clearAuth();
      return null;
    } catch {
      clearAuth();
      return null;
    } finally {
      setAuthChecking(false);
    }
  }, [clearAuth, setAuth, setAuthChecking, syncCurrentUser]);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    initializeAuth();
  }, [initializeAuth]);

  useEffect(
    () =>
      subscribeToAuthSessionEvents((event) => {
        if (event?.type === "logout") {
          useAuthStore.getState().logoutLocal();
        }
      }),
    [],
  );

  const clearSession = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Local sign-out must still complete if the server session already expired.
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const login = useCallback(
    async (credentials) => {
      clearAuthError();

      try {
        const authData = await authService.login(credentials);
        applySession(authData);
        return authData;
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    },
    [applySession, clearAuthError, setAuthError],
  );

  const register = useCallback(
    async (accountData) => {
      clearAuthError();

      try {
        const authData = await authService.register(accountData);
        applySession(authData);
        return authData;
      } catch (error) {
        setAuthError(error);
        throw error;
      }
    },
    [applySession, clearAuthError, setAuthError],
  );

  const refreshSession = useCallback(async () => {
    const authData = await authService.refreshAccessToken();
    const nextSession = getAuthPayload(authData);

    applySession(authData);

    if (nextSession.user && nextSession.accessToken) {
      await syncCurrentUser(nextSession.accessToken);
    }

    return authData;
  }, [applySession, syncCurrentUser]);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      const nextUser = response.user ?? response;

      if (nextUser) {
        setUser(nextUser);
      }

      return response;
    } catch (error) {
      if ([401, 403].includes(error?.statusCode ?? error?.status)) {
        clearAuth();
      }

      throw error;
    }
  }, [clearAuth, setUser]);

  const resetPassword = useCallback(
    async (payload) => {
      const response = await authService.resetPassword(payload);
      clearAuth();
      return response;
    },
    [clearAuth],
  );

  const verifyEmail = useCallback(
    async (payload) => {
      const response = await authService.verifyEmail(payload);
      const nextUser = response.user ?? null;

      if (nextUser) {
        setUser(nextUser);
      }

      return response;
    },
    [setUser],
  );

  const changePassword = useCallback(
    async (payload) => {
      const response = await authService.changePassword(payload);
      clearAuth();
      return response;
    },
    [clearAuth],
  );

  const updateUser = useCallback(
    (userData) => {
      setUser({
        ...user,
        ...userData,
      });
    },
    [setUser, user],
  );

  const can = useCallback(
    (permission) => hasPermission(user, permission),
    [user],
  );

  const hasAnyRole = useCallback(
    (allowedRoles) => hasRole(user, allowedRoles),
    [user],
  );

  const signIn = useCallback(
    async (credentials) => {
      const authData = await login(credentials);
      return authData.user ?? null;
    },
    [login],
  );

  const signUp = useCallback(
    async (accountData) => {
      const authData = await register(accountData);
      return authData.user ?? null;
    },
    [register],
  );

  const contextValue = useMemo(
    () => ({
      accessToken,
      authError,
      can,
      changePassword,
      clearAuthError,
      forgotPassword: authService.forgotPassword,
      getCurrentUser,
      hasRole: hasAnyRole,
      initializeAuth,
      isAuthenticated,
      isAuthChecking,
      isBootstrapping: isAuthChecking,
      login,
      logout: clearSession,
      permissions: user ? getRolePermissions(user.role) : [],
      refreshSession,
      register,
      resendVerification: authService.resendVerification,
      resetPassword,
      role: role ?? "",
      signIn,
      signOut: clearSession,
      signUp,
      token: accessToken,
      updateUser,
      user,
      verifyEmail,
    }),
    [
      accessToken,
      authError,
      can,
      changePassword,
      clearAuthError,
      clearSession,
      getCurrentUser,
      hasAnyRole,
      initializeAuth,
      isAuthenticated,
      isAuthChecking,
      login,
      refreshSession,
      register,
      resetPassword,
      role,
      signIn,
      signUp,
      updateUser,
      user,
      verifyEmail,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
