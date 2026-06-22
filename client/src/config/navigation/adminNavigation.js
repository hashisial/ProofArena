// @ts-check

import { ROUTE_IDS, ROUTE_METADATA } from "../routeMetadata.js";
import { createNavigationItemsFromRouteIds } from "../../utils/routeHelpers.js";

export const ADMIN_NAV_ROUTE_IDS = Object.freeze([
  ROUTE_IDS.ADMIN.DASHBOARD,
  ROUTE_IDS.ADMIN.USERS,
  ROUTE_IDS.ADMIN.PROVIDERS,
  ROUTE_IDS.ADMIN.CHALLENGES,
  ROUTE_IDS.ADMIN.PROOFS,
  ROUTE_IDS.ADMIN.REPORTS,
  ROUTE_IDS.ADMIN.SETTINGS,
]);

export const ADMIN_NAV_LINKS = createNavigationItemsFromRouteIds(
  ADMIN_NAV_ROUTE_IDS,
  ROUTE_METADATA,
);
