import { USER_ROLES } from "../constants/index.js";
import { AppError } from "../utils/AppError.js";

export const roles = Object.freeze({
  admin: USER_ROLES.ADMIN,
  client: USER_ROLES.CLIENT,
  provider: USER_ROLES.PROVIDER,
});

export const workspaceRoles = Object.freeze([roles.client, roles.provider]);

export const permissions = Object.freeze({
  ADMIN_ANALYTICS_READ: "admin:analytics:read",
  ADMIN_ARTICLES_MANAGE: "admin:articles:manage",
  ADMIN_BILLING_MANAGE: "admin:billing:manage",
  ADMIN_CONTENT_MANAGE: "admin:content:manage",
  ADMIN_REVIEWS_MANAGE: "admin:reviews:manage",
  ADMIN_SETTINGS_MANAGE: "admin:settings:manage",
  ADMIN_SUPPORT_MANAGE: "admin:support:manage",
  ADMIN_USERS_MANAGE: "admin:users:manage",
  BILLING_MANAGE: "billing:manage",
  CAMPAIGNS_MANAGE: "campaigns:manage",
  DASHBOARD_READ: "dashboard:read",
  LEADS_MANAGE: "leads:manage",
  MARKETPLACE_COMPLETE_WORK: "marketplace:complete-work",
  MARKETPLACE_HIRE: "marketplace:hire",
  MARKETPLACE_PAYOUTS: "marketplace:payouts",
  MARKETPLACE_READ: "marketplace:read",
  MEDIA_UPLOAD: "media:upload",
  MESSAGES_USE: "messages:use",
  NETWORK_USE: "network:use",
  NOTIFICATIONS_READ: "notifications:read",
  OUTREACH_MANAGE: "outreach:manage",
  PORTFOLIO_READ_OWN: "portfolio:read-own",
  PROFILE_READ: "profile:read",
  PROFILE_UPDATE: "profile:update",
  PROJECTS_MANAGE: "projects:manage",
  REVIEWS_CREATE: "reviews:create",
  SCRAPER_USE: "scraper:use",
  SERVICES_CREATE: "services:create",
  SERVICES_READ_OWN: "services:read-own",
});

const legacyAdminPermissionAliases = Object.freeze({
  analytics: permissions.ADMIN_ANALYTICS_READ,
  articles: permissions.ADMIN_ARTICLES_MANAGE,
  billing: permissions.ADMIN_BILLING_MANAGE,
  content: permissions.ADMIN_CONTENT_MANAGE,
  reviews: permissions.ADMIN_REVIEWS_MANAGE,
  settings: permissions.ADMIN_SETTINGS_MANAGE,
  support: permissions.ADMIN_SUPPORT_MANAGE,
  users: permissions.ADMIN_USERS_MANAGE,
});

const rolePermissionMap = Object.freeze({
  [roles.client]: Object.freeze([
    permissions.BILLING_MANAGE,
    permissions.CAMPAIGNS_MANAGE,
    permissions.DASHBOARD_READ,
    permissions.LEADS_MANAGE,
    permissions.MARKETPLACE_HIRE,
    permissions.MARKETPLACE_READ,
    permissions.MEDIA_UPLOAD,
    permissions.MESSAGES_USE,
    permissions.NETWORK_USE,
    permissions.NOTIFICATIONS_READ,
    permissions.OUTREACH_MANAGE,
    permissions.PORTFOLIO_READ_OWN,
    permissions.PROFILE_READ,
    permissions.PROFILE_UPDATE,
    permissions.PROJECTS_MANAGE,
    permissions.REVIEWS_CREATE,
    permissions.SCRAPER_USE,
  ]),
  [roles.provider]: Object.freeze([
    permissions.BILLING_MANAGE,
    permissions.DASHBOARD_READ,
    permissions.MARKETPLACE_COMPLETE_WORK,
    permissions.MARKETPLACE_PAYOUTS,
    permissions.MARKETPLACE_READ,
    permissions.MEDIA_UPLOAD,
    permissions.MESSAGES_USE,
    permissions.NETWORK_USE,
    permissions.NOTIFICATIONS_READ,
    permissions.PORTFOLIO_READ_OWN,
    permissions.PROFILE_READ,
    permissions.PROFILE_UPDATE,
    permissions.PROJECTS_MANAGE,
    permissions.REVIEWS_CREATE,
    permissions.SERVICES_CREATE,
    permissions.SERVICES_READ_OWN,
  ]),
});

export function normalizeRole(role) {
  return role === "user" ? roles.client : role;
}

function getPrincipal(request) {
  return request.admin ?? request.user ?? null;
}

function normalizePermission(permission) {
  return legacyAdminPermissionAliases[permission] ?? permission;
}

function permissionMatches(grantedPermission, requiredPermission) {
  const granted = normalizePermission(grantedPermission);
  const required = normalizePermission(requiredPermission);

  if (granted === "all" || granted === required) {
    return true;
  }

  if (granted.endsWith(":*")) {
    return required.startsWith(granted.slice(0, -1));
  }

  return false;
}

export function getRolePermissions(role) {
  return [...(rolePermissionMap[normalizeRole(role)] ?? [])];
}

export function hasPermission(principal, permission) {
  if (!principal || !permission) {
    return false;
  }

  const principalRole = normalizeRole(principal.role);
  const explicitPermissions = principal.permissions ?? [];

  if (principalRole === roles.admin) {
    return explicitPermissions.some((granted) =>
      permissionMatches(granted, permission),
    );
  }

  return getRolePermissions(principalRole).some((granted) =>
    permissionMatches(granted, permission),
  );
}

export function requirePermission(...requiredPermissions) {
  return (request, _response, next) => {
    const principal = getPrincipal(request);

    if (!principal) {
      next(new AppError("Authentication required", 401));
      return;
    }

    const missingPermissions = requiredPermissions.filter(
      (permission) => !hasPermission(principal, permission),
    );

    if (missingPermissions.length > 0) {
      next(
        new AppError(
          `Permission required: ${missingPermissions
            .map(normalizePermission)
            .join(", ")}`,
          403,
        ),
      );
      return;
    }

    next();
  };
}

export function requireAnyPermission(...requiredPermissions) {
  return (request, _response, next) => {
    const principal = getPrincipal(request);

    if (!principal) {
      next(new AppError("Authentication required", 401));
      return;
    }

    if (requiredPermissions.some((permission) => hasPermission(principal, permission))) {
      next();
      return;
    }

    next(
      new AppError(
        `One permission required: ${requiredPermissions
          .map(normalizePermission)
          .join(" or ")}`,
        403,
      ),
    );
  };
}

export function authorizeRoles(...allowedRoles) {
  return (request, _response, next) => {
    const principal = getPrincipal(request);

    if (!principal) {
      next(new AppError("Authentication required", 401));
      return;
    }

    const principalRole = normalizeRole(principal.role);
    const normalizedAllowedRoles = allowedRoles.flat().map(normalizeRole);

    if (!normalizedAllowedRoles.includes(principalRole)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}

export const requireRole = authorizeRoles;

export function requireAdminPermission(permission) {
  return (request, _response, next) => {
    const principal = request.admin;

    if (!principal || principal.role !== roles.admin) {
      next(new AppError("Admin access required", 403));
      return;
    }

    if (hasPermission(principal, permission)) {
      next();
      return;
    }

    next(
      new AppError(`Admin permission required: ${normalizePermission(permission)}`, 403),
    );
  };
}
