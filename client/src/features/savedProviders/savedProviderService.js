import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString, mapItemsResponse } from "../../services/shared/index.js";

export const savedProviderService = Object.freeze({
  async getMySavedProviders(params = {}) {
    const query = buildQueryString(params, { omitValues: ["all"] });

    return mapItemsResponse(
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
