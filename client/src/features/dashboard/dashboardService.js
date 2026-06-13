import { DASHBOARD_API } from "../../constants/apiEndpoints.js";
import { api } from "../../services/apiClient.js";
import { mapCollectionItems } from "../../services/shared/index.js";

export const dashboardService = Object.freeze({
  async getMyActivityFeed() {
    return mapCollectionItems(await api.get(DASHBOARD_API.ACCOUNT.ACTIVITY_FEED));
  },

  async getMyDashboard() {
    return api.get(DASHBOARD_API.ACCOUNT.DASHBOARD);
  },
});

export const { getMyActivityFeed, getMyDashboard } = dashboardService;
