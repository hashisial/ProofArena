import { cn } from "../../utils/cn.js";
import { getRouteFallback, getRouteMetaByPath } from "../../utils/routeMetadata.js";
import { Breadcrumbs } from "./Breadcrumbs.jsx";
import { Badge } from "./Badge.jsx";
import { UniversalBackButton } from "./UniversalBackButton.jsx";
import { useLocation } from "react-router-dom";

function renderBadge(badge) {
  if (!badge) {
    return null;
  }

  if (typeof badge === "string" || typeof badge === "number") {
    return <Badge variant="primary">{badge}</Badge>;
  }

  return badge;
}

function renderMetadata(metadata) {
  if (!metadata) {
    return null;
  }

  const items = Array.isArray(metadata) ? metadata : [metadata];

  return (
    <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[var(--color-text-muted)]">
      {items.map((item, index) => {
        if (typeof item === "string" || typeof item === "number") {
          return (
            <div className="min-w-0" key={`${item}-${index}`}>
              <dd className="truncate">{item}</dd>
            </div>
          );
        }

        return (
          <div className="min-w-0" key={`${item.label ?? "metadata"}-${index}`}>
            {item.label ? (
              <dt className="sr-only">{item.label}</dt>
            ) : null}
            <dd className="truncate">
              {item.label ? <span className="text-[var(--color-text-secondary)]">{item.label}: </span> : null}
              {item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function PageHeader({
  action,
  actions,
  backFallback,
  backFallbackHref,
  badge,
  breadcrumbs,
  className = "",
  description,
  eyebrow,
  metadata,
  showBackButton,
  showBack = false,
  showBreadcrumbs = false,
  title,
}) {
  const location = useLocation();
  const routeMeta = getRouteMetaByPath(location.pathname);
  const actionContent = action ?? actions;
  const resolvedDescription = description ?? routeMeta?.description;
  const resolvedEyebrow = eyebrow;
  const resolvedTitle = title ?? routeMeta?.futurePageTitle ?? routeMeta?.label;
  const shouldShowBackButton = showBackButton === "auto"
    ? getRouteFallback(location.pathname) !== location.pathname
    : Boolean(showBackButton ?? showBack);
  const shouldShowBreadcrumbs = Boolean(showBreadcrumbs || breadcrumbs);

  return (
    <header className={cn("min-w-0", className)}>
      {shouldShowBreadcrumbs ? (
        <Breadcrumbs
          className="mb-4"
          items={breadcrumbs}
          pathname={location.pathname}
        />
      ) : null}

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex min-w-0 flex-wrap items-center gap-3">
            {shouldShowBackButton ? (
              <UniversalBackButton
                fallbackHref={backFallbackHref ?? backFallback}
                variant="minimal"
              />
            ) : null}
            {resolvedEyebrow ? (
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
                {resolvedEyebrow}
              </p>
            ) : null}
            {renderBadge(badge)}
          </div>

          {resolvedTitle ? (
            <h1 className="page-title mt-2 max-w-5xl break-words">
              {resolvedTitle}
            </h1>
          ) : null}

          {resolvedDescription ? (
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[var(--color-text-muted)] sm:text-base">
              {resolvedDescription}
            </p>
          ) : null}

          {renderMetadata(metadata)}
        </div>
        {actionContent ? (
          <div className="flex min-w-0 shrink-0 flex-wrap gap-3 sm:justify-end">
            {actionContent}
          </div>
        ) : null}
      </div>
    </header>
  );
}
