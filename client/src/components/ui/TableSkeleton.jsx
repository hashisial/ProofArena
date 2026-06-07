import { Skeleton } from "./Skeleton.jsx";

export function TableSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div
      aria-busy="true"
      className="mobile-scroll-panel rounded-2xl border border-[#E9E2F3] bg-white p-4"
    >
      <div
        className="grid min-w-[42rem] gap-4 border-b border-[#E9E2F3] pb-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton className="h-4 w-24" key={`header-${index}`} />
        ))}
      </div>
      <div className="min-w-[42rem] divide-y divide-[#E9E2F3]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            className="grid gap-4 py-4"
            key={`row-${rowIndex}`}
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                className={columnIndex === 0 ? "h-4 w-32" : "h-4 w-24"}
                key={`row-${rowIndex}-column-${columnIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
