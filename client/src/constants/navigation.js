import { ADMIN_ROUTES, DASHBOARD_ROUTES, PUBLIC_ROUTES } from "./routes.js";

function createNavigationItem({
  badge,
  comingSoon,
  description,
  href,
  iconKey,
  label,
  requiredRole,
}) {
  const roles = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
      ? [requiredRole]
      : undefined;

  return Object.freeze({
    ...(badge ? { badge } : {}),
    ...(comingSoon ? { comingSoon: true } : {}),
    ...(description ? { description } : {}),
    href,
    ...(iconKey ? { iconKey, iconName: iconKey } : {}),
    label,
    path: href,
    ...(requiredRole ? { requiredRole, roles: Object.freeze(roles) } : {}),
  });
}

function createNavigationItems(items) {
  return Object.freeze(items.map(createNavigationItem));
}

function createNavigationGroup(title, links) {
  return Object.freeze({
    links: Object.freeze(links),
    title,
  });
}

function findNavigationItem(items, href) {
  return items.find((item) => item.href === href);
}

export const PUBLIC_NAV_LINKS = createNavigationItems([
  {
    description: "Return to the ProofArena outcome economy overview.",
    href: PUBLIC_ROUTES.HOME,
    iconKey: "Home",
    label: "Home",
  },
  {
    description: "See how measurable outcomes move from challenge to verified proof.",
    href: PUBLIC_ROUTES.HOW_IT_WORKS,
    iconKey: "ListChecks",
    label: "How It Works",
  },
  {
    description: "Explore outcome challenges ready for execution plans.",
    href: PUBLIC_ROUTES.CHALLENGES,
    iconKey: "Target",
    label: "Challenges",
  },
  {
    description: "Discover providers building proof-based reputation.",
    href: PUBLIC_ROUTES.PROVIDERS,
    iconKey: "Users",
    label: "Providers",
  },
  {
    description: "Review public records of verified outcome execution.",
    href: PUBLIC_ROUTES.PROOF_LEDGER,
    iconKey: "FileCheck2",
    label: "Proof Ledger",
  },
  {
    description: "Explore provider rankings based on verified outcomes.",
    href: PUBLIC_ROUTES.LEADERBOARD,
    iconKey: "Medal",
    label: "Leaderboard",
  },
]);

const RESOURCE_NAV_LINKS = createNavigationItems([
  {
    description: "Read product, marketplace, and outcome-economy insights.",
    href: PUBLIC_ROUTES.BLOG,
    iconKey: "Newspaper",
    label: "Blog",
  },
  {
    description: "Explore guides, proof workflows, and marketplace resources.",
    href: PUBLIC_ROUTES.RESOURCES,
    iconKey: "BookOpen",
    label: "Resources",
  },
  {
    description: "Review proof-backed outcome stories.",
    href: PUBLIC_ROUTES.CASE_STUDIES,
    iconKey: "Library",
    label: "Case Studies",
  },
  {
    description: "Find support for clients, providers, and proof workflows.",
    href: PUBLIC_ROUTES.HELP,
    iconKey: "LifeBuoy",
    label: "Help Center",
  },
]);

const COMPANY_NAV_LINKS = createNavigationItems([
  {
    description: "Review outcome-focused platform pricing.",
    href: PUBLIC_ROUTES.PRICING,
    iconKey: "BadgeDollarSign",
    label: "Pricing",
  },
  {
    description: "Contact ScaleOps and the ProofArena team.",
    href: PUBLIC_ROUTES.CONTACT,
    iconKey: "Mail",
    label: "Contact",
  },
  {
    description: "Understand ProofArena trust and safety foundations.",
    href: PUBLIC_ROUTES.TRUST_SAFETY,
    iconKey: "ShieldCheck",
    label: "Trust & Safety",
  },
  {
    description: "Review how profile, proof, and account data are handled.",
    href: PUBLIC_ROUTES.PRIVACY,
    iconKey: "LockKeyhole",
    label: "Privacy",
  },
  {
    description: "Review the platform terms of service.",
    href: PUBLIC_ROUTES.TERMS,
    iconKey: "ScrollText",
    label: "Terms",
  },
]);

export const FOOTER_NAV_LINKS = Object.freeze([
  ...RESOURCE_NAV_LINKS,
  ...COMPANY_NAV_LINKS,
]);

export const FOOTER_NAV_GROUPS = Object.freeze([
  createNavigationGroup("Platform", [
    findNavigationItem(PUBLIC_NAV_LINKS, PUBLIC_ROUTES.HOW_IT_WORKS),
    findNavigationItem(PUBLIC_NAV_LINKS, PUBLIC_ROUTES.CHALLENGES),
    findNavigationItem(PUBLIC_NAV_LINKS, PUBLIC_ROUTES.PROVIDERS),
    findNavigationItem(PUBLIC_NAV_LINKS, PUBLIC_ROUTES.PROOF_LEDGER),
    findNavigationItem(PUBLIC_NAV_LINKS, PUBLIC_ROUTES.LEADERBOARD),
  ]),
  createNavigationGroup("Resources", [
    ...RESOURCE_NAV_LINKS,
  ]),
  createNavigationGroup("Company / Trust", [
    ...COMPANY_NAV_LINKS,
  ]),
]);

export const PUBLIC_NAV_DROPDOWNS = Object.freeze([
  createNavigationGroup("Company", COMPANY_NAV_LINKS),
  createNavigationGroup("Resources", RESOURCE_NAV_LINKS),
]);

export const DASHBOARD_NAV_LINKS = createNavigationItems([
  {
    description: "Your ProofArena workspace overview.",
    href: DASHBOARD_ROUTES.DASHBOARD,
    iconKey: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    description: "Monitor active challenges, provider decisions, and next actions.",
    href: DASHBOARD_ROUTES.CLIENT_WORKSPACE,
    iconKey: "BriefcaseBusiness",
    label: "Workspace",
    requiredRole: "client",
  },
  {
    description: "Create and manage measurable client challenges.",
    href: DASHBOARD_ROUTES.MY_CHALLENGES,
    iconKey: "Target",
    label: "Challenges",
    requiredRole: "client",
  },
  {
    description: "Review warm outcome challenges matched to your offers and proof profile.",
    href: DASHBOARD_ROUTES.MATCHED_CHALLENGES,
    iconKey: "Target",
    label: "Matched Challenges",
    requiredRole: "provider",
  },
  {
    description: "Follow the guided path toward your first proof-backed client win.",
    href: DASHBOARD_ROUTES.FIRST_CLIENT_MODE,
    iconKey: "Medal",
    label: "First Client Mode",
    requiredRole: "provider",
  },
  {
    description: "Package services into measurable proof-based offers.",
    href: DASHBOARD_ROUTES.MY_OUTCOME_OFFERS,
    iconKey: "PackageCheck",
    label: "Outcome Offers",
    requiredRole: "provider",
  },
  {
    description: "Track structured plans submitted to client challenges.",
    href: DASHBOARD_ROUTES.MY_EXECUTION_PLANS,
    iconKey: "ClipboardList",
    label: "Execution Plans",
    requiredRole: "provider",
  },
  {
    description: "Manage matched, applied, shortlisted, won, and lost client opportunities.",
    href: DASHBOARD_ROUTES.OPPORTUNITY_PIPELINE,
    iconKey: "ClipboardList",
    label: "Opportunity Pipeline",
    requiredRole: "provider",
  },
  {
    description: "Store reusable proof assets for offers and execution plans.",
    href: DASHBOARD_ROUTES.PROOF_VAULT,
    iconKey: "FileCheck2",
    label: "Proof Vault",
    requiredRole: "provider",
  },
  {
    description: "Keep saved and shortlisted providers ready for future challenge invites.",
    href: DASHBOARD_ROUTES.SAVED_PROVIDERS,
    iconKey: "Bookmark",
    label: "Saved Providers",
    requiredRole: "client",
  },
  {
    description: "Manage your identity and proof-based reputation.",
    href: DASHBOARD_ROUTES.PROFILE,
    iconKey: "UserCircle",
    label: "Profile",
  },
  {
    description: "Review your submitted proof and verification status.",
    href: DASHBOARD_ROUTES.PROOF,
    iconKey: "FileCheck2",
    label: "Proof",
  },
  {
    description: "Coordinate execution with clients and providers.",
    href: DASHBOARD_ROUTES.MESSAGES,
    iconKey: "MessageSquare",
    label: "Messages",
  },
  {
    description: "Review challenge updates, proof alerts, and message signals.",
    href: DASHBOARD_ROUTES.NOTIFICATIONS,
    iconKey: "Bell",
    label: "Notifications",
  },
  {
    description: "Keep saved providers, challenges, and proof records together.",
    href: DASHBOARD_ROUTES.SAVED,
    iconKey: "Bookmark",
    label: "Saved",
  },
  {
    description: "Manage invoices, provider earnings, and future payments.",
    href: DASHBOARD_ROUTES.BILLING,
    iconKey: "CreditCard",
    label: "Billing",
  },
  {
    description: "Configure workspace preferences.",
    href: DASHBOARD_ROUTES.SETTINGS,
    iconKey: "Settings",
    label: "Settings",
  },
]);

export const DASHBOARD_FUTURE_NAV_LINKS = createNavigationItems([
  {
    comingSoon: true,
    description: "Review future provider rankings based on verified outcomes.",
    href: PUBLIC_ROUTES.LEADERBOARD,
    iconKey: "Medal",
    label: "Leaderboard",
  },
]);

export const ADMIN_NAV_LINKS = createNavigationItems([
  {
    description: "Platform trust and operations overview.",
    href: ADMIN_ROUTES.ADMIN,
    iconKey: "LayoutDashboard",
    label: "Admin Overview",
    requiredRole: "admin",
  },
  {
    description: "Review users and account status.",
    href: ADMIN_ROUTES.ADMIN_USERS,
    iconKey: "Users",
    label: "Users",
    requiredRole: "admin",
  },
  {
    description: "Manage provider verification and quality.",
    href: ADMIN_ROUTES.ADMIN_PROVIDERS,
    iconKey: "ShieldCheck",
    label: "Providers",
    requiredRole: "admin",
  },
  {
    description: "Moderate outcome challenge quality.",
    href: ADMIN_ROUTES.ADMIN_CHALLENGES,
    iconKey: "Target",
    label: "Challenges",
    requiredRole: "admin",
  },
  {
    description: "Moderate published and draft outcome offers.",
    href: ADMIN_ROUTES.ADMIN_OFFERS,
    iconKey: "PackageCheck",
    label: "Outcome Offers",
    requiredRole: "admin",
  },
  {
    description: "Review proof assets and verification signals.",
    href: ADMIN_ROUTES.ADMIN_PROOF_ASSETS,
    iconKey: "FileCheck2",
    label: "Proof Assets",
    requiredRole: "admin",
  },
  {
    description: "Review submitted proof before outcomes become public reputation.",
    href: ADMIN_ROUTES.ADMIN_PROOF_REVIEW,
    iconKey: "FileSearch",
    label: "Proof Review",
    requiredRole: "admin",
  },
  {
    description: "Review provider identity and profile verification requests.",
    href: ADMIN_ROUTES.ADMIN_VERIFICATION,
    iconKey: "BadgeCheck",
    label: "Verification",
    requiredRole: "admin",
  },
  {
    description: "Inspect platform trust reports.",
    href: ADMIN_ROUTES.ADMIN_REPORTS,
    iconKey: "BarChart3",
    label: "Reports",
    requiredRole: "admin",
  },
  {
    description: "Handle disputes and trust escalations.",
    href: ADMIN_ROUTES.ADMIN_DISPUTES,
    iconKey: "AlertTriangle",
    label: "Disputes",
    requiredRole: "admin",
  },
  {
    description: "Configure platform controls.",
    href: ADMIN_ROUTES.ADMIN_SETTINGS,
    iconKey: "Settings",
    label: "Settings",
    requiredRole: "admin",
  },
]);

export const NAVIGATION_GROUPS = Object.freeze({
  ADMIN: ADMIN_NAV_LINKS,
  DASHBOARD: DASHBOARD_NAV_LINKS,
  DASHBOARD_FUTURE: DASHBOARD_FUTURE_NAV_LINKS,
  FOOTER: FOOTER_NAV_LINKS,
  FOOTER_GROUPS: FOOTER_NAV_GROUPS,
  PUBLIC: PUBLIC_NAV_LINKS,
  PUBLIC_DROPDOWNS: PUBLIC_NAV_DROPDOWNS,
});

export function canAccessNavigationItem(item, role) {
  if (!item?.requiredRole) {
    return true;
  }

  const requiredRoles = Array.isArray(item.requiredRole)
    ? item.requiredRole
    : [item.requiredRole];

  return requiredRoles.includes(role);
}
