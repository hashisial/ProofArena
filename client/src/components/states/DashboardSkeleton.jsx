import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { cn } from "../../utils/cn.js";

export function DashboardSkeleton({
  className = "",
  includeTable = true,
  metricCount = 4,
  sectionCount = 2,
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid w-full max-w-full min-w-0 gap-6", className)}
    >
      <div className="grid gap-3">
        <Skeleton className="h-5 w-32" rounded="rounded-full" />
        <Skeleton className="h-9 w-full max-w-xl" rounded="rounded-2xl" />
        <Skeleton className="h-4 w-full max-w-2xl" rounded="rounded-full" />
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: metricCount }).map((_, index) => (
          <Card key={`metric-${index}`} padding="lg" variant="bordered">
            <Skeleton className="h-4 w-24" rounded="rounded-full" />
            <Skeleton className="mt-5 h-8 w-28" rounded="rounded-2xl" />
            <Skeleton className="mt-4 h-3 w-full" rounded="rounded-full" />
          </Card>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {Array.from({ length: sectionCount }).map((_, index) => (
          <Card key={`section-${index}`} padding="lg" variant="bordered">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-36" rounded="rounded-full" />
              <Skeleton className="h-8 w-20" rounded="rounded-full" />
            </div>
            <div className="mt-6 grid gap-3">
              <Skeleton className="h-4 w-full" rounded="rounded-full" />
              <Skeleton className="h-4 w-11/12" rounded="rounded-full" />
              <Skeleton className="h-4 w-3/4" rounded="rounded-full" />
            </div>
          </Card>
        ))}
      </div>

      {includeTable ? (
        <Card padding="lg" variant="bordered">
          <Skeleton className="h-5 w-40" rounded="rounded-full" />
          <div className="mt-5 grid gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton className="h-12 w-full" key={`row-${index}`} rounded="rounded-2xl" />
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
