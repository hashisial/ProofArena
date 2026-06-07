import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { profileService } from "../profile/profileService.js";

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
  async getProviderComparison(providerIds = []) {
    const query = new URLSearchParams();

    providerIds
      .map((providerId) => String(providerId ?? "").trim())
      .filter(Boolean)
      .slice(0, 4)
      .forEach((providerId) => query.append("providerIds[]", providerId));

    return api.get(`${API_ENDPOINTS.PROVIDERS.COMPARE}?${query.toString()}`, {
      skipUserAuth: true,
    });
  },
  async getPublicProviders(params = {}) {
    const query = buildQuery(params);

    return api.get(`${API_ENDPOINTS.PROVIDERS.BASE}${query ? `?${query}` : ""}`, {
      skipUserAuth: true,
    });
  },
  async getProviderFilters() {
    return api.get(API_ENDPOINTS.PROVIDERS.FILTERS, {
      skipUserAuth: true,
    });
  },
  async getProviderPublicProfile(username) {
    return profileService.getPublicProfile(username);
  },
  async searchProviders(params = {}) {
    return providerService.getPublicProviders(params);
  },
});

export const searchProviders = providerService.searchProviders;
export const getProviderComparison = providerService.getProviderComparison;
export const getPublicProviders = providerService.getPublicProviders;
export const getProviderFilters = providerService.getProviderFilters;
export const getProviderPublicProfile = providerService.getProviderPublicProfile;
