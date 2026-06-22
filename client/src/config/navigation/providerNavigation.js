// @ts-check

import { DASHBOARD_ROUTES } from "../../constants/routes.js";
import { ROUTE_IDS, ROUTE_METADATA } from "../routeMetadata.js";
import {
  createNavigationItemsFromRouteIds,
} from "../../utils/routeHelpers.js";

function getNavigationItem(routeId, overrides = {}) {
  const route = ROUTE_METADATA[routeId];

  if (!route) {
    throw new Error(`Missing route metadata for provider navigation route: ${routeId}`);
  }

  return Object.freeze({
    description: route.description,
    exactMatch: false,
    href: route.path,
    iconKey: route.iconKey,
    iconName: route.iconKey,
    id: route.id,
    label: route.label,
    path: route.path,
    routeId: route.id,
    showInMobile: true,
    showInSidebar: true,
    type: "link",
    ...(route.roles?.length ? { requiredRole: route.roles.length === 1 ? route.roles[0] : route.roles, roles: route.roles } : {}),
    ...overrides,
  });
}

export const PROVIDER_NAV_ROUTE_IDS = Object.freeze([
  ROUTE_IDS.DASHBOARD.DASHBOARD,
  ROUTE_IDS.PROVIDER.PROFILE,
  ROUTE_IDS.PROVIDER.OFFERS,
  ROUTE_IDS.PROVIDER.CHALLENGES,
  ROUTE_IDS.PROVIDER.PROOF_VAULT,
  ROUTE_IDS.PROVIDER.OPPORTUNITIES,
  ROUTE_IDS.PROVIDER.SETTINGS,
]);

export const PROVIDER_NAV_LINKS = Object.freeze([
  getNavigationItem(ROUTE_IDS.DASHBOARD.DASHBOARD, {
    description: "Provider acquisition overview, readiness, matched opportunities, and next actions.",
    exactMatch: true,
    href: DASHBOARD_ROUTES.DASHBOARD,
    label: "Overview",
    path: DASHBOARD_ROUTES.DASHBOARD,
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.PROFILE, {
    description: "Provider public identity, trust signals, proof score, skills, and service positioning.",
    label: "Profile",
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.OFFERS, {
    description: "Package services into measurable outcome offers.",
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.CHALLENGES, {
    description: "Review relevant client outcome challenges matched by skills, proof, category, and availability.",
    href: DASHBOARD_ROUTES.MY_CHALLENGES,
    path: DASHBOARD_ROUTES.MY_CHALLENGES,
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.PROOF_VAULT, {
    description: "Store reusable credibility assets and evidence.",
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.OPPORTUNITIES, {
    description: "Track matched, invited, applied, shortlisted, won, and lost work.",
    label: "Opportunities",
  }),
  getNavigationItem(ROUTE_IDS.PROVIDER.SETTINGS, {
    description: "Account, profile, notification, availability, and provider preference controls.",
  }),
]);

export const PROVIDER_FUTURE_NAV_ROUTE_IDS = Object.freeze([
  ROUTE_IDS.PUBLIC.LEADERBOARD,
]);

export const PROVIDER_FUTURE_NAV_LINKS = createNavigationItemsFromRouteIds(
  PROVIDER_FUTURE_NAV_ROUTE_IDS,
  ROUTE_METADATA,
);

export const PROVIDER_NAV_GROUPS = Object.freeze([
  Object.freeze({
    id: "provider-acquisition",
    links: PROVIDER_NAV_LINKS,
    title: "Provider Command Center",
  }),
]);
