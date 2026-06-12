export function LoadingState({ columns = 3 }) {
  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${columnClasses[columns] ?? columnClasses[3]}`}>
      {Array.from({ length: columns }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-[1.6rem] border border-[#3F6212]/12 bg-[linear-gradient(110deg,#ffffff,#f4efff,#ffffff)] shadow-[0_18px_55px_rgba(63, 98, 18, 0.06)]"
        />
      ))}
    </div>
  );
}
