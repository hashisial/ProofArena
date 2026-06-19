import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";

function hasVerifiedEmail(user) {
  return Boolean(user?.emailVerified ?? user?.isEmailVerified ?? user?.isVerified);
}

export function EmailVerifiedRoute({ children }) {
  const location = useLocation();
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);
  const user = useAuthStore((state) => state.user);

  if (isAuthChecking) {
    return (
      <PageLoader
        description="Confirming your account verification status."
        title="Preparing secure access"
      />
    );
  }

  if (user && !hasVerifiedEmail(user)) {
    return (
      <Navigate
        replace
        state={{
          from: location,
          reason: "email-verification-required",
        }}
        to={ROUTES.RESEND_VERIFICATION}
      />
    );
  }

  return children ?? <Outlet />;
}
