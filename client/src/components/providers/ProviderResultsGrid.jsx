import { AlertCircle, SearchX } from "lucide-react";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { ProviderCard } from "./ProviderCard.jsx";
import { ROUTES } from "../../constants/index.js";

function ProviderCardSkeleton() {
  return (
    <div className="rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_16px_50px_rgba(28, 25, 23, 0.06)]">
      <div className="flex gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
        <div className="grid flex-1 gap-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="mt-6 h-20 w-full" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
      <Skeleton className="mt-5 h-12 w-full rounded-full" />
    </div>
  );
}

export function ProviderResultsGrid({
  error,
  isError,
  isLoading,
  onMessage,
  onRetry,
  providers = [],
}) {
  if (isLoading) {
    return (
      <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProviderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        actionText="Try again"
        description={error?.message ?? "Something went wrong while loading provider profiles."}
        icon={AlertCircle}
        onAction={onRetry}
        title="Provider search could not be loaded"
        variant="bordered"
      />
    );
  }

  if (providers.length === 0) {
    return (
      <EmptyState
        actionHref={ROUTES.CHALLENGES}
        actionText="Explore Challenges"
        description="Try adjusting filters or search by another skill, category, or outcome."
        icon={SearchX}
        title="No providers found"
        variant="bordered"
      />
    );
  }

  return (
    <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id || provider._id || provider.username}
          onMessage={onMessage}
          provider={provider}
        />
      ))}
    </div>
  );
}
