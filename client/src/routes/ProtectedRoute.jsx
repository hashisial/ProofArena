import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const user = useAuthStore((state) => state.user);

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

  return children ?? <Outlet />;
}
