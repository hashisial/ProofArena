import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";
import { buildProofAssetEndpoint } from "./proofAssetUtils.js";

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

function endpoint(path) {
  return buildProofAssetEndpoint(path);
}

function normalizeResult(result) {
  if (Array.isArray(result)) {
    return { items: result };
  }

  return result ?? { items: [] };
}

export const proofAssetService = Object.freeze({
  async attachProofAsset(id, payload) {
    return api.post(endpoint(API_ENDPOINTS.PROOF_ASSETS.ATTACH(id)), payload);
  },

  async createProofAsset(payload) {
    if (payload instanceof FormData) {
      return api.upload(endpoint(API_ENDPOINTS.PROOF_ASSETS.BASE), payload);
    }

    return api.post(endpoint(API_ENDPOINTS.PROOF_ASSETS.BASE), payload);
  },

  async deleteProofAsset(id) {
    return api.delete(endpoint(`${API_ENDPOINTS.PROOF_ASSETS.BASE}/${encodeURIComponent(id)}`));
  },

  async detachProofAsset(id, payload) {
    return api.post(endpoint(API_ENDPOINTS.PROOF_ASSETS.DETACH(id)), payload);
  },

  async getMyProofAssets(params = {}) {
    const query = buildQuery(params);
    return normalizeResult(
      await api.get(`${endpoint(API_ENDPOINTS.PROOF_ASSETS.MY)}${query ? `?${query}` : ""}`),
    );
  },

  async getProofAssetById(id) {
    return api.get(endpoint(API_ENDPOINTS.PROOF_ASSETS.DETAIL_BY_ID(id)));
  },

  async updateProofAsset(id, payload) {
    return api.patch(endpoint(`${API_ENDPOINTS.PROOF_ASSETS.BASE}/${encodeURIComponent(id)}`), payload);
  },
});

export const {
  attachProofAsset,
  createProofAsset,
  deleteProofAsset,
  detachProofAsset,
  getMyProofAssets,
  getProofAssetById,
  updateProofAsset,
} = proofAssetService;
