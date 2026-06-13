import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_BRAND, PUBLIC_NAV_DROPDOWNS, PUBLIC_NAV_LINKS, ROUTES } from "../constants/index.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import { getInitials } from "../utils/index.js";
import { Badge } from "./ui/Badge.jsx";
import { Button } from "./Button.jsx";
import { BrandLogo } from "./BrandLogo.jsx";
import { Container } from "./Container.jsx";

function isActiveRoute(path, href) {
  if (href === "/") {
    return path === "/";
  }

  return path === href || path.startsWith(`${href}/`);
}

function NavItem({ href, label, onClick, path, variant = "desktop" }) {
  const active = isActiveRoute(path, href);

  if (variant === "mobile") {
    return (
      <a
        aria-current={active ? "page" : undefined}
        className={`rounded-2xl px-4 py-4 text-xl font-black tracking-normal transition focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 ${
          active
            ? "bg-[#F7FEE7] text-[#365314]"
            : "text-[#44403C] hover:bg-[#FEFCE8] hover:text-[#365314]"
        }`}
        href={href}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={`relative rounded-lg py-2 text-sm font-extrabold transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[#3F6212] after:transition-transform after:duration-200 focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 ${
        active
          ? "text-[#365314] after:scale-x-100"
          : "text-[#78716C] after:scale-x-0 hover:text-[#365314] hover:after:scale-x-100"
      }`}
      href={href}
      onClick={onClick}
    >
      {label}
    </a>
  );
}

function NavDropdown({ group, onClick, path, variant = "desktop" }) {
  const active = group.links.some((item) => isActiveRoute(path, item.href));

  if (variant === "mobile") {
    return (
      <div className="border-t border-[var(--color-border)] pt-4">
        <p className="px-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--color-primary)]">
          {group.title}
        </p>
        <div className="mt-2 grid gap-1">
          {group.links.map((item) => (
            <NavItem
              href={item.href}
              key={item.href}
              label={item.label}
              onClick={onClick}
              path={path}
              variant="mobile"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 rounded-lg py-2 text-sm font-extrabold transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)] ${
          active
            ? "text-[var(--color-primary-hover)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-primary-hover)]"
        }`}
        type="button"
      >
        {group.title}
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>
      <div className="invisible absolute left-1/2 top-[calc(100%+0.65rem)] z-50 w-64 -translate-x-1/2 translate-y-1 rounded-lg border border-[var(--color-border)] bg-white p-2 opacity-0 shadow-[var(--shadow-premium)] transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {group.links.map((item) => (
          <a
            className="block rounded-md px-3 py-2.5 transition hover:bg-[var(--color-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            href={item.href}
            key={item.href}
          >
            <span className="block text-sm font-black text-[var(--color-foreground)]">{item.label}</span>
            <span className="mt-0.5 block text-xs font-semibold leading-5 text-[var(--color-text-muted)]">
              {item.description}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const { isAuthenticated, logout, role, user } = useAuth();
  const navigate = useNavigate();
  const path = useRoutePath();

  const dashboardHref = role === "admin" ? ROUTES.ADMIN : ROUTES.DASHBOARD;
  const ctaHref = isAuthenticated ? dashboardHref : ROUTES.REGISTER;
  const ctaLabel = isAuthenticated ? (role === "admin" ? "Admin" : "Dashboard") : "Sign up";
  const userName = getUserName(user);
  const roleLabel = getRoleLabel(role || user?.role);
  const avatarUrl = getAvatarUrl(user);

  useEffect(() => {
    function handleScroll() {
      setHasScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

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
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUserMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  async function handleLogout() {
    setIsUserMenuOpen(false);
    closeMenu();
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition duration-300 ${
          hasScrolled || isMenuOpen
            ? "border-b border-[#E7E5E4] bg-white/95 shadow-[0_18px_50px_rgba(63,98,18,0.08)] backdrop-blur-xl"
            : "border-b border-[#E7E5E4]/80 bg-white/92 backdrop-blur-lg"
        }`}
      >
        <Container className="flex min-h-18 items-center justify-between gap-5 py-4">
          <BrandLogo onClick={closeMenu} />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-4 xl:flex"
          >
            {PUBLIC_NAV_LINKS.map((item) => (
              <NavItem
                href={item.href}
                key={item.href}
                label={item.label}
                path={path}
              />
            ))}
            {PUBLIC_NAV_DROPDOWNS.map((group) => (
              <NavDropdown group={group} key={group.title} path={path} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            {isAuthenticated ? (
              <>
                <Button as="a" className="min-h-11 px-5 py-2.5" href={ctaHref}>
                  {ctaLabel}
                </Button>
                <div className="relative" ref={userMenuRef}>
                  <button
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    aria-label={`Open account menu for ${userName}`}
                    className="flex min-h-11 items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-white px-2.5 py-2 text-left shadow-[0_12px_30px_rgba(28, 25, 23, 0.06)] transition hover:border-[#3F6212]/25 focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    type="button"
                  >
                    {avatarUrl ? (
                      <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7FEE7] text-xs font-black text-[#365314]">
                        {getInitials(userName)}
                      </span>
                    )}
                    <span className="max-w-36">
                      <span className="block truncate text-sm font-black text-[#1C1917]">{userName}</span>
                      <span className="block text-xs font-bold text-[#78716C]">{roleLabel}</span>
                    </span>
                  </button>
                  {isUserMenuOpen ? (
                    <div
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl border border-[#E7E5E4] bg-white p-2 shadow-[0_24px_70px_rgba(28, 25, 23, 0.14)]"
                      role="menu"
                    >
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-black text-[#1C1917]">{userName}</p>
                        <Badge className="mt-2" size="sm" variant="primary">
                          {roleLabel}
                        </Badge>
                      </div>
                      <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#44403C] transition hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" href={dashboardHref} role="menuitem">
                        Dashboard
                      </a>
                      <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#44403C] transition hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" href={ROUTES.PROFILE} role="menuitem">
                        Profile
                      </a>
                      <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-[#DC2626] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" onClick={handleLogout} role="menuitem" type="button">
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <a
                  className="rounded-xl px-3 py-2 text-sm font-extrabold text-[#44403C] transition hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                  href={ROUTES.LOGIN}
                >
                  Login
                </a>
                <Button as="a" className="min-h-11 px-5 py-2.5" href={ctaHref}>
                  {ctaLabel}
                </Button>
              </>
            )}
          </div>

          <button
            aria-controls="public-mobile-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E7E5E4] bg-white text-[#1C1917] shadow-[0_12px_30px_rgba(63, 98, 18, 0.12)] transition hover:border-[#65A30D] hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 xl:hidden"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            type="button"
          >
            <span className="grid gap-1.5">
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </Container>
      </header>
      {isMenuOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-[#E7E5E4] bg-[#FEFCE8]/98 shadow-[0_28px_80px_rgba(63,98,18,0.12)] backdrop-blur-xl xl:hidden" id="public-mobile-menu">
          <Container className="section-reveal grid gap-3 py-6 sm:gap-4 sm:py-8">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">
                  {APP_BRAND.TAGLINE}
                </p>
              </div>
              <button
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7E5E4] text-[#1C1917] transition hover:border-[#65A30D] hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                onClick={closeMenu}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="grid gap-3 sm:gap-4">
              {PUBLIC_NAV_LINKS.map((item) => (
                <NavItem
                  href={item.href}
                  key={item.href}
                  label={item.label}
                  onClick={closeMenu}
                  path={path}
                  variant="mobile"
                />
              ))}
              {PUBLIC_NAV_DROPDOWNS.map((group) => (
                <NavDropdown
                  group={group}
                  key={group.title}
                  onClick={closeMenu}
                  path={path}
                  variant="mobile"
                />
              ))}
              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img alt="" className="h-11 w-11 rounded-2xl object-cover" src={avatarUrl} />
                      ) : (
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7FEE7] text-sm font-black text-[#365314]">
                          {getInitials(userName)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#1C1917]">{userName}</p>
                        <p className="text-xs font-bold text-[#78716C]">{roleLabel}</p>
                      </div>
                    </div>
                  </div>
                  <NavItem
                    href={dashboardHref}
                    label={role === "admin" ? "Admin" : "Dashboard"}
                    onClick={closeMenu}
                    path={path}
                    variant="mobile"
                  />
                  <NavItem
                    href={ROUTES.PROFILE}
                    label="Profile"
                    onClick={closeMenu}
                    path={path}
                    variant="mobile"
                  />
                  <button
                    className="rounded-2xl px-4 py-4 text-left text-xl font-black tracking-normal text-[#DC2626] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavItem
                  href={ROUTES.LOGIN}
                  label="Login"
                  onClick={closeMenu}
                  path={path}
                  variant="mobile"
                />
              )}
            </nav>
            {!isAuthenticated ? (
              <Button as="a" className="mt-2 w-full" href={ctaHref} onClick={closeMenu}>
                {ctaLabel}
              </Button>
            ) : null}
          </Container>
        </div>
      ) : null}
    </>
  );
}
