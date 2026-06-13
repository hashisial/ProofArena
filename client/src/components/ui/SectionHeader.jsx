import { createElement } from "react";
import { cn } from "../../utils/cn.js";
import { Badge } from "./Badge.jsx";

export function SectionHeader({
  actions,
  align = "left",
  badge,
  badgeVariant = "primary",
  className = "",
  description,
  eyebrow,
  title,
  titleAs: Title = "h2",
}) {
  const isCentered = align === "center";

  return (
    <header
      className={cn(
        "flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        isCentered && "items-center text-center sm:items-center",
        className,
      )}
    >
      <div className={cn("min-w-0 max-w-3xl", isCentered && "mx-auto")}>
        {badge ? (
          <Badge className={isCentered ? "mx-auto" : ""} variant={badgeVariant}>
            {badge}
          </Badge>
        ) : eyebrow ? (
          <p className="small-label uppercase text-[var(--color-primary)]">{eyebrow}</p>
        ) : null}
        {title
          ? createElement(
              Title,
              {
                className: cn("section-title break-words", (badge || eyebrow) && "mt-3"),
              },
              title,
            )
          : null}
        {description ? (
          <p className="body-muted mt-3 max-w-2xl break-words">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className={cn("flex shrink-0 flex-wrap gap-3", isCentered && "justify-center")}>
          {actions}
        </div>
      ) : null}
    </header>
  );
}
