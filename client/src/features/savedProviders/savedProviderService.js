import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

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

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const savedProviderService = Object.freeze({
  async getMySavedProviders(params = {}) {
    const query = buildQuery(params);

    return normalizeResult(
      await api.get(`${API_ENDPOINTS.SAVED_PROVIDERS.BASE}${query ? `?${query}` : ""}`),
    );
  },

  async getSavedProviderStatus(providerId) {
    return api.get(API_ENDPOINTS.SAVED_PROVIDERS.STATUS(providerId));
  },

  async saveProvider(payload) {
    return api.post(API_ENDPOINTS.SAVED_PROVIDERS.BASE, payload);
  },

  async unsaveProvider(providerId) {
    return api.delete(API_ENDPOINTS.SAVED_PROVIDERS.UNSAVE(providerId));
  },

  async updateSavedProvider(id, payload) {
    return api.patch(`${API_ENDPOINTS.SAVED_PROVIDERS.BASE}/${encodeURIComponent(id)}`, payload);
  },
});

export const {
  getMySavedProviders,
  getSavedProviderStatus,
  saveProvider,
  unsaveProvider,
  updateSavedProvider,
} = savedProviderService;
