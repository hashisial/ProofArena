export const APP_ROLES = Object.freeze({
  admin: "admin",
  client: "client",
  provider: "provider",
  support: "support",
});

export const WORKSPACE_ROLES = Object.freeze([APP_ROLES.client, APP_ROLES.provider]);

export const APP_PERMISSIONS = Object.freeze({
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

const ROLE_PERMISSIONS = Object.freeze({
  [APP_ROLES.client]: Object.freeze([
    APP_PERMISSIONS.BILLING_MANAGE,
    APP_PERMISSIONS.CAMPAIGNS_MANAGE,
    APP_PERMISSIONS.DASHBOARD_READ,
    APP_PERMISSIONS.LEADS_MANAGE,
    APP_PERMISSIONS.MARKETPLACE_HIRE,
    APP_PERMISSIONS.MARKETPLACE_READ,
    APP_PERMISSIONS.MEDIA_UPLOAD,
    APP_PERMISSIONS.MESSAGES_USE,
    APP_PERMISSIONS.NETWORK_USE,
    APP_PERMISSIONS.NOTIFICATIONS_READ,
    APP_PERMISSIONS.OUTREACH_MANAGE,
    APP_PERMISSIONS.PORTFOLIO_READ_OWN,
    APP_PERMISSIONS.PROFILE_READ,
    APP_PERMISSIONS.PROFILE_UPDATE,
    APP_PERMISSIONS.PROJECTS_MANAGE,
    APP_PERMISSIONS.REVIEWS_CREATE,
    APP_PERMISSIONS.SCRAPER_USE,
  ]),
  [APP_ROLES.provider]: Object.freeze([
    APP_PERMISSIONS.BILLING_MANAGE,
    APP_PERMISSIONS.DASHBOARD_READ,
    APP_PERMISSIONS.MARKETPLACE_COMPLETE_WORK,
    APP_PERMISSIONS.MARKETPLACE_PAYOUTS,
    APP_PERMISSIONS.MARKETPLACE_READ,
    APP_PERMISSIONS.MEDIA_UPLOAD,
    APP_PERMISSIONS.MESSAGES_USE,
    APP_PERMISSIONS.NETWORK_USE,
    APP_PERMISSIONS.NOTIFICATIONS_READ,
    APP_PERMISSIONS.PORTFOLIO_READ_OWN,
    APP_PERMISSIONS.PROFILE_READ,
    APP_PERMISSIONS.PROFILE_UPDATE,
    APP_PERMISSIONS.PROJECTS_MANAGE,
    APP_PERMISSIONS.REVIEWS_CREATE,
    APP_PERMISSIONS.SERVICES_CREATE,
    APP_PERMISSIONS.SERVICES_READ_OWN,
  ]),
});

export function normalizeRole(role) {
  return role === "user" ? APP_ROLES.client : role;
}

export function hasRole(user, allowedRoles = WORKSPACE_ROLES) {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(normalizeRole(user.role));
}

export function getRolePermissions(role) {
  return [...(ROLE_PERMISSIONS[normalizeRole(role)] ?? [])];
}

export function hasPermission(user, permission) {
  if (!user || !permission) {
    return false;
  }

  const userPermissions = user.permissions?.includes("all")
    ? ["all"]
    : Array.from(new Set([...getRolePermissions(user.role), ...(user.permissions ?? [])]));

  return userPermissions.some(
    (grantedPermission) =>
      grantedPermission === "all" ||
      grantedPermission === permission ||
      (grantedPermission.endsWith(":*") &&
        permission.startsWith(grantedPermission.slice(0, -1))),
  );
}
