import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  isAuthenticated as hasAuthenticatedUser,
  isRoleAllowed,
  normalizeRole,
} from "../utils/accessPolicy.js";

export function RoleProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const allowedRoleList = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles].filter(Boolean);
  const currentRole = normalizeRole(role ?? user?.role);

  if (isAuthChecking) {
    return (
      <PageLoader
        description="Verifying your ProofArena session securely."
        title="Preparing your outcome workspace"
      />
    );
  }

  if (!isAuthenticated || !hasAuthenticatedUser(user)) {
    return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  }

  if (allowedRoleList.length > 0 && !isRoleAllowed(currentRole, allowedRoleList)) {
    return <Navigate replace state={{ from: location }} to={ROUTES.SYSTEM.NOT_AUTHORIZED} />;
  }

  return children ?? <Outlet />;
}

export const RoleRoute = RoleProtectedRoute;
