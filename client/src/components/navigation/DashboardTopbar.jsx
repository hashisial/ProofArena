import { Bell, Menu, PanelLeftClose, PanelLeftOpen, PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { useSidebarState } from "../../hooks/useSidebarState.js";
import { useNotificationStore } from "../../store/useNotificationStore.js";
import { getInitials } from "../../utils/index.js";

function getRoleLabel(role) {
  if (!role) {
    return "Member";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getUserName(user) {
  return user?.fullName || user?.name || user?.username || user?.email || "ProofArena User";
}

function getAvatarUrl(user) {
  return typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url ?? "";
}

export function DashboardTopbar({
  description = "ProofArena workspace command center.",
  title = "Dashboard",
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const {
    isCollapsed,
    isMobileOpen,
    toggleMobileSidebar,
    toggleSidebar,
  } = useSidebarState();
  const { logout, role, user } = useAuth();
  const navigate = useNavigate();
  const userName = getUserName(user);
  const roleLabel = getRoleLabel(role || user?.role);
  const avatarUrl = getAvatarUrl(user);
  const accountMenuId = "provider-account-menu";
  const accountMenuButtonId = "provider-account-menu-button";

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
          aria-controls="dashboard-sidebar"
          aria-expanded={isMobileOpen}
          aria-label={isMobileOpen ? "Close dashboard sidebar" : "Open dashboard sidebar"}
          className="topbar-icon-button grid h-11 w-11 place-items-center lg:hidden"
          onClick={toggleMobileSidebar}
          type="button"
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          aria-controls="dashboard-sidebar"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="topbar-icon-button hidden h-11 w-11 place-items-center lg:grid"
          onClick={toggleSidebar}
          type="button"
        >
          {isCollapsed ? (
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
          <p className="mt-1 hidden max-w-2xl truncate text-xs font-semibold text-[var(--color-text-muted)] md:block">
            {description}
          </p>
        </div>

        <Button
          className="hidden min-h-11 shrink-0 px-4 py-2.5 lg:inline-flex"
          disabled
          iconLeft={<PlusCircle className="h-4 w-4" />}
          title="Create Outcome Offer will be wired to the provider offer workflow in a later stage."
          variant="outline"
        >
          <span>Create Outcome Offer</span>
          <Badge size="sm" variant="warning">
            Soon
          </Badge>
        </Button>

        <a
          aria-label="Open notifications"
          className="topbar-icon-button relative grid h-11 w-11 place-items-center"
          href={ROUTES.NOTIFICATIONS}
        >
          <Bell aria-hidden="true" className="h-5 w-5" />
          {unreadCount > 0 ? (
            <>
              <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[var(--color-primary)]" />
              <span className="sr-only">{unreadCount} unread notifications</span>
            </>
          ) : null}
        </a>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            aria-controls={accountMenuId}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-label={`Open account menu for ${userName}`}
            className="topbar-account-button flex shrink-0 items-center gap-3 px-2.5 py-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary-ring)]"
            id={accountMenuButtonId}
            onClick={() => setMenuOpen((current) => !current)}
            ref={menuButtonRef}
            type="button"
          >
            {avatarUrl ? (
              <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
            ) : (
              <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-[var(--color-foreground)] text-xs font-black text-white">
                {getInitials(userName)}
              </span>
            )}
            <span className="hidden min-w-0 pr-2 text-left sm:block">
              <span className="block max-w-40 truncate text-sm font-black text-[var(--color-foreground)]">{userName}</span>
              <span className="block text-xs font-bold text-[var(--color-text-muted)]">{roleLabel}</span>
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
                  {roleLabel}
                </Badge>
              </div>
              <a className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" href={ROUTES.PROFILE}>
                Profile
              </a>
              <a className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" href={ROUTES.SETTINGS}>
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
