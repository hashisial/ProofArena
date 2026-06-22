// @ts-check

export const NAVIGATION_GROUP = Object.freeze({
  ADMIN: "admin",
  CLIENT: "client",
  COMPANY: "company",
  PROVIDER: "provider",
  PUBLIC: "public",
  RESOURCES: "resources",
});

export const NAVIGATION_SURFACE = Object.freeze({
  BREADCRUMB: "breadcrumb",
  DESKTOP: "desktop",
  FOOTER: "footer",
  MOBILE: "mobile",
  SIDEBAR: "sidebar",
});

export const NAVIGATION_ITEM_TYPE = Object.freeze({
  GROUP: "group",
  LINK: "link",
  SECTION: "section",
});

/**
 * @typedef {typeof NAVIGATION_GROUP[keyof typeof NAVIGATION_GROUP]} NavigationGroup
 * @typedef {typeof NAVIGATION_SURFACE[keyof typeof NAVIGATION_SURFACE]} NavigationSurface
 * @typedef {typeof NAVIGATION_ITEM_TYPE[keyof typeof NAVIGATION_ITEM_TYPE]} NavigationItemType
 *
 * @typedef {Readonly<{
 *   activePatterns?: readonly (string | RegExp)[],
 *   badge?: string | number | { label?: string, value?: string | number, variant?: string },
 *   blockedRoles?: readonly string[],
 *   children?: readonly NavigationItem[],
 *   comingSoon?: boolean,
 *   description: string,
 *   disabled?: boolean,
 *   exactMatch?: boolean,
 *   featureFlag?: string,
 *   future?: boolean,
 *   hideWhenAuth?: boolean,
 *   href: string,
 *   iconKey?: string,
 *   iconName?: string,
 *   id?: string,
 *   label: string,
 *   path: string,
 *   permissions?: readonly string[],
 *   priority?: number,
 *   requiredRole?: string | readonly string[],
 *   requiresAuth?: boolean,
 *   roles?: readonly string[],
 *   routeId: string,
 *   showInFooter?: boolean,
 *   showInHeader?: boolean,
 *   showInMobile?: boolean,
 *   showInSidebar?: boolean,
 *   type?: NavigationItemType,
 * }>} NavigationItem
 *
 * @typedef {Readonly<{
 *   id?: string,
 *   title: string,
 *   links: readonly NavigationItem[],
 * }>} NavigationSection
 */
