import { cn } from "../../utils/cn.js";

const variants = {
  black: "border-[#1C1917] bg-[#1C1917] text-white",
  blue: "border-[#0F766E]/20 bg-[#CCFBF1] text-[#0F766E]",
  gray: "border-[#E7E5E4] bg-[#FFFBEB] text-[#44403C]",
  green: "border-[#65A30D]/20 bg-[#F7FEE7] text-[#3F6212]",
  outline: "border-[#E7E5E4] bg-white text-[#44403C]",
  primary: "border-[#3F6212]/20 bg-[#ECFCCB] text-[#3F6212]",
  secondary: "border-[#A16207]/20 bg-[#FEF3C7] text-[#A16207]",
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
