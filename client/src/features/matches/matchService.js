import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildMatchEndpoint } from "./matchUtils.js";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === "all") {
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
}

function endpoint(path) {
  return buildMatchEndpoint(path);
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const matchService = Object.freeze({
  async getChallengeRecommendedProviders(challengeId, params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.MATCHES.CHALLENGE_PROVIDERS(challengeId))}${query ? `?${query}` : ""}`),
    );
  },

  async getClientMatchById(id) {
    return api.get(endpoint(API_ENDPOINTS.MATCHES.CLIENT_DETAIL(id)));
  },

  async getMyMatchedChallenges(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
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
