import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      if (value.length > 0) {
        query.set(key, value.join(","));
      }
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
}

export const providerService = Object.freeze({
  async searchProviders(params = {}) {
    const query = buildQuery(params);

    return api.get(`${API_ENDPOINTS.PROVIDERS}${query ? `?${query}` : ""}`, {
      skipUserAuth: true,
    });
  },
});

export const searchProviders = providerService.searchProviders;
