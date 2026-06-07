import { Home } from "lucide-react";
import { ROUTES } from "../../constants/index.js";

export function PageQuickActions() {
  return (
    <nav
      aria-label="Quick page shortcuts"
      className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-wrap justify-end gap-2"
    >
      <a
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E9E2F3] bg-white/95 px-4 py-2 text-sm font-black text-[#07030D] shadow-[0_18px_45px_rgba(31, 14, 54, 0.14)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#7C3AED]/45 hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
        href={ROUTES.HOME}
      >
        <Home aria-hidden="true" className="h-4 w-4" />
        <span>Home</span>
      </a>
    </nav>
  );
}
