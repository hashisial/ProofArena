import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildExecutionPlanEndpoint } from "./executionPlanUtils.js";

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
  return buildExecutionPlanEndpoint(path);
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const executionPlanService = Object.freeze({
  async acceptExecutionPlan(id, payload = {}) {
    return api.post(endpoint(API_ENDPOINTS.EXECUTION_PLANS.ACCEPT(id)), payload);
  },

  async getExecutionPlanByIdForClient(id) {
    return api.get(endpoint(API_ENDPOINTS.EXECUTION_PLANS.CLIENT_DETAIL(id)));
  },

  async getExecutionPlanByIdForProvider(id) {
    return api.get(endpoint(API_ENDPOINTS.EXECUTION_PLANS.DETAIL_BY_ID(id)));
  },

  async getMyExecutionPlans(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.EXECUTION_PLANS.MY)}${query ? `?${query}` : ""}`),
    );
  },

  async getPlansForClientChallenge(challengeId, params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.EXECUTION_PLANS.BY_CHALLENGE(challengeId))}${query ? `?${query}` : ""}`),
    );
  },

  async rejectExecutionPlan(id, payload = {}) {
    return api.post(endpoint(API_ENDPOINTS.EXECUTION_PLANS.REJECT(id)), payload);
  },

  async shortlistExecutionPlan(id, payload = {}) {
    return api.post(endpoint(API_ENDPOINTS.EXECUTION_PLANS.SHORTLIST(id)), payload);
  },

  async submitExecutionPlan(payload) {
    return api.post(endpoint(API_ENDPOINTS.EXECUTION_PLANS.BASE), payload);
  },

  async updateExecutionPlan(id, payload) {
    return api.patch(endpoint(`${API_ENDPOINTS.EXECUTION_PLANS.BASE}/${encodeURIComponent(id)}`), payload);
  },

  async withdrawExecutionPlan(id) {
    return api.post(endpoint(API_ENDPOINTS.EXECUTION_PLANS.WITHDRAW(id)), {});
  },
});

export const {
  acceptExecutionPlan,
  getExecutionPlanByIdForClient,
  getExecutionPlanByIdForProvider,
  getMyExecutionPlans,
  getPlansForClientChallenge,
  rejectExecutionPlan,
  shortlistExecutionPlan,
  submitExecutionPlan,
  updateExecutionPlan,
  withdrawExecutionPlan,
} = executionPlanService;
