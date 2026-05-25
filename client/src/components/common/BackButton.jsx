import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import { cn } from "../../utils/cn.js";

export function BackButton({
  className = "",
  fallbackPath = ROUTES.DASHBOARD,
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
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#3F6212]/12",
        variant === "ghost"
          ? "border-transparent bg-transparent text-[#44403C] hover:bg-[#F7FEE7] hover:text-[#365314]"
          : "border-[#E7E5E4] bg-white text-[#44403C] shadow-[0_12px_30px_rgba(28, 25, 23, 0.06)] hover:border-[#3F6212]/30 hover:text-[#365314]",
        className,
      )}
      onClick={handleBack}
      type="button"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
