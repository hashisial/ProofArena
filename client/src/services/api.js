import { apiClient, apiDelete, apiGet, apiPatch, apiPost, apiPostForm, withAuth } from "./apiClient.js";
import { API_ENDPOINTS } from "../constants/index.js";
import { authService } from "../features/auth/authService.js";
import { profileService } from "../features/profile/profileService.js";
import {
  DEFAULT_MARKETPLACE_CATEGORIES,
  FALLBACK_PORTFOLIO,
  FALLBACK_SERVICES,
} from "../utils/constants.js";

function getCollection(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  return [];
}

export async function getHealthStatus() {
  return apiGet(API_ENDPOINTS.HEALTH);
}

export async function getServices() {
  try {
    const services = getCollection(await apiGet("/services", { skipUserAuth: true }));
    return services.length > 0 ? services : FALLBACK_SERVICES;
  } catch (error) {
    if (error.message === "Network Error" || error.status >= 500) {
      return FALLBACK_SERVICES;
    }

    throw error;
  }
}

export async function getPortfolio() {
  try {
    const portfolio = getCollection(await apiGet("/portfolio", { skipUserAuth: true }));
    return portfolio.length > 0 ? portfolio : FALLBACK_PORTFOLIO;
  } catch (error) {
    if (error.message === "Network Error" || error.status >= 500) {
      return FALLBACK_PORTFOLIO;
    }

    throw error;
  }
}

export async function getBlogs(placement) {
  const query = placement ? `?placement=${encodeURIComponent(placement)}` : "";
  return getCollection(await apiGet(`/blogs${query}`, { skipUserAuth: true }));
}

export async function getBlogBySlug(slug) {
  return apiGet(`/blogs/${slug}`, { skipUserAuth: true });
}

export async function getReviews() {
  return getCollection(await apiGet("/reviews", { skipUserAuth: true }));
}

export async function getServiceReviews(serviceId) {
  return getCollection(
    await apiGet(`/reviews/service/${encodeURIComponent(serviceId)}`, {
      skipUserAuth: true,
    }),
  );
}

export async function getProviderReviews(providerId) {
  return getCollection(
    await apiGet(`/reviews/provider/${encodeURIComponent(providerId)}`, {
      skipUserAuth: true,
    }),
  );
}

export async function submitLead(leadData) {
  return apiPost("/contact", leadData);
}

export async function trackPageVisit(visitData) {
  return apiPost("/analytics/visits", visitData);
}

export async function trackMarketplaceEvent(eventData) {
  return apiPost("/analytics/events", eventData);
}

export async function loginAdmin(credentials) {
  return authService.login(credentials);
}

export async function registerUser(accountData) {
  return authService.register(accountData);
}

export async function loginUser(credentials) {
  return authService.login(credentials);
}

export async function refreshUserSession() {
  return authService.refreshToken();
}

export async function logoutUser() {
  return authService.logout();
}

export async function requestPasswordReset(email) {
  return authService.forgotPassword(email);
}

export async function resetPassword(payload) {
  return authService.resetPassword(payload);
}

export async function verifyEmail(payload) {
  return authService.verifyEmail(payload);
}

export async function changePassword(payload) {
  return authService.changePassword(payload);
}

export async function getCurrentUser() {
  return authService.getCurrentUser();
}

export async function getMyLeads(sort = "desc") {
  const data = await apiGet(`/account/leads?sort=${sort}`);

  return getCollection(data);
}

export async function getMyDashboard() {
  return apiGet("/account/dashboard");
}

export async function getMyActivityFeed() {
  return getCollection(await apiGet("/account/activity-feed"));
}

export async function getMyProfile() {
  return profileService.getMyProfile();
}

export async function updateMyProfile(profileData) {
  return profileService.updateMyProfile(profileData);
}

export async function uploadMyProfileMedia({ file, type }) {
  if (type === "avatar") {
    return uploadProfileAvatar(file);
  }

  return uploadProfileCover(file);
}

export async function getPublicProfile(username) {
  return profileService.getPublicProfile(username);
}

export async function updateProfile(profileData) {
  return profileService.updateMyProfile(profileData);
}

export async function uploadProfileAvatar(file) {
  const formData = new FormData();
  formData.append("image", file);

  return profileService.uploadAvatar(formData);
}

export async function uploadProfileCover(file) {
  const formData = new FormData();
  formData.append("image", file);

  return profileService.uploadCover(formData);
}

export async function getSubscriptionPlans() {
  return getCollection(await apiGet("/billing/plans", { skipUserAuth: true }));
}

export async function getMySubscription() {
  return apiGet("/billing/subscription");
}

export async function createCheckoutSession(planKey) {
  return apiPost("/billing/checkout-session", { planKey });
}

export async function createCustomerPortalSession() {
  return apiPost("/billing/portal-session", {});
}

export async function selectFreePlan() {
  return apiPost("/billing/select-free", {});
}

export async function createMyLead(leadData) {
  return apiPost("/account/leads", leadData);
}

export async function importMyLeads(leads) {
  return apiPost("/account/leads/import", { leads });
}

export async function updateMyLead(id, leadData) {
  return apiPatch(`/account/leads/${id}`, leadData);
}

export async function deleteMyLead(id) {
  return apiDelete(`/account/leads/${id}`);
}

export async function startLeadScrape(scrapeData) {
  if (typeof scrapeData === "string") {
    return apiPost("/account/lead-scrapes", { keyword: scrapeData });
  }

  return apiPost("/account/lead-scrapes", scrapeData);
}

export async function getLeadScrapeJobs() {
  return getCollection(await apiGet("/account/lead-scrapes"));
}

export async function getLeadScrapeJob(id) {
  return apiGet(`/account/lead-scrapes/${id}`);
}

export async function getCampaigns() {
  return getCollection(await apiGet("/account/campaigns"));
}

export async function createCampaign(campaignData) {
  return apiPost("/account/campaigns", campaignData);
}

export async function updateCampaign(id, campaignData) {
  return apiPatch(`/account/campaigns/${id}`, campaignData);
}

export async function startCampaign(id) {
  return apiPost(`/account/campaigns/${id}/start`, {});
}

export async function getEmailTemplates() {
  return getCollection(await apiGet("/account/email-templates"));
}

export async function createEmailTemplate(templateData) {
  return apiPost("/account/email-templates", templateData);
}

export async function updateEmailTemplate(id, templateData) {
  return apiPatch(`/account/email-templates/${id}`, templateData);
}

export async function deleteEmailTemplate(id) {
  return apiDelete(`/account/email-templates/${id}`);
}

export async function sendOutreachEmail({ leadId, templateId }) {
  return apiPost("/account/outreach-emails", { leadId, templateId });
}

export async function getOutreachEmails() {
  return getCollection(await apiGet("/account/outreach-emails"));
}

export async function startOutreachAutomation({ statusFilter, templateId }) {
  return apiPost("/account/outreach-jobs", { statusFilter, templateId });
}

export async function getOutreachJobs() {
  return getCollection(await apiGet("/account/outreach-jobs"));
}

export async function getMyServices() {
  return getCollection(await apiGet("/account/services"));
}

export async function createMyService(serviceData) {
  return apiPost("/account/services", serviceData);
}

export async function uploadMyServiceImages(files = []) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });

  return apiPostForm("/account/services/images", formData);
}

export async function getMyPortfolio() {
  return getCollection(await apiGet("/account/portfolio"));
}

export async function getMyReviews() {
  return getCollection(await apiGet("/account/reviews"));
}

export async function createMyReview(reviewData) {
  return apiPost("/account/reviews", reviewData);
}

export async function getConversations() {
  return getCollection(await apiGet("/conversations"));
}

export async function startConversation(participantId) {
  return apiPost("/conversations/direct", { participantId, targetUserId: participantId });
}

export async function startAdminConversation() {
  return apiPost("/conversations/support", {});
}

export async function getConversationMessages(conversationId) {
  return getCollection(await apiGet(`/conversations/${conversationId}/messages`));
}

export async function sendConversationMessage(conversationId, messageData) {
  return apiPost(`/conversations/${conversationId}/messages`, messageData);
}

export async function deleteConversationMessage(messageId) {
  return apiDelete(`/messages/${encodeURIComponent(messageId)}`);
}

export async function markConversationRead(conversationId) {
  return apiPatch(`/conversations/${conversationId}/read`, {});
}

export async function uploadMessageAttachments(files) {
  const formData = new FormData();

  Array.from(files ?? []).forEach((file) => {
    formData.append("attachments", file);
  });

  return getCollection(await apiPostForm("/messages/attachments", formData));
}

export async function getNotifications({ type = "", unreadOnly = false } = {}) {
  const params = new URLSearchParams();

  if (unreadOnly) {
    params.set("unreadOnly", "true");
  }

  if (type) {
    params.set("type", type);
  }

  const query = params.toString();
  return getCollection(await apiGet(`/notifications${query ? `?${query}` : ""}`));
}

export async function getUnreadNotificationCount() {
  return apiGet("/notifications/unread-count");
}

export async function markNotificationRead(notificationId) {
  return apiPatch(`/notifications/${notificationId}/read`, {});
}

export async function markAllNotificationsRead() {
  return apiPatch("/notifications/read-all", {});
}

export async function deleteNotification(notificationId) {
  return apiDelete(`/notifications/${encodeURIComponent(notificationId)}`);
}

export async function getPresence(userIds) {
  return getCollection(await apiPost("/messages/presence", { userIds }));
}

export async function getConnections(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return getCollection(await apiGet(`/connections${query ? `?${query}` : ""}`));
}

export async function getAcceptedConnections() {
  return getCollection(await apiGet("/connections/accepted"));
}

export async function getReceivedConnectionRequests() {
  return getCollection(await apiGet("/connections/requests"));
}

export async function getSentConnectionRequests() {
  return getCollection(await apiGet("/connections/sent"));
}

export async function getConnectionSuggestions(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return getCollection(await apiGet(`/connections/suggestions${query ? `?${query}` : ""}`));
}

export async function searchConnectionCandidates(q) {
  const params = new URLSearchParams();

  if (q) {
    params.set("q", q);
  }

  return getCollection(await apiGet(`/connections/search?${params.toString()}`));
}

export async function requestConnection(receiverId) {
  return apiPost("/connections", { receiverId });
}

export async function acceptConnection(connectionId) {
  return apiPatch(`/connections/${encodeURIComponent(connectionId)}/accept`, {});
}

export async function rejectConnection(connectionId) {
  return apiPatch(`/connections/${encodeURIComponent(connectionId)}/reject`, {});
}

export async function updateConnectionStatus(connectionId, status) {
  return apiPatch(`/connections/${encodeURIComponent(connectionId)}`, { status });
}

export async function deleteConnection(connectionId) {
  return apiDelete(`/connections/${encodeURIComponent(connectionId)}`);
}

export async function blockUser(userId) {
  return apiPost(`/connections/${encodeURIComponent(userId)}/block`, {});
}

export async function searchProviders(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      }
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  return apiGet(`/marketplace/providers${query ? `?${query}` : ""}`, {
    skipUserAuth: true,
  });
}

export async function getMarketplaceCategories() {
  try {
    const categories = getCollection(await apiGet("/marketplace/categories", { skipUserAuth: true }));
    return categories.length > 0 ? categories : DEFAULT_MARKETPLACE_CATEGORIES;
  } catch (error) {
    if (error.message === "Network Error" || error.status >= 500 || error.status === 404) {
      return DEFAULT_MARKETPLACE_CATEGORIES;
    }

    throw error;
  }
}

export async function getMarketplaceCategoryBySlug(slug) {
  try {
    return await apiGet(`/marketplace/categories/${encodeURIComponent(slug)}`, {
      skipUserAuth: true,
    });
  } catch (error) {
    const fallbackCategory = DEFAULT_MARKETPLACE_CATEGORIES.find(
      (category) => category.slug === slug,
    );

    if (fallbackCategory && (error.message === "Network Error" || error.status >= 500 || error.status === 404)) {
      return fallbackCategory;
    }

    throw error;
  }
}

export async function getProviderPublicProfile(username) {
  return apiGet(`/providers/${encodeURIComponent(username)}`, {
    skipUserAuth: true,
  });
}

export async function connectWithProvider(username) {
  return apiPost(`/providers/${encodeURIComponent(username)}/connect`, {});
}

export async function submitProviderVerification(documents) {
  const formData = new FormData();

  Array.from(documents ?? []).forEach((file) => {
    formData.append("documents", file);
  });

  return apiPostForm("/providers/verification", formData);
}

export async function getSavedItems() {
  return getCollection(await apiGet("/saved"));
}

export async function saveItem(savedItemData) {
  return apiPost("/saved", savedItemData);
}

export async function deleteSavedItem(savedItemId) {
  return apiDelete(`/saved/${encodeURIComponent(savedItemId)}`);
}

export async function searchMarketplaceServices(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      }
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  const response = await apiClient.get(`/marketplace/services${query ? `?${query}` : ""}`);
  const payload = response.data ?? {};

  return {
    filters: payload.filters ?? {},
    items: Array.isArray(payload.data) ? payload.data : getCollection(payload.data),
    pagination: payload.pagination ?? {
      hasMore: false,
      limit: filters.limit ?? 12,
      page: filters.page ?? 1,
      pages: 1,
      total: 0,
    },
  };
}

export async function getMarketplaceService(serviceId) {
  return apiGet(`/marketplace/service/${encodeURIComponent(serviceId)}`);
}

export async function getMarketplaceFavorites() {
  return getCollection(await apiGet("/marketplace/favorites"));
}

export async function saveMarketplaceFavorite(favoriteData) {
  return apiPost("/marketplace/favorites", favoriteData);
}

export async function removeMarketplaceFavorite({ targetId, targetType }) {
  return apiDelete(
    `/marketplace/favorites/${encodeURIComponent(targetType)}/${encodeURIComponent(targetId)}`,
  );
}

export async function getMarketplaceConnectAccount() {
  return apiGet("/marketplace/connect/account");
}

export async function createMarketplaceConnectAccount() {
  return apiPost("/marketplace/connect/account", {});
}

export async function createMarketplaceOnboardingLink() {
  return apiPost("/marketplace/connect/onboarding-link", {});
}

export async function createMarketplaceCheckoutSession(paymentData) {
  return apiPost("/marketplace/checkout-session", paymentData);
}

export async function getMarketplaceTransactions() {
  return getCollection(await apiGet("/marketplace/transactions"));
}

export async function completeMarketplaceWork(transactionId) {
  return apiPost(`/marketplace/transactions/${transactionId}/complete-work`, {});
}

export async function getProjects(status = "") {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return getCollection(await apiGet(`/account/projects${query}`));
}

export async function createProject(projectData) {
  return apiPost("/account/projects", projectData);
}

export async function updateProject(projectId, projectData) {
  return apiPatch(`/account/projects/${projectId}`, projectData);
}

export async function getNetworkFeed(search = "") {
  const query = search ? `?q=${encodeURIComponent(search)}` : "";
  return getCollection(await apiGet(`/network/feed${query}`));
}

export async function createNetworkPost(postData) {
  return apiPost("/network/posts", postData);
}

export async function toggleNetworkPostLike(postId) {
  return apiPost(`/network/posts/${postId}/like`, {});
}

export async function getNetworkPostComments(postId) {
  return getCollection(await apiGet(`/network/posts/${postId}/comments`));
}

export async function createNetworkPostComment(postId, commentData) {
  return apiPost(`/network/posts/${postId}/comments`, commentData);
}

export async function shareNetworkPost(postId, shareData = {}) {
  return apiPost(`/network/posts/${postId}/share`, shareData);
}

export async function getAdminAnalyticsSummary(token) {
  return apiGet("/analytics/summary", withAuth(token));
}

export async function getAdminSaasOverview(token) {
  return apiGet("/admin/saas", withAuth(token));
}

export async function getAdminPlans(token) {
  return getCollection(await apiGet("/admin/plans", withAuth(token)));
}

export async function getAdminUsers(token) {
  return getCollection(await apiGet("/admin/users", withAuth(token)));
}

export async function createAdminUser(userData, token) {
  return apiPost("/admin/users", userData, withAuth(token));
}

export async function updateAdminUser(id, userData, token) {
  return apiPatch(`/admin/users/${id}`, userData, withAuth(token));
}

export async function deleteAdminUser(id, token) {
  return apiDelete(`/admin/users/${id}`, withAuth(token));
}

export async function resetAdminUserPassword(id, passwordData, token) {
  return apiPatch(`/admin/users/${id}/password`, passwordData, withAuth(token));
}

export async function updateAdminUserProfile(id, profileData, token) {
  return apiPatch(`/admin/users/${id}/profile`, profileData, withAuth(token));
}

export async function updateAdminUserSettings(id, settingsData, token) {
  return apiPatch(`/admin/users/${id}/settings`, settingsData, withAuth(token));
}

export async function removeAdminUserMedia(id, type, token) {
  return apiDelete(`/admin/users/${id}/media/${type}`, withAuth(token));
}

export async function updateAdminPassword(passwordData, token) {
  return apiPatch("/admin/me/password", passwordData, withAuth(token));
}

export async function getAdminBlogs(token) {
  return getCollection(await apiGet("/admin/blogs", withAuth(token)));
}

export async function createAdminBlog(blogData, token) {
  return apiPost("/admin/blogs", blogData, withAuth(token));
}

export async function updateAdminBlog(id, blogData, token) {
  return apiPatch(`/admin/blogs/${id}`, blogData, withAuth(token));
}

export async function deleteAdminBlog(id, token) {
  return apiDelete(`/admin/blogs/${id}`, withAuth(token));
}

export async function getAdminReviews(token) {
  return getCollection(await apiGet("/admin/reviews", withAuth(token)));
}

export async function createAdminReview(reviewData, token) {
  return apiPost("/admin/reviews", reviewData, withAuth(token));
}

export async function updateAdminReview(id, reviewData, token) {
  return apiPatch(`/admin/reviews/${id}`, reviewData, withAuth(token));
}

export async function deleteAdminReview(id, token) {
  return apiDelete(`/admin/reviews/${id}`, withAuth(token));
}

export async function getAdminSupportConversations(token) {
  return getCollection(await apiGet("/admin/support/conversations", withAuth(token)));
}

export async function getAdminMarketplaceTransactions(token) {
  return getCollection(await apiGet("/admin/marketplace/transactions", withAuth(token)));
}

export async function getAdminMarketplaceServices(token, filters = "") {
  const normalizedFilters =
    typeof filters === "string" ? { status: filters } : filters ?? {};
  const params = new URLSearchParams();

  Object.entries(normalizedFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : "";
  return getCollection(await apiGet(`/admin/marketplace/services${query}`, withAuth(token)));
}

export async function getAdminMarketplaceCategories(token) {
  return getCollection(await apiGet("/admin/marketplace/categories", withAuth(token)));
}

export async function createAdminMarketplaceCategory(categoryData, token) {
  return apiPost("/admin/marketplace/categories", categoryData, withAuth(token));
}

export async function updateAdminMarketplaceCategory(categoryId, categoryData, token) {
  return apiPatch(
    `/admin/marketplace/categories/${categoryId}`,
    categoryData,
    withAuth(token),
  );
}

export async function deleteAdminMarketplaceCategory(categoryId, token) {
  return apiDelete(`/admin/marketplace/categories/${categoryId}`, withAuth(token));
}

export async function updateAdminMarketplaceService(serviceId, serviceData, token) {
  return apiPatch(
    `/admin/marketplace/services/${serviceId}`,
    serviceData,
    withAuth(token),
  );
}

export async function deleteAdminMarketplaceService(serviceId, token) {
  return apiDelete(`/admin/marketplace/services/${serviceId}`, withAuth(token));
}

export async function getAdminMarketplaceProviders(token, filters = "") {
  const normalizedFilters =
    typeof filters === "string" ? { status: filters } : filters ?? {};
  const params = new URLSearchParams();

  Object.entries(normalizedFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });
  const query = params.toString() ? `?${params.toString()}` : "";
  return getCollection(await apiGet(`/admin/marketplace/providers${query}`, withAuth(token)));
}

export async function updateAdminMarketplaceProvider(userId, providerData, token) {
  return apiPatch(
    `/admin/marketplace/providers/${userId}`,
    providerData,
    withAuth(token),
  );
}

export async function releaseAdminMarketplaceFunds(transactionId, token) {
  return apiPost(
    `/admin/marketplace/transactions/${transactionId}/release`,
    {},
    withAuth(token),
  );
}

export async function getAdminSupportMessages(conversationId, token) {
  return getCollection(
    await apiGet(
      `/admin/support/conversations/${conversationId}/messages`,
      withAuth(token),
    ),
  );
}

export async function sendAdminSupportMessage(conversationId, messageData, token) {
  return apiPost(
    `/admin/support/conversations/${conversationId}/messages`,
    messageData,
    withAuth(token),
  );
}

export async function updateAdminSupportConversation(conversationId, conversationData, token) {
  return apiPatch(
    `/admin/support/conversations/${conversationId}`,
    conversationData,
    withAuth(token),
  );
}

export async function updateAdminPlan(planKey, planData, token) {
  return apiPatch(`/admin/plans/${planKey}`, planData, withAuth(token));
}

export async function getLeads(token, sort = "desc") {
  const data = await apiGet(`/leads?sort=${sort}`, withAuth(token));

  return getCollection(data);
}

export async function getLeadById(id, token) {
  return apiGet(`/leads/${id}`, withAuth(token));
}

export async function createService(serviceData, token) {
  return apiPost("/services", serviceData, withAuth(token));
}

export async function createPortfolioItem(portfolioData, token) {
  return apiPost("/portfolio", portfolioData, withAuth(token));
}
