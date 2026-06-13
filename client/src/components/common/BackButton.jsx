import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import { cn } from "../../utils/cn.js";

export function BackButton({
  className = "",
  fallbackPath = ROUTES.DASHBOARD,
  iconOnly = false,
  label = "Back",
  variant = "default",
}) {
  const navigate = useNavigate();

  function handleBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackPath);
  }

  return (
    <button
      aria-label="Go back"
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)]",
        iconOnly ? "h-11 w-11 px-0" : "px-4",
        variant === "ghost"
          ? "border-transparent bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-hover)]"
          : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] shadow-[var(--shadow-soft)] hover:border-[var(--color-primary-border)] hover:text-[var(--color-primary-hover)]",
        className,
      )}
      onClick={handleBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className={cn("shrink-0 stroke-[2.75]", iconOnly ? "h-6 w-6" : "h-4 w-4")} />
      {iconOnly ? null : <span>{label}</span>}
    </button>
  );
}
