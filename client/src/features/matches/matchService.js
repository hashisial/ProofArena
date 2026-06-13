import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString, mapItemsResponse } from "../../services/shared/index.js";
import { buildMatchEndpoint } from "./matchUtils.js";

function endpoint(path) {
  return buildMatchEndpoint(path);
}

export const matchService = Object.freeze({
  async getChallengeRecommendedProviders(challengeId, params = {}) {
    const query = buildQueryString(params, { omitValues: ["all"] });
    return mapItemsResponse(
      await api.get(`${endpoint(API_ENDPOINTS.MATCHES.CHALLENGE_PROVIDERS(challengeId))}${query ? `?${query}` : ""}`),
    );
  },

  async getClientMatchById(id) {
    return api.get(endpoint(API_ENDPOINTS.MATCHES.CLIENT_DETAIL(id)));
  },

  async getMyMatchedChallenges(params = {}) {
    const query = buildQueryString(params, { omitValues: ["all"] });
    return mapItemsResponse(
      await api.get(`${endpoint(API_ENDPOINTS.MATCHES.PROVIDER)}${query ? `?${query}` : ""}`),
    );
  },

  async getProviderMatchById(id) {
    return api.get(endpoint(API_ENDPOINTS.MATCHES.PROVIDER_DETAIL(id)));
  },

  async refreshChallengeMatches(challengeId) {
    return api.post(endpoint(API_ENDPOINTS.MATCHES.CHALLENGE_REFRESH(challengeId)), {});
  },

  async refreshMyMatches() {
    return api.post(endpoint(API_ENDPOINTS.MATCHES.PROVIDER_REFRESH), {});
  },

  async updateClientMatchStatus(id, payload) {
    return api.patch(endpoint(API_ENDPOINTS.MATCHES.CLIENT_STATUS(id)), payload);
  },

  async updateProviderMatchStatus(id, payload) {
    return api.patch(endpoint(API_ENDPOINTS.MATCHES.PROVIDER_STATUS(id)), payload);
  },
});

export const {
  getChallengeRecommendedProviders,
  getClientMatchById,
  getMyMatchedChallenges,
  getProviderMatchById,
  refreshChallengeMatches,
  refreshMyMatches,
  updateClientMatchStatus,
  updateProviderMatchStatus,
} = matchService;
