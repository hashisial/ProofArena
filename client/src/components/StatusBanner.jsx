export function StatusBanner({ children, className = "", tone = "info" }) {
  const toneClasses = {
    error: "border-[#3F6212]/30 bg-[#F7FEE7] text-[#365314]",
    info: "border-black/10 bg-white text-black/72",
    success: "border-[#3F6212]/20 bg-[#3F6212] text-white",
  };

  return (
    <div className={`status-banner status-banner-${tone} rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone] ?? toneClasses.info} ${className}`}>
      {children}
    </div>
  );
}
