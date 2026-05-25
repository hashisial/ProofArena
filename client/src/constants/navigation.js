import { ROUTES } from "./routes.js";

export const PUBLIC_NAV_LINKS = Object.freeze([
  {
    description: "See how measurable outcomes move from challenge to verified proof.",
    iconName: "ListChecks",
    label: "How it Works",
    path: ROUTES.HOW_IT_WORKS,
  },
  {
    description: "Explore outcome challenges ready for execution plans.",
    iconName: "Target",
    label: "Challenges",
    path: ROUTES.CHALLENGES,
  },
  {
    description: "Discover providers building proof-based reputation.",
    iconName: "Users",
    label: "Providers",
    path: ROUTES.PROVIDERS,
  },
  {
    description: "Review outcome-focused platform pricing.",
    iconName: "BadgeDollarSign",
    label: "Pricing",
    path: ROUTES.PRICING,
  },
  {
    description: "Explore guides, proof workflows, and marketplace resources.",
    iconName: "BookOpen",
    label: "Resources",
    path: ROUTES.RESOURCES,
  },
]);

export const DASHBOARD_NAV_LINKS = Object.freeze([
  {
    description: "Your ProofArena workspace overview.",
    iconName: "LayoutDashboard",
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
  },
  {
    description: "Create and manage measurable client challenges.",
    iconName: "Target",
    label: "Challenges",
    path: ROUTES.MY_CHALLENGES,
    roles: ["client"],
  },
  {
    description: "Package services into measurable proof-based offers.",
    iconName: "PackageCheck",
    label: "Outcome Offers",
    path: ROUTES.MY_OUTCOME_OFFERS,
    roles: ["provider"],
  },
  {
    description: "Track structured plans submitted to client challenges.",
    iconName: "ClipboardList",
    label: "Execution Plans",
    path: ROUTES.MY_EXECUTION_PLANS,
    roles: ["provider"],
  },
  {
    description: "Review your submitted proof and verification status.",
    iconName: "FileCheck2",
    label: "Proof",
    path: ROUTES.PROOF,
  },
  {
    description: "Coordinate execution with clients and providers.",
    iconName: "MessageSquare",
    label: "Messages",
    path: ROUTES.MESSAGES,
  },
  {
    description: "Review challenge updates, proof alerts, and message signals.",
    iconName: "Bell",
    label: "Notifications",
    path: ROUTES.NOTIFICATIONS,
  },
  {
    description: "Manage your identity and proof-based reputation.",
    iconName: "UserCircle",
    label: "Profile",
    path: ROUTES.PROFILE,
  },
  {
    description: "Keep saved providers, challenges, and proof records together.",
    iconName: "Bookmark",
    label: "Saved",
    path: ROUTES.SAVED,
  },
  {
    description: "Manage invoices, provider earnings, and future payments.",
    iconName: "CreditCard",
    label: "Billing",
    path: ROUTES.BILLING,
  },
  {
    description: "Configure workspace preferences.",
    iconName: "Settings",
    label: "Settings",
    path: ROUTES.SETTINGS,
  },
]);

export const ADMIN_NAV_LINKS = Object.freeze([
  {
    description: "Platform trust and operations overview.",
    iconName: "LayoutDashboard",
    label: "Overview",
    path: ROUTES.ADMIN,
  },
  {
    description: "Review users and account status.",
    iconName: "Users",
    label: "Users",
    path: ROUTES.ADMIN_USERS,
  },
  {
    description: "Manage provider verification and quality.",
    iconName: "ShieldCheck",
    label: "Providers",
    path: ROUTES.ADMIN_PROVIDERS,
  },
  {
    description: "Moderate outcome challenge quality.",
    iconName: "Target",
    label: "Challenges",
    path: ROUTES.ADMIN_CHALLENGES,
  },
  {
    description: "Review submitted proof before reputation is earned.",
    iconName: "FileCheck2",
    label: "Proof Review",
    path: ROUTES.ADMIN_PROOF_REVIEW,
  },
  {
    description: "Inspect platform trust reports.",
    iconName: "BarChart3",
    label: "Reports",
    path: ROUTES.ADMIN_REPORTS,
  },
  {
    description: "Handle disputes and trust escalations.",
    iconName: "AlertTriangle",
    label: "Disputes",
    path: ROUTES.ADMIN_DISPUTES,
  },
  {
    description: "Configure platform controls.",
    iconName: "Settings",
    label: "Settings",
    path: ROUTES.ADMIN_SETTINGS,
  },
]);
