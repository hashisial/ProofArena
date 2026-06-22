import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  CLIENT_ROUTES,
  DASHBOARD_ROUTES,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES,
} from "../constants/routes.js";
import { USER_ROLES } from "../constants/statuses.js";
import { ROUTE_GROUP } from "../types/routes.js";
import {
  getRouteFallback,
  getRouteGroup,
  getRouteMetaByPath,
  isAdminRoute as isAdminRouteFromMetadata,
  isClientRoute as isClientRouteFromMetadata,
  isKnownRoute as isKnownRouteFromMetadata,
  isPublicRoute as isPublicRouteFromMetadata,
} from "./routeMetadata.js";
import { normalizePathname } from "./routeHelpers.js";
import { getPrimaryDashboardPath } from "./accessPolicy.js";

export function normalizePath(pathname) {
  return normalizePathname(pathname);
}

export function isKnownRoute(pathname) {
  return isKnownRouteFromMetadata(pathname);
}

export function isPublicRoute(pathname) {
  return isPublicRouteFromMetadata(pathname);
}

export function isProviderDashboardRoute(pathname) {
  const normalizedPathname = normalizePath(pathname);
  const meta = getRouteMetaByPath(normalizedPathname);

  return (
    meta?.group === ROUTE_GROUP.PROVIDER ||
    normalizedPathname === DASHBOARD_ROUTES.DASHBOARD ||
    normalizedPathname === DASHBOARD_ROUTES.PROVIDER_DASHBOARD ||
    normalizedPathname.startsWith(`${DASHBOARD_ROUTES.DASHBOARD}/`)
  );
}

export function isClientRoute(pathname) {
  return isClientRouteFromMetadata(pathname);
}

export function isAdminRoute(pathname) {
  return isAdminRouteFromMetadata(pathname);
}

export function isSystemRoute(pathname) {
  const normalizedPathname = normalizePath(pathname);
  return (
    normalizedPathname === SYSTEM_ROUTES.NOT_AUTHORIZED ||
    normalizedPathname === SYSTEM_ROUTES.NOT_FOUND ||
    normalizedPathname === SYSTEM_ROUTES.SERVER_ERROR ||
    normalizedPathname === PUBLIC_ROUTES.FORBIDDEN ||
    normalizedPathname === PUBLIC_ROUTES.SERVER_ERROR
  );
}

export function getRouteGroupFromPath(pathname) {
  const metadataGroup = getRouteGroup(pathname);

  if (metadataGroup) {
    return metadataGroup;
  }

  const normalizedPathname = normalizePath(pathname);

  if (normalizedPathname === ADMIN_ROUTES.ADMIN || normalizedPathname.startsWith(`${ADMIN_ROUTES.ADMIN}/`)) {
    return ROUTE_GROUP.ADMIN;
  }

  if (normalizedPathname === CLIENT_ROUTES.DASHBOARD || normalizedPathname.startsWith(`${CLIENT_ROUTES.DASHBOARD}/`)) {
    return ROUTE_GROUP.CLIENT;
  }

  if (normalizedPathname === DASHBOARD_ROUTES.DASHBOARD || normalizedPathname.startsWith(`${DASHBOARD_ROUTES.DASHBOARD}/`)) {
    return ROUTE_GROUP.PROVIDER;
  }

  if (
    normalizedPathname === AUTH_ROUTES.LOGIN ||
    normalizedPathname === AUTH_ROUTES.REGISTER ||
    normalizedPathname.startsWith("/login") ||
    normalizedPathname.startsWith("/register")
  ) {
    return ROUTE_GROUP.AUTH;
  }

  if (isSystemRoute(normalizedPathname)) {
    return ROUTE_GROUP.SYSTEM;
  }

  return ROUTE_GROUP.PUBLIC;
}

export function getDashboardFallbackForRole(userRole) {
  return getPrimaryDashboardPath(userRole, {
    guestFallback: PUBLIC_ROUTES.HOME,
    unknownFallback: PUBLIC_ROUTES.HOME,
  });
}

export function isRouteAllowedForRole(pathname, userRole) {
  const meta = getRouteMetaByPath(pathname);

  if (!meta) {
    return false;
  }

  if (!meta.isProtected && meta.roles.length === 0) {
    return true;
  }

  if (!userRole) {
    return false;
  }

  if (meta.roles.length > 0) {
    return meta.roles.includes(userRole);
  }

  if (meta.group === ROUTE_GROUP.ADMIN) {
    return userRole === USER_ROLES.ADMIN;
  }

  if (meta.group === ROUTE_GROUP.CLIENT) {
    return userRole === USER_ROLES.CLIENT;
  }

  if (meta.group === ROUTE_GROUP.PROVIDER) {
    return userRole === USER_ROLES.PROVIDER;
  }

  return true;
}

export function getSafeFallbackForPath(pathname, userRole) {
  const group = getRouteGroupFromPath(pathname);

  if (!userRole && [ROUTE_GROUP.ADMIN, ROUTE_GROUP.CLIENT, ROUTE_GROUP.DASHBOARD, ROUTE_GROUP.PROVIDER].includes(group)) {
    return AUTH_ROUTES.LOGIN;
  }

  if (group === ROUTE_GROUP.ADMIN) {
    return userRole === USER_ROLES.ADMIN ? ADMIN_ROUTES.ADMIN : SYSTEM_ROUTES.NOT_AUTHORIZED;
  }

  if (group === ROUTE_GROUP.CLIENT) {
    return userRole === USER_ROLES.CLIENT ? CLIENT_ROUTES.DASHBOARD : SYSTEM_ROUTES.NOT_AUTHORIZED;
  }

  if (group === ROUTE_GROUP.PROVIDER || group === ROUTE_GROUP.DASHBOARD) {
    if (userRole === USER_ROLES.PROVIDER) {
      return DASHBOARD_ROUTES.DASHBOARD;
    }

    return userRole ? SYSTEM_ROUTES.NOT_AUTHORIZED : AUTH_ROUTES.LOGIN;
  }

  if (group === ROUTE_GROUP.SYSTEM) {
    return PUBLIC_ROUTES.HOME;
  }

  return getRouteFallback(pathname);
}

export function shouldRenderAsFutureDisabled(pathname) {
  const meta = getRouteMetaByPath(pathname);

  if (!meta) {
    return true;
  }

  return meta.futureFeatureFlags.length > 0;
}
