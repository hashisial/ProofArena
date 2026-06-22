import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn.js";
import { getRouteFallback } from "../../utils/routeMetadata.js";

const variantClasses = {
  button:
    "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] hover:border-[var(--color-primary-border)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)]",
  ghost:
    "border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-hover)]",
  minimal:
    "border-transparent bg-transparent px-0 text-[var(--color-text-muted)] hover:text-[var(--color-primary-hover)]",
};

function normalizeInternalPath(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "";
  }

  return value;
}

function getLocationStatePath(state) {
  const from = state?.from;

  if (typeof from === "string") {
    return normalizeInternalPath(from);
  }

  if (from?.pathname) {
    return normalizeInternalPath(`${from.pathname}${from.search ?? ""}${from.hash ?? ""}`);
  }

  return "";
}

function hasSafeSameOriginReferrer(currentPathname) {
  if (typeof window === "undefined" || typeof document === "undefined" || !document.referrer) {
    return false;
  }

  try {
    const referrer = new URL(document.referrer);
    const current = new URL(window.location.href);

    return referrer.origin === current.origin && referrer.pathname !== currentPathname;
  } catch {
    return false;
  }
}

function hasInternalRouterHistory() {
  if (typeof window === "undefined") {
    return false;
  }

  const index = window.history.state?.idx;
  return Number.isInteger(index) && index > 0;
}

export function UniversalBackButton({
  ariaLabel,
  className = "",
  fallbackHref,
  iconOnly = false,
  label = "Back",
  variant = "ghost",
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackPath = normalizeInternalPath(fallbackHref) || getRouteFallback(location.pathname);
  const statePath = getLocationStatePath(location.state);
  const resolvedAriaLabel = ariaLabel ?? (iconOnly ? label : "Go back");

  function handleBack() {
    if (statePath && statePath !== `${location.pathname}${location.search}${location.hash}`) {
      navigate(statePath);
      return;
    }

    if (hasInternalRouterHistory() || hasSafeSameOriginReferrer(location.pathname)) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath, { replace: false });
  }

  return (
    <button
      aria-label={resolvedAriaLabel}
      className={cn(
        "inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border px-3.5 text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        iconOnly ? "h-10 w-10 px-0" : "",
        variantClasses[variant] ?? variantClasses.ghost,
        className,
      )}
      onClick={handleBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4 shrink-0 stroke-[2.75]" />
      {iconOnly ? null : <span className="truncate">{label}</span>}
    </button>
  );
}
