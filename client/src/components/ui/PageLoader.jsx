import { Spinner } from "./Spinner.jsx";

export function PageLoader({
  description = "Verifying your ProofArena session securely.",
  title = "Preparing your outcome workspace",
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-white px-6 text-center">
      <div>
        <Spinner className="mx-auto" size="lg" />
        <h1 className="mt-5 text-2xl font-black tracking-normal text-[#1C1917]">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">{description}</p>
      </div>
    </div>
  );
}
