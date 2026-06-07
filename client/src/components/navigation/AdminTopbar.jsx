import { Bell, Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useNotificationStore } from "../../store/useNotificationStore.js";
import { useUIStore } from "../../store/useUIStore.js";
import { getInitials } from "../../utils/index.js";

function getUserName(user) {
  return user?.fullName || user?.name || user?.username || user?.email || "ScaleOps Admin";
}

function getAvatarUrl(user) {
  return typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url ?? "";
}

export function AdminTopbar({ title = "ProofArena Control Center" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebarCollapsed = useUIStore((state) => state.toggleSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const userName = getUserName(user);
  const avatarUrl = getAvatarUrl(user);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[#E9E2F3] bg-white/94 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button
          aria-label="Open admin sidebar"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E9E2F3] bg-white text-[#493C5E] shadow-[0_12px_30px_rgba(31, 14, 54, 0.06)] transition hover:border-[#7C3AED]/25 hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12 lg:hidden"
          onClick={toggleSidebar}
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E9E2F3] bg-white text-[#493C5E] shadow-[0_12px_30px_rgba(31, 14, 54, 0.06)] transition hover:border-[#7C3AED]/25 hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12 lg:grid"
          onClick={toggleSidebarCollapsed}
          type="button"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />
          ) : (
            <PanelLeftClose aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="hidden text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED] sm:block">
            ProofArena by ScaleOps
          </p>
          <h1 className="truncate text-xl font-black tracking-[-0.04em] text-[#07030D] sm:mt-1 sm:text-2xl">
            {title}
          </h1>
        </div>

        <label className="relative hidden min-w-[18rem] max-w-sm flex-1 lg:block">
          <span className="sr-only">Search admin records</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A69AB5]"
          />
          <input
            aria-label="Search users, challenges, proof"
            className="h-11 w-full rounded-2xl border border-[#E9E2F3] bg-[#FAFAFA] pl-11 pr-4 text-sm font-medium text-[#07030D] outline-none transition placeholder:text-[#A69AB5] focus:border-[#7C3AED]/45 focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
            placeholder="Search users, challenges, proof..."
            type="search"
          />
        </label>

        <a
          aria-label="Open admin alerts"
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#E9E2F3] bg-white text-[#493C5E] shadow-[0_12px_30px_rgba(31, 14, 54, 0.06)] transition hover:border-[#7C3AED]/25 hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12"
          href={ROUTES.ADMIN_REPORTS}
        >
          <Bell aria-hidden="true" className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#7C3AED]" />
          {unreadCount > 0 ? <span className="sr-only">{unreadCount} unread admin alerts</span> : null}
        </a>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={`Open admin menu for ${userName}`}
            className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#E9E2F3] bg-white px-2.5 py-2 shadow-[0_12px_30px_rgba(31, 14, 54, 0.06)] transition hover:border-[#7C3AED]/25 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/12"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            {avatarUrl ? (
              <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#7C3AED] text-xs font-black text-white">
                {getInitials(userName)}
              </span>
            )}
            <span className="hidden min-w-0 pr-2 text-left sm:block">
              <span className="block max-w-40 truncate text-sm font-black text-[#07030D]">{userName}</span>
              <span className="block text-xs font-bold text-[#6F657C]">Platform Admin</span>
            </span>
          </button>

          {menuOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl border border-[#E9E2F3] bg-white p-2 shadow-[0_24px_70px_rgba(31, 14, 54, 0.14)]"
              role="menu"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-black text-[#07030D]">{userName}</p>
                <Badge className="mt-2" size="sm" variant="primary">
                  Admin
                </Badge>
              </div>
              <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#493C5E] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" href={ROUTES.ADMIN} role="menuitem">
                Admin overview
              </a>
              <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#493C5E] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" href={ROUTES.ADMIN_SETTINGS} role="menuitem">
                Settings
              </a>
              <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-[#DC2626] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" onClick={handleLogout} role="menuitem" type="button">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
