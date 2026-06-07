import { AlertCircle } from "lucide-react";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ProviderCard } from "./ProviderCard.jsx";
import { ProviderEmptyState } from "./ProviderEmptyState.jsx";
import { ProviderSkeletonCard } from "./ProviderSkeletonCard.jsx";

export function ProviderResultsGrid({
  hasAnyFilters = false,
  isAuthenticated = false,
  isError,
  isLoading,
  onClearFilters,
  onRetry,
  providers = [],
  viewerRole = "",
}) {
  if (isLoading) {
    return (
      <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProviderSkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        actionText="Retry"
        description="Something went wrong while loading provider discovery. Try again."
        icon={AlertCircle}
        onAction={onRetry}
        title="Could not load providers"
        variant="bordered"
      />
    );
  }

  if (providers.length === 0) {
    return <ProviderEmptyState hasAnyFilters={hasAnyFilters} onClear={onClearFilters} />;
  }

  return (
    <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {providers.map((provider) => (
        <ProviderCard
          isAuthenticated={isAuthenticated}
          key={provider.userId || provider.id || provider._id || provider.username}
          provider={provider}
          viewerRole={viewerRole}
        />
      ))}
    </div>
  );
}
