import {
  BarChart3,
  CreditCard,
  FileCheck2,
  LifeBuoy,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { ModulePlaceholder } from "../components/common/ModulePlaceholder.jsx";
import { PublicPlaceholderPage } from "../components/common/PublicPlaceholderPage.jsx";
import { ROUTES } from "../constants/index.js";
import { ProviderPublicProfile } from "./ProviderPublicProfile.jsx";
import { PublicProfile } from "./PublicProfile.jsx";
import { Marketplace } from "./Marketplace.jsx";
import { ServiceDetail } from "./ServiceDetail.jsx";

const publicPages = {
  blog: {
    description:
      "Insights on outcome-based work, provider reputation, execution plans, proof workflows, and client acquisition.",
    eyebrow: "Blog",
    features: ["Provider growth", "Client hiring clarity", "Proof-based trust", "Marketplace strategy"],
    primaryActionLabel: "Explore Resources",
    primaryActionTo: ROUTES.RESOURCES,
    secondaryActionLabel: "Join ProofArena",
    secondaryActionTo: ROUTES.REGISTER,
    title: "ProofArena Blog",
  },
  howItWorks: {
    badge: "Workflow preview",
    description:
      "Clients define measurable outcomes, providers submit execution plans, milestones track progress, and verified proof builds reputation.",
    eyebrow: "How ProofArena works",
    features: ["Define outcome", "Compare execution plans", "Track milestones", "Verify proof"],
    primaryActionLabel: "Create a Challenge",
    primaryActionTo: ROUTES.REGISTER,
    secondaryActionLabel: "Become a Provider",
    secondaryActionTo: ROUTES.REGISTER,
    title: "How ProofArena Works",
  },
  challenges: {
    badge: "Challenge previews",
    description:
      "Browse measurable business challenges with clear goals, timelines, proof requirements, and execution plans.",
    eyebrow: "Outcome challenges",
    features: ["Measurable goals", "Proof requirements", "Execution plans", "Milestone tracking"],
    primaryActionLabel: "Create a Challenge",
    primaryActionTo: ROUTES.REGISTER,
    secondaryActionLabel: "Explore Providers",
    secondaryActionTo: ROUTES.PROVIDERS,
    title: "Outcome Challenges",
  },
  challengeDetail: {
    badge: "Challenge detail placeholder",
    description:
      "Challenge detail pages will show the target outcome, success criteria, timeline, proof requirements, and execution plans for a measurable challenge.",
    eyebrow: "Example challenge detail",
    features: ["Target outcome", "Success criteria", "Proof requirements", "Execution plans"],
    primaryActionLabel: "Create a Challenge",
    primaryActionTo: ROUTES.REGISTER,
    secondaryActionLabel: "Explore Challenges",
    secondaryActionTo: ROUTES.CHALLENGES,
    title: "Challenge detail foundation",
  },
  proofLedger: {
    badge: "Proof records preview",
    description:
      "Verified proof records will show what was delivered, what evidence was reviewed, and how provider reputation was earned.",
    eyebrow: "Proof Ledger",
    features: ["Verified outcomes", "Proof summaries", "Public trust records", "Provider reputation"],
    primaryActionLabel: "Become a Provider",
    primaryActionTo: ROUTES.REGISTER,
    secondaryActionLabel: "View Providers",
    secondaryActionTo: ROUTES.PROVIDERS,
    title: "Proof Ledger",
  },
  leaderboard: {
    badge: "Leaderboard preview",
    description:
      "Provider rankings will be based on proof score, completed outcomes, approval rate, and on-time delivery - not paid boosts.",
    eyebrow: "Proof-based leaderboard",
    features: ["Proof score ranking", "Category leaderboards", "Completed outcomes", "On-time delivery"],
    primaryActionLabel: "Explore Providers",
    primaryActionTo: ROUTES.PROVIDERS,
    secondaryActionLabel: "Join as Provider",
    secondaryActionTo: ROUTES.REGISTER,
    title: "Provider Leaderboard",
  },
  resources: {
    badge: "Resource library preview",
    description:
      "Guides, playbooks, and learning resources for clients and providers using proof-based outcome work.",
    eyebrow: "Resources",
    features: ["Provider guides", "Client challenge templates", "Proof requirements", "Growth playbooks"],
    primaryActionLabel: "Read Blog",
    primaryActionTo: ROUTES.BLOG,
    secondaryActionLabel: "Contact Us",
    secondaryActionTo: ROUTES.CONTACT,
    title: "Resources",
  },
  caseStudies: {
    badge: "Case study preview",
    description:
      "Verified case studies will show how measurable challenges were completed and reviewed.",
    eyebrow: "Case studies",
    features: ["Challenge goal", "Delivery workflow", "Proof submitted", "Result verified"],
    primaryActionLabel: "Explore Proof Ledger",
    primaryActionTo: ROUTES.PROOF_LEDGER,
    secondaryActionLabel: "Create a Challenge",
    secondaryActionTo: ROUTES.REGISTER,
    title: "Outcome stories will appear here.",
  },
  help: {
    badge: "Support foundation",
    description:
      "Find answers about outcome challenges, provider profiles, proof submission, verification, and marketplace safety.",
    eyebrow: "Help Center",
    features: ["For clients", "For providers", "Proof and verification", "Account support"],
    primaryActionLabel: "Contact Support",
    primaryActionTo: ROUTES.CONTACT,
    secondaryActionLabel: "Go Home",
    secondaryActionTo: ROUTES.HOME,
    title: "Help Center",
  },
  pricing: {
    badge: "Pricing foundation",
    description:
      "ProofArena pricing will be designed around outcome challenges, provider visibility, proof workflows, and platform trust.",
    eyebrow: "Pricing",
    features: ["Client challenge posting", "Provider profile tools", "Proof workflows", "Future payment protection"],
    primaryActionLabel: "Join Waitlist",
    primaryActionTo: ROUTES.REGISTER,
    secondaryActionLabel: "Contact Us",
    secondaryActionTo: ROUTES.CONTACT,
    title: "Pricing",
  },
  trustSafety: {
    badge: "Trust foundation",
    description:
      "ProofArena is designed around evidence-backed reputation, privacy controls, and safer marketplace behavior.",
    eyebrow: "Trust & Safety",
    features: ["Verified proof", "Verification badges", "Privacy controls", "Review foundation"],
    primaryActionLabel: "Explore Proof Ledger",
    primaryActionTo: ROUTES.PROOF_LEDGER,
    secondaryActionLabel: "Contact Us",
    secondaryActionTo: ROUTES.CONTACT,
    title: "Trust built from proof, privacy, and review workflows.",
  },
  privacy: {
    badge: "Privacy foundation",
    description:
      "ProofArena privacy information will explain how profile data, proof records, public visibility, and account data are handled. This page is a product placeholder and should be reviewed before production launch.",
    eyebrow: "Privacy",
    features: ["Profile data", "Proof records", "Public visibility", "Account data"],
    primaryActionLabel: "Contact Us",
    primaryActionTo: ROUTES.CONTACT,
    secondaryActionLabel: "Go Home",
    secondaryActionTo: ROUTES.HOME,
    title: "Privacy Policy",
  },
  terms: {
    badge: "Terms foundation",
    description:
      "ProofArena terms will define platform rules for clients, providers, proof review, challenge participation, and account use. This page is a product placeholder and should be reviewed before production launch.",
    eyebrow: "Terms",
    features: ["Client rules", "Provider rules", "Proof review", "Account use"],
    primaryActionLabel: "Contact Us",
    primaryActionTo: ROUTES.CONTACT,
    secondaryActionLabel: "Go Home",
    secondaryActionTo: ROUTES.HOME,
    title: "Terms of Service",
  },
  contact: {
    badge: "Contact route ready",
    description:
      "Contact us about partnerships, platform access, provider onboarding, client challenges, or support.",
    eyebrow: "Contact",
    features: ["Partnerships", "Platform access", "Provider onboarding", "Client challenges"],
    primaryActionLabel: "Back to Home",
    primaryActionTo: ROUTES.HOME,
    secondaryActionLabel: "Join ProofArena",
    secondaryActionTo: ROUTES.REGISTER,
    title: "Contact ScaleOps / ProofArena",
  },
};

const dashboardPages = {
  proof: {
    badge: "Proof workspace",
    description:
      "Your submitted proof, review status, approval history, and challenge evidence will be managed here.",
    highlights: ["Submitted proof", "Review status", "Approval history", "Challenge evidence"],
    icon: FileCheck2,
    primaryActionHref: ROUTES.CHALLENGES,
    primaryActionText: "Open Challenges",
    secondaryActionHref: ROUTES.PROOF_LEDGER,
    secondaryActionText: "Public Proof Ledger",
    title: "My Proof",
  },
  billing: {
    badge: "Billing foundation",
    description:
      "Future payments, challenge invoices, provider earnings, and account billing settings will be managed here.",
    highlights: ["Challenge invoices", "Provider earnings", "Payment history", "Billing settings"],
    icon: CreditCard,
    primaryActionHref: ROUTES.SETTINGS,
    primaryActionText: "Account Settings",
    secondaryActionHref: ROUTES.CONTACT,
    secondaryActionText: "Contact Support",
    title: "Billing",
  },
};

const adminPages = {
  users: ["Users", "Review user accounts, account status, role assignments, and trust signals.", Users],
  providers: ["Providers", "Manage provider verification, quality review, proof score checks, and platform readiness.", ShieldCheck],
  challenges: ["Challenges", "Moderate outcome challenge quality, scope, visibility, and platform fit.", Target],
  proofReview: ["Proof Review", "Review submitted proof before outcomes become visible reputation.", FileCheck2],
  reports: ["Reports", "Inspect platform trust, proof approval, dispute, and operational signals.", BarChart3],
  disputes: ["Disputes", "Handle client-provider disputes and trust escalations with a clear review trail.", LifeBuoy],
  settings: ["Admin Settings", "Configure platform controls, moderation defaults, and ScaleOps admin preferences.", ShieldCheck],
};

function Page({ config }) {
  return <PublicPlaceholderPage {...config} />;
}

function AdminPage({ config }) {
  const [title, description, icon] = config;
  return (
    <ModulePlaceholder
      badge="Admin module placeholder"
      description={description}
      highlights={["Queue management", "Status review", "Admin notes", "Audit trail"]}
      icon={icon}
      primaryActionHref={ROUTES.ADMIN}
      primaryActionText="Admin Overview"
      secondaryActionHref={ROUTES.ADMIN_REPORTS}
      secondaryActionText="View Reports"
      showBack
      title={title}
    />
  );
}

export const Blog = () => <Page config={publicPages.blog} />;
export const HowItWorks = () => <Page config={publicPages.howItWorks} />;
export const Challenges = () => <Page config={publicPages.challenges} />;
export const ChallengeDetailRoute = () => <Page config={publicPages.challengeDetail} />;
export const ProofLedger = () => <Page config={publicPages.proofLedger} />;
export const Leaderboard = () => <Page config={publicPages.leaderboard} />;
export const ContactPlaceholder = () => <Page config={publicPages.contact} />;
export const Resources = () => <Page config={publicPages.resources} />;
export const CaseStudies = () => <Page config={publicPages.caseStudies} />;
export const HelpCenter = () => <Page config={publicPages.help} />;
export const Pricing = () => <Page config={publicPages.pricing} />;
export const TrustSafety = () => <Page config={publicPages.trustSafety} />;
export const PrivacyPolicy = () => <Page config={publicPages.privacy} />;
export const TermsOfService = () => <Page config={publicPages.terms} />;

export const ProofWorkspace = () => <ModulePlaceholder {...dashboardPages.proof} showBack />;
export const Billing = () => <ModulePlaceholder {...dashboardPages.billing} showBack />;

export const AdminUsers = () => <AdminPage config={adminPages.users} />;
export const AdminProviders = () => <AdminPage config={adminPages.providers} />;
export const AdminChallenges = () => <AdminPage config={adminPages.challenges} />;
export const AdminProofReview = () => <AdminPage config={adminPages.proofReview} />;
export const AdminReports = () => <AdminPage config={adminPages.reports} />;
export const AdminDisputes = () => <AdminPage config={adminPages.disputes} />;
export const AdminSettings = () => <AdminPage config={adminPages.settings} />;

export function PublicProfileRoute() {
  const { username } = useParams();
  return <PublicProfile username={username} />;
}

export function ProviderProfileRoute() {
  const { username } = useParams();
  return <ProviderPublicProfile username={username} />;
}

export function ServiceDetailRoute() {
  const { serviceId } = useParams();
  return <ServiceDetail serviceId={serviceId} />;
}

export function MarketplaceCategoryRoute() {
  const { categorySlug } = useParams();
  return <Marketplace categorySlug={categorySlug} />;
}
