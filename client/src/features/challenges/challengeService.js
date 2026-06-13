import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildQueryString, mapItemsResponse } from "../../services/shared/index.js";
import { buildChallengeEndpoint } from "./challengeUtils.js";

function endpoint(path) {
  return buildChallengeEndpoint(path);
}

export const challengeService = Object.freeze({
  async archiveChallenge(id) {
    return api.post(endpoint(API_ENDPOINTS.CHALLENGES.ARCHIVE(id)), {});
  },

  async closeChallenge(id) {
    return api.post(endpoint(API_ENDPOINTS.CHALLENGES.CLOSE(id)), {});
  },

  async createChallenge(payload) {
    return api.post(endpoint(API_ENDPOINTS.CHALLENGES.BASE), payload);
  },

  async deleteChallenge(id) {
    return api.delete(endpoint(`${API_ENDPOINTS.CHALLENGES.BASE}/${encodeURIComponent(id)}`));
  },

  async getChallengeById(id) {
    return api.get(endpoint(API_ENDPOINTS.CHALLENGES.DETAIL_BY_ID(id)));
  },

  async getMyChallenges(params = {}) {
    const query = buildQueryString(params);
    return mapItemsResponse(
      await api.get(`${endpoint(API_ENDPOINTS.CHALLENGES.MY)}${query ? `?${query}` : ""}`),
    );
  },

  async getPublicChallengeBySlug(username, slug) {
    return api.get(endpoint(API_ENDPOINTS.CHALLENGES.DETAIL_BY_SLUG(username, slug)));
  },

  async getPublicChallenges(params = {}) {
    const query = buildQueryString(params);
    return mapItemsResponse(
      await api.get(`${endpoint(API_ENDPOINTS.CHALLENGES.BASE)}${query ? `?${query}` : ""}`, {
        skipUserAuth: true,
      }),
    );
  },

  async pauseChallenge(id) {
    return api.post(endpoint(API_ENDPOINTS.CHALLENGES.PAUSE(id)), {});
  },

  async publishChallenge(id) {
    return api.post(endpoint(API_ENDPOINTS.CHALLENGES.PUBLISH(id)), {});
  },

  async updateChallenge(id, payload) {
    return api.patch(endpoint(`${API_ENDPOINTS.CHALLENGES.BASE}/${encodeURIComponent(id)}`), payload);
  },
});

export const {
  archiveChallenge,
  closeChallenge,
  createChallenge,
  deleteChallenge,
  getChallengeById,
  getMyChallenges,
  getPublicChallengeBySlug,
  getPublicChallenges,
  pauseChallenge,
  publishChallenge,
  updateChallenge,
} = challengeService;
