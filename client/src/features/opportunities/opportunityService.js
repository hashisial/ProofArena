import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildOpportunityEndpoint } from "./opportunityUtils.js";

function endpoint(path) {
  return buildOpportunityEndpoint(path);
}

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

export const opportunityService = Object.freeze({
  async addOpportunityNote(id, payload) {
    return api.post(endpoint(API_ENDPOINTS.OPPORTUNITIES.NOTES(id)), payload);
  },

  async archiveOpportunity(id) {
    return api.post(endpoint(API_ENDPOINTS.OPPORTUNITIES.ARCHIVE(id)), {});
  },

  async completeNextAction(id, payload) {
    return api.post(endpoint(API_ENDPOINTS.OPPORTUNITIES.COMPLETE_NEXT_ACTION(id)), payload);
  },

  async createOpportunity(payload) {
    return api.post(endpoint(API_ENDPOINTS.OPPORTUNITIES.BASE), payload);
  },

  async getMyOpportunities(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.OPPORTUNITIES.BASE)}${query ? `?${query}` : ""}`),
    );
  },

  async getOpportunityById(id) {
    return api.get(endpoint(API_ENDPOINTS.OPPORTUNITIES.DETAIL(id)));
  },

  async getOpportunityStats() {
    return api.get(endpoint(API_ENDPOINTS.OPPORTUNITIES.STATS));
  },

  async updateNextAction(id, payload) {
    return api.patch(endpoint(API_ENDPOINTS.OPPORTUNITIES.NEXT_ACTION(id)), payload);
  },

  async updateOpportunity(id, payload) {
    return api.patch(endpoint(API_ENDPOINTS.OPPORTUNITIES.DETAIL(id)), payload);
  },

  async updateOpportunityStage(id, payload) {
    return api.patch(endpoint(API_ENDPOINTS.OPPORTUNITIES.STAGE(id)), payload);
  },
});

export const {
  addOpportunityNote,
  archiveOpportunity,
  completeNextAction,
  createOpportunity,
  getMyOpportunities,
  getOpportunityById,
  getOpportunityStats,
  updateNextAction,
  updateOpportunity,
  updateOpportunityStage,
} = opportunityService;
