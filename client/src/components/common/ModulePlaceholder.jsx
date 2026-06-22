import { CheckCircle2 } from "lucide-react";
import { getModulePlaceholderConfig } from "../../config/modulePlaceholders.js";
import { ModulePlaceholder as StateModulePlaceholder } from "../states/ModulePlaceholder.jsx";
import { PageHeader } from "../ui/PageHeader.jsx";

export function ModulePlaceholder({
  badge = "Foundation ready",
  description,
  highlights = [],
  icon: Icon = CheckCircle2,
  moduleKey,
  moduleScope = "shared",
  primaryActionHref,
  primaryActionText,
  secondaryActionHref,
  secondaryActionText,
  showBack = false,
  title,
}) {
  const placeholder = getModulePlaceholderConfig(moduleScope, moduleKey ?? title, {
    futureFeatures: highlights,
    futureStage: badge,
    title,
  });

  return (
    <section className="placeholder-section px-4 py-12 text-[var(--color-foreground)] sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8">
        <div className="placeholder-hero-card relative overflow-hidden p-5 sm:p-6 md:p-8">
          <PageHeader
            badge={badge}
            description={description}
            showBackButton={showBack ? "auto" : false}
            showBreadcrumbs={showBack}
            title={title}
          />
        </div>

        <StateModulePlaceholder
          description={description}
          futureFeatures={placeholder.futureFeatures}
          futureStage={placeholder.futureStage}
          icon={Icon}
          moduleName={placeholder.title ?? title}
          primaryAction={
            primaryActionText
              ? {
                  href: primaryActionHref,
                  label: primaryActionText,
                }
              : undefined
          }
          secondaryAction={
            secondaryActionText
              ? {
                  href: secondaryActionHref,
                  label: secondaryActionText,
                  variant: "secondary",
                }
              : undefined
          }
          status="planned"
          title={`${title} module foundation`}
        />
      </div>
    </section>
  );
}
