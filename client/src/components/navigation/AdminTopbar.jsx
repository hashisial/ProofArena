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
  const menuButtonRef = useRef(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const userName = getUserName(user);
  const avatarUrl = getAvatarUrl(user);
  const accountMenuId = "admin-account-menu";
  const accountMenuButtonId = "admin-account-menu-button";

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
        menuButtonRef.current?.focus({ preventScroll: true });
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
    <header className="dashboard-topbar sticky top-0 z-30 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <button
          aria-controls="admin-sidebar"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close admin sidebar" : "Open admin sidebar"}
          className="topbar-icon-button grid h-11 w-11 place-items-center lg:hidden"
          onClick={toggleMobileMenu}
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          aria-controls="admin-sidebar"
          aria-expanded={!isSidebarCollapsed}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="topbar-icon-button hidden h-11 w-11 place-items-center lg:grid"
          onClick={toggleSidebar}
          type="button"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />
          ) : (
            <PanelLeftClose aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="hidden text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)] sm:block">
            ProofArena by ScaleOps
          </p>
          <h1 className="truncate text-xl font-black tracking-normal text-[var(--color-foreground)] sm:mt-1 sm:text-2xl">
            {title}
          </h1>
        </div>

        <label className="relative hidden min-w-[18rem] max-w-sm flex-1 lg:block">
          <span className="sr-only">Search admin records</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-light)]"
          />
          <input
            aria-label="Search users, challenges, proof"
            className="h-11 w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-warm)] pl-11 pr-4 text-sm font-medium text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary-border)] focus:bg-white focus:ring-4 focus:ring-[var(--color-primary-ring)]"
            placeholder="Search users, challenges, proof..."
            type="search"
          />
        </label>

        <a
          aria-label="Open admin alerts"
          className="topbar-icon-button relative grid h-11 w-11 place-items-center"
          href={ROUTES.ADMIN_REPORTS}
        >
          <Bell aria-hidden="true" className="h-5 w-5" />
          {unreadCount > 0 ? (
            <>
              <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--color-primary)]" />
              <span className="sr-only">{unreadCount} unread admin alerts</span>
            </>
          ) : null}
        </a>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            aria-controls={accountMenuId}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label={`Open admin menu for ${userName}`}
            className="topbar-account-button flex shrink-0 items-center gap-3 px-2.5 py-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary-ring)]"
            id={accountMenuButtonId}
            onClick={() => setMenuOpen((current) => !current)}
            ref={menuButtonRef}
            type="button"
          >
            {avatarUrl ? (
              <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] text-xs font-black text-white">
                {getInitials(userName)}
              </span>
            )}
            <span className="hidden min-w-0 pr-2 text-left sm:block">
              <span className="block max-w-40 truncate text-sm font-black text-[var(--color-foreground)]">{userName}</span>
              <span className="block text-xs font-bold text-[var(--color-text-muted)]">Platform Admin</span>
            </span>
          </button>

          {menuOpen ? (
            <div
              aria-labelledby={accountMenuButtonId}
              className="topbar-menu-surface absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 p-2"
              id={accountMenuId}
              role="group"
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-black text-[var(--color-foreground)]">{userName}</p>
                <Badge className="mt-2" size="sm" variant="primary">
                  Admin
                </Badge>
              </div>
              <a className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" href={ROUTES.ADMIN}>
                Admin overview
              </a>
              <a className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" href={ROUTES.ADMIN_SETTINGS}>
                Settings
              </a>
              <button className="w-full rounded-[var(--radius-lg)] px-3 py-2 text-left text-sm font-bold text-[var(--color-danger)] transition hover:bg-[var(--color-danger-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" onClick={handleLogout} type="button">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
