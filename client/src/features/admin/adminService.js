import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString } from "../../services/shared/index.js";

const resourceEndpoints = Object.freeze({
  challenges: API_ENDPOINTS.ADMIN.CHALLENGES,
  offers: API_ENDPOINTS.ADMIN.OFFERS,
  proofAssets: API_ENDPOINTS.ADMIN.PROOF_ASSETS,
  providers: API_ENDPOINTS.ADMIN.PROVIDERS,
  users: API_ENDPOINTS.ADMIN.USERS,
});

const moderationEndpoints = Object.freeze({
  challenges: API_ENDPOINTS.ADMIN.CHALLENGE_MODERATION,
  offers: API_ENDPOINTS.ADMIN.OFFER_MODERATION,
  proofAssets: API_ENDPOINTS.ADMIN.PROOF_ASSET_MODERATION,
  providers: API_ENDPOINTS.ADMIN.PROVIDER_MODERATION,
});

function normalizeList(result) {
  if (Array.isArray(result)) {
    return { items: result, pagination: { limit: result.length, page: 1, pages: 1, total: result.length } };
  }

  return {
    items: Array.isArray(result?.items) ? result.items : [],
    pagination: result?.pagination ?? { limit: 20, page: 1, pages: 1, total: 0 },
  };
}

export const adminService = Object.freeze({
  async getList(resource, params = {}) {
    const endpoint = resourceEndpoints[resource];
    const query = buildQueryString(params, { omitValues: ["all"] });

    return normalizeList(await api.get(`${endpoint}${query ? `?${query}` : ""}`));
  },

  async getOverview() {
    return api.get(API_ENDPOINTS.ADMIN.OVERVIEW);
  },

  async moderateResource(resource, id, payload) {
    return api.patch(moderationEndpoints[resource](id), payload);
  },

  async updateUserStatus(id, status) {
    return api.patch(API_ENDPOINTS.ADMIN.USER_STATUS(id), { status });
  },
});
