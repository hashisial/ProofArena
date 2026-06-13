import { createElement } from "react";
import { cn } from "../../utils/cn.js";

const sizeClasses = {
  default: "max-w-7xl",
  full: "max-w-none",
  narrow: "max-w-4xl",
  wide: "max-w-[90rem]",
};

export function Container({
  as: Component = "div",
  children,
  className = "",
  size = "default",
  ...props
}) {
  return createElement(
    Component,
    {
      className: cn(
        "mx-auto w-full min-w-0 px-[var(--space-page-x)]",
        sizeClasses[size] ?? sizeClasses.default,
        className,
      ),
      ...props,
    },
    children,
  );
}
