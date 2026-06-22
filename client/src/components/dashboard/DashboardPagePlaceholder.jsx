import { getModulePlaceholderConfig } from "../../config/modulePlaceholders.js";
import { ModulePlaceholder } from "../states/ModulePlaceholder.jsx";
import { PageHeader } from "../ui/PageHeader.jsx";

export function DashboardPagePlaceholder({
  description,
  futureFeatures,
  futureStage,
  moduleKey,
  stageNote = "Coming in later stages.",
  title,
}) {
  const placeholder = getModulePlaceholderConfig("provider", moduleKey ?? title, {
    futureFeatures,
    futureStage: futureStage ?? stageNote,
    title,
  });

  return (
    <div className="grid gap-6">
      <PageHeader
        description={description}
        eyebrow="Provider command center"
        showBackButton="auto"
        showBreadcrumbs
        title={title}
      />

      <ModulePlaceholder
        description={description}
        futureFeatures={placeholder.futureFeatures}
        futureStage={placeholder.futureStage}
        moduleName={placeholder.title ?? title}
        status="planned"
        title={`${title} foundation`}
      />
    </div>
  );
}
