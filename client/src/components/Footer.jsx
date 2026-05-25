import { APP_BRAND, ROUTES } from "../constants/index.js";
import { Container } from "./Container.jsx";

const platformLinks = [
  { label: "How It Works", path: ROUTES.HOW_IT_WORKS },
  { label: "Challenges", path: ROUTES.CHALLENGES },
  { label: "Providers", path: ROUTES.PROVIDERS },
  { label: "Proof Ledger", path: ROUTES.PROOF_LEDGER },
  { label: "Leaderboard", path: ROUTES.LEADERBOARD },
];

const resourceLinks = [
  { label: "Blog", path: ROUTES.BLOG },
  { label: "Resources", path: ROUTES.RESOURCES },
  { label: "Case Studies", path: ROUTES.CASE_STUDIES },
  { label: "Help Center", path: ROUTES.HELP },
  { label: "Contact", path: ROUTES.CONTACT },
];

const trustLinks = [
  { label: "Pricing", path: ROUTES.PRICING },
  { label: "Trust & Safety", path: ROUTES.TRUST_SAFETY },
  { label: "Privacy", path: ROUTES.PRIVACY },
  { label: "Terms", path: ROUTES.TERMS },
];

const footerGroups = [
  { title: "Platform", links: platformLinks },
  { title: "Resources", links: resourceLinks },
  { title: "Company / Trust", links: trustLinks },
];

function FooterLink({ label, path }) {
  return (
    <a
      className="group w-fit rounded-lg py-1 text-sm font-semibold leading-6 text-[#44403C] transition hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
      href={path}
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
          <FooterLink key={`${title}-${item.path}`} label={item.label} path={item.path} />
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-[#E7E5E4] bg-[#FFFBEB] text-[#1C1917]">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)] lg:gap-16">
          <div className="max-w-xl">
            <a
              aria-label={`${APP_BRAND.PRODUCT_NAME} home`}
              className="group inline-flex items-center gap-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
              href={ROUTES.HOME}
            >
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] text-xs font-black text-[#365314] shadow-[0_14px_34px_rgba(63, 98, 18, 0.14)] transition group-hover:-translate-y-0.5 group-hover:border-[#3F6212]/40 group-hover:shadow-[0_18px_44px_rgba(63, 98, 18, 0.2)]">
                PA
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#3F6212]" />
              </span>
              <span>
                <span className="block text-2xl font-black leading-none text-[#1C1917]">
                  {APP_BRAND.PRODUCT_NAME}
                </span>
                <span className="mt-1 block text-xs font-bold uppercase leading-5 tracking-[0.16em] text-[#78716C]">
                  by {APP_BRAND.COMPANY_NAME}
                </span>
              </span>
            </a>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#44403C]">
              ProofArena by ScaleOps helps clients launch measurable outcome
              challenges and helps providers build proof-backed reputation.
            </p>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#78716C]">
              Less proposal noise. More structured plans, milestone tracking,
              and approved proof.
            </p>

            <p className="mt-6 inline-flex rounded-full border border-[#A16207]/20 bg-[#FEF3C7] px-4 py-2 text-xs font-black uppercase leading-5 tracking-[0.16em] text-[#A16207]">
              Proof-backed work starts here
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerGroups.map((group) => (
              <FooterGroup
                key={group.title}
                links={group.links}
                title={group.title}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-[#E7E5E4] pt-6 sm:mt-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold leading-6 text-[#44403C]">
                &copy; {year} {APP_BRAND.COMPANY_NAME} / {APP_BRAND.PRODUCT_NAME}. All rights reserved.
              </p>
              <p className="mt-1 text-sm leading-6 text-[#78716C]">
                Proof-backed work starts with measurable outcomes.
              </p>
            </div>

            <a
              className="w-fit rounded-full border border-[#E7E5E4] bg-white px-4 py-2 text-sm font-black text-[#44403C] transition hover:-translate-y-0.5 hover:border-[#65A30D] hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
              href={ROUTES.HOME}
            >
              Back home
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
