import { Card } from "./Card.jsx";
import { Skeleton } from "./Skeleton.jsx";

export function CardSkeleton({ count = 1 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} variant="bordered">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-4 h-7 w-3/4" />
            </div>
            <Skeleton className="h-10 w-10 shrink-0" rounded="rounded-xl" />
          </div>
          <div className="mt-6 grid gap-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Skeleton className="h-9 w-24" rounded="rounded-full" />
            <Skeleton className="h-9 w-28" rounded="rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}
