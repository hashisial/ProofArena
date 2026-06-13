import { createElement } from "react";
import { cn } from "../../utils/cn.js";
import { Container } from "./Container.jsx";

export function Section({
  align = "left",
  as: Component = "section",
  children,
  className = "",
  containerClassName = "",
  containerSize = "default",
  eyebrow,
  id,
  subtitle,
  title,
  titleAs: Title = "h2",
  ...props
}) {
  const isCentered = align === "center";

  return createElement(
    Component,
    {
      className: cn("py-[var(--space-section)]", className),
      id,
      ...props,
    },
    <Container className={containerClassName} size={containerSize}>
      {eyebrow || title || subtitle ? (
        <header className={cn("max-w-3xl", isCentered && "mx-auto text-center")}>
          {eyebrow ? (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
              {eyebrow}
            </p>
          ) : null}
          {title
            ? createElement(
                Title,
                {
                  className: "section-title mt-3 break-words",
                },
                title,
              )
            : null}
          {subtitle ? (
            <p className="body-muted mt-4 break-words sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </header>
      ) : null}
      {children ? <div className={cn((eyebrow || title || subtitle) && "mt-8")}>{children}</div> : null}
    </Container>,
  );
}
