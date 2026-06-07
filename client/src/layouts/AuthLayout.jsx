import { Outlet } from "react-router-dom";
import { PageQuickActions } from "../components/common/PageQuickActions.jsx";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "../constants/index.js";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen overflow-x-hidden bg-[#FBF9FF] lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="hidden border-r border-[#E9E2F3] bg-[#F8F4FF] p-10 lg:grid lg:content-between">
        <a className="text-2xl font-black tracking-[-0.05em] text-[#07030D]" href="/">
          {PRODUCT_NAME}
        </a>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
            ProofArena by ScaleOps
          </p>
          <h1 className="mt-4 max-w-xl text-5xl font-black leading-none tracking-[-0.06em] text-[#07030D]">
            {PRODUCT_TAGLINE}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#493C5E]">
            Create measurable challenges, track milestones, and verify proof before reputation is earned.
          </p>
        </div>
      </aside>
      <main className="grid min-w-0 place-items-center px-4 py-8 sm:px-6 sm:py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <PageQuickActions />
    </div>
  );
}
