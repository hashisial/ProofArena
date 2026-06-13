import { Outlet, useLocation } from "react-router-dom";
import { BackButton } from "../components/common/BackButton.jsx";
import { Footer } from "../components/common/Footer.jsx";
import { PublicNavbar } from "../components/navigation/PublicNavbar.jsx";
import { ROUTES } from "../constants/index.js";
import { cn } from "../utils/cn.js";

export function PublicLayout({
  children,
  className = "",
  mainClassName = "",
  showFooter = true,
  showNavbar = true,
}) {
  const location = useLocation();
  const showBack = location.pathname !== ROUTES.HOME;

  return (
    <div
      className={cn(
        "flex min-h-svh min-w-0 flex-col overflow-x-clip bg-[#FFFFFF] text-[#1C1917]",
        className,
      )}
      data-layout="public"
    >
      <a
        className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-[#3F6212] px-4 py-2 text-sm font-bold text-white shadow-lg transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      {showNavbar ? <PublicNavbar /> : null}
      <main className={cn("min-w-0 flex-1", mainClassName)} id="main-content" tabIndex={-1}>
        {showBack ? (
          <div className="mx-auto flex w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
            <BackButton fallbackPath={ROUTES.HOME} iconOnly />
          </div>
        ) : null}
        {children ?? <Outlet />}
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}
