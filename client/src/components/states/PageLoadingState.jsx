import { Loader2 } from "lucide-react";
import { AppStateShell } from "./AppStateShell.jsx";
import { DashboardSkeleton } from "./DashboardSkeleton.jsx";
import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { cn } from "../../utils/cn.js";

function GenericSkeleton({ skeletonType }) {
  const rows = skeletonType === "form" || skeletonType === "settings" ? 6 : 4;

  return (
    <Card aria-hidden="true" padding="lg" variant="bordered">
      <Skeleton className="h-5 w-36" rounded="rounded-full" />
      <div className={cn("mt-6 grid gap-4", skeletonType === "cards" && "sm:grid-cols-2 lg:grid-cols-3")}>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton
            className={cn(
              skeletonType === "cards" ? "h-28" : "h-12",
              skeletonType === "profile" && index === 0 && "h-28",
            )}
            key={`${skeletonType}-${index}`}
            rounded="rounded-2xl"
          />
        ))}
      </div>
    </Card>
  );
}

export function PageLoadingState({
  className = "",
  description = "Loading the latest page state.",
  mode = "dashboard",
  skeletonType = "page",
  title = "Loading",
  variant = "loading",
}) {
  const isDashboard = mode === "dashboard" || skeletonType === "dashboard";

  return (
    <div className={cn("grid gap-6", className)} aria-busy="true" aria-live="polite">
      <AppStateShell
        description={description}
        icon={Loader2}
        size="compact"
        title={title}
        variant={variant}
      />
      {isDashboard ? (
        <DashboardSkeleton includeTable={skeletonType === "table" || skeletonType === "dashboard"} />
      ) : (
        <GenericSkeleton skeletonType={skeletonType} />
      )}
    </div>
  );
}
