import { Footer } from "./Footer.jsx";
import { Header } from "./Header.jsx";
import { ROUTES } from "../constants/index.js";
import { useRoutePath } from "../hooks/useRoutePath.js";

const appRoutes = new Set([
  ROUTES.ADMIN,
  ROUTES.DASHBOARD,
  ROUTES.LEADS,
  ROUTES.MARKETPLACE,
  ROUTES.MESSAGES,
  ROUTES.NETWORK,
  ROUTES.NOTIFICATIONS,
  ROUTES.PAYMENTS,
  ROUTES.PROFILE,
  ROUTES.PROJECTS,
  ROUTES.SCRAPER,
  ROUTES.SETTINGS,
]);

export function Layout({ children }) {
  const path = useRoutePath();
  const isAppRoute = appRoutes.has(path) ||
    path.startsWith(`${ROUTES.ADMIN}/`) ||
    path.startsWith(`${ROUTES.DASHBOARD}/`);

  return (
    <div className="min-h-screen bg-white text-[#07030D]">
      {isAppRoute ? null : <Header />}
      <main>{children}</main>
      {isAppRoute ? null : <Footer />}
    </div>
  );
}
