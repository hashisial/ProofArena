import { ROUTES, USER_ROLES } from "../constants/index.js";

export function getDefaultAuthenticatedRoute(user) {
  if (user?.role === USER_ROLES.ADMIN) {
    return ROUTES.ADMIN;
  }

  if (user?.role === USER_ROLES.CLIENT) {
    return ROUTES.CLIENT_DASHBOARD;
  }

  if (user?.role === USER_ROLES.PROVIDER) {
    return ROUTES.PROVIDER_DASHBOARD;
  }

  if (user?.role === USER_ROLES.SUPPORT) {
    return ROUTES.SUPPORT_DASHBOARD;
  }

  return ROUTES.DASHBOARD;
}

export function getIntendedDestination(state, fallback = ROUTES.DASHBOARD) {
  const from = state?.from;
  const destination =
    typeof from === "string"
      ? from
      : `${from?.pathname ?? ""}${from?.search ?? ""}${from?.hash ?? ""}`;

  if (!destination.startsWith("/") || destination.startsWith("//")) {
    return fallback;
  }

  return destination;
}
