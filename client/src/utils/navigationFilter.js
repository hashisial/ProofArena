// @ts-check

import {
  canViewNavItem,
  isAuthenticated as isUserAuthenticated,
  normalizeRole,
  shouldDisableNavItem,
} from "./accessPolicy.js";

function hasFeatureFlag(item, featureFlags = {}, includeFuture = false) {
  if ((item.future || item.comingSoon) && !includeFuture) {
    return false;
  }

  if (!item.featureFlag) {
    return true;
  }

  return Boolean(featureFlags[item.featureFlag]);
}

function isVisibleOnSurface(item, surface) {
  if ((surface === "mobile" || surface === "mobilePublicNav") && item.showInMobile === false) {
    return false;
  }

  if (surface === "sidebar" || surface === "providerSidebar" || surface === "clientSidebar" || surface === "adminSidebar") {
    return item.showInSidebar !== false;
  }

  if (surface === "publicHeader" && item.showInHeader === false) {
    return false;
  }

  if (surface === "publicFooter" && item.showInFooter === false) {
    return false;
  }

  return true;
}

export function canShowNavigationItem(item, context = {}) {
  const {
    featureFlags = {},
    includeDisabled = true,
    includeFuture = true,
    isAuthenticated,
    role,
    surface = "sidebar",
    user,
  } = context;
  const resolvedRole = role ?? normalizeRole(user);
  const resolvedUser = user ?? (resolvedRole ? { role: resolvedRole } : null);
  const authenticated = isAuthenticated ?? isUserAuthenticated(user);

  return (
    isVisibleOnSurface(item, surface) &&
    hasFeatureFlag(item, featureFlags, includeFuture) &&
    canViewNavItem(item, resolvedUser, {
      ...context,
      isAuthenticated: authenticated,
      role: resolvedRole,
    }) &&
    (includeDisabled || !shouldDisableNavItem(item, resolvedUser, context))
  );
}

export function filterNavigationItems(items = [], context = {}) {
  return items
    .filter((item) => canShowNavigationItem(item, context))
    .map((item) => {
      const user = context.user ?? (context.role ? { role: context.role } : null);
      const isDisabled = shouldDisableNavItem(item, user, context);
      const normalizedItem = isDisabled
        ? {
            ...item,
            disabled: true,
            href: item.future || item.comingSoon ? "" : item.href,
          }
        : item;

      if (!item.children?.length) {
        return normalizedItem;
      }

      return {
        ...normalizedItem,
        children: filterNavigationItems(item.children, context),
      };
    })
    .filter((item) => !item.children || item.children.length > 0 || item.href || item.path);
}

export function filterNavigationSections(sections = [], context = {}) {
  return sections
    .map((section) => ({
      ...section,
      links: filterNavigationItems(section.links ?? section.items ?? [], context),
    }))
    .filter((section) => section.links.length > 0);
}
