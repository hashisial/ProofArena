const floatingObjects = [
  "left-[5%] top-[15%] h-32 w-32 rounded-[2rem] border border-[#A78BFA]/35 bg-[#7C3AED]/15 shadow-[0_0_70px_rgba(124, 58, 237, 0.22)] animate-drift-slow",
  "right-[8%] top-[24%] h-40 w-40 rounded-full border border-white/20 bg-white/[0.055] shadow-[0_0_90px_rgba(167, 139, 250, 0.16)] animate-orbit-wide",
  "left-[18%] top-[58%] h-24 w-24 rounded-full border border-[#7C3AED]/40 bg-[#A78BFA]/14 animate-float-diagonal",
  "right-[18%] top-[68%] h-28 w-28 rotate-45 rounded-[1.4rem] border border-[#A78BFA]/30 bg-[#5B21B6]/16 animate-spin-soft",
  "left-[42%] top-[22%] h-16 w-48 rounded-full border border-[#A78BFA]/25 bg-white/[0.045] animate-wave-slide",
  "right-[35%] top-[82%] h-20 w-20 rounded-[1.6rem] border border-white/15 bg-[#7C3AED]/12 animate-breathe-rotate",
  "left-[72%] top-[48%] h-12 w-12 rounded-full bg-[#A78BFA]/35 blur-sm animate-ping-slow",
  "left-[8%] top-[78%] h-44 w-44 rounded-full border border-dashed border-[#A78BFA]/18 bg-[#7C3AED]/8 animate-orbit-reverse",
  "right-[5%] top-[86%] h-24 w-56 rounded-full border border-white/12 bg-white/[0.035] animate-depth-float",
  "left-[58%] top-[66%] h-28 w-28 rounded-[2rem] border border-[#7C3AED]/24 bg-[#A78BFA]/10 animate-slow-sweep",
];

export function HomeMotionBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden overflow-hidden sm:block"
    >
      <div className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A78BFA]/10 animate-orbit-slow" />
      <div className="absolute left-[12%] top-[12%] h-96 w-96 rounded-full bg-[#7C3AED]/16 blur-3xl animate-pulse-glow" />
      <div className="absolute right-[10%] bottom-[12%] h-[28rem] w-[28rem] rounded-full bg-[#A78BFA]/12 blur-3xl animate-drift-slow" />
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/30 to-transparent animate-shimmer-line" />
      <div className="absolute left-[10%] top-[38%] h-px w-80 rotate-12 bg-gradient-to-r from-transparent via-[#A78BFA]/45 to-transparent animate-shimmer-line" />
      <div className="absolute right-[14%] top-[56%] h-px w-96 -rotate-12 bg-gradient-to-r from-transparent via-[#7C3AED]/55 to-transparent animate-shimmer-line" />
      <div className="absolute left-0 top-[68%] h-px w-[150vw] -rotate-6 bg-gradient-to-r from-transparent via-[#A78BFA]/20 to-transparent animate-slow-sweep" />
      <div className="absolute left-[28%] top-[34%] h-[22rem] w-[22rem] rounded-full border border-dashed border-[#A78BFA]/16 animate-spin-soft" />
      <div className="absolute right-[22%] top-[8%] h-[18rem] w-[18rem] rounded-full border border-dashed border-[#7C3AED]/18 animate-orbit-slow" />
      <div className="absolute right-[30%] bottom-[2%] h-[26rem] w-[26rem] rounded-full border border-[#A78BFA]/8 animate-orbit-reverse" />

      {floatingObjects.map((className) => (
        <div className={`absolute backdrop-blur-md ${className}`} key={className} />
      ))}
    </div>
  );
}
