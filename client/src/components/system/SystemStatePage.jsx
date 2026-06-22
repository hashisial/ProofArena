import { ArrowRight } from "lucide-react";
import { useId } from "react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { UniversalBackButton } from "../ui/UniversalBackButton.jsx";
import { cn } from "../../utils/cn.js";

export function SystemStatePage({
  actions = [],
  badge,
  className = "",
  code,
  description,
  icon: Icon,
  links = [],
  showBackAction = true,
  title,
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "state-page-section grid min-h-[calc(100vh-8rem)] place-items-center overflow-hidden px-4 py-14 text-[var(--color-foreground)] sm:px-6 lg:px-8",
        className,
      )}
    >
      <Card
        className="state-page-card relative w-full max-w-4xl overflow-hidden text-left"
        padding="lg"
        variant="elevated"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,var(--color-primary),transparent)] opacity-35" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.38fr)] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              {Icon ? (
                <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-lg)] border border-[var(--color-primary-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
              ) : null}
              {code ? <Badge variant="primary">{code}</Badge> : null}
              {badge ? <Badge variant="warning">{badge}</Badge> : null}
            </div>

            <h1
              className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-normal text-[var(--color-foreground)] sm:text-5xl"
              id={titleId}
            >
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-[var(--color-text-secondary)]">
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions.map((action, index) => (
                <Button
                  as="a"
                  className="w-full sm:w-auto"
                  href={action.href}
                  iconRight={action.iconRight ?? (index === 0 ? <ArrowRight className="h-4 w-4" /> : undefined)}
                  key={`${action.label}-${action.href}`}
                  variant={action.variant ?? (index === 0 ? "primary" : "secondary")}
                >
                  {action.label}
                </Button>
              ))}
              {showBackAction ? (
                <UniversalBackButton className="w-full sm:w-auto" variant="button" />
              ) : null}
            </div>
          </div>

          <aside
            aria-label="Helpful links"
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Safe next steps
            </p>
            {links.length > 0 ? (
              <nav className="mt-4 grid gap-2" aria-label="Route recovery links">
                {links.map((link) => (
                  <a
                    className="group rounded-[var(--radius-lg)] border border-transparent bg-[var(--color-card)] px-4 py-3 text-sm font-black text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary-border)] hover:text-[var(--color-primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 motion-reduce:transition-none"
                    href={link.href}
                    key={`${link.label}-${link.href}`}
                  >
                    {link.label}
                    {link.description ? (
                        <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--color-text-muted)]">
                        {link.description}
                      </span>
                    ) : null}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="mt-4 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                Use the actions on this page to return to a safe area.
              </p>
            )}
          </aside>
        </div>
      </Card>
    </section>
  );
}
