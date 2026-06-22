import { Clock3 } from "lucide-react";
import { AppStateShell } from "./AppStateShell.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { cn } from "../../utils/cn.js";

const statusConfig = {
  comingSoon: {
    badge: "Coming soon",
    variant: "comingSoon",
  },
  disabled: {
    badge: "Unavailable",
    variant: "restricted",
  },
  inProgress: {
    badge: "In progress",
    variant: "warning",
  },
  planned: {
    badge: "Planned",
    variant: "comingSoon",
  },
};

export function ModulePlaceholder({
  className = "",
  description,
  futureFeatures = [],
  futureStage,
  icon = Clock3,
  moduleName,
  primaryAction,
  secondaryAction,
  status = "planned",
  title,
}) {
  const config = statusConfig[status] ?? statusConfig.planned;
  const resolvedTitle = title ?? moduleName;
  const stageLabel = futureStage ? String(futureStage) : "Future stage";
  const primary = primaryAction ?? {
    comingSoon: true,
    disabled: true,
    label: `Coming in ${stageLabel}`,
  };

  return (
    <AppStateShell
      actions={primary}
      badge={config.badge}
      className={className}
      description={description}
      icon={icon}
      secondaryActions={secondaryAction}
      title={resolvedTitle}
      variant={config.variant}
    >
      <div className="grid w-full max-w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Card className="bg-[var(--color-card)]/92" padding="md" variant="bordered">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)]">
            Roadmap
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="warning">{stageLabel}</Badge>
            <Badge variant="primary">{moduleName}</Badge>
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-[var(--color-text-secondary)]">
            This route is connected now so navigation remains reliable while the production module is built later.
          </p>
        </Card>

        {futureFeatures.length > 0 ? (
          <Card className="bg-[var(--color-card)]/92" padding="md" variant="bordered">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Planned capability
            </p>
            <ul className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2" aria-label={`${moduleName} planned capabilities`}>
              {futureFeatures.map((feature) => (
                <li
                  className={cn(
                    "planned-feature-tile min-w-0 px-4 py-3",
                    "text-sm font-bold leading-6 text-[var(--color-text-secondary)]",
                  )}
                  key={feature}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ) : null}
      </div>
    </AppStateShell>
  );
}
