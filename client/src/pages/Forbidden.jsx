import { ShieldAlert } from "lucide-react";
import { ErrorState } from "../components/ui/ErrorState.jsx";
import { ROUTES } from "../constants/index.js";

export function Forbidden() {
  return (
    <ErrorState
      code="403"
      description="This area may be limited to clients, providers, or ScaleOps admins."
      icon={ShieldAlert}
      primaryActionHref={ROUTES.DASHBOARD}
      primaryActionText="Back to Dashboard"
      secondaryActionHref={ROUTES.HOME}
      secondaryActionText="Go Home"
      title="You don't have access to this workspace."
    />
  );
}
