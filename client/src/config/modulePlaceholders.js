export const MODULE_PLACEHOLDERS = {
  admin: {
    challenges: {
      futureFeatures: [
        "Review outcome scope, clarity, and platform fit",
        "Moderate challenge visibility and trust risk",
        "Track reports, disputes, and admin notes",
        "Prepare challenge quality controls",
      ],
      futureStage: "Admin moderation stage",
      title: "Challenge moderation",
    },
    dashboard: {
      futureFeatures: [
        "Monitor user trust and platform safety",
        "Review proof queues and moderation signals",
        "Track reports, disputes, and operational risk",
        "Coordinate admin workflows without scattered tools",
      ],
      futureStage: "Admin operations stage",
      title: "Admin overview",
    },
    disputes: {
      futureFeatures: [
        "Review client-provider disputes with context",
        "Collect proof, messages, and timeline evidence",
        "Track resolution status and audit history",
        "Protect marketplace trust through consistent handling",
      ],
      futureStage: "Dispute handling stage",
      title: "Dispute resolution",
    },
    providers: {
      futureFeatures: [
        "Review provider verification and readiness",
        "Inspect proof score, account risk, and category fit",
        "Track provider quality and platform restrictions",
        "Support future provider trust operations",
      ],
      futureStage: "Provider operations stage",
      title: "Provider operations",
    },
    proofs: {
      futureFeatures: [
        "Review submitted proof assets and verification queues",
        "Flag suspicious evidence and repeated risk patterns",
        "Support dispute evidence and approval workflows",
        "Protect reputation quality across the platform",
      ],
      futureStage: "Stage 23+",
      title: "Proof review operations",
    },
    reports: {
      futureFeatures: [
        "Review platform reports and abuse signals",
        "Track moderation queues and trust incidents",
        "Prepare operational summaries for admin teams",
        "Connect future analytics to trust workflows",
      ],
      futureStage: "Reporting stage",
      title: "Reports and trust signals",
    },
    settings: {
      futureFeatures: [
        "Configure admin defaults and moderation controls",
        "Manage platform policies and operational settings",
        "Prepare future enterprise controls",
        "Support secure internal workflows",
      ],
      futureStage: "Admin configuration stage",
      title: "Admin settings",
    },
    users: {
      futureFeatures: [
        "Review account status, roles, and restrictions",
        "Inspect user trust status and verification state",
        "Prepare moderation and support actions",
        "Keep admin decisions auditable",
      ],
      futureStage: "Admin user management stage",
      title: "User management",
    },
  },
  client: {
    active: {
      futureFeatures: [
        "Track milestones, provider updates, and revisions",
        "Review submitted proof before approvals",
        "Monitor active outcomes and next decisions",
        "Prepare dispute and completion workflows",
      ],
      futureStage: "Stages 26-29",
      title: "Active work",
    },
    challenges: {
      futureFeatures: [
        "Create measurable outcome challenges",
        "Define success criteria and proof requirements",
        "Manage budgets, timelines, and urgency",
        "Compare execution plans without vague proposals",
      ],
      futureStage: "Stages 12-13",
      title: "Client challenges",
    },
    overview: {
      futureFeatures: [
        "See posted challenges and active work",
        "Review saved providers and proof decisions",
        "Track next actions across buyer workflows",
        "Prepare high-quality client demand signals",
      ],
      futureStage: "Client workspace stage",
      title: "Buyer control center",
    },
    providers: {
      futureFeatures: [
        "Discover proof-backed providers by skill and category",
        "Compare proof score, availability, and verified outcomes",
        "Save and shortlist providers for future work",
        "Use matching signals to reduce hiring uncertainty",
      ],
      futureStage: "Stages 6, 18, 37",
      title: "Provider discovery",
    },
    settings: {
      futureFeatures: [
        "Manage client account and company profile",
        "Configure billing, verification, and notifications",
        "Set buyer preferences and communication defaults",
        "Prepare future company-level controls",
      ],
      futureStage: "Client settings stage",
      title: "Client settings",
    },
  },
  provider: {
    dashboard: {
      futureFeatures: [
        "Track provider readiness and next actions",
        "Surface matched opportunities and proof gaps",
        "Prepare offer, profile, and reputation work",
        "Connect future acquisition intelligence",
      ],
      futureStage: "Provider command center stage",
      title: "Provider overview",
    },
    offers: {
      futureFeatures: [
        "Package services into measurable outcome offers",
        "Define target results, timelines, and proof requirements",
        "Set pricing and availability around outcomes",
        "Sell results instead of vague services",
      ],
      futureStage: "Stage 10",
      title: "Outcome offers",
    },
    opportunities: {
      futureFeatures: [
        "Track matched, invited, applied, and shortlisted work",
        "Manage negotiating, won, lost, and completed outcomes",
        "Connect future pipeline intelligence",
        "Turn provider demand into an operating system",
      ],
      futureStage: "Stage 44",
      title: "Opportunities pipeline",
    },
    profile: {
      futureFeatures: [
        "Build a client-ready provider identity",
        "Show trust signals, skills, and service positioning",
        "Connect verification, proof score, and reputation",
        "Prepare public profile discovery",
      ],
      futureStage: "Stage 4",
      title: "Provider profile",
    },
    proofVault: {
      futureFeatures: [
        "Upload screenshots, PDFs, reports, certificates, and URLs",
        "Attach reusable evidence to execution plans",
        "Extract and organize proof assets",
        "Build a private credibility library",
      ],
      futureStage: "Stage 23",
      title: "Proof Vault",
    },
    settings: {
      futureFeatures: [
        "Manage provider preferences and availability",
        "Configure profile, notifications, and account controls",
        "Prepare future payout and verification settings",
        "Keep provider operations in one command center",
      ],
      futureStage: "Provider settings stage",
      title: "Provider settings",
    },
    challenges: {
      futureFeatures: [
        "Review matched client outcome challenges",
        "Filter by skill, category, proof score, and availability",
        "Prepare execution plan and application workflows",
        "Connect future smart matching signals",
      ],
      futureStage: "Stages 12, 18",
      title: "Matched challenges",
    },
  },
  shared: {
    billing: {
      futureFeatures: [
        "Manage invoices, earnings, and payment history",
        "Prepare secure payment protection workflows",
        "Connect future provider payout and client billing views",
        "Support marketplace financial operations",
      ],
      futureStage: "Payments stage",
      title: "Billing",
    },
    proof: {
      futureFeatures: [
        "Review submitted proof and approval history",
        "Track evidence attached to active work",
        "Prepare reusable proof workflows",
        "Connect private proof to public reputation",
      ],
      futureStage: "Proof workflow stage",
      title: "My Proof",
    },
  },
};

const aliasMap = {
  "active work": "active",
  "admin settings": "settings",
  "client overview": "overview",
  "client settings": "settings",
  "find providers": "providers",
  "matched challenges": "challenges",
  "my challenges": "challenges",
  "my proof": "proof",
  "outcome offers": "offers",
  "proof review": "proofs",
  "proof vault": "proofVault",
};

function toLookupKey(value) {
  return String(value ?? "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function getModulePlaceholderConfig(scope, key, fallback = {}) {
  const normalizedKey = toLookupKey(key);
  const resolvedKey = aliasMap[normalizedKey] ?? normalizedKey.replace(/\s+/g, "");
  const scopedConfig = MODULE_PLACEHOLDERS[scope]?.[resolvedKey];

  return {
    ...fallback,
    ...scopedConfig,
  };
}
