// @ts-check

import { matchesRoutePattern, normalizePathname } from "./routeHelpers.js";

function getItemHref(item) {
  return item?.href || item?.path || "";
}

function matchesActivePattern(pathname, pattern) {
  if (!pattern) {
    return false;
  }

  if (pattern instanceof RegExp) {
    return pattern.test(pathname);
  }

  const normalizedPattern = normalizePathname(String(pattern));

  if (normalizedPattern.endsWith("/*")) {
    const basePattern = normalizedPattern.slice(0, -2);
    return pathname === basePattern || pathname.startsWith(`${basePattern}/`);
  }

  return normalizedPattern.includes(":")
    ? matchesRoutePattern(pathname, normalizedPattern)
    : pathname === normalizedPattern;
}

export function isNavigationItemActive(item, pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const href = normalizePathname(getItemHref(item));
  const activePatterns = item?.activePatterns ?? [];

  if (activePatterns.some((pattern) => matchesActivePattern(normalizedPathname, pattern))) {
    return true;
  }

  if (item?.children?.some((child) => isNavigationItemActive(child, normalizedPathname))) {
    return true;
  }

  if (!href) {
    return false;
  }

  if (item?.exactMatch) {
    return normalizedPathname === href;
  }

  return normalizedPathname === href || (href !== "/" && normalizedPathname.startsWith(`${href}/`));
}

export function hasActiveNavigationChild(item, pathname) {
  return Boolean(item?.children?.some((child) => isNavigationItemActive(child, pathname)));
}
