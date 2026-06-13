export const API_ENDPOINTS = Object.freeze({
  HEALTH: "/health",
  HEALTH_STATUS: "/health/status",

  AUTH_STATUS: "/auth/status",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  ME: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  CHANGE_PASSWORD: "/auth/change-password",

  USERS_STATUS: "/users/status",
  ACCOUNT: Object.freeze({
    ACTIVITY_FEED: "/account/activity-feed",
    DASHBOARD: "/account/dashboard",
    PROFILE: "/account/profile",
  }),
  PROFILE: "/profile",
  PROFILE_ABOUT: "/profile/about",
  PROFILE_ANALYTICS: "/profile/me/analytics",
  PROFILE_AVATAR: "/profile/avatar",
  PROFILE_COVER: "/profile/cover",
  PROFILE_EDUCATION: "/profile/education",
  PROFILE_EDUCATION_ITEM: (educationId) => `/profile/education/${encodeURIComponent(educationId)}`,
  PROFILE_EXPERIENCE: "/profile/experience",
  PROFILE_EXPERIENCE_ITEM: (experienceId) => `/profile/experience/${encodeURIComponent(experienceId)}`,
  PROFILE_UPLOAD_AVATAR: "/profile/upload-avatar",
  PROFILE_UPLOAD_COVER: "/profile/upload-cover",
  PROFILE_INTRO: "/profile/intro",
  PROFILE_ME: "/profile/me",
  PROFILE_OPEN_TO: "/profile/open-to",
  PROFILE_PRIVACY: "/profile/privacy",
  PROFILE_SERVICES: "/profile/services",
  PROFILE_SERVICE_ITEM: (serviceId) => `/profile/services/${encodeURIComponent(serviceId)}`,
  PROFILE_SKILLS: "/profile/skills",
  PROFILE_UPDATE_ME: "/profile/me",
  PROFILE_PUBLIC_BY_USERNAME: (username) => `/profile/${encodeURIComponent(username)}`,
  PROFILE_PUBLIC_ACTIVITY: (username) => `/profile/${encodeURIComponent(username)}/activity`,
  PROFILE_VERIFICATION: "/profile/verification",
  PROFILE_VERIFICATION_REQUEST: "/profile/verification/request",

  CONNECTION_STATUS: (userId) => `/connections/status/${encodeURIComponent(userId)}`,
  CONNECTION_REQUEST: (userId) => `/connections/request/${encodeURIComponent(userId)}`,
  CONNECTION_WITH_USER: (userId) => `/connections/user/${encodeURIComponent(userId)}`,

  FOLLOW_STATUS: (userId) => `/follows/status/${encodeURIComponent(userId)}`,
  FOLLOW_USER: (userId) => `/follows/${encodeURIComponent(userId)}`,

  CHALLENGES: Object.freeze({
    ARCHIVE: (id) => `/challenges/${encodeURIComponent(id)}/archive`,
    BASE: "/challenges",
    CLOSE: (id) => `/challenges/${encodeURIComponent(id)}/close`,
    DETAIL_BY_ID: (id) => `/challenges/id/${encodeURIComponent(id)}`,
    DETAIL_BY_SLUG: (username, slug) =>
      `/challenges/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    MY: "/challenges/me",
    PAUSE: (id) => `/challenges/${encodeURIComponent(id)}/pause`,
    PUBLISH: (id) => `/challenges/${encodeURIComponent(id)}/publish`,
  }),
  EXECUTION_PLANS: Object.freeze({
    ACCEPT: (id) => `/execution-plans/${encodeURIComponent(id)}/accept`,
    BASE: "/execution-plans",
    BY_CHALLENGE: (challengeId) =>
      `/execution-plans/challenge/${encodeURIComponent(challengeId)}`,
    CLIENT_DETAIL: (id) => `/execution-plans/client/${encodeURIComponent(id)}`,
    DETAIL_BY_ID: (id) => `/execution-plans/id/${encodeURIComponent(id)}`,
    MY: "/execution-plans/me",
    REJECT: (id) => `/execution-plans/${encodeURIComponent(id)}/reject`,
    SHORTLIST: (id) => `/execution-plans/${encodeURIComponent(id)}/shortlist`,
    WITHDRAW: (id) => `/execution-plans/${encodeURIComponent(id)}/withdraw`,
  }),
  MATCHES: Object.freeze({
    CHALLENGE_PROVIDERS: (challengeId) =>
      `/matches/challenge/${encodeURIComponent(challengeId)}/providers`,
    CHALLENGE_REFRESH: (challengeId) =>
      `/matches/challenge/${encodeURIComponent(challengeId)}/refresh`,
    CLIENT_DETAIL: (id) => `/matches/client/${encodeURIComponent(id)}`,
    CLIENT_STATUS: (id) => `/matches/client/${encodeURIComponent(id)}/status`,
    PROVIDER: "/matches/provider",
    PROVIDER_DETAIL: (id) => `/matches/provider/${encodeURIComponent(id)}`,
    PROVIDER_REFRESH: "/matches/provider/refresh",
    PROVIDER_STATUS: (id) => `/matches/provider/${encodeURIComponent(id)}/status`,
  }),
  FIRST_CLIENT: Object.freeze({
    BADGES: "/first-client/badges",
    REFRESH: "/first-client/refresh",
    STARTER_CHALLENGES: "/first-client/starter-challenges",
    STATUS: "/first-client/status",
  }),
  OUTCOME_OFFERS: Object.freeze({
    ARCHIVE: (id) => `/outcome-offers/${encodeURIComponent(id)}/archive`,
    BASE: "/outcome-offers",
    DETAIL_BY_ID: (id) => `/outcome-offers/id/${encodeURIComponent(id)}`,
    DETAIL_BY_SLUG: (username, slug) =>
      `/outcome-offers/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    MY: "/outcome-offers/me",
    PAUSE: (id) => `/outcome-offers/${encodeURIComponent(id)}/pause`,
    PUBLISH: (id) => `/outcome-offers/${encodeURIComponent(id)}/publish`,
  }),
  OPPORTUNITIES: Object.freeze({
    ARCHIVE: (id) => `/opportunities/${encodeURIComponent(id)}/archive`,
    BASE: "/opportunities",
    COMPLETE_NEXT_ACTION: (id) => `/opportunities/${encodeURIComponent(id)}/next-action/complete`,
    DETAIL: (id) => `/opportunities/${encodeURIComponent(id)}`,
    NEXT_ACTION: (id) => `/opportunities/${encodeURIComponent(id)}/next-action`,
    NOTES: (id) => `/opportunities/${encodeURIComponent(id)}/notes`,
    STAGE: (id) => `/opportunities/${encodeURIComponent(id)}/stage`,
    STATS: "/opportunities/stats",
  }),
  PROOF_ASSETS: Object.freeze({
    ATTACH: (id) => `/proof-assets/${encodeURIComponent(id)}/attach`,
    BASE: "/proof-assets",
    DETACH: (id) => `/proof-assets/${encodeURIComponent(id)}/detach`,
    DETAIL_BY_ID: (id) => `/proof-assets/id/${encodeURIComponent(id)}`,
    MY: "/proof-assets/me",
  }),
  PROVIDERS: Object.freeze({
    BASE: "/providers",
    COMPARE: "/providers/compare",
    FILTERS: "/providers/filters",
    PUBLIC_PROFILE: (username) => `/profile/${encodeURIComponent(username)}`,
  }),
  SAVED_PROVIDERS: Object.freeze({
    BASE: "/saved-providers",
    STATUS: (providerId) => `/saved-providers/provider/${encodeURIComponent(providerId)}/status`,
    UNSAVE: (providerId) => `/saved-providers/provider/${encodeURIComponent(providerId)}`,
  }),
  APPLICATIONS: Object.freeze({
    BASE: "/applications",
    BY_CHALLENGE: (challengeId) => `/applications/challenge/${encodeURIComponent(challengeId)}`,
    MY: "/applications/me",
  }),
  MILESTONES: Object.freeze({
    BASE: "/milestones",
    BY_CHALLENGE: (challengeId) => `/milestones/challenge/${encodeURIComponent(challengeId)}`,
    DETAIL: (milestoneId) => `/milestones/${encodeURIComponent(milestoneId)}`,
  }),
  PROOFS: "/proofs",
  PROOF_LEDGER: "/proof-ledger",
  LEADERBOARD: "/leaderboard",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  SAVED: "/saved",
  BILLING: Object.freeze({
    BASE: "/billing",
    CHECKOUT_SESSION: "/billing/checkout-session",
    PLANS: "/billing/plans",
    PORTAL: "/billing/portal-session",
    PORTAL_SESSION: "/billing/portal-session",
    SELECT_FREE: "/billing/select-free",
    STATUS: "/billing/subscription",
    SUBSCRIPTION: "/billing/subscription",
  }),
  ADMIN: Object.freeze({
    BASE: "/admin",
    CHALLENGES: "/admin/challenges",
    CHALLENGE_MODERATION: (id) => `/admin/challenges/${encodeURIComponent(id)}/moderation`,
    DISPUTES: "/admin/disputes",
    OFFERS: "/admin/outcome-offers",
    OFFER_MODERATION: (id) => `/admin/outcome-offers/${encodeURIComponent(id)}/moderation`,
    OVERVIEW: "/admin/overview",
    PROOF_ASSETS: "/admin/proof-assets",
    PROOF_ASSET_MODERATION: (id) => `/admin/proof-assets/${encodeURIComponent(id)}/moderation`,
    PROOF_REVIEW: "/admin/proof-review",
    PROVIDERS: "/admin/providers",
    PROVIDER_MODERATION: (id) => `/admin/providers/${encodeURIComponent(id)}/moderation`,
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
    USER: (id) => `/admin/users/${encodeURIComponent(id)}`,
    USERS: "/admin/users",
    USER_STATUS: (id) => `/admin/users/${encodeURIComponent(id)}/status`,
  }),
});

export const AUTH_API = Object.freeze({
  CHANGE_PASSWORD: API_ENDPOINTS.CHANGE_PASSWORD,
  FORGOT_PASSWORD: API_ENDPOINTS.FORGOT_PASSWORD,
  LOGIN: API_ENDPOINTS.LOGIN,
  LOGOUT: API_ENDPOINTS.LOGOUT,
  ME: API_ENDPOINTS.ME,
  REFRESH: API_ENDPOINTS.REFRESH_TOKEN,
  REFRESH_ALIAS: "/auth/refresh",
  REFRESH_TOKEN: API_ENDPOINTS.REFRESH_TOKEN,
  REGISTER: API_ENDPOINTS.REGISTER,
  RESEND_VERIFICATION: API_ENDPOINTS.RESEND_VERIFICATION,
  RESET_PASSWORD: API_ENDPOINTS.RESET_PASSWORD,
  STATUS: API_ENDPOINTS.AUTH_STATUS,
  VERIFY_EMAIL: API_ENDPOINTS.VERIFY_EMAIL,
});

export const PROFILE_API = Object.freeze({
  ACTIVITY: API_ENDPOINTS.PROFILE_PUBLIC_ACTIVITY,
  AVATAR_UPLOAD: API_ENDPOINTS.PROFILE_AVATAR,
  COVER_UPLOAD: API_ENDPOINTS.PROFILE_COVER,
  OWNER: API_ENDPOINTS.PROFILE_ME,
  PRIVACY: API_ENDPOINTS.PROFILE_PRIVACY,
  PUBLIC_PROFILE: API_ENDPOINTS.PROFILE_PUBLIC_BY_USERNAME,
  UPDATE: API_ENDPOINTS.PROFILE_UPDATE_ME,
  VERIFICATION: API_ENDPOINTS.PROFILE_VERIFICATION,
});

const PROOF_SUBMISSIONS_API = Object.freeze({
  BASE: API_ENDPOINTS.PROOFS,
  DETAIL: (proofId) => `${API_ENDPOINTS.PROOFS}/${encodeURIComponent(proofId)}`,
});

export const PROOFARENA_API = Object.freeze({
  APPLICATIONS: API_ENDPOINTS.APPLICATIONS,
  CHALLENGE_DETAILS: API_ENDPOINTS.CHALLENGES.DETAIL_BY_ID,
  CHALLENGES: API_ENDPOINTS.CHALLENGES,
  EXECUTION_PLANS: API_ENDPOINTS.EXECUTION_PLANS,
  FIRST_CLIENT: API_ENDPOINTS.FIRST_CLIENT,
  LEADERBOARD: API_ENDPOINTS.LEADERBOARD,
  MATCHES: API_ENDPOINTS.MATCHES,
  MILESTONES: API_ENDPOINTS.MILESTONES,
  OPPORTUNITIES: API_ENDPOINTS.OPPORTUNITIES,
  OUTCOME_OFFERS: API_ENDPOINTS.OUTCOME_OFFERS,
  PROOF_ASSETS: API_ENDPOINTS.PROOF_ASSETS,
  PROOF_LEDGER: API_ENDPOINTS.PROOF_LEDGER,
  PROOF_SUBMISSIONS: PROOF_SUBMISSIONS_API,
  PROVIDERS: API_ENDPOINTS.PROVIDERS,
  SAVED_PROVIDERS: API_ENDPOINTS.SAVED_PROVIDERS,
});

const NOTIFICATIONS_API = Object.freeze({
  BASE: API_ENDPOINTS.NOTIFICATIONS,
  DELETE: (notificationId) =>
    `${API_ENDPOINTS.NOTIFICATIONS}/${encodeURIComponent(notificationId)}`,
  READ: (notificationId) =>
    `${API_ENDPOINTS.NOTIFICATIONS}/${encodeURIComponent(notificationId)}/read`,
  READ_ALL: `${API_ENDPOINTS.NOTIFICATIONS}/read-all`,
  UNREAD_COUNT: `${API_ENDPOINTS.NOTIFICATIONS}/unread-count`,
});

const MESSAGES_API = Object.freeze({
  ATTACHMENTS: `${API_ENDPOINTS.MESSAGES}/attachments`,
  BASE: API_ENDPOINTS.MESSAGES,
  CONVERSATIONS: `${API_ENDPOINTS.MESSAGES}/conversations`,
  CONVERSATION_MESSAGES: (conversationId) =>
    `${API_ENDPOINTS.MESSAGES}/conversations/${encodeURIComponent(conversationId)}/messages`,
  DELETE: (messageId) => `${API_ENDPOINTS.MESSAGES}/${encodeURIComponent(messageId)}`,
  PRESENCE: `${API_ENDPOINTS.MESSAGES}/presence`,
  READ: (messageId) => `${API_ENDPOINTS.MESSAGES}/${encodeURIComponent(messageId)}/read`,
  READ_CONVERSATION: (conversationId) =>
    `${API_ENDPOINTS.MESSAGES}/conversations/${encodeURIComponent(conversationId)}/read`,
});

const SAVED_API = Object.freeze({
  BASE: API_ENDPOINTS.SAVED,
  DELETE: (savedItemId) => `${API_ENDPOINTS.SAVED}/${encodeURIComponent(savedItemId)}`,
});

export const DASHBOARD_API = Object.freeze({
  ACCOUNT: API_ENDPOINTS.ACCOUNT,
  BILLING: API_ENDPOINTS.BILLING,
  MESSAGES: MESSAGES_API,
  NOTIFICATIONS: NOTIFICATIONS_API,
  SAVED: SAVED_API,
  SETTINGS: PROFILE_API.PRIVACY,
});

export const ADMIN_API = Object.freeze({
  CHALLENGES: API_ENDPOINTS.ADMIN.CHALLENGES,
  DISPUTES: API_ENDPOINTS.ADMIN.DISPUTES,
  PROOF_REVIEW: API_ENDPOINTS.ADMIN.PROOF_REVIEW,
  PROVIDERS: API_ENDPOINTS.ADMIN.PROVIDERS,
  REPORTS: API_ENDPOINTS.ADMIN.REPORTS,
  SETTINGS: API_ENDPOINTS.ADMIN.SETTINGS,
  USER: API_ENDPOINTS.ADMIN.USER,
  USERS: API_ENDPOINTS.ADMIN.USERS,
});

export function getPublicProfileEndpoint(username) {
  return PROFILE_API.PUBLIC_PROFILE(username);
}

export function getChallengeEndpoint(challengeId) {
  return PROOFARENA_API.CHALLENGE_DETAILS(challengeId);
}

export function getApplicationEndpoint(applicationId) {
  return `${PROOFARENA_API.APPLICATIONS.BASE}/${encodeURIComponent(applicationId)}`;
}

export function getProofEndpoint(proofId) {
  return PROOFARENA_API.PROOF_SUBMISSIONS.DETAIL(proofId);
}

export function getAdminUserEndpoint(userId) {
  return ADMIN_API.USER(userId);
}

export const API_GROUPS = Object.freeze({
  ADMIN: ADMIN_API,
  AUTH: AUTH_API,
  DASHBOARD: DASHBOARD_API,
  PROFILE: PROFILE_API,
  PROOFARENA: PROOFARENA_API,
});

export const API_ENDPOINT_GROUPS = Object.freeze({
  AUTH: Object.freeze({
    LOGIN: API_ENDPOINTS.LOGIN,
    LOGOUT: API_ENDPOINTS.LOGOUT,
    ME: API_ENDPOINTS.ME,
    FORGOT_PASSWORD: API_ENDPOINTS.FORGOT_PASSWORD,
    REGISTER: API_ENDPOINTS.REGISTER,
    REFRESH_TOKEN: API_ENDPOINTS.REFRESH_TOKEN,
    RESET_PASSWORD: API_ENDPOINTS.RESET_PASSWORD,
    RESEND_VERIFICATION: API_ENDPOINTS.RESEND_VERIFICATION,
    STATUS: API_ENDPOINTS.AUTH_STATUS,
    VERIFY_EMAIL: API_ENDPOINTS.VERIFY_EMAIL,
    CHANGE_PASSWORD: API_ENDPOINTS.CHANGE_PASSWORD,
  }),
  ACCOUNT: API_ENDPOINTS.ACCOUNT,
  HEALTH: Object.freeze({
    ROOT: API_ENDPOINTS.HEALTH,
    STATUS: API_ENDPOINTS.HEALTH_STATUS,
  }),
  USERS: Object.freeze({
    PROFILE: API_ENDPOINTS.PROFILE,
    STATUS: API_ENDPOINTS.USERS_STATUS,
  }),
  ADMIN: API_ENDPOINTS.ADMIN,
  PROFILE: Object.freeze({
    ABOUT: API_ENDPOINTS.PROFILE_ABOUT,
    ANALYTICS: API_ENDPOINTS.PROFILE_ANALYTICS,
    AVATAR: API_ENDPOINTS.PROFILE_AVATAR,
    COVER: API_ENDPOINTS.PROFILE_COVER,
    EDUCATION: API_ENDPOINTS.PROFILE_EDUCATION,
    EDUCATION_ITEM: API_ENDPOINTS.PROFILE_EDUCATION_ITEM,
    EXPERIENCE: API_ENDPOINTS.PROFILE_EXPERIENCE,
    EXPERIENCE_ITEM: API_ENDPOINTS.PROFILE_EXPERIENCE_ITEM,
    INTRO: API_ENDPOINTS.PROFILE_INTRO,
    ME: API_ENDPOINTS.PROFILE_ME,
    OPEN_TO: API_ENDPOINTS.PROFILE_OPEN_TO,
    PRIVACY: API_ENDPOINTS.PROFILE_PRIVACY,
    PUBLIC: API_ENDPOINTS.PROFILE,
    PUBLIC_ACTIVITY: API_ENDPOINTS.PROFILE_PUBLIC_ACTIVITY,
    PUBLIC_BY_USERNAME: API_ENDPOINTS.PROFILE_PUBLIC_BY_USERNAME,
    SERVICES: API_ENDPOINTS.PROFILE_SERVICES,
    SERVICE_ITEM: API_ENDPOINTS.PROFILE_SERVICE_ITEM,
    SKILLS: API_ENDPOINTS.PROFILE_SKILLS,
    UPDATE_ME: API_ENDPOINTS.PROFILE_UPDATE_ME,
    VERIFICATION: API_ENDPOINTS.PROFILE_VERIFICATION,
    VERIFICATION_REQUEST: API_ENDPOINTS.PROFILE_VERIFICATION_REQUEST,
  }),
  SOCIAL: Object.freeze({
    CONNECTION_REQUEST: API_ENDPOINTS.CONNECTION_REQUEST,
    CONNECTION_STATUS: API_ENDPOINTS.CONNECTION_STATUS,
    CONNECTION_WITH_USER: API_ENDPOINTS.CONNECTION_WITH_USER,
    FOLLOW_STATUS: API_ENDPOINTS.FOLLOW_STATUS,
    FOLLOW_USER: API_ENDPOINTS.FOLLOW_USER,
  }),
  CHALLENGES: API_ENDPOINTS.CHALLENGES,
  APPLICATIONS: API_ENDPOINTS.APPLICATIONS,
  BILLING: API_ENDPOINTS.BILLING,
  EXECUTION_PLANS: API_ENDPOINTS.EXECUTION_PLANS,
  FIRST_CLIENT: API_ENDPOINTS.FIRST_CLIENT,
  LEADERBOARD: API_ENDPOINTS.LEADERBOARD,
  MATCHES: API_ENDPOINTS.MATCHES,
  MESSAGES: API_ENDPOINTS.MESSAGES,
  MILESTONES: API_ENDPOINTS.MILESTONES,
  NOTIFICATIONS: API_ENDPOINTS.NOTIFICATIONS,
  OUTCOME_OFFERS: API_ENDPOINTS.OUTCOME_OFFERS,
  OPPORTUNITIES: API_ENDPOINTS.OPPORTUNITIES,
  PROOF_ASSETS: API_ENDPOINTS.PROOF_ASSETS,
  PROOFS: API_ENDPOINTS.PROOFS,
  PROVIDERS: API_ENDPOINTS.PROVIDERS,
  SAVED_PROVIDERS: API_ENDPOINTS.SAVED_PROVIDERS,
});
