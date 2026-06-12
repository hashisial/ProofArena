export function PageFallback({ label = "Loading page..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-5 text-center text-black/58">
      <div>
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[#3F6212]/20 border-t-[#3F6212]" />
        <p className="mt-5 text-sm font-semibold">{label}</p>
      </div>
    </div>
  );
}
