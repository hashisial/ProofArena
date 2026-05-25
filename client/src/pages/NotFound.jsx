import { FileQuestion } from "lucide-react";
import { ErrorState } from "../components/ui/ErrorState.jsx";
import { ROUTES } from "../constants/index.js";

export function NotFound() {
  return (
    <ErrorState
      code="404"
      description="The page may have moved, or the link may not be ready yet."
      icon={FileQuestion}
      primaryActionHref={ROUTES.HOME}
      primaryActionText="Go Home"
      secondaryActionHref={ROUTES.PROVIDERS}
      secondaryActionText="Explore Providers"
      title="Page not found"
    />
  );
}
