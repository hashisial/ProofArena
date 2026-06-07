export function StatusBanner({ children, className = "", tone = "info" }) {
  const toneClasses = {
    error: "border-[#7C3AED]/30 bg-[#F5F3FF] text-[#5B21B6]",
    info: "border-black/10 bg-white text-black/72",
    success: "border-[#7C3AED]/20 bg-[#7C3AED] text-white",
  };

  return (
    <div className={`status-banner status-banner-${tone} rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone] ?? toneClasses.info} ${className}`}>
      {children}
    </div>
  );
}
