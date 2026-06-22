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
  CLIENT_NAV_GROUPS,
  CLIENT_NAV_LINKS,
  COMPANY_NAV_LINKS,
  DASHBOARD_FUTURE_NAV_LINKS,
  DASHBOARD_NAV_LINKS,
  FOOTER_NAV_GROUPS,
  FOOTER_NAV_LINKS,
  MARKETPLACE_NAV_LINKS,
  NAVIGATION_GROUPS,
  PRODUCT_NAV_LINKS,
  PROVIDER_NAV_GROUPS,
  PROVIDER_NAV_LINKS,
  PUBLIC_FOOTER_BRAND_COPY,
  PUBLIC_MOBILE_NAV_GROUPS,
  PUBLIC_NAV_DROPDOWNS,
  PUBLIC_NAV_LINKS,
  PUBLIC_NAV_REGISTRY,
  RESOURCE_NAV_LINKS,
  canAccessNavigationItem,
} from "./navigation.js";
export {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  CLIENT_ROUTES,
  DASHBOARD_ROUTES,
  DYNAMIC_ROUTES,
  PROVIDER_ROUTES,
  PUBLIC_ROUTES,
  ROUTE_TREE,
  ROUTES,
  ROUTE_GROUPS,
  SYSTEM_ROUTES,
  getProfileRoute,
  isAdminRoute,
  isAuthRoute,
  isDashboardRoute,
  isPublicRoute,
} from "./routes.js";
export {
  ROUTE_DUPLICATE_PATHS,
  ROUTE_IDS,
  ROUTE_METADATA,
  ROUTE_METADATA_LIST,
  getRouteMetadata,
  getRouteMetadataByGroup,
  getRouteMetadataByPath,
} from "../config/routeMetadata.js";
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
