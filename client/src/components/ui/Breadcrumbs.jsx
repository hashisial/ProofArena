import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../utils/cn.js";
import { buildBreadcrumbsFromPath } from "../../utils/routeMetadata.js";

function normalizeItem(item, index, total) {
  const current = Boolean(item.current) || index === total - 1;

  return {
    current,
    disabled: Boolean(item.disabled),
    hidden: Boolean(item.hidden),
    href: item.href ?? item.path,
    label: item.label,
  };
}

export function Breadcrumbs({
  className = "",
  items,
  pathname,
}) {
  const location = useLocation();
  const sourceItems = items ?? buildBreadcrumbsFromPath(pathname ?? location.pathname);
  const normalizedItems = sourceItems
    .map((item, index) => normalizeItem(item, index, sourceItems.length))
    .filter((item) => !item.hidden && item.label);

  if (normalizedItems.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-bold text-[var(--color-text-muted)]">
        {normalizedItems.map((item, index) => {
          const key = `${item.label}-${index}`;
          const isLinked = item.href && !item.current && !item.disabled;

          return (
            <li className="flex min-w-0 items-center gap-1" key={key}>
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[var(--color-border-strong)]"
                />
              ) : null}
              {isLinked ? (
                <Link
                  className="max-w-[10rem] truncate rounded-md px-1.5 py-1 text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:max-w-[14rem]"
                  to={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={item.current ? "page" : undefined}
                  className={cn(
                    "max-w-[12rem] truncate rounded-md px-1.5 py-1 sm:max-w-[18rem]",
                    item.current
                      ? "text-[var(--color-foreground)]"
                      : "text-[var(--color-text-muted)]",
                    item.disabled && "opacity-70",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
