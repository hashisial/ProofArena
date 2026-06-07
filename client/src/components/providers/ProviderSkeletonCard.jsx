import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderSkeletonCard() {
  return (
    <div className="rounded-3xl border border-[#E9E2F3] bg-white p-5 shadow-[0_16px_50px_rgba(31,14,54,0.06)]">
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
