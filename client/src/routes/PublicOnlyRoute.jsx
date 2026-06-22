import { Navigate, Outlet } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { isAuthenticated as hasAuthenticatedUser } from "../utils/accessPolicy.js";
import { getDefaultAuthenticatedRoute } from "./authRouteUtils.js";

export function PublicOnlyRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const user = useAuthStore((state) => state.user);

  if (isAuthChecking) {
    return (
      <PageLoader
        description="Checking your ProofArena session."
        title="Preparing secure access"
      />
    );
  }

  if (isAuthenticated && hasAuthenticatedUser(user)) {
    return <Navigate replace to={getDefaultAuthenticatedRoute(user)} />;
  }

  return children ?? <Outlet />;
}
