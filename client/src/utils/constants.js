export {
  APP_BRAND,
  APP_NAV_ITEMS,
  COMPANY_NAME,
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  ROUTES,
  USER_ROLES,
} from "../constants/index.js";

export const SERVICE_CATEGORY_META = [
  {
    id: "growth",
    label: "Growth Systems",
    description: "Acquire better leads and convert them through tighter funnels.",
  },
  {
    id: "crypto",
    label: "Crypto Support",
    description: "Run high-trust Web3 support across chat, email, and community.",
  },
  {
    id: "dev",
    label: "Development",
    description: "Build scalable websites, apps, and SaaS platforms.",
  },
  {
    id: "business",
    label: "Business Support",
    description: "Reduce operating drag with reliable admin and back-office systems.",
  },
];

export const DEFAULT_MARKETPLACE_CATEGORIES = [
  {
    description: "Lead capture, qualification, funnels, and conversion systems for growth teams.",
    icon: "LG",
    name: "Lead Generation",
    slug: "lead-generation",
  },
  {
    description: "Live chat, email handling, help desk workflows, and customer response operations.",
    icon: "CS",
    name: "Customer Support",
    slug: "customer-support",
  },
  {
    description: "Web3-native support, community moderation, ticket handling, and crypto operations.",
    icon: "CR",
    name: "Crypto Support",
    slug: "crypto-support",
  },
  {
    description: "Modern websites, landing pages, CMS builds, and performance-focused web experiences.",
    icon: "WD",
    name: "Website Development",
    slug: "website-development",
  },
  {
    description: "Mobile and web application builds with scalable product architecture.",
    icon: "AD",
    name: "App Development",
    slug: "app-development",
  },
  {
    description: "SaaS platforms, dashboards, subscription products, and multi-tenant systems.",
    icon: "SD",
    name: "SaaS Development",
    slug: "saas-development",
  },
  {
    description: "Administrative support, scheduling, research, inbox management, and operations help.",
    icon: "VA",
    name: "Virtual Assistant",
    slug: "virtual-assistant",
  },
  {
    description: "Real estate lead systems, admin workflows, CRM cleanup, and agent support.",
    icon: "RE",
    name: "Real Estate Support",
    slug: "real-estate-support",
  },
  {
    description: "Automated workflows, integrations, CRM logic, and repeatable operations systems.",
    icon: "AU",
    name: "Automation",
    slug: "automation",
  },
  {
    description: "Outbound systems, email campaigns, sales workflows, and outreach operations.",
    icon: "SO",
    name: "Sales & Outreach",
    slug: "sales-outreach",
  },
];

export const FALLBACK_SERVICES = [
  {
    _id: "fallback-growth",
    title: "Growth Systems",
    category: "growth",
    description:
      "Performance-focused acquisition systems built around lead quality, speed to contact, and conversion tracking.",
    features: ["Lead generation", "Sales funnels", "CRM setup"],
    icon: "GS",
  },
  {
    _id: "fallback-crypto",
    title: "Crypto Customer Support",
    category: "crypto",
    description:
      "Always-on support operations for crypto teams that need fast responses and community trust.",
    features: ["Live chat support", "Email handling", "Community moderation"],
    icon: "CS",
  },
  {
    _id: "fallback-dev",
    title: "Development Solutions",
    category: "dev",
    description:
      "Custom digital products engineered for performance, clean UX, and long-term scale.",
    features: ["Website development", "App development", "SaaS platforms"],
    icon: "DV",
  },
  {
    _id: "fallback-business",
    title: "Business Support",
    category: "business",
    description:
      "Operational support that saves time, lowers overhead, and keeps teams focused on revenue.",
    features: ["Virtual assistants", "Real estate lead systems", "Admin support"],
    icon: "BS",
  },
];

export const FALLBACK_PORTFOLIO = [
  {
    _id: "fallback-real-estate",
    title: "Lead Engine for Property Team",
    industry: "Real Estate",
    description:
      "Built a localized funnel and CRM workflow that turned cold traffic into booked buyer calls.",
    results: ["500+ leads generated", "41% lower cost per lead", "3.2x booking rate"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
    mediaType: "image",
    beforeState: "Cold traffic and scattered follow-up.",
    afterState: "Localized funnel with CRM automation and booked buyer calls.",
    testimonial: "The pipeline finally became measurable and predictable.",
    tags: ["Real Estate", "Lead Gen", "CRM"],
  },
  {
    _id: "fallback-crypto",
    title: "Support Desk for Web3 Platform",
    industry: "Crypto",
    description:
      "Launched a support system for live chat, email triage, and community escalation.",
    results: ["24/7 coverage", "38% faster response time", "12k+ tickets handled"],
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=1400&q=80",
    mediaType: "image",
    beforeState: "Support volume was hard to triage across community channels.",
    afterState: "Escalation flows, ticket routing, and always-on coverage.",
    testimonial: "Response quality improved without adding internal overhead.",
    tags: ["Crypto", "Support", "Web3"],
  },
  {
    _id: "fallback-saas",
    title: "SaaS Conversion Upgrade",
    industry: "SaaS",
    description:
      "Refined product messaging, landing page structure, and onboarding CTAs.",
    results: ["3x conversion rate", "28% demo lift", "19% churn reduction"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    mediaType: "image",
    beforeState: "Unclear messaging and weak onboarding CTAs.",
    afterState: "Sharper conversion path from first visit to demo request.",
    testimonial: "The product story became easier for buyers to understand.",
    tags: ["SaaS", "Conversion", "UX"],
  },
  {
    _id: "fallback-services",
    title: "Back Office Automation",
    industry: "Business",
    description:
      "Automated repetitive admin work and created reporting workflows for leadership.",
    results: ["16 hours saved weekly", "2.4x task throughput", "Zero missed handoffs"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    mediaType: "image",
    beforeState: "Manual admin processes and missed ownership handoffs.",
    afterState: "Automated reporting and clear operating rhythms.",
    testimonial: "The team recovered time every week without losing visibility.",
    tags: ["Operations", "Automation", "Business"],
  },
];
