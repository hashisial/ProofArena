import { createElement, useId } from "react";
import { Badge } from "./Badge.jsx";
import { Button } from "./Button.jsx";
import { Card } from "./Card.jsx";
import { cn } from "../../utils/cn.js";

const variants = {
  default: "bg-[var(--color-card)]",
  spotlight:
    "bg-[var(--gradient-error-spotlight)]",
};

export function ErrorState({
  className = "",
  code,
  description,
  icon,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionHref,
  primaryActionText,
  secondaryActionHref,
  secondaryActionText,
  title,
  variant = "spotlight",
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8",
        variants[variant] ?? variants.spotlight,
        className,
      )}
    >
      <Card
        className="relative w-full max-w-3xl overflow-hidden text-center"
        padding="lg"
        variant="elevated"
      >
        <div className="relative z-10 grid justify-items-center">
          {icon ? (
            <div
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-[var(--radius-lg)] border border-[var(--color-primary-border)] bg-[var(--color-accent-soft)] text-[var(--color-primary)]"
            >
              {createElement(icon, { className: "h-7 w-7" })}
            </div>
          ) : null}

          {code ? (
            <Badge className="mt-6" size="lg" variant="primary">
              {code}
            </Badge>
          ) : null}

          <h1
            className="mt-5 max-w-2xl text-4xl font-black tracking-normal text-[var(--color-foreground)] sm:text-5xl"
            id={titleId}
          >
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-text-secondary)]">
            {description}
          </p>

          {(primaryActionText || secondaryActionText) ? (
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              {primaryActionText ? (
                <Button
                  as={primaryActionHref ? "a" : "button"}
                  className="w-full sm:w-auto"
                  href={primaryActionHref}
                  onClick={onPrimaryAction}
                >
                  {primaryActionText}
                </Button>
              ) : null}
              {secondaryActionText ? (
                <Button
                  as={secondaryActionHref ? "a" : "button"}
                  className="w-full sm:w-auto"
                  href={secondaryActionHref || undefined}
                  onClick={onSecondaryAction}
                  variant="outline"
                >
                  {secondaryActionText}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
