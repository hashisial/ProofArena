import { createElement } from "react";
import { Badge } from "./Badge.jsx";
import { Button } from "./Button.jsx";
import { Card } from "./Card.jsx";
import { cn } from "../../utils/cn.js";

const variants = {
  default: "bg-white",
  spotlight:
    "bg-[radial-gradient(circle_at_88%_12%,rgba(63, 98, 18, 0.14),transparent_30%),linear-gradient(135deg,#ffffff,#fffbeb)]",
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
  return (
    <section
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
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#3F6212]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[#65A30D]/10 blur-3xl"
        />

        <div className="relative z-10 grid justify-items-center">
          {icon ? (
            <div
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-3xl border border-[#3F6212]/20 bg-[#F7FEE7] text-[#3F6212]"
            >
              {createElement(icon, { className: "h-7 w-7" })}
            </div>
          ) : null}

          {code ? (
            <Badge className="mt-6" size="lg" variant="primary">
              {code}
            </Badge>
          ) : null}

          <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-normal text-[#1C1917] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#44403C]">
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
                  href={secondaryActionHref}
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
