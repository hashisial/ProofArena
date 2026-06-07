import { cn } from "../../utils/cn.js";

export function Skeleton({ animate = true, className = "", rounded = "rounded-2xl" }) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-[#E9E2F3]", animate && "animate-pulse", rounded, className)}
    />
  );
}
