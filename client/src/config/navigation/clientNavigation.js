// @ts-check

import { ROUTE_IDS, ROUTE_METADATA } from "../routeMetadata.js";
import { createNavigationItemsFromRouteIds } from "../../utils/routeHelpers.js";

export const CLIENT_NAV_ROUTE_IDS = Object.freeze([
  ROUTE_IDS.CLIENT.DASHBOARD,
  ROUTE_IDS.CLIENT.CHALLENGES,
  ROUTE_IDS.CLIENT.PROVIDERS,
  ROUTE_IDS.CLIENT.ACTIVE,
  ROUTE_IDS.CLIENT.SETTINGS,
]);

const clientNavigationLinks = createNavigationItemsFromRouteIds(
  CLIENT_NAV_ROUTE_IDS,
  ROUTE_METADATA,
);

export const CLIENT_NAV_LINKS = Object.freeze(
  clientNavigationLinks.map((item) =>
    Object.freeze({
      ...item,
      activePatterns:
        item.routeId === ROUTE_IDS.CLIENT.DASHBOARD
          ? Object.freeze([item.href, "/dashboard/client"])
          : item.activePatterns,
      exactMatch: item.routeId === ROUTE_IDS.CLIENT.DASHBOARD,
      showInMobile: true,
      showInSidebar: true,
      type: item.type ?? "link",
    }),
  ),
);

export const CLIENT_NAV_GROUPS = Object.freeze([
  Object.freeze({
    id: "client-buyer-workflow",
    links: CLIENT_NAV_LINKS,
    title: "Buyer Command Center",
  }),
]);
