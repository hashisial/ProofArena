import { getPrimaryDashboardPath } from "./accessPolicy.js";

export function getDashboardPathForRole(userOrRole, options) {
  return getPrimaryDashboardPath(userOrRole, options);
}
