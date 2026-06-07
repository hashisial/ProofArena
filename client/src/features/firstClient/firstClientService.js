import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildFirstClientEndpoint } from "./firstClientUtils.js";

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
  return buildFirstClientEndpoint(path);
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const firstClientService = Object.freeze({
  async getFirstClientStatus() {
    return api.get(endpoint(API_ENDPOINTS.FIRST_CLIENT.STATUS));
  },

  async getMyBadges() {
    return normalizeResult(await api.get(endpoint(API_ENDPOINTS.FIRST_CLIENT.BADGES)));
  },

  async getStarterChallenges(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.FIRST_CLIENT.STARTER_CHALLENGES)}${query ? `?${query}` : ""}`),
    );
  },

  async refreshFirstClientStatus() {
    return api.post(endpoint(API_ENDPOINTS.FIRST_CLIENT.REFRESH), {});
  },
});

export const {
  getFirstClientStatus,
  getMyBadges,
  getStarterChallenges,
  refreshFirstClientStatus,
} = firstClientService;
