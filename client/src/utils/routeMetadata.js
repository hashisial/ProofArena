import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  CLIENT_ROUTES,
  DASHBOARD_ROUTES,
  PUBLIC_ROUTES,
  SYSTEM_ROUTES,
} from "../constants/routes.js";
import {
  ROUTE_METADATA_LIST,
  getRouteMetadataByPath,
} from "../config/routeMetadata.js";
import { ROUTE_GROUP } from "../types/routes.js";
import { normalizePathname } from "./routeHelpers.js";

const FALLBACK_BY_GROUP = Object.freeze({
  [ROUTE_GROUP.ADMIN]: ADMIN_ROUTES.ADMIN,
  [ROUTE_GROUP.AUTH]: PUBLIC_ROUTES.HOME,
  [ROUTE_GROUP.CLIENT]: CLIENT_ROUTES.DASHBOARD,
  [ROUTE_GROUP.DASHBOARD]: DASHBOARD_ROUTES.DASHBOARD,
  [ROUTE_GROUP.DYNAMIC]: PUBLIC_ROUTES.HOME,
  [ROUTE_GROUP.PROVIDER]: DASHBOARD_ROUTES.DASHBOARD,
  [ROUTE_GROUP.PUBLIC]: PUBLIC_ROUTES.HOME,
  [ROUTE_GROUP.SYSTEM]: PUBLIC_ROUTES.HOME,
});

const BASE_BREADCRUMBS_BY_GROUP = Object.freeze({
  [ROUTE_GROUP.ADMIN]: {
    href: ADMIN_ROUTES.ADMIN,
    label: "Admin",
  },
  [ROUTE_GROUP.AUTH]: {
    href: PUBLIC_ROUTES.HOME,
    label: "Home",
  },
  [ROUTE_GROUP.CLIENT]: {
    href: CLIENT_ROUTES.DASHBOARD,
    label: "Client",
  },
  [ROUTE_GROUP.DASHBOARD]: {
    href: DASHBOARD_ROUTES.DASHBOARD,
    label: "Dashboard",
  },
  [ROUTE_GROUP.PROVIDER]: {
    href: DASHBOARD_ROUTES.DASHBOARD,
    label: "Dashboard",
  },
  [ROUTE_GROUP.PUBLIC]: {
    href: PUBLIC_ROUTES.HOME,
    label: "Home",
  },
});

function titleCaseSegment(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function isSamePath(left, right) {
  return normalizePathname(left) === normalizePathname(right);
}

function visibleRouteMeta(pathname) {
  const meta = getRouteMetaByPath(pathname);
  return meta?.showInBreadcrumbs === false ? null : meta;
}

function withCurrentState(items) {
  return items.map((item, index) => {
    const isFinal = index === items.length - 1;

    return Object.freeze({
      ...item,
      current: isFinal,
      href: isFinal || item.disabled ? undefined : item.href,
    });
  });
}

function buildFallbackBreadcrumbs(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ current: true, label: "Home" }];
  }

  const items = [
    {
      href: PUBLIC_ROUTES.HOME,
      label: "Home",
    },
  ];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const meta = visibleRouteMeta(href);
    const isFinal = index === segments.length - 1;

    items.push({
      disabled: !meta && !isFinal,
      href: meta && !isFinal ? meta.path : undefined,
      label: meta?.breadcrumbLabel ?? meta?.label ?? titleCaseSegment(segment),
    });
  });

  return withCurrentState(items);
}

export function getRouteMetaByPath(pathname) {
  return getRouteMetadataByPath(normalizePathname(pathname));
}

export function getRouteLabel(pathname) {
  const meta = getRouteMetaByPath(pathname);
  return meta?.breadcrumbLabel ?? meta?.label ?? titleCaseSegment(normalizePathname(pathname).split("/").filter(Boolean).at(-1) ?? "Home");
}

export function getRouteGroup(pathname) {
  return getRouteMetaByPath(pathname)?.group ?? "";
}

export function getRouteFallback(pathname) {
  const group = getRouteGroup(pathname);

  if (group && FALLBACK_BY_GROUP[group]) {
    return FALLBACK_BY_GROUP[group];
  }

  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === ADMIN_ROUTES.ADMIN || normalizedPathname.startsWith(`${ADMIN_ROUTES.ADMIN}/`)) {
    return ADMIN_ROUTES.ADMIN;
  }

  if (normalizedPathname === CLIENT_ROUTES.DASHBOARD || normalizedPathname.startsWith(`${CLIENT_ROUTES.DASHBOARD}/`)) {
    return CLIENT_ROUTES.DASHBOARD;
  }

  if (normalizedPathname === DASHBOARD_ROUTES.DASHBOARD || normalizedPathname.startsWith(`${DASHBOARD_ROUTES.DASHBOARD}/`)) {
    return DASHBOARD_ROUTES.DASHBOARD;
  }

  return PUBLIC_ROUTES.HOME;
}

export function isKnownRoute(pathname) {
  return Boolean(getRouteMetaByPath(pathname));
}

export function isDashboardRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const group = getRouteGroup(pathname);

  return (
    group === ROUTE_GROUP.DASHBOARD ||
    group === ROUTE_GROUP.PROVIDER ||
    normalizedPathname === DASHBOARD_ROUTES.DASHBOARD ||
    normalizedPathname.startsWith(`${DASHBOARD_ROUTES.DASHBOARD}/`)
  );
}

export function isClientRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  return getRouteGroup(pathname) === ROUTE_GROUP.CLIENT ||
    normalizedPathname === CLIENT_ROUTES.DASHBOARD ||
    normalizedPathname.startsWith(`${CLIENT_ROUTES.DASHBOARD}/`);
}

export function isAdminRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  return getRouteGroup(pathname) === ROUTE_GROUP.ADMIN ||
    normalizedPathname === ADMIN_ROUTES.ADMIN ||
    normalizedPathname.startsWith(`${ADMIN_ROUTES.ADMIN}/`);
}

export function isPublicRoute(pathname) {
  const group = getRouteGroup(pathname);
  return group === ROUTE_GROUP.PUBLIC || group === ROUTE_GROUP.AUTH;
}

export function buildBreadcrumbsFromPath(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  const currentMeta = visibleRouteMeta(normalizedPathname);

  if (!currentMeta) {
    return buildFallbackBreadcrumbs(normalizedPathname);
  }

  const base = BASE_BREADCRUMBS_BY_GROUP[currentMeta.group] ?? BASE_BREADCRUMBS_BY_GROUP[ROUTE_GROUP.PUBLIC];
  const items = [];

  if (base && !isSamePath(base.href, currentMeta.path)) {
    const baseMeta = visibleRouteMeta(base.href);

    items.push({
      href: baseMeta?.path ?? base.href,
      label: base.label,
    });
  }

  items.push({
    href: currentMeta.path,
    label: currentMeta.breadcrumbLabel ?? currentMeta.label,
    routeId: currentMeta.id,
  });

  return withCurrentState(items);
}

export function getKnownRoutePaths() {
  return Object.freeze(ROUTE_METADATA_LIST.map((route) => route.path));
}
