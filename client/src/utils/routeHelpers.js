// @ts-check

function encodeRouteValue(value) {
  return encodeURIComponent(String(value ?? ""));
}

export function buildRoute(pattern, params = {}) {
  return Object.entries(params).reduce(
    (route, [key, value]) => route.replace(`:${key}`, encodeRouteValue(value)),
    pattern,
  );
}

export function normalizePathname(pathname) {
  if (typeof pathname !== "string" || pathname.length === 0) {
    return "";
  }

  const normalized = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;

  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;
}

export function matchesRoutePattern(pathname, pattern) {
  const pathSegments = normalizePathname(pathname).split("/").filter(Boolean);
  const patternSegments = normalizePathname(pattern).split("/").filter(Boolean);

  if (pathSegments.length !== patternSegments.length) {
    return false;
  }

  return patternSegments.every(
    (segment, index) => segment.startsWith(":") || segment === pathSegments[index],
  );
}

export function isDynamicRoutePath(path) {
  return String(path ?? "").split("/").some((segment) => segment.startsWith(":"));
}

export function createRouteMap(routeMetadataList) {
  return Object.freeze(
    routeMetadataList.reduce((registry, route) => {
      registry[route.id] = route;
      return registry;
    }, {}),
  );
}

export function getRouteById(routeRegistry, routeId) {
  return routeRegistry[routeId] ?? null;
}

export function getRoutesByGroup(routeMetadataList, group) {
  return Object.freeze(routeMetadataList.filter((route) => route.group === group));
}

export function getRouteByPath(routeMetadataList, pathname) {
  const normalizedPathname = normalizePathname(pathname);

  return routeMetadataList.find((route) => {
    const normalizedRoutePath = normalizePathname(route.path);
    return route.isDynamic
      ? matchesRoutePattern(normalizedPathname, normalizedRoutePath)
      : normalizedPathname === normalizedRoutePath;
  }) ?? null;
}

export function assertUniqueRoutePaths(routeMetadataList) {
  const seen = new Map();
  const duplicates = [];

  routeMetadataList.forEach((route) => {
    const normalizedPath = normalizePathname(route.path);
    const previousRouteId = seen.get(normalizedPath);

    if (previousRouteId) {
      duplicates.push({
        path: normalizedPath,
        routeIds: [previousRouteId, route.id],
      });
      return;
    }

    seen.set(normalizedPath, route.id);
  });

  return Object.freeze(duplicates);
}

export function createNavigationItemFromRoute(route) {
  const roles = Object.freeze([...(route.roles ?? [])]);
  const requiredRole = roles.length === 0
    ? undefined
    : roles.length === 1
      ? roles[0]
      : roles;

  return Object.freeze({
    ...(route.futureMenuBadge ? { badge: route.futureMenuBadge } : {}),
    description: route.description,
    exactMatch: Boolean(route.exactMatch),
    href: route.path,
    ...(route.iconKey ? { iconKey: route.iconKey, iconName: route.iconKey } : {}),
    id: route.id,
    label: route.label,
    path: route.path,
    ...(requiredRole ? { requiredRole, roles } : {}),
    routeId: route.id,
    showInMobile: route.showInNavigation ?? route.showInSidebar ?? true,
    showInSidebar: route.showInSidebar ?? route.showInNavigation ?? true,
    type: "link",
  });
}

export function createNavigationItemsFromRouteIds(routeIds, routeRegistry) {
  return Object.freeze(
    routeIds
      .map((routeId) => getRouteById(routeRegistry, routeId))
      .filter(Boolean)
      .map(createNavigationItemFromRoute),
  );
}

export function createNavigationSection(title, routeIds, routeRegistry) {
  return Object.freeze({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    links: createNavigationItemsFromRouteIds(routeIds, routeRegistry),
    title,
  });
}

export function createBreadcrumbItemFromRoute(route, params = {}) {
  return Object.freeze({
    label: route.breadcrumbLabel ?? route.label,
    path: route.isDynamic ? buildRoute(route.path, params) : route.path,
    routeId: route.id,
  });
}

export function getBreadcrumbCandidates(routeMetadataList) {
  return Object.freeze(routeMetadataList.filter((route) => route.showInBreadcrumbs));
}
