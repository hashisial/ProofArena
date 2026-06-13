import { cn } from "../../utils/cn.js";
import { BackButton } from "../common/BackButton.jsx";

export function PageHeader({
  action,
  actions,
  backFallback,
  className = "",
  description,
  eyebrow,
  showBack = false,
  title,
}) {
  const actionContent = action ?? actions;

  return (
    <header className={cn("min-w-0", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {showBack ? <BackButton className="mb-4" fallbackPath={backFallback} /> : null}
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="page-title mt-2 break-words">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[var(--color-text-muted)] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actionContent ? <div className="flex shrink-0 flex-wrap gap-3">{actionContent}</div> : null}
      </div>
    </header>
  );
}
