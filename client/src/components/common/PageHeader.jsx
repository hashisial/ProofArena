import { BackButton } from "./BackButton.jsx";

export function PageHeader({
  actions,
  backFallback,
  description,
  eyebrow,
  showBack = false,
  title,
}) {
  return (
    <header className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {showBack ? <BackButton className="mb-4" fallbackPath={backFallback} /> : null}
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h1 className="mt-2 break-words text-3xl font-black leading-tight tracking-normal text-[#1C1917] sm:text-4xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-[#78716C] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
