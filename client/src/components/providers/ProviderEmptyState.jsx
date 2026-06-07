import { SearchX } from "lucide-react";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/index.js";

export function ProviderEmptyState({ hasAnyFilters = false, onClear }) {
  return (
    <EmptyState
      actionText="Clear filters"
      description={
        hasAnyFilters
          ? "Try a broader skill, lower the proof score filter, or remove some filters."
          : "Public provider profiles with outcome offers and proof-backed reputation will appear here as the marketplace grows."
      }
      icon={SearchX}
      onAction={onClear}
      secondaryActionHref={ROUTES.PROVIDERS}
      secondaryActionText="View all providers"
      title={hasAnyFilters ? "No providers matched your filters" : "Providers will appear here soon"}
      variant="bordered"
    />
  );
}
