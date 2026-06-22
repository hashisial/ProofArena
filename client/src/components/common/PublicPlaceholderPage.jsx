import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "../../utils/cn.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { PageHeader } from "./PageHeader.jsx";

export function PublicPlaceholderPage({
  badge = "Route connected",
  className = "",
  description,
  eyebrow,
  features = [],
  primaryActionLabel,
  primaryActionTo,
  secondaryActionLabel,
  secondaryActionTo,
  title,
}) {
  return (
    <section
      className={cn(
        "placeholder-section relative overflow-hidden px-4 py-14 text-[var(--color-foreground)] sm:px-6 sm:py-16 lg:px-8 lg:py-20",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_16%_12%,rgba(63,98,18,0.10),transparent_30%),radial-gradient(circle_at_88%_26%,rgba(161,98,7,0.08),transparent_28%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl gap-8">
        <Card
          className="placeholder-hero-card relative"
          padding="lg"
          variant="elevated"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,var(--color-primary),transparent)] opacity-35" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.36fr)] lg:items-end">
            <div className="min-w-0">
              <PageHeader
                description={description}
                eyebrow={eyebrow}
                title={title}
              />
              {(primaryActionLabel || secondaryActionLabel) ? (
                <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {primaryActionLabel ? (
                    <Button as="a" className="w-full sm:w-auto" href={primaryActionTo}>
                      {primaryActionLabel}
                      <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
                    </Button>
                  ) : null}
                  {secondaryActionLabel ? (
                    <Button as="a" className="w-full sm:w-auto" href={secondaryActionTo} variant="secondary">
                      {secondaryActionLabel}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-white/88 p-5 shadow-[var(--shadow-soft)]">
              <Badge variant="primary">{badge}</Badge>
              <div className="mt-5 flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-[var(--color-primary-hover)]">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black leading-6 text-[var(--color-foreground)]">
                    Public route is connected.
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-[var(--color-text-muted)]">
                    This placeholder keeps navigation clean until the full module is implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {features.length > 0 ? (
          <Card padding="lg" variant="default">
            <CardHeader>
              <Badge variant="secondary">Foundation scope</Badge>
              <CardTitle>What this page will support</CardTitle>
              <CardDescription>
                These routes are intentionally connected now so homepage, navbar, and footer links do not dead-end.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  className="planned-feature-tile min-w-0 p-4"
                  key={feature}
                >
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
                  <p className="mt-3 break-words text-sm font-black leading-6 text-[var(--color-foreground)]">
                    {feature}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
