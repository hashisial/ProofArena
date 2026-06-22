import { cn } from "../../utils/cn.js";

const maxWidthClasses = {
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-none",
};

export function DashboardContentShell({
  children,
  className = "",
  maxWidth = "7xl",
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-full min-w-0",
        maxWidthClasses[maxWidth] ?? maxWidthClasses["7xl"],
        className,
      )}
      data-dashboard-content-shell=""
    >
      {children}
    </div>
  );
}
