// @ts-check

import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  CLIENT_ROUTES,
  DASHBOARD_ROUTES,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES,
} from "../constants/routes.js";
import { ACCOUNT_STATUS, USER_ROLES } from "../constants/statuses.js";
import { getRouteMetadata } from "../config/routeMetadata.js";
import { ROUTE_GROUP } from "../types/routes.js";
import { getRouteMetaByPath } from "./routeMetadata.js";
import { normalizePathname } from "./routeHelpers.js";

export const ACCESS_ROLES = Object.freeze({
  ADMIN: USER_ROLES.ADMIN,
  CLIENT: USER_ROLES.CLIENT,
  GUEST: "guest",
  MODERATOR: "moderator",
  PROVIDER: USER_ROLES.PROVIDER,
  SUPER_ADMIN: "super_admin",
  SUPPORT: USER_ROLES.SUPPORT,
  TEAM_MEMBER: "team_member",
});

const ADMIN_OVERRIDE_ROLES = Object.freeze([
  ACCESS_ROLES.ADMIN,
  ACCESS_ROLES.SUPER_ADMIN,
]);

function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function resolveUser(userOrRole) {
  if (!userOrRole) {
    return null;
  }

  return typeof userOrRole === "string" ? { role: userOrRole } : userOrRole;
}

function normalizeRoleValue(role) {
  const value = String(role ?? "").trim().toLowerCase();

  if (!value) {
    return ACCESS_ROLES.GUEST;
  }

  if (value === "user") {
    return ACCESS_ROLES.CLIENT;
  }

  return value;
}

export function normalizeRole(userOrRole) {
  const user = resolveUser(userOrRole);
  return normalizeRoleValue(user?.role);
}

export function isAuthenticated(user) {
  if (!user) {
    return false;
  }

  const accountStatus = user.accountStatus ?? ACCOUNT_STATUS.ACTIVE;
  return Boolean(user.id || user._id || user.email || user.username) && accountStatus !== ACCOUNT_STATUS.DELETED;
}

export function isAdminRole(role) {
  return ADMIN_OVERRIDE_ROLES.includes(normalizeRole(role));
}

export function isProviderRole(role) {
  return normalizeRole(role) === ACCESS_ROLES.PROVIDER;
}

export function isClientRole(role) {
  return normalizeRole(role) === ACCESS_ROLES.CLIENT;
}

export function isGuestRole(role) {
  return normalizeRole(role) === ACCESS_ROLES.GUEST;
}

export function getPrimaryDashboardPath(userOrRole, options = {}) {
  const role = normalizeRole(userOrRole);
  const guestFallback = options.guestFallback ?? AUTH_ROUTES.LOGIN;
  const unknownFallback = options.unknownFallback ?? PUBLIC_ROUTES.HOME;

  if (isAdminRole(role)) {
    return ADMIN_ROUTES.ADMIN;
  }

  if (role === ACCESS_ROLES.CLIENT) {
    return CLIENT_ROUTES.DASHBOARD;
  }

  if (role === ACCESS_ROLES.PROVIDER) {
    return DASHBOARD_ROUTES.DASHBOARD;
  }

  if (role === ACCESS_ROLES.SUPPORT) {
    return DASHBOARD_ROUTES.SUPPORT_DASHBOARD;
  }

  if (role === ACCESS_ROLES.GUEST) {
    return guestFallback;
  }

  return unknownFallback;
}

function roleMatchesAllowed(role, allowedRoles = []) {
  if (allowedRoles.length === 0) {
    return true;
  }

  const normalizedRole = normalizeRole(role);

  return allowedRoles.some((allowedRole) => {
    const normalizedAllowedRole = normalizeRoleValue(allowedRole);
    return normalizedAllowedRole === normalizedRole ||
      (normalizedAllowedRole === ACCESS_ROLES.ADMIN && isAdminRole(normalizedRole));
  });
}

export function isRoleAllowed(role, allowedRoles = []) {
  return roleMatchesAllowed(role, toArray(allowedRoles));
}

function roleIsBlocked(role, blockedRoles = []) {
  const normalizedRole = normalizeRole(role);
  return blockedRoles.some((blockedRole) => normalizeRoleValue(blockedRole) === normalizedRole);
}

function getEffectivePermissions(user) {
  const permissions = toArray(user?.permissions);
  return new Set(permissions);
}

function hasRequiredPermissions(user, permissions = []) {
  const requiredPermissions = toArray(permissions);

  if (requiredPermissions.length === 0) {
    return true;
  }

  const grantedPermissions = getEffectivePermissions(user);

  return requiredPermissions.every(
    (permission) =>
      grantedPermissions.has("all") ||
      grantedPermissions.has(permission) ||
      [...grantedPermissions].some((granted) =>
        String(granted).endsWith(":*") && String(permission).startsWith(String(granted).slice(0, -1)),
      ),
  );
}

export function canAccessRoute(routeMetaOrPath, user) {
  const routeMeta = typeof routeMetaOrPath === "string"
    ? getRouteMetaByPath(routeMetaOrPath)
    : routeMetaOrPath;

  if (!routeMeta) {
    return false;
  }

  if (routeMeta.isPublic && !routeMeta.isProtected) {
    return true;
  }

  if (!isAuthenticated(user)) {
    return false;
  }

  const role = normalizeRole(user);

  if (routeMeta.group === ROUTE_GROUP.ADMIN && !isAdminRole(role)) {
    return false;
  }

  if (routeMeta.group === ROUTE_GROUP.CLIENT && !isClientRole(role)) {
    return false;
  }

  if (routeMeta.group === ROUTE_GROUP.PROVIDER && !isProviderRole(role)) {
    return false;
  }

  if (!roleMatchesAllowed(role, routeMeta.roles)) {
    return false;
  }

  return hasRequiredPermissions(user, routeMeta.permissions);
}

export function canViewNavItem(navItem, user, context = {}) {
  if (!navItem) {
    return false;
  }

  const authenticated = context.isAuthenticated ?? isAuthenticated(user);
  const role = context.role ?? normalizeRole(user);

  if (navItem.hideWhenAuth && authenticated) {
    return false;
  }

  if ((navItem.requiresAuth || navItem.isProtected) && !authenticated) {
    return false;
  }

  if (roleIsBlocked(role, navItem.blockedRoles)) {
    return false;
  }

  if (!roleMatchesAllowed(role, navItem.roles ?? navItem.requiredRole)) {
    return false;
  }

  if (!hasRequiredPermissions(user, navItem.permissions)) {
    return false;
  }

  const routeMeta = navItem.routeId
    ? getRouteMetadata(navItem.routeId)
    : getRouteMetaByPath(navItem.href ?? navItem.path ?? "");
  if (routeMeta?.isProtected && !canAccessRoute(routeMeta, user)) {
    return false;
  }

  return true;
}

export function shouldDisableNavItem(navItem, user, context = {}) {
  if (!navItem) {
    return true;
  }

  if (navItem.disabled || navItem.future || navItem.comingSoon) {
    return true;
  }

  if (!navItem.href && !navItem.path) {
    return true;
  }

  const routeMeta = getRouteMetaByPath(navItem.href ?? navItem.path ?? "");

  if (routeMeta?.futureFeatureFlags?.length && !context.includeFuture) {
    return true;
  }

  return !canViewNavItem(navItem, user, context);
}

export function getUnauthorizedFallback(user, attemptedPath = "") {
  if (!isAuthenticated(user)) {
    return AUTH_ROUTES.LOGIN;
  }

  const normalizedPath = normalizePathname(attemptedPath);
  const routeMeta = getRouteMetaByPath(normalizedPath);

  if (routeMeta?.group === ROUTE_GROUP.SYSTEM) {
    return PUBLIC_ROUTES.HOME;
  }

  return getPrimaryDashboardPath(user, {
    guestFallback: AUTH_ROUTES.LOGIN,
    unknownFallback: SYSTEM_ROUTES.NOT_AUTHORIZED,
  });
}

export function getAccessDecision(routeMetaOrPath, user) {
  const routeMeta = typeof routeMetaOrPath === "string"
    ? getRouteMetaByPath(routeMetaOrPath)
    : routeMetaOrPath;

  if (!routeMeta) {
    return Object.freeze({
      allowed: false,
      fallback: SYSTEM_ROUTES.NOT_FOUND,
      reason: "unknown_route",
    });
  }

  if (canAccessRoute(routeMeta, user)) {
    return Object.freeze({
      allowed: true,
      fallback: routeMeta.path,
      reason: "allowed",
    });
  }

  return Object.freeze({
    allowed: false,
    fallback: getUnauthorizedFallback(user, routeMeta.path),
    reason: isAuthenticated(user) ? "forbidden" : "unauthenticated",
  });
}
