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
        "stage3-shell-root flex min-h-svh w-full max-w-full min-w-0 flex-col overflow-x-clip",
        className,
      )}
      data-layout="public"
    >
      <a
        className="shell-skip-link"
        href="#main-content"
      >
        Skip to content
      </a>
      {showNavbar ? <PublicNavbar /> : null}
      <main className={cn("w-full max-w-full min-w-0 flex-1", mainClassName)} id="main-content" tabIndex={-1}>
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
