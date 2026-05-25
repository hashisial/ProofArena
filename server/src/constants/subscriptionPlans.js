export const PLAN_KEYS = {
  AGENCY: "agency",
  FREE: "free",
  PRO: "pro",
};

export const PLAN_ORDER = [PLAN_KEYS.FREE, PLAN_KEYS.PRO, PLAN_KEYS.AGENCY];

export const defaultSubscriptionPlans = [
  {
    advancedTools: false,
    apiLimitMonthly: 1000,
    description: "Start with CRM basics, contact capture, and limited prospecting.",
    features: [
      "Up to 100 leads",
      "5 scraping requests per day",
      "1,000 API requests per month",
      "Basic CRM",
    ],
    key: PLAN_KEYS.FREE,
    leadLimit: 100,
    emailLimitMonthly: 25,
    monthlyPrice: 0,
    name: "Free",
    scrapeLimitDaily: 5,
    scrapeLimitMonthly: null,
    sortOrder: 1,
    stripePriceId: "",
  },
  {
    advancedTools: true,
    apiLimitMonthly: 25000,
    description: "Run unlimited lead management with campaign automation.",
    features: [
      "Unlimited leads",
      "100 scraping requests per month",
      "25,000 API requests per month",
      "Email campaign automation",
    ],
    key: PLAN_KEYS.PRO,
    leadLimit: null,
    emailLimitMonthly: null,
    monthlyPrice: 49,
    name: "Pro",
    scrapeLimitMonthly: 100,
    sortOrder: 2,
    stripePriceId: "",
  },
  {
    advancedTools: true,
    apiLimitMonthly: 100000,
    description: "Team access and advanced analytics for agency-scale workspaces.",
    features: [
      "Unlimited leads",
      "500 scraping requests per month",
      "100,000 API requests per month",
      "Team access",
      "Advanced analytics",
    ],
    key: PLAN_KEYS.AGENCY,
    leadLimit: null,
    emailLimitMonthly: null,
    monthlyPrice: 149,
    name: "Agency",
    scrapeLimitMonthly: 500,
    sortOrder: 3,
    stripePriceId: "",
  },
];
