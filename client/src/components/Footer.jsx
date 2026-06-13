import { APP_BRAND, FOOTER_NAV_GROUPS } from "../constants/index.js";
import { BrandLogo } from "./BrandLogo.jsx";
import { Container } from "./Container.jsx";

function FooterLink({ href, label }) {
  return (
    <a
      className="group w-fit rounded-lg py-1 text-sm font-semibold leading-6 text-[#44403C] transition hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
      href={href}
    >
      <span className="bg-[linear-gradient(#3F6212,#3F6212)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_2px]">
        {label}
      </span>
    </a>
  );
}

function FooterGroup({ links, title }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase leading-5 tracking-[0.18em] text-[#3F6212]">
        {title}
      </h3>
      <nav aria-label={`${title} footer links`} className="mt-4 grid gap-2.5">
        {links.map((item) => (
          <FooterLink href={item.href} key={`${title}-${item.href}`} label={item.label} />
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-[#E7E5E4] bg-[#FEFCE8] text-[#1C1917]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)] lg:gap-16">
          <div className="max-w-xl">
            <BrandLogo size="lg" />

            <p className="mt-6 max-w-md text-sm leading-7 text-[#44403C]">
              ProofArena by ScaleOps helps clients launch measurable outcome
              challenges and helps providers build proof-backed reputation.
            </p>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#78716C]">
              Less proposal noise. More structured plans, milestone tracking,
              and approved proof.
            </p>

            <p className="mt-6 inline-flex rounded-full border border-[#A16207]/20 bg-[#ECFCCB] px-4 py-2 text-xs font-black uppercase leading-5 tracking-[0.16em] text-[#A16207]">
              Proof-backed work starts here
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FOOTER_NAV_GROUPS.map((group) => (
              <FooterGroup
                key={group.title}
                links={group.links}
                title={group.title}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#E7E5E4] pt-6 sm:mt-14">
          <div>
            <div>
              <p className="text-sm font-semibold leading-6 text-[#44403C]">
                &copy; {year} {APP_BRAND.COMPANY_NAME} / {APP_BRAND.PRODUCT_NAME}. All rights reserved.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#78716C]">
                Proof-backed work starts with measurable outcomes.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
