import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";

export function RoleRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const allowedRoleList = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles].filter(Boolean);
  const currentRole = role ?? user?.role ?? null;

  if (isAuthChecking) {
    return (
      <PageLoader
        description="Verifying your ProofArena session securely."
        title="Preparing your outcome workspace"
      />
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  }

  if (allowedRoleList.length > 0 && !allowedRoleList.includes(currentRole)) {
    return <Navigate replace to={ROUTES.FORBIDDEN} />;
  }

  return children ?? <Outlet />;
}
