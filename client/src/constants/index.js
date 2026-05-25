import { PUBLIC_NAV_LINKS } from "./navigation.js";

export const APP_BRAND = Object.freeze({
  COMPANY_NAME: "ScaleOps",
  PRODUCT_NAME: "ProofArena",
  FULL_NAME: "ProofArena by ScaleOps",
  TAGLINE: "Launch outcomes. Prove execution.",
});

export const COMPANY_NAME = APP_BRAND.COMPANY_NAME;
export const PRODUCT_NAME = APP_BRAND.PRODUCT_NAME;
export const PRODUCT_TAGLINE = APP_BRAND.TAGLINE;

export const APP_NAV_ITEMS = Object.freeze(
  PUBLIC_NAV_LINKS.map((item) =>
    Object.freeze({
      description: item.description,
      href: item.path,
      iconName: item.iconName,
      label: item.label,
      path: item.path,
    }),
  ),
);

export { API_ENDPOINT_GROUPS, API_ENDPOINTS } from "./apiEndpoints.js";
export { DESIGN_TOKENS } from "./designTokens.js";
export { ADMIN_NAV_LINKS, DASHBOARD_NAV_LINKS, PUBLIC_NAV_LINKS } from "./navigation.js";
export { ROUTES } from "./routes.js";
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
