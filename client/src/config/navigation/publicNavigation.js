// @ts-check

import { ROUTE_IDS, ROUTE_METADATA, getRouteMetadata } from "../routeMetadata.js";

function routeItem(routeId, overrides = {}) {
  const metadata = getRouteMetadata(routeId);

  if (!metadata) {
    throw new Error(`Missing route metadata for public navigation route: ${routeId}`);
  }

  return Object.freeze({
    badge: undefined,
    description: metadata.description,
    disabled: false,
    group: metadata.group,
    href: metadata.path,
    iconKey: metadata.iconKey,
    id: metadata.id,
    label: metadata.label,
    path: metadata.path,
    showInFooter: true,
    showInHeader: true,
    showInMobile: true,
    ...overrides,
  });
}

function futureItem(id, label, description, overrides = {}) {
  return Object.freeze({
    badge: "Soon",
    description,
    disabled: true,
    group: "future",
    href: "",
    iconKey: undefined,
    id,
    label,
    path: "",
    showInFooter: true,
    showInHeader: false,
    showInMobile: true,
    ...overrides,
  });
}

function section(title, links, overrides = {}) {
  return Object.freeze({
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    links: Object.freeze(links),
    title,
    ...overrides,
  });
}

export const PUBLIC_PRIORITY_ROUTE_IDS = Object.freeze([
  ROUTE_IDS.PUBLIC.PROVIDERS,
  ROUTE_IDS.PUBLIC.CHALLENGES,
  ROUTE_IDS.PUBLIC.LEADERBOARD,
  ROUTE_IDS.PUBLIC.PRICING,
]);

export const PUBLIC_PRIMARY_ROUTE_IDS = PUBLIC_PRIORITY_ROUTE_IDS;

export const PUBLIC_NAV_LINKS = Object.freeze([
  routeItem(ROUTE_IDS.PUBLIC.PROVIDERS, {
    description: "Find proof-backed providers.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.CHALLENGES, {
    description: "Browse measurable outcome challenges.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.LEADERBOARD, {
    description: "Rank providers by verified execution.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.PRICING, {
    description: "Review platform pricing.",
  }),
]);

export const RESOURCE_NAV_LINKS = Object.freeze([
  routeItem(ROUTE_IDS.PUBLIC.BLOG, {
    description: "Read ProofArena product and outcome economy updates.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.RESOURCES, {
    label: "Guides",
    description: "Use practical guides for clients, providers, and proof workflows.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.HELP, {
    description: "Find support and operating guidance.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.CASE_STUDIES, {
    description: "Study proof-backed outcome examples.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.PROOF_LEDGER, {
    label: "Proof System",
    description: "Understand verified outcomes and public proof records.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.TRUST_SAFETY, {
    description: "Review safety, trust, and marketplace standards.",
  }),
]);

export const COMPANY_NAV_LINKS = Object.freeze([
  futureItem(
    "public.about.future",
    "About",
    "Company story page is reserved for a dedicated future public page.",
  ),
  routeItem(ROUTE_IDS.PUBLIC.CONTACT, {
    description: "Contact ScaleOps and ProofArena.",
  }),
  futureItem(
    "public.careers.future",
    "Careers",
    "Careers page is reserved for hiring and team updates.",
  ),
  routeItem(ROUTE_IDS.PUBLIC.PRIVACY, {
    description: "Read the privacy policy.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.TERMS, {
    description: "Read the terms of service.",
  }),
]);

export const PRODUCT_NAV_LINKS = Object.freeze([
  futureItem(
    "public.product.outcome_offers",
    "Outcome Offers",
    "Provider outcome offer directory is planned for a future public release.",
  ),
  futureItem(
    "public.product.execution_plans",
    "Execution Plans",
    "Execution plan education and examples are planned for a future public page.",
  ),
  futureItem(
    "public.product.smart_matching",
    "Smart Matching",
    "Smart matching education is planned for a future public page.",
  ),
  futureItem(
    "public.product.proof_vault",
    "Proof Vault",
    "Proof Vault is currently a protected provider workspace.",
  ),
  routeItem(ROUTE_IDS.PUBLIC.PROOF_LEDGER, {
    label: "Verified Outcomes",
    description: "Review public proof and verified outcome records.",
  }),
  routeItem(ROUTE_IDS.PUBLIC.LEADERBOARD, {
    label: "Reputation Engine",
    description: "See reputation shaped by verified execution.",
  }),
]);

export const MARKETPLACE_NAV_LINKS = Object.freeze([
  routeItem(ROUTE_IDS.PUBLIC.PROVIDERS),
  routeItem(ROUTE_IDS.PUBLIC.CHALLENGES),
  routeItem(ROUTE_IDS.PUBLIC.LEADERBOARD),
  routeItem(ROUTE_IDS.PUBLIC.PRICING),
]);

export const PUBLIC_NAV_DROPDOWNS = Object.freeze([
  section("Resources", RESOURCE_NAV_LINKS, {
    description: "Guides, proof education, and trust resources.",
  }),
  section("Company", COMPANY_NAV_LINKS, {
    description: "Company, contact, and legal information.",
  }),
]);

export const PUBLIC_MOBILE_NAV_GROUPS = Object.freeze([
  section("Marketplace", PUBLIC_NAV_LINKS),
  ...PUBLIC_NAV_DROPDOWNS,
]);

export const PUBLIC_FOOTER_BRAND_COPY =
  "ProofArena helps providers get clients without endless proposal chasing by turning services into verified outcome offers, matching them with relevant client challenges, and building reputation through approved proof.";

export const FOOTER_NAV_GROUPS = Object.freeze([
  section("Marketplace", MARKETPLACE_NAV_LINKS),
  section("Product", PRODUCT_NAV_LINKS),
  section("Resources", RESOURCE_NAV_LINKS.filter((item) => item.label !== "Proof System")),
  section("Company", COMPANY_NAV_LINKS.filter((item) => item.label !== "Privacy" && item.label !== "Terms")),
  section("Legal", [
    routeItem(ROUTE_IDS.PUBLIC.PRIVACY),
    routeItem(ROUTE_IDS.PUBLIC.TERMS),
  ]),
]);

export const FOOTER_NAV_LINKS = Object.freeze(
  FOOTER_NAV_GROUPS.flatMap((group) => group.links),
);

export const PUBLIC_NAV_REGISTRY = Object.freeze({
  COMPANY: COMPANY_NAV_LINKS,
  DROPDOWNS: PUBLIC_NAV_DROPDOWNS,
  FOOTER: FOOTER_NAV_GROUPS,
  MARKETPLACE: MARKETPLACE_NAV_LINKS,
  MOBILE: PUBLIC_MOBILE_NAV_GROUPS,
  PRIMARY: PUBLIC_NAV_LINKS,
  PRODUCT: PRODUCT_NAV_LINKS,
  RESOURCES: RESOURCE_NAV_LINKS,
  ROUTE_METADATA,
});
