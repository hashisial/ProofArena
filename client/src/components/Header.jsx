import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APP_BRAND, PUBLIC_NAV_LINKS, ROUTES } from "../constants/index.js";
import { useAuth } from "../hooks/useAuth.js";
import { useRoutePath } from "../hooks/useRoutePath.js";
import { getInitials } from "../utils/index.js";
import { Badge } from "./ui/Badge.jsx";
import { Button } from "./Button.jsx";
import { Container } from "./Container.jsx";

function isActiveRoute(path, href) {
  if (href === "/") {
    return path === "/";
  }

  return path === href || path.startsWith(`${href}/`);
}

function Wordmark({ onClick }) {
  return (
    <a
      aria-label={`${APP_BRAND.PRODUCT_NAME} home`}
      className="group flex min-w-0 items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
      href={ROUTES.HOME}
      onClick={onClick}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF] text-xs font-black text-[#5B21B6] shadow-[0_14px_34px_rgba(124, 58, 237, 0.14)] transition group-hover:-translate-y-0.5 group-hover:border-[#7C3AED]/40 group-hover:shadow-[0_18px_44px_rgba(124, 58, 237, 0.2)]">
        PA
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#7C3AED]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-lg font-black tracking-normal text-[#07030D]">
          {APP_BRAND.PRODUCT_NAME}
        </span>
        <span className="hidden text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#6F657C] sm:block">
          by {APP_BRAND.COMPANY_NAME}
        </span>
      </span>
    </a>
  );
}

function NavItem({ href, label, onClick, path, variant = "desktop" }) {
  const active = isActiveRoute(path, href);

  if (variant === "mobile") {
    return (
      <a
        aria-current={active ? "page" : undefined}
        className={`rounded-2xl px-4 py-4 text-xl font-black tracking-normal transition focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 ${
          active
            ? "bg-[#F5F3FF] text-[#5B21B6]"
            : "text-[#493C5E] hover:bg-[#F8F4FF] hover:text-[#5B21B6]"
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
      className={`relative rounded-lg py-2 text-sm font-extrabold transition after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[#7C3AED] after:transition-transform after:duration-200 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 ${
        active
          ? "text-[#5B21B6] after:scale-x-100"
          : "text-[#6F657C] after:scale-x-0 hover:text-[#5B21B6] hover:after:scale-x-100"
      }`}
      href={href}
      onClick={onClick}
    >
      {label}
    </a>
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
            ? "border-b border-[#E9E2F3] bg-white/95 shadow-[0_18px_50px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            : "border-b border-[#E9E2F3]/80 bg-white/92 backdrop-blur-lg"
        }`}
      >
        <Container className="flex min-h-18 items-center justify-between gap-5 py-4">
          <Wordmark onClick={closeMenu} />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 xl:flex"
          >
            {PUBLIC_NAV_LINKS.map((item) => (
              <NavItem
                href={item.path}
                key={item.path}
                label={item.label}
                path={path}
              />
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
                    className="flex min-h-11 items-center gap-3 rounded-2xl border border-[#E9E2F3] bg-white px-2.5 py-2 text-left shadow-[0_12px_30px_rgba(31, 14, 54, 0.06)] transition hover:border-[#7C3AED]/25 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
                    onClick={() => setIsUserMenuOpen((current) => !current)}
                    type="button"
                  >
                    {avatarUrl ? (
                      <img alt="" className="h-9 w-9 rounded-xl object-cover" src={avatarUrl} />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F5F3FF] text-xs font-black text-[#5B21B6]">
                        {getInitials(userName)}
                      </span>
                    )}
                    <span className="max-w-36">
                      <span className="block truncate text-sm font-black text-[#07030D]">{userName}</span>
                      <span className="block text-xs font-bold text-[#6F657C]">{roleLabel}</span>
                    </span>
                  </button>
                  {isUserMenuOpen ? (
                    <div
                      className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-2xl border border-[#E9E2F3] bg-white p-2 shadow-[0_24px_70px_rgba(31, 14, 54, 0.14)]"
                      role="menu"
                    >
                      <div className="px-3 py-2">
                        <p className="truncate text-sm font-black text-[#07030D]">{userName}</p>
                        <Badge className="mt-2" size="sm" variant="primary">
                          {roleLabel}
                        </Badge>
                      </div>
                      <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#493C5E] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" href={dashboardHref} role="menuitem">
                        Dashboard
                      </a>
                      <a className="block rounded-xl px-3 py-2 text-sm font-bold text-[#493C5E] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" href={ROUTES.PROFILE} role="menuitem">
                        Profile
                      </a>
                      <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-[#DC2626] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" onClick={handleLogout} role="menuitem" type="button">
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <a
                  className="rounded-xl px-3 py-2 text-sm font-extrabold text-[#493C5E] transition hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E9E2F3] bg-white text-[#07030D] shadow-[0_12px_30px_rgba(124, 58, 237, 0.12)] transition hover:border-[#A78BFA] hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 xl:hidden"
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
        <div className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto border-t border-[#E9E2F3] bg-[#F8F4FF]/98 shadow-[0_28px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl xl:hidden" id="public-mobile-menu">
          <Container className="section-reveal grid gap-3 py-6 sm:gap-4 sm:py-8">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7C3AED]">
                  {APP_BRAND.TAGLINE}
                </p>
              </div>
              <button
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E9E2F3] text-[#07030D] transition hover:border-[#A78BFA] hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
                onClick={closeMenu}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="grid gap-3 sm:gap-4">
              {PUBLIC_NAV_LINKS.map((item) => (
                <NavItem
                  href={item.path}
                  key={item.path}
                  label={item.label}
                  onClick={closeMenu}
                  path={path}
                  variant="mobile"
                />
              ))}
              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img alt="" className="h-11 w-11 rounded-2xl object-cover" src={avatarUrl} />
                      ) : (
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-sm font-black text-[#5B21B6]">
                          {getInitials(userName)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-[#07030D]">{userName}</p>
                        <p className="text-xs font-bold text-[#6F657C]">{roleLabel}</p>
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
                    className="rounded-2xl px-4 py-4 text-left text-xl font-black tracking-normal text-[#DC2626] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
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
