import { APP_BRAND, FOOTER_NAV_GROUPS, PUBLIC_FOOTER_BRAND_COPY } from "../constants/index.js";
import { filterNavigationSections } from "../utils/navigationFilter.js";
import { BrandLogo } from "./BrandLogo.jsx";
import { Container } from "./Container.jsx";
import { Badge } from "./ui/Badge.jsx";

const FILTERED_FOOTER_NAV_GROUPS = filterNavigationSections(FOOTER_NAV_GROUPS, {
  includeDisabled: true,
  includeFuture: true,
  surface: "publicFooter",
});

function FooterLink({ item }) {
  if (item.disabled || !item.href) {
    return (
      <div className="w-fit rounded-lg py-1 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
        <span>{item.label}</span>
        <Badge className="ml-2 align-middle" size="sm" variant="warning">
          Soon
        </Badge>
      </div>
    );
  }

  return (
    <a
      className="group w-fit rounded-lg py-1 text-sm font-semibold leading-6 text-[var(--color-text-secondary)] transition hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-ring)]"
      href={item.href}
    >
      <span className="bg-[linear-gradient(var(--color-primary),var(--color-primary))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
        {item.label}
      </span>
    </a>
  );
}

function FooterGroup({ links, title }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase leading-5 tracking-[0.16em] text-[var(--color-primary)]">
        {title}
      </h3>
      <nav aria-label={`${title} footer links`} className="mt-4 grid gap-2.5">
        {links.map((item) => (
          <FooterLink item={item} key={`${title}-${item.id}`} />
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.65fr)] lg:gap-16">
          <div className="max-w-xl">
            <BrandLogo size="lg" />

            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
              {PUBLIC_FOOTER_BRAND_COPY}
            </p>

            <p className="mt-6 inline-flex rounded-full border border-[var(--color-warning-border)] bg-[var(--color-accent-soft)] px-4 py-2 text-xs font-black uppercase leading-5 tracking-[0.14em] text-[var(--color-warning-strong)]">
              Proof-backed work starts here
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {FILTERED_FOOTER_NAV_GROUPS.map((group) => (
              <FooterGroup
                key={group.id}
                links={group.links}
                title={group.title}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--color-border)] pt-6 sm:mt-14">
          <p className="text-sm font-semibold leading-6 text-[var(--color-text-secondary)]">
            &copy; {year} {APP_BRAND.COMPANY_NAME} / {APP_BRAND.PRODUCT_NAME}. All rights reserved.
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
            Proof-backed work starts with measurable outcomes.
          </p>
        </div>
      </Container>
    </footer>
  );
}
