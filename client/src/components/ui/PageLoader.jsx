import { Spinner } from "./Spinner.jsx";

export function PageLoader({
  description = "Verifying your ProofArena session securely.",
  title = "Preparing your outcome workspace",
}) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center"
      role="status"
    >
      <div>
        <Spinner aria-hidden="true" className="mx-auto" label="" size="lg" />
        <h1 className="mt-5 text-2xl font-black tracking-normal text-[var(--color-foreground)]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  );
}
