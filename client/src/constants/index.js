import { PUBLIC_NAV_LINKS } from "./navigation.js";

export const APP_BRAND = Object.freeze({
  COMPANY_NAME: "ScaleOps",
  PRODUCT_NAME: "ProofArena",
  FULL_NAME: "ProofArena by ScaleOps",
  TAGLINE: "Launch measurable outcomes. Pay for verified execution.",
});

export const COMPANY_NAME = APP_BRAND.COMPANY_NAME;
export const PRODUCT_NAME = APP_BRAND.PRODUCT_NAME;
export const PRODUCT_TAGLINE = APP_BRAND.TAGLINE;

export const APP_NAV_ITEMS = Object.freeze(
  PUBLIC_NAV_LINKS.map((item) =>
    Object.freeze({
      description: item.description,
      href: item.href,
      iconKey: item.iconKey,
      iconName: item.iconName,
      label: item.label,
      path: item.path,
    }),
  ),
);

export {
  ADMIN_API,
  API_ENDPOINT_GROUPS,
  API_ENDPOINTS,
  API_GROUPS,
  AUTH_API,
  DASHBOARD_API,
  PROFILE_API,
  PROOFARENA_API,
  getAdminUserEndpoint,
  getApplicationEndpoint,
  getChallengeEndpoint,
  getProofEndpoint,
  getPublicProfileEndpoint,
} from "./apiEndpoints.js";
export { DESIGN_TOKENS } from "./designTokens.js";
export { QUERY_KEY_GROUPS, QUERY_KEYS, queryKeys } from "./queryKeys.js";
export {
  ADMIN_NAV_LINKS,
  DASHBOARD_FUTURE_NAV_LINKS,
  DASHBOARD_NAV_LINKS,
  FOOTER_NAV_GROUPS,
  FOOTER_NAV_LINKS,
  NAVIGATION_GROUPS,
  PUBLIC_NAV_DROPDOWNS,
  PUBLIC_NAV_LINKS,
  canAccessNavigationItem,
} from "./navigation.js";
export {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  DASHBOARD_ROUTES,
  DYNAMIC_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
  ROUTE_GROUPS,
  getProfileRoute,
  isAdminRoute,
  isAuthRoute,
  isDashboardRoute,
  isPublicRoute,
} from "./routes.js";
export {
  ACCOUNT_STATUS,
  CHALLENGE_STATUS,
  CHALLENGE_STATUS_VALUES,
  PROOF_STATUS,
  PROOF_STATUS_VALUES,
  PROVIDER_VERIFICATION_STATUS,
  PROVIDER_VERIFICATION_STATUS_VALUES,
  USER_ROLES,
  USER_ROLE_VALUES,
} from "./statuses.js";
