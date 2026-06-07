import { Outlet } from "react-router-dom";
import { Footer } from "../components/common/Footer.jsx";
import { PageQuickActions } from "../components/common/PageQuickActions.jsx";
import { PublicNavbar } from "../components/navigation/PublicNavbar.jsx";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#FBF9FF] text-[#07030D]">
      <PublicNavbar />
      <main className="min-w-0">
        <Outlet />
      </main>
      <Footer />
      <PageQuickActions />
    </div>
  );
}
