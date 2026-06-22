import { FileQuestion } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SystemStatePage } from "../components/system/SystemStatePage.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { getRouteGroupFromPath } from "../utils/routeValidation.js";
import {
  getPrimaryDashboardPath,
  isAdminRole,
  isAuthenticated as hasAuthenticatedUser,
  isClientRole,
  isProviderRole,
} from "../utils/accessPolicy.js";
import { ROUTE_GROUP } from "../types/routes.js";

function getHelpfulLinks({ group, isAuthenticated, role }) {
  if (group === ROUTE_GROUP.ADMIN && isAdminRole(role)) {
    return [
      {
        description: "Return to platform operations.",
        href: ROUTES.ADMIN,
        label: "Admin Overview",
      },
      {
        description: "Inspect trust and operations signals.",
        href: ROUTES.ADMIN_REPORTS,
        label: "Reports",
      },
    ];
  }

  if (group === ROUTE_GROUP.CLIENT && isClientRole(role)) {
    return [
      {
        description: "Return to your buyer workspace.",
        href: ROUTES.CLIENT.DASHBOARD,
        label: "Client Overview",
      },
      {
        description: "Review posted outcome challenges.",
        href: ROUTES.CLIENT.CHALLENGES,
        label: "My Challenges",
      },
    ];
  }

  if ((group === ROUTE_GROUP.PROVIDER || group === ROUTE_GROUP.DASHBOARD) && isProviderRole(role)) {
    return [
      {
        description: "Return to your provider workspace.",
        href: ROUTES.DASHBOARD,
        label: "Provider Dashboard",
      },
      {
        description: "Review matched outcome demand.",
        href: ROUTES.MATCHED_CHALLENGES,
        label: "Matched Challenges",
      },
    ];
  }

  if (isAuthenticated) {
    return [
      {
        description: "Return to your correct workspace.",
        href: getPrimaryDashboardPath(role, {
          guestFallback: ROUTES.HOME,
          unknownFallback: ROUTES.HOME,
        }),
        label: "My Dashboard",
      },
    ];
  }

  return [
    {
      description: "Browse proof-backed providers.",
      href: ROUTES.PROVIDERS,
      label: "Providers",
    },
    {
      description: "Explore outcome challenges.",
      href: ROUTES.CHALLENGES,
      label: "Challenges",
    },
  ];
}

export function NotFound() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role) ?? user?.role ?? null;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticated = isAuthenticated && hasAuthenticatedUser(user);
  const group = getRouteGroupFromPath(location.pathname);
  const dashboardHref = authenticated
    ? getPrimaryDashboardPath(user ?? role, {
        guestFallback: ROUTES.HOME,
        unknownFallback: ROUTES.HOME,
      })
    : "";
  const actions = [
    {
      href: ROUTES.HOME,
      label: "Go home",
    },
  ];

  if (authenticated && dashboardHref && dashboardHref !== ROUTES.HOME) {
    actions.push({
      href: dashboardHref,
      label: "Go to my dashboard",
      variant: "secondary",
    });
  }

  return (
    <SystemStatePage
      actions={actions}
      badge="Route safety"
      code="404"
      description="The page may have moved, the link may be outdated, or this feature may not be available yet."
      icon={FileQuestion}
      links={getHelpfulLinks({ group, isAuthenticated: authenticated, role })}
      title="This page does not exist yet"
    />
  );
}
