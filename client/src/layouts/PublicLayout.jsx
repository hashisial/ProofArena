import { Outlet } from "react-router-dom";
import { Footer } from "../components/common/Footer.jsx";
import { PageQuickActions } from "../components/common/PageQuickActions.jsx";
import { PublicNavbar } from "../components/navigation/PublicNavbar.jsx";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#FEFCE8] text-[#1C1917]">
      <PublicNavbar />
      <main className="min-w-0">
        <Outlet />
      </main>
      <Footer />
      <PageQuickActions />
    </div>
  );
}
