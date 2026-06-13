import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString, mapItemsResponse } from "../../services/shared/index.js";
import { buildFirstClientEndpoint } from "./firstClientUtils.js";

function endpoint(path) {
  return buildFirstClientEndpoint(path);
}

export const firstClientService = Object.freeze({
  async getFirstClientStatus() {
    return api.get(endpoint(API_ENDPOINTS.FIRST_CLIENT.STATUS));
  },

  async getMyBadges() {
    return mapItemsResponse(await api.get(endpoint(API_ENDPOINTS.FIRST_CLIENT.BADGES)));
  },

  async getStarterChallenges(params = {}) {
    const query = buildQueryString(params, { omitValues: ["all"] });
    return mapItemsResponse(
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
