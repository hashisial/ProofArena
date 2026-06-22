import {
  buildRoute,
  matchesRoutePattern,
  normalizePathname,
} from "../utils/routeHelpers.js";

function matchesStaticRoute(pathname, routes) {
  const normalized = normalizePathname(pathname);
  return Object.values(routes).some((route) => normalizePathname(route) === normalized);
}

function matchesDynamicRoute(pathname, patterns) {
  return patterns.some((pattern) => matchesRoutePattern(pathname, pattern));
}

export const PUBLIC_ROUTES = Object.freeze({
  HOME: "/",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  CHALLENGES: "/challenges",
  PROVIDERS: "/providers",
  PROVIDER_COMPARE: "/providers/compare",
  PROOF_LEDGER: "/proof-ledger",
  LEADERBOARD: "/leaderboard",
  OUTCOME_OFFERS: "/offers",
  BLOG: "/blog",
  CONTACT: "/contact",
  RESOURCES: "/resources",
  CASE_STUDIES: "/case-studies",
  HELP: "/help",
  PRICING: "/pricing",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  TRUST_SAFETY: "/trust-safety",
  MARKETPLACE: "/marketplace",
  PORTFOLIO: "/portfolio",
  SERVICES: "/services",
  FORBIDDEN: "/403",
  SERVER_ERROR: "/500",
});

export const AUTH_ROUTES = Object.freeze({
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  RESEND_VERIFICATION: "/resend-verification",
});

export const DASHBOARD_ROUTES = Object.freeze({
  DASHBOARD: "/dashboard",
  CLIENT_DASHBOARD: "/dashboard/client",
  PROVIDER_DASHBOARD: "/dashboard/provider",
  SUPPORT_DASHBOARD: "/dashboard/support",
  CLIENT_WORKSPACE: "/dashboard/workspace",
  MY_CHALLENGES: "/dashboard/challenges",
  NEW_CHALLENGE: "/dashboard/challenges/new",
  MY_OUTCOME_OFFERS: "/dashboard/offers",
  NEW_OUTCOME_OFFER: "/dashboard/offers/new",
  MY_EXECUTION_PLANS: "/dashboard/plans",
  NEW_EXECUTION_PLAN: "/dashboard/plans/new",
  MATCHED_CHALLENGES: "/dashboard/matches",
  SAVED_MATCHES: "/dashboard/matches/saved",
  APPLIED_MATCHES: "/dashboard/matches/applied",
  OPPORTUNITY_PIPELINE: "/dashboard/opportunities",
  PROOF_READINESS: "/dashboard/proof-readiness",
  PROOF_VAULT: "/dashboard/proof-vault",
  FIRST_CLIENT_MODE: "/dashboard/first-client",
  STARTER_CHALLENGES: "/dashboard/starter-challenges",
  SAVED_PROVIDERS: "/dashboard/saved-providers",
  PROFILE: "/profile",
  MESSAGES: "/messages",
  SETTINGS: "/settings",
  PROVIDER_SETTINGS: "/dashboard/settings",
  NOTIFICATIONS: "/notifications",
  PROOF: "/proof",
  SAVED: "/saved",
  BILLING: "/billing",
  ACCOUNT: "/account",
  CONNECTIONS: "/connections",
  LEADS: "/leads",
  NETWORK: "/network",
  PAYMENTS: "/payments",
  PROJECTS: "/projects",
  SCRAPER: "/scraper",
  PROVIDER_SERVICES: "/provider-services",
});

export const ADMIN_ROUTES = Object.freeze({
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_PROVIDERS: "/admin/providers",
  ADMIN_CHALLENGES: "/admin/challenges",
  ADMIN_OFFERS: "/admin/offers",
  ADMIN_PROOFS: "/admin/proofs",
  ADMIN_PROOF_ASSETS: "/admin/proof-assets",
  ADMIN_PROOF_REVIEW: "/admin/proof-review",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_VERIFICATION: "/admin/verification",
  ADMIN_DISPUTES: "/admin/disputes",
  ADMIN_SETTINGS: "/admin/settings",
});

export const PROVIDER_ROUTES = Object.freeze({
  DASHBOARD: DASHBOARD_ROUTES.DASHBOARD,
  PROFILE: "/dashboard/profile",
  PROFILE_ONBOARDING: "/dashboard/profile/onboarding",
  PROFILE_ONBOARDING_STEP: "/dashboard/profile/onboarding/:stepSegment",
  OFFERS: DASHBOARD_ROUTES.MY_OUTCOME_OFFERS,
  CHALLENGES: DASHBOARD_ROUTES.MY_CHALLENGES,
  PROOF_VAULT: DASHBOARD_ROUTES.PROOF_VAULT,
  OPPORTUNITIES: DASHBOARD_ROUTES.OPPORTUNITY_PIPELINE,
  SETTINGS: DASHBOARD_ROUTES.PROVIDER_SETTINGS,
});

export const CLIENT_ROUTES = Object.freeze({
  DASHBOARD: "/client",
  CHALLENGES: "/client/challenges",
  PROVIDERS: "/client/providers",
  ACTIVE: "/client/active",
  SETTINGS: "/client/settings",
});

export const SYSTEM_ROUTES = Object.freeze({
  NOT_AUTHORIZED: "/not-authorized",
  NOT_FOUND: "/not-found",
  LEGACY_FORBIDDEN: PUBLIC_ROUTES.FORBIDDEN,
  SERVER_ERROR: PUBLIC_ROUTES.SERVER_ERROR,
});

export const DYNAMIC_ROUTES = Object.freeze({
  PUBLIC_PROFILE: "/profile/:username",
  LEGACY_PUBLIC_PROFILE: "/u/:username",
  PROVIDER_PROFILE: "/providers/:username",
  PUBLIC_CHALLENGE: "/challenges/:username/:slug",
  PUBLIC_OUTCOME_OFFER: "/offers/:username/:slug",
  MARKETPLACE_CATEGORY: "/marketplace/category/:categorySlug",
  MARKETPLACE_SERVICE: "/marketplace/service/:serviceId",
  OWNER_CHALLENGE: "/dashboard/challenges/:challengeId",
  EDIT_CHALLENGE: "/dashboard/challenges/:challengeId/edit",
  CHALLENGE_PROVIDERS: "/dashboard/challenges/:challengeId/providers",
  CHALLENGE_SHORTLISTED_PROVIDERS: "/dashboard/challenges/:challengeId/providers/shortlisted",
  PROVIDER_SELECTION: "/dashboard/challenges/:challengeId/provider-selection",
  LEGACY_RECOMMENDED_PROVIDERS: "/dashboard/challenges/:challengeId/recommended-providers",
  CHALLENGE_PLANS: "/dashboard/challenges/:challengeId/plans",
  CLIENT_EXECUTION_PLAN: "/dashboard/challenges/:challengeId/plans/:planId",
  OWNER_OUTCOME_OFFER: "/dashboard/offers/:offerId",
  EDIT_OUTCOME_OFFER: "/dashboard/offers/:offerId/edit",
  EXECUTION_PLAN_DETAIL: "/dashboard/plans/:planId",
  EDIT_EXECUTION_PLAN: "/dashboard/plans/:planId/edit",
  OPPORTUNITY_DETAIL: "/dashboard/opportunities/:opportunityId",
  PROOF_ASSET_DETAIL: "/dashboard/proof-vault/:assetId",
  PROFILE_ONBOARDING_STEP: PROVIDER_ROUTES.PROFILE_ONBOARDING_STEP,
});

const PUBLIC_DYNAMIC_PATTERNS = Object.freeze([
  DYNAMIC_ROUTES.PUBLIC_PROFILE,
  DYNAMIC_ROUTES.LEGACY_PUBLIC_PROFILE,
  DYNAMIC_ROUTES.PROVIDER_PROFILE,
  DYNAMIC_ROUTES.PUBLIC_CHALLENGE,
  DYNAMIC_ROUTES.PUBLIC_OUTCOME_OFFER,
  DYNAMIC_ROUTES.MARKETPLACE_CATEGORY,
  DYNAMIC_ROUTES.MARKETPLACE_SERVICE,
]);

const DASHBOARD_DYNAMIC_PATTERNS = Object.freeze([
  DYNAMIC_ROUTES.OWNER_CHALLENGE,
  DYNAMIC_ROUTES.EDIT_CHALLENGE,
  DYNAMIC_ROUTES.CHALLENGE_PROVIDERS,
  DYNAMIC_ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS,
  DYNAMIC_ROUTES.PROVIDER_SELECTION,
  DYNAMIC_ROUTES.LEGACY_RECOMMENDED_PROVIDERS,
  DYNAMIC_ROUTES.CHALLENGE_PLANS,
  DYNAMIC_ROUTES.CLIENT_EXECUTION_PLAN,
  DYNAMIC_ROUTES.OWNER_OUTCOME_OFFER,
  DYNAMIC_ROUTES.EDIT_OUTCOME_OFFER,
  DYNAMIC_ROUTES.EXECUTION_PLAN_DETAIL,
  DYNAMIC_ROUTES.EDIT_EXECUTION_PLAN,
  DYNAMIC_ROUTES.OPPORTUNITY_DETAIL,
  DYNAMIC_ROUTES.PROOF_ASSET_DETAIL,
  DYNAMIC_ROUTES.PROFILE_ONBOARDING_STEP,
]);

export const ROUTE_GROUPS = Object.freeze({
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES,
  PROVIDER: PROVIDER_ROUTES,
  CLIENT: CLIENT_ROUTES,
  ADMIN: ADMIN_ROUTES,
  SYSTEM: SYSTEM_ROUTES,
  DYNAMIC: DYNAMIC_ROUTES,
});

export const ROUTE_TREE = ROUTE_GROUPS;

export function getProfileRoute(username) {
  return buildRoute(DYNAMIC_ROUTES.PUBLIC_PROFILE, { username });
}

export function isAuthRoute(pathname) {
  return matchesStaticRoute(pathname, AUTH_ROUTES);
}

export function isDashboardRoute(pathname) {
  const normalized = normalizePathname(pathname);
  return (
    normalized.startsWith(`${DASHBOARD_ROUTES.DASHBOARD}/`) ||
    matchesStaticRoute(pathname, DASHBOARD_ROUTES) ||
    matchesDynamicRoute(pathname, DASHBOARD_DYNAMIC_PATTERNS)
  );
}

export function isAdminRoute(pathname) {
  const normalized = normalizePathname(pathname);
  return normalized === ADMIN_ROUTES.ADMIN || normalized.startsWith(`${ADMIN_ROUTES.ADMIN}/`);
}

export function isPublicRoute(pathname) {
  return (
    matchesStaticRoute(pathname, PUBLIC_ROUTES) ||
    matchesDynamicRoute(pathname, PUBLIC_DYNAMIC_PATTERNS)
  );
}

export const ROUTES = Object.freeze({
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  DASHBOARD_GROUP: DASHBOARD_ROUTES,
  PROVIDER: PROVIDER_ROUTES,
  CLIENT: CLIENT_ROUTES,
  ADMIN_GROUP: ADMIN_ROUTES,
  SYSTEM: SYSTEM_ROUTES,
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...DASHBOARD_ROUTES,
  ...ADMIN_ROUTES,
  PUBLIC_PROFILE: DYNAMIC_ROUTES.PUBLIC_PROFILE,
  OUTCOME_OFFER_DETAIL: (username, slug) =>
    buildRoute(DYNAMIC_ROUTES.PUBLIC_OUTCOME_OFFER, { username, slug }),
  OWNER_CHALLENGE: (challengeId) => buildRoute(DYNAMIC_ROUTES.OWNER_CHALLENGE, { challengeId }),
  EDIT_CHALLENGE: (challengeId) => buildRoute(DYNAMIC_ROUTES.EDIT_CHALLENGE, { challengeId }),
  CHALLENGE_PROVIDERS: (challengeId) =>
    buildRoute(DYNAMIC_ROUTES.CHALLENGE_PROVIDERS, { challengeId }),
  CHALLENGE_SHORTLISTED_PROVIDERS: (challengeId) =>
    buildRoute(DYNAMIC_ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS, { challengeId }),
  PROVIDER_SELECTION: (challengeId) =>
    buildRoute(DYNAMIC_ROUTES.PROVIDER_SELECTION, { challengeId }),
  RECOMMENDED_PROVIDERS: (challengeId) =>
    buildRoute(DYNAMIC_ROUTES.CHALLENGE_PROVIDERS, { challengeId }),
  LEGACY_RECOMMENDED_PROVIDERS: (challengeId) =>
    buildRoute(DYNAMIC_ROUTES.LEGACY_RECOMMENDED_PROVIDERS, { challengeId }),
  CHALLENGE_PLANS: (challengeId) => buildRoute(DYNAMIC_ROUTES.CHALLENGE_PLANS, { challengeId }),
  CLIENT_EXECUTION_PLAN: (challengeId, planId) =>
    buildRoute(DYNAMIC_ROUTES.CLIENT_EXECUTION_PLAN, { challengeId, planId }),
  OWNER_OUTCOME_OFFER: (offerId) => buildRoute(DYNAMIC_ROUTES.OWNER_OUTCOME_OFFER, { offerId }),
  EDIT_OUTCOME_OFFER: (offerId) => buildRoute(DYNAMIC_ROUTES.EDIT_OUTCOME_OFFER, { offerId }),
  EXECUTION_PLAN_DETAIL: (planId) => buildRoute(DYNAMIC_ROUTES.EXECUTION_PLAN_DETAIL, { planId }),
  EDIT_EXECUTION_PLAN: (planId) => buildRoute(DYNAMIC_ROUTES.EDIT_EXECUTION_PLAN, { planId }),
  OPPORTUNITY_DETAIL: (opportunityId) =>
    buildRoute(DYNAMIC_ROUTES.OPPORTUNITY_DETAIL, { opportunityId }),
  PROOF_ASSET_DETAIL: (assetId) => buildRoute(DYNAMIC_ROUTES.PROOF_ASSET_DETAIL, { assetId }),
  PROFILE_ONBOARDING_STEP: (stepSegment) =>
    buildRoute(DYNAMIC_ROUTES.PROFILE_ONBOARDING_STEP, { stepSegment }),
});
