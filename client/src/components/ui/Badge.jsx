import { cn } from "../../utils/cn.js";

const variants = {
  black: "border-[#07030D] bg-[#07030D] text-white",
  blue: "border-[#0F766E]/20 bg-[#CCFBF1] text-[#0F766E]",
  gray: "border-[#E9E2F3] bg-[#F8F4FF] text-[#493C5E]",
  green: "border-[#A78BFA]/20 bg-[#F5F3FF] text-[#7C3AED]",
  outline: "border-[#E9E2F3] bg-white text-[#493C5E]",
  primary: "border-[#7C3AED]/20 bg-[#EDE9FE] text-[#7C3AED]",
  secondary: "border-[#6D28D9]/20 bg-[#FEF3C7] text-[#6D28D9]",
  red: "border-[#DC2626]/20 bg-[#FEE2E2] text-[#DC2626]",
  yellow: "border-[#D97706]/20 bg-[#FEF3C7] text-[#D97706]",
};

const sizes = {
  lg: "min-h-8 px-3.5 text-sm",
  md: "min-h-7 px-3 text-xs",
  sm: "min-h-6 px-2.5 text-xs",
};

export function Badge({
  children,
  className = "",
  leftIcon,
  rightIcon,
  rounded = "full",
  size = "md",
  variant = "gray",
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 break-words border text-center font-black leading-tight whitespace-normal [overflow-wrap:anywhere]",
        variants[variant] ?? variants.gray,
        sizes[size] ?? sizes.md,
        rounded === "md" ? "rounded-xl" : "rounded-full",
        className,
      )}
    >
      {leftIcon ? <span aria-hidden="true">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </span>
  );
}
