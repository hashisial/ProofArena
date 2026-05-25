import { RefreshCcw } from "lucide-react";
import { ErrorState } from "../components/ui/ErrorState.jsx";
import { ROUTES } from "../constants/index.js";

export function ServerError() {
  function refreshPage() {
    window.location.reload();
  }

  return (
    <ErrorState
      code="500"
      description="Our system hit an unexpected issue. Try refreshing, or return to your dashboard."
      icon={RefreshCcw}
      onPrimaryAction={refreshPage}
      primaryActionText="Refresh Page"
      secondaryActionHref={ROUTES.DASHBOARD}
      secondaryActionText="Go to Dashboard"
      title="Something broke while verifying the result."
    />
  );
}
