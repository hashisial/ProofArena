import { cn } from "../utils/index.js";

const variantClasses = {
  primary:
    "border border-[#7C3AED] bg-[#7C3AED] text-white shadow-[0_18px_44px_rgba(124,58,237,0.22)] hover:border-[#5B21B6] hover:bg-[#5B21B6] hover:shadow-[0_22px_58px_rgba(124,58,237,0.3)]",
  secondary:
    "border border-[#E9E2F3] bg-white text-[#07030D] shadow-[0_14px_40px_rgba(31,14,54,0.06)] hover:border-[#A78BFA] hover:bg-[#FBF9FF] hover:text-[#5B21B6] hover:shadow-[0_18px_48px_rgba(124,58,237,0.12)]",
  outline:
    "border border-[#7C3AED]/35 bg-[#F5F3FF] text-[#7C3AED] hover:border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white hover:shadow-[0_18px_48px_rgba(124,58,237,0.2)]",
};

export function Button({
  as: Element = "button",
  children,
  className = "",
  disabled = false,
  isLoading = false,
  loadingLabel = "Loading...",
  onClick,
  type = "button",
  variant = "primary",
  ...props
}) {
  const isDisabled = disabled || isLoading;
  const elementProps =
    Element === "button"
      ? { disabled: isDisabled, type }
      : { "aria-disabled": isDisabled };

  function handleClick(event) {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  return (
    <Element
      aria-busy={isLoading ? "true" : undefined}
      className={cn(
        "group relative inline-flex min-h-12 min-w-0 max-w-full items-center justify-center overflow-hidden rounded-full px-5 py-3 text-center text-sm font-bold leading-5 tracking-normal whitespace-normal transition duration-300 [overflow-wrap:anywhere] before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:skew-x-[-18deg] before:bg-white/30 before:opacity-0 before:blur-md before:transition-all before:duration-500 after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-white/0 after:transition after:duration-300 hover:-translate-y-0.5 hover:scale-[1.015] hover:before:left-[120%] hover:before:opacity-100 hover:after:ring-white/25 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 disabled:cursor-not-allowed disabled:opacity-55",
        isDisabled && "pointer-events-none opacity-60",
        variantClasses[variant],
        className,
      )}
      onClick={handleClick}
      {...elementProps}
      {...props}
    >
      <span className="relative z-10 flex min-w-0 max-w-full flex-wrap items-center justify-center break-words [overflow-wrap:anywhere]">
        {isLoading ? loadingLabel : children}
      </span>
    </Element>
  );
}
