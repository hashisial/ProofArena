import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BackButton } from "./BackButton.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";

export function ModulePlaceholder({
  badge = "Foundation ready",
  description,
  highlights = [],
  icon: Icon = CheckCircle2,
  primaryActionHref,
  primaryActionText,
  secondaryActionHref,
  secondaryActionText,
  showBack = false,
  title,
}) {
  return (
    <section className="bg-white px-4 py-16 text-[#07030D] sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#7C3AED]/16 bg-[radial-gradient(circle_at_92%_12%,rgba(124, 58, 237, 0.14),transparent_32%),linear-gradient(135deg,#ffffff,#F8F4FF)] p-6 shadow-[0_24px_80px_rgba(31, 14, 54, 0.08)] md:p-8">
          {showBack ? <BackButton className="mb-5" fallbackPath="/dashboard" /> : null}
          <Badge variant="primary">{badge}</Badge>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-[#07030D] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#493C5E]">
            {description}
          </p>
          {(primaryActionText || secondaryActionText) ? (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {primaryActionText ? (
                <Button as="a" href={primaryActionHref}>
                  {primaryActionText}
                </Button>
              ) : null}
              {secondaryActionText ? (
                <Button as="a" href={secondaryActionHref} variant="outline">
                  {secondaryActionText}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card variant="elevated">
            <CardHeader>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <CardTitle>{title} module shell</CardTitle>
              <CardDescription>
                This page is connected to routing and ready for the next implementation stage.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Badge variant="primary">ProofArena</Badge>
              <Badge variant="gray">ScaleOps platform</Badge>
            </CardFooter>
          </Card>

          <EmptyState
            actionHref={primaryActionHref}
            actionText={primaryActionText}
            description={description}
            icon={Icon}
            secondaryActionHref={secondaryActionHref}
            secondaryActionText={secondaryActionText}
            title="No production records yet"
            variant="spotlight"
          />
        </div>

        {highlights.length > 0 ? (
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>What this page will support</CardTitle>
              <CardDescription>
                The interface is intentionally connected now so navigation never lands on a broken route.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map((item) => (
                <div className="rounded-2xl border border-[#E9E2F3] bg-[#FAFAFA] px-4 py-4" key={item}>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
                  <p className="mt-3 text-sm font-bold leading-6 text-[#493C5E]">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
