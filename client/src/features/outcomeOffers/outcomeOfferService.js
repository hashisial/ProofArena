import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildOutcomeOfferEndpoint } from "./outcomeOfferUtils.js";

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
}

function endpoint(path) {
  return buildOutcomeOfferEndpoint(path);
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const outcomeOfferService = Object.freeze({
  async archiveOutcomeOffer(id) {
    return api.post(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.ARCHIVE(id)), {});
  },

  async createOutcomeOffer(payload) {
    return api.post(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.BASE), payload);
  },

  async deleteOutcomeOffer(id) {
    return api.delete(endpoint(`${API_ENDPOINTS.OUTCOME_OFFERS.BASE}/${encodeURIComponent(id)}`));
  },

  async getMyOutcomeOffers(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.OUTCOME_OFFERS.MY)}${query ? `?${query}` : ""}`),
    );
  },

  async getOutcomeOfferById(id) {
    return api.get(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.DETAIL_BY_ID(id)));
  },

  async getPublicOutcomeOfferBySlug(username, slug) {
    return api.get(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.DETAIL_BY_SLUG(username, slug)));
  },

  async getPublicOutcomeOffers(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.OUTCOME_OFFERS.BASE)}${query ? `?${query}` : ""}`, {
        skipUserAuth: true,
      }),
    );
  },

  async pauseOutcomeOffer(id) {
    return api.post(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.PAUSE(id)), {});
  },

  async publishOutcomeOffer(id) {
    return api.post(endpoint(API_ENDPOINTS.OUTCOME_OFFERS.PUBLISH(id)), {});
  },

  async updateOutcomeOffer(id, payload) {
    return api.patch(endpoint(`${API_ENDPOINTS.OUTCOME_OFFERS.BASE}/${encodeURIComponent(id)}`), payload);
  },
});

export const {
  archiveOutcomeOffer,
  createOutcomeOffer,
  deleteOutcomeOffer,
  getMyOutcomeOffers,
  getOutcomeOfferById,
  getPublicOutcomeOfferBySlug,
  getPublicOutcomeOffers,
  pauseOutcomeOffer,
  publishOutcomeOffer,
  updateOutcomeOffer,
} = outcomeOfferService;
