import { ShieldAlert } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SystemStatePage } from "../components/system/SystemStatePage.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  getPrimaryDashboardPath,
  getUnauthorizedFallback,
  isAuthenticated as hasAuthenticatedUser,
} from "../utils/accessPolicy.js";

export function NotAuthorized() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role) ?? user?.role ?? null;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticated = isAuthenticated && hasAuthenticatedUser(user);
  const dashboardHref = getPrimaryDashboardPath(user ?? role, {
    guestFallback: ROUTES.LOGIN,
    unknownFallback: ROUTES.HOME,
  });
  const attemptedPath = location.state?.from?.pathname ?? location.pathname;
  const safeFallback = getUnauthorizedFallback(user, attemptedPath);
  const primaryHref = authenticated
    ? dashboardHref
    : ROUTES.LOGIN;
  const actions = [
    {
      href: primaryHref,
      label: authenticated ? "Go to my dashboard" : "Login",
    },
    {
      href: ROUTES.HOME,
      label: "Go home",
      variant: "secondary",
    },
  ];

  const links = [
    {
      description: "Return to a public route that is always available.",
      href: ROUTES.HOME,
      label: "Home",
    },
    {
      description: "Ask for access help without exposing private route details.",
      href: ROUTES.CONTACT,
      label: "Contact Support",
    },
  ];

  if (authenticated && safeFallback && safeFallback !== ROUTES.SYSTEM.NOT_AUTHORIZED && safeFallback !== ROUTES.LOGIN) {
    links.unshift({
      description: "Use the safest available route for your account.",
      href: safeFallback,
      label: "Safe workspace",
    });
  }

  return (
    <SystemStatePage
      actions={actions}
      badge="Access control"
      code="403"
      description="Your current account does not have permission to view this page."
      icon={ShieldAlert}
      links={links}
      title="You do not have access to this area"
    />
  );
}
