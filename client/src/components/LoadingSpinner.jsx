export function LoadingSpinner({ label = "Loading data..." }) {
  return (
    <div className="premium-surface flex min-h-56 flex-col items-center justify-center rounded-[2rem] px-6 py-12 text-center">
      <div className="relative z-10 h-11 w-11 animate-spin rounded-full border-2 border-[#3F6212]/20 border-t-[#3F6212]" />
      <p className="relative z-10 mt-5 text-sm font-semibold text-black/56">{label}</p>
    </div>
  );
}
