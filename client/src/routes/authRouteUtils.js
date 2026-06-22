import { ROUTES } from "../constants/index.js";
import { getPrimaryDashboardPath } from "../utils/accessPolicy.js";

export function getDefaultAuthenticatedRoute(user) {
  return getPrimaryDashboardPath(user, {
    guestFallback: ROUTES.LOGIN,
    unknownFallback: ROUTES.DASHBOARD,
  });
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
