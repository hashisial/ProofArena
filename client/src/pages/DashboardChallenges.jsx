import { Navigate } from "react-router-dom";
import { ROUTES, USER_ROLES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { MatchedChallenges } from "./MatchedChallenges.jsx";
import { MyChallenges } from "./MyChallenges.jsx";

export function DashboardChallenges() {
  const { role, user } = useAuth();
  const currentRole = role || user?.role;

  if (currentRole === USER_ROLES.PROVIDER) {
    return <MatchedChallenges />;
  }

  if (currentRole === USER_ROLES.CLIENT) {
    return <MyChallenges />;
  }

  return <Navigate replace to={currentRole === USER_ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.SYSTEM.NOT_AUTHORIZED} />;
}
