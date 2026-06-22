import { Navigate } from "react-router-dom";
import { ClientDashboard } from "../components/dashboard/ClientDashboard.jsx";
import { ProviderDashboard } from "../components/dashboard/ProviderDashboard.jsx";
import { ROUTES, USER_ROLES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";

export function Dashboard() {
  const { role, user } = useAuth();
  const currentRole = role || user?.role;

  if (currentRole === USER_ROLES.CLIENT) {
    return <ClientDashboard />;
  }

  if (currentRole === USER_ROLES.PROVIDER) {
    return <ProviderDashboard />;
  }

  if (currentRole === USER_ROLES.SUPPORT) {
    return <Navigate replace to={ROUTES.SUPPORT_DASHBOARD} />;
  }

  return <Navigate replace to={currentRole === USER_ROLES.ADMIN ? ROUTES.ADMIN : ROUTES.SYSTEM.NOT_AUTHORIZED} />;
}
