import { Outlet } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo.jsx";
import { BackButton } from "../components/common/BackButton.jsx";
import { PRODUCT_TAGLINE, ROUTES } from "../constants/index.js";
import { cn } from "../utils/cn.js";

export function AuthLayout({
  children,
  className = "",
  contentClassName = "",
}) {
  return (
    <div
      className={cn(
        "grid min-h-svh min-w-0 overflow-x-clip bg-[#FFFFFF] lg:grid-cols-[0.95fr_1.05fr]",
        className,
      )}
      data-layout="auth"
    >
      <a
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-[#3F6212] px-4 py-2 text-sm font-bold text-white shadow-lg transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <aside
        aria-label="ProofArena introduction"
        className="hidden min-h-svh border-r border-[#E7E5E4] bg-[#FEFCE8] p-10 lg:grid lg:content-between"
      >
        <BrandLogo size="lg" />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            ProofArena by ScaleOps
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-none tracking-[-0.06em] text-[#1C1917]">
            {PRODUCT_TAGLINE}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#44403C]">
            Create measurable challenges, track milestones, and verify proof before reputation is earned.
          </p>
        </div>
      </aside>
      <main
        className="grid min-h-svh min-w-0 place-items-center bg-[radial-gradient(circle_at_top_right,rgba(63,98,18,0.08),transparent_32%),#FFFFFF] px-4 py-8 sm:px-6 sm:py-10"
        id="main-content"
        tabIndex={-1}
      >
        <div className={cn("w-full max-w-md", contentClassName)}>
          <BackButton className="mb-5" fallbackPath={ROUTES.HOME} iconOnly />
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
