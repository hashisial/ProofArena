import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

export const socialService = Object.freeze({
  getConnectionStatus(userId) {
    return api.get(API_ENDPOINTS.CONNECTION_STATUS(userId));
  },
  sendConnectionRequest(userId) {
    return api.post(API_ENDPOINTS.CONNECTION_REQUEST(userId), {});
  },
  removeConnection(userId) {
    return api.delete(API_ENDPOINTS.CONNECTION_WITH_USER(userId));
  },
  getFollowStatus(userId) {
    return api.get(API_ENDPOINTS.FOLLOW_STATUS(userId));
  },
  followUser(userId) {
    return api.post(API_ENDPOINTS.FOLLOW_USER(userId), {});
  },
  unfollowUser(userId) {
    return api.delete(API_ENDPOINTS.FOLLOW_USER(userId));
  },
});

export const getConnectionStatus = socialService.getConnectionStatus;
export const sendConnectionRequest = socialService.sendConnectionRequest;
export const removeConnection = socialService.removeConnection;
export const getFollowStatus = socialService.getFollowStatus;
export const followUser = socialService.followUser;
export const unfollowUser = socialService.unfollowUser;
