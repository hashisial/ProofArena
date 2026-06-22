// @ts-check

export const ROUTE_GROUP = Object.freeze({
  ADMIN: "admin",
  AUTH: "auth",
  CLIENT: "client",
  DASHBOARD: "dashboard",
  DYNAMIC: "dynamic",
  PROVIDER: "provider",
  PUBLIC: "public",
  SYSTEM: "system",
});

export const ROUTE_ACCESS_MODE = Object.freeze({
  PROTECTED: "protected",
  PUBLIC: "public",
  PUBLIC_ONLY: "public_only",
});

export const ROUTE_VISIBILITY = Object.freeze({
  HIDDEN: "hidden",
  NAVIGATION: "navigation",
  SIDEBAR: "sidebar",
});

/**
 * @typedef {typeof ROUTE_GROUP[keyof typeof ROUTE_GROUP]} RouteGroup
 * @typedef {typeof ROUTE_ACCESS_MODE[keyof typeof ROUTE_ACCESS_MODE]} RouteAccessMode
 *
 * @typedef {Readonly<{
 *   id: string,
 *   path: string,
 *   label: string,
 *   description: string,
 *   group: RouteGroup,
 *   breadcrumbLabel: string,
 *   roles: readonly string[],
 *   permissions: readonly string[],
 *   showInNavigation: boolean,
 *   showInSidebar: boolean,
 *   showInBreadcrumbs: boolean,
 *   isProtected: boolean,
 *   isPublic: boolean,
 *   isDynamic: boolean,
 *   futureFeatureFlags: readonly string[],
 *   futureAnalyticsId: string,
 *   futureSeoTitle: string,
 *   futureSeoDescription: string,
 *   futurePageTitle: string,
 *   futureTrackingId: string,
 *   futureMenuBadge: string,
 *   iconKey: string,
 *   mobilePriority: number,
 * }>} RouteMetadata
 */
