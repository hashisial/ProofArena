const root = (name) => Object.freeze([name]);

const authRoot = root("auth");
const accountRoot = root("account");
const profileRoot = root("profile");
const challengeRoot = root("challenges");
const applicationRoot = root("applications");
const milestoneRoot = root("milestones");
const proofRoot = root("proof");
const proofAssetRoot = root("proofAssets");
const leaderboardRoot = root("leaderboard");
const messageRoot = root("messages");
const notificationRoot = root("notifications");
const billingRoot = root("billing");
const adminRoot = root("admin");
const providerRoot = root("providers");
const savedProviderRoot = root("savedProviders");
const executionPlanRoot = root("executionPlans");
const matchRoot = root("matches");
const outcomeOfferRoot = root("outcomeOffers");
const opportunityRoot = root("opportunities");
const firstClientRoot = root("firstClient");
const socialRoot = root("social");

export const queryKeys = Object.freeze({
  auth: Object.freeze({
    all: authRoot,
    me: () => [...authRoot, "me"],
    session: () => [...authRoot, "session"],
  }),
  dashboard: Object.freeze({
    all: accountRoot,
    activityFeed: [...accountRoot, "activity-feed"],
    overview: [...accountRoot, "dashboard"],
    profile: [...accountRoot, "profile"],
  }),
  profile: Object.freeze({
    all: profileRoot,
    analytics: [...profileRoot, "me", "analytics"],
    me: [...profileRoot, "me"],
    onboardingProgress: [...profileRoot, "me", "onboarding-progress"],
    owner: [...profileRoot, "me"],
    privacy: [...profileRoot, "me", "privacy"],
    publicPreview: [...profileRoot, "me", "public-preview"],
    publicActivity: (username) => [...profileRoot, "public", username, "activity"],
    public: (username) => [...profileRoot, "public", username],
    publishedPublic: (identifier) => [...profileRoot, "published-public", identifier],
    verification: [...profileRoot, "me", "verification"],
  }),
  challenges: Object.freeze({
    all: challengeRoot,
    details: [...challengeRoot, "detail"],
    detail: (id) => [...challengeRoot, "detail", id],
    meRoot: [...challengeRoot, "me"],
    me: (filters = {}) => [...challengeRoot, "me", filters],
    publicRoot: [...challengeRoot, "public"],
    public: (filters = {}) => [...challengeRoot, "public", filters],
    publicDetail: (username, slug) => [...challengeRoot, "public", username, slug],
  }),
  applications: Object.freeze({
    all: applicationRoot,
    challenge: (challengeId, filters = {}) => [...applicationRoot, "challenge", challengeId, filters],
    detail: (applicationId) => [...applicationRoot, "detail", applicationId],
    me: (filters = {}) => [...applicationRoot, "me", filters],
  }),
  milestones: Object.freeze({
    all: milestoneRoot,
    challenge: (challengeId) => [...milestoneRoot, "challenge", challengeId],
    detail: (milestoneId) => [...milestoneRoot, "detail", milestoneId],
    engagement: (engagementId) => [...milestoneRoot, "engagement", engagementId],
  }),
  proof: Object.freeze({
    all: proofRoot,
    detail: (proofId) => [...proofRoot, "detail", proofId],
    ledger: (filters = {}) => [...proofRoot, "ledger", filters],
    submissions: (filters = {}) => [...proofRoot, "submissions", filters],
  }),
  proofAssets: Object.freeze({
    all: proofAssetRoot,
    detail: (id) => [...proofAssetRoot, "detail", id],
    meRoot: [...proofAssetRoot, "me"],
    me: (filters = {}) => [...proofAssetRoot, "me", filters],
  }),
  leaderboard: Object.freeze({
    all: leaderboardRoot,
    list: (filters = {}) => [...leaderboardRoot, "list", filters],
  }),
  messages: Object.freeze({
    all: messageRoot,
    conversation: (conversationId) => [...messageRoot, conversationId],
    conversations: () => [...messageRoot, "conversations"],
  }),
  notifications: Object.freeze({
    all: notificationRoot,
    list: (filters = {}) => [...notificationRoot, filters],
    unreadCount: () => [...notificationRoot, "unread-count"],
  }),
  billing: Object.freeze({
    all: billingRoot,
    plans: () => [...billingRoot, "plans"],
    subscription: () => [...billingRoot, "subscription"],
  }),
  admin: Object.freeze({
    all: adminRoot,
    detail: (resource, id) => [...adminRoot, resource, "detail", id],
    list: (resource, filters = {}) => [...adminRoot, resource, filters],
    overview: [...adminRoot, "overview"],
  }),
  providers: Object.freeze({
    all: providerRoot,
    compare: (providerIds = []) => [...providerRoot, "compare", providerIds],
    filters: [...providerRoot, "filters"],
    profile: (username) => [...providerRoot, "profile", username],
    public: (filters = {}) => [...providerRoot, "public", filters],
    search: (filters = {}) => [...providerRoot, "search", filters],
  }),
  savedProviders: Object.freeze({
    all: savedProviderRoot,
    me: (filters = {}) => [...savedProviderRoot, "me", filters],
    status: (providerId) => [...savedProviderRoot, "status", providerId],
  }),
  executionPlans: Object.freeze({
    all: executionPlanRoot,
    challengeRoot: [...executionPlanRoot, "challenge"],
    challenge: (challengeId, filters = {}) => [...executionPlanRoot, "challenge", challengeId, filters],
    clientDetail: (id) => [...executionPlanRoot, "client", id],
    meRoot: [...executionPlanRoot, "me"],
    me: (filters = {}) => [...executionPlanRoot, "me", filters],
    providerDetail: (id) => [...executionPlanRoot, "provider", id],
  }),
  matches: Object.freeze({
    all: matchRoot,
    challengeRoot: [...matchRoot, "challenge"],
    challengeProvidersRoot: (challengeId) => [...matchRoot, "challenge", challengeId, "providers"],
    challengeProviders: (challengeId, filters = {}) => [...matchRoot, "challenge", challengeId, "providers", filters],
    clientDetail: (id) => [...matchRoot, "client", id],
    providerRoot: [...matchRoot, "provider"],
    provider: (filters = {}) => [...matchRoot, "provider", filters],
    providerDetail: (id) => [...matchRoot, "provider", id],
  }),
  outcomeOffers: Object.freeze({
    all: outcomeOfferRoot,
    detail: (id) => [...outcomeOfferRoot, "detail", id],
    meRoot: [...outcomeOfferRoot, "me"],
    me: (filters = {}) => [...outcomeOfferRoot, "me", filters],
    publicRoot: [...outcomeOfferRoot, "public"],
    public: (filters = {}) => [...outcomeOfferRoot, "public", filters],
    publicDetail: (username, slug) => [...outcomeOfferRoot, "public", username, slug],
  }),
  opportunities: Object.freeze({
    all: opportunityRoot,
    detail: (id) => [...opportunityRoot, "detail", id],
    list: (filters = {}) => [...opportunityRoot, "list", filters],
    stats: [...opportunityRoot, "stats"],
  }),
  firstClient: Object.freeze({
    all: firstClientRoot,
    badges: () => [...firstClientRoot, "badges"],
    starterChallengesRoot: [...firstClientRoot, "starterChallenges"],
    starterChallenges: (filters = {}) => [...firstClientRoot, "starterChallenges", filters],
    status: () => [...firstClientRoot, "status"],
  }),
  social: Object.freeze({
    all: socialRoot,
    connectionStatus: (userId) => [...socialRoot, "connection", userId],
    followStatus: (userId) => [...socialRoot, "follow", userId],
  }),
});

export const QUERY_KEYS = queryKeys;

export const QUERY_KEY_GROUPS = Object.freeze({
  ADMIN: queryKeys.admin,
  APPLICATIONS: queryKeys.applications,
  AUTH: queryKeys.auth,
  BILLING: queryKeys.billing,
  CHALLENGES: queryKeys.challenges,
  DASHBOARD: queryKeys.dashboard,
  LEADERBOARD: queryKeys.leaderboard,
  MESSAGES: queryKeys.messages,
  MILESTONES: queryKeys.milestones,
  NOTIFICATIONS: queryKeys.notifications,
  PROFILE: queryKeys.profile,
  PROOF: queryKeys.proof,
});
