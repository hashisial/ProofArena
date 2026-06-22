import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  APP_BRAND,
  PUBLIC_MOBILE_NAV_GROUPS,
  PUBLIC_NAV_DROPDOWNS,
  PUBLIC_NAV_LINKS,
  ROUTES,
} from "../constants/index.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import { getDashboardPathForRole } from "../utils/getDashboardPathForRole.js";
import { filterNavigationItems, filterNavigationSections } from "../utils/navigationFilter.js";
import { getInitials } from "../utils/index.js";
import { Badge } from "./ui/Badge.jsx";
import { Button } from "./Button.jsx";
import { BrandLogo } from "./BrandLogo.jsx";
import { Container } from "./Container.jsx";

function isActiveRoute(path, href) {
  if (!href) {
    return false;
  }

  if (href === "/") {
    return path === "/";
  }

  return path === href || path.startsWith(`${href}/`);
}

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

function DisabledNavItem({ description, label, variant = "desktop" }) {
  if (variant === "mobile") {
    return (
      <div
        aria-label={`${label} is not available yet`}
        className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-card)]/70 px-4 py-3"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg font-black text-[var(--color-text-muted)]">{label}</span>
          <Badge size="sm" variant="warning">
            Soon
          </Badge>
        </div>
        {description ? (
          <p className="mt-1 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      aria-label={`${label} is not available yet`}
      className="rounded-md px-3 py-2.5 opacity-70"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="block text-sm font-black text-[var(--color-text-muted)]">{label}</span>
        <Badge size="sm" variant="warning">
          Soon
        </Badge>
      </div>
      {description ? (
        <span className="mt-0.5 block text-xs font-semibold leading-5 text-[var(--color-text-muted)]">
          {description}
        </span>
      ) : null}
    </div>
  );
}

function NavItem({ item, onClick, path, variant = "desktop" }) {
  if (item.disabled || !item.href) {
    return <DisabledNavItem description={item.description} label={item.label} variant={variant} />;
  }

  const active = isActiveRoute(path, item.href);

  if (variant === "mobile") {
    return (
      <a
        aria-current={active ? "page" : undefined}
        className={`rounded-[var(--radius-lg)] px-4 py-4 text-lg font-black tracking-normal transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none ${
          active
            ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)]"
        }`}
        href={item.href}
        onClick={onClick}
      >
        {item.label}
      </a>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
        className={`relative rounded-[var(--radius-md)] py-2 text-sm font-extrabold transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[var(--color-primary)] after:transition-transform after:duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none ${
        active
          ? "text-[var(--color-primary-hover)] after:scale-x-100"
          : "text-[var(--color-text-muted)] after:scale-x-0 hover:text-[var(--color-primary-hover)] hover:after:scale-x-100"
      }`}
      href={item.href}
      onClick={onClick}
    >
      {item.label}
    </a>
  );
}

function DesktopDropdown({ group, path }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const active = group.links.some((item) => !item.disabled && isActiveRoute(path, item.href));
  const panelId = `public-nav-${group.id}`;
  const triggerId = `public-nav-trigger-${group.id}`;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setIsOpen(false);
    }, 0);

    return () => window.clearTimeout(closeTimer);
  }, [path]);

  function handleBlur(event) {
    if (!dropdownRef.current?.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onBlur={handleBlur}
      onFocus={() => setIsOpen(true)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        if (!dropdownRef.current?.contains(document.activeElement)) {
          setIsOpen(false);
        }
      }}
      ref={dropdownRef}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 rounded-[var(--radius-md)] py-2 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none ${
          active || isOpen
            ? "text-[var(--color-primary-hover)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-hover)]"
        }`}
        id={triggerId}
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        {group.title}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        aria-hidden={!isOpen}
        className={`absolute left-1/2 top-[calc(100%+0.75rem)] z-50 w-72 -translate-x-1/2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-[var(--shadow-floating)] transition duration-200 motion-reduce:transition-none ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-1 opacity-0"
        }`}
        aria-labelledby={triggerId}
        id={panelId}
      >
        {group.links.map((item) =>
          item.disabled || !item.href ? (
            <DisabledNavItem
              description={item.description}
              key={item.id}
              label={item.label}
            />
          ) : (
            <a
              className="block rounded-[var(--radius-lg)] px-3 py-2.5 transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] motion-reduce:transition-none"
              href={item.href}
              key={item.id}
              onClick={() => setIsOpen(false)}
            >
              <span className="block text-sm font-black text-[var(--color-foreground)]">
                {item.label}
              </span>
              <span className="mt-0.5 block text-xs font-semibold leading-5 text-[var(--color-text-muted)]">
                {item.description}
              </span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}

function MobileNavGroup({ group, isOpen, onToggle, onNavigate, path }) {
  const panelId = `mobile-nav-group-${group.id}`;

  return (
    <section className="border-t border-[var(--color-border)] pt-4">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] px-4 py-3 text-left text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)] transition hover:bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
        onClick={onToggle}
        type="button"
      >
        {group.title}
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div className="mt-2 grid gap-1" id={panelId}>
          {group.links.map((item) => (
            <NavItem
              item={item}
              key={item.id}
              onClick={onNavigate}
              path={path}
              variant="mobile"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [openMobileGroups, setOpenMobileGroups] = useState(() => new Set(["Marketplace"]));
  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuCloseButtonRef = useRef(null);
  const previousMobileFocusRef = useRef(null);
  const { isAuthenticated, isAuthChecking, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const path = useRoutePath();

  const currentUser = useMemo(() => user ?? (role ? { role } : null), [role, user]);
  const dashboardHref = useMemo(
    () =>
      getDashboardPathForRole(currentUser, {
        guestFallback: ROUTES.LOGIN,
        unknownFallback: ROUTES.DASHBOARD,
      }),
    [currentUser],
  );
  const userName = getUserName(user);
  const roleLabel = getRoleLabel(role || user?.role);
  const avatarUrl = getAvatarUrl(user);
  const accountMenuId = "public-account-menu";
  const accountMenuButtonId = "public-account-menu-button";
  const navigationRole = role || user?.role;
  const navigationContext = useMemo(
    () => ({
      includeDisabled: true,
      includeFuture: true,
      isAuthenticated,
      role: navigationRole,
      user,
    }),
    [isAuthenticated, navigationRole, user],
  );
  const primaryNavLinks = useMemo(
    () =>
      filterNavigationItems(PUBLIC_NAV_LINKS, {
        ...navigationContext,
        surface: "publicHeader",
      }),
    [navigationContext],
  );
  const publicDropdowns = useMemo(
    () =>
      filterNavigationSections(PUBLIC_NAV_DROPDOWNS, {
        ...navigationContext,
        surface: "publicHeader",
      }),
    [navigationContext],
  );
  const mobileNavGroups = useMemo(
    () =>
      filterNavigationSections(PUBLIC_MOBILE_NAV_GROUPS, {
        ...navigationContext,
        surface: "mobilePublicNav",
      }),
    [navigationContext],
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMobileGroup = useCallback((title) => {
    setOpenMobileGroups((current) => {
      const next = new Set(current);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    setIsUserMenuOpen(false);
    closeMenu();
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [closeMenu, logout, navigate]);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      closeMenu();
      setIsUserMenuOpen(false);
    }, 0);

    return () => window.clearTimeout(closeTimer);
  }, [closeMenu, path]);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const triggerElement = mobileMenuButtonRef.current;
    previousMobileFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      mobileMenuCloseButtonRef.current?.focus({ preventScroll: true });
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      const focusTarget = previousMobileFocusRef.current ?? triggerElement;
      focusTarget?.focus?.({ preventScroll: true });
    };
  }, [closeMenu, isMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!userMenuRef.current?.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        userMenuButtonRef.current?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition duration-300 ${
          hasScrolled || isMenuOpen
            ? "border-b border-[var(--color-border)] bg-white/95 shadow-[0_18px_50px_rgba(63,98,18,0.08)] backdrop-blur-xl"
            : "border-b border-[var(--color-border)] bg-white/92 backdrop-blur-lg"
        }`}
      >
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-5 py-4">
          <BrandLogo onClick={closeMenu} />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-5 lg:flex"
          >
            {primaryNavLinks.map((item) => (
              <NavItem item={item} key={item.id} path={path} />
            ))}
            {publicDropdowns.map((group) => (
              <DesktopDropdown group={group} key={group.id} path={path} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthChecking ? (
              <Button className="min-h-11 px-5 py-2.5" disabled variant="secondary">
                Checking session
              </Button>
            ) : isAuthenticated ? (
              <>
                <Button
                  as="a"
                  className="min-h-11 px-5 py-2.5"
                  href={dashboardHref}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Dashboard
                </Button>
                <div className="relative" ref={userMenuRef}>
                  <button
                    aria-controls={accountMenuId}
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label={`Open account menu for ${userName}`}
                    className="flex min-h-11 items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-2 text-left shadow-[var(--shadow-control)] transition hover:border-[var(--color-primary-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
                    id={accountMenuButtonId}
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    ref={userMenuButtonRef}
                    type="button"
                  >
                    {avatarUrl ? (
                      <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-primary-soft)] text-xs font-black text-[var(--color-primary-hover)]">
                        {getInitials(userName)}
                      </span>
                    )}
                    <span className="max-w-36">
                      <span className="block truncate text-sm font-black text-[var(--color-foreground)]">
                        {userName}
                      </span>
                      <span className="block text-xs font-bold text-[var(--color-text-muted)]">
                        {roleLabel}
                      </span>
                    </span>
                  </button>
                  {isUserMenuOpen ? (
                    <div
                      aria-labelledby={accountMenuButtonId}
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] p-2 shadow-[var(--shadow-floating)]"
                      id={accountMenuId}
                      role="group"
                    >
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-black text-[var(--color-foreground)]">
                          {userName}
                        </p>
                        <Badge className="mt-2" size="sm" variant="primary">
                          {roleLabel}
                        </Badge>
                      </div>
                      <a
                        className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
                        href={dashboardHref}
                      >
                        Dashboard
                      </a>
                      <a
                        className="block rounded-[var(--radius-lg)] px-3 py-2 text-sm font-bold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
                        href={ROUTES.PROFILE}
                      >
                        Profile
                      </a>
                      <button
                        className="w-full rounded-[var(--radius-lg)] px-3 py-2 text-left text-sm font-bold text-[var(--color-danger)] transition hover:bg-[var(--color-danger-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
                        onClick={handleLogout}
                        type="button"
                      >
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <a
                  className="rounded-xl px-3 py-2 text-sm font-extrabold text-[var(--color-text-secondary)] transition hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)]"
                  href={ROUTES.LOGIN}
                >
                  Login
                </a>
                <Button
                  as="a"
                  className="min-h-11 px-5 py-2.5"
                  href={`${ROUTES.REGISTER}?role=provider`}
                  variant="outline"
                >
                  Join as Provider
                </Button>
                <Button
                  as="a"
                  className="min-h-11 px-5 py-2.5"
                  href={`${ROUTES.REGISTER}?intent=post-challenge`}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Post a Challenge
                </Button>
              </>
            )}
          </div>

          <button
            aria-controls="public-mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] shadow-[var(--shadow-control)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none lg:hidden"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            ref={mobileMenuButtonRef}
            type="button"
          >
            <span className="grid gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition motion-reduce:transition-none ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition motion-reduce:transition-none ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition motion-reduce:transition-none ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </Container>
      </header>

      {isMenuOpen ? (
        <>
          <button
            aria-label="Close navigation menu"
            className="fixed inset-0 top-[4.5rem] z-40 cursor-default bg-[var(--color-overlay)]/45 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
            type="button"
          />
          <aside
            aria-label="Mobile navigation menu"
            aria-modal="true"
            className="fixed inset-x-3 bottom-3 top-[5.25rem] z-50 overflow-y-auto overflow-x-hidden overscroll-contain rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-background)] shadow-[var(--shadow-floating)] lg:hidden"
            id="public-mobile-menu"
            role="dialog"
          >
            <Container className="grid gap-4 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {APP_BRAND.TAGLINE}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                    Navigate the ProofArena public platform.
                  </p>
                </div>
                <button
                  aria-label="Close navigation menu"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] text-[var(--color-foreground)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] motion-reduce:transition-none"
                  onClick={closeMenu}
                  ref={mobileMenuCloseButtonRef}
                  type="button"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile navigation" className="grid gap-3">
                {mobileNavGroups.map((group) => (
                  <MobileNavGroup
                    group={group}
                    isOpen={openMobileGroups.has(group.title)}
                    key={group.id}
                    onNavigate={closeMenu}
                    onToggle={() => toggleMobileGroup(group.title)}
                    path={path}
                  />
                ))}
              </nav>

              <div className="grid gap-3 border-t border-[var(--color-border)] pt-4">
                {isAuthChecking ? (
                  <Button className="w-full" disabled variant="secondary">
                    Checking session
                  </Button>
                ) : isAuthenticated ? (
                  <>
                    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img alt="" className="h-11 w-11 rounded-2xl object-cover" src={avatarUrl} />
                        ) : (
                          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-primary-soft)] text-sm font-black text-[var(--color-primary-hover)]">
                            {getInitials(userName)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[var(--color-foreground)]">
                            {userName}
                          </p>
                          <p className="text-xs font-bold text-[var(--color-text-muted)]">
                            {roleLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      as="a"
                      className="w-full"
                      href={dashboardHref}
                      iconRight={<ArrowRight className="h-4 w-4" />}
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Button>
                    <Button
                      className="w-full"
                      onClick={handleLogout}
                      variant="outline"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      as="a"
                      className="w-full"
                      href={`${ROUTES.REGISTER}?intent=post-challenge`}
                      iconRight={<ArrowRight className="h-4 w-4" />}
                      onClick={closeMenu}
                    >
                      Post a Challenge
                    </Button>
                    <Button
                      as="a"
                      className="w-full"
                      href={`${ROUTES.REGISTER}?role=provider`}
                      onClick={closeMenu}
                      variant="outline"
                    >
                      Join as Provider
                    </Button>
                    <Button
                      as="a"
                      className="w-full"
                      href={ROUTES.LOGIN}
                      onClick={closeMenu}
                      variant="ghost"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </Container>
          </aside>
        </>
      ) : null}
    </>
  );
}
