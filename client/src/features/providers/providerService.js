import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString } from "../../services/shared/index.js";
import { profileService } from "../profile/profileService.js";

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
    const query = buildQueryString(params);

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
