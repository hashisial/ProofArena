import { Spinner } from "./Spinner.jsx";

export function PageLoader({
  description = "Verifying your ProofArena session securely.",
  title = "Preparing your outcome workspace",
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--color-background)] px-6 text-center">
      <div>
        <Spinner className="mx-auto" size="lg" />
        <h1 className="mt-5 text-2xl font-black tracking-normal text-[var(--color-foreground)]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      </div>
    </div>
  );
}
