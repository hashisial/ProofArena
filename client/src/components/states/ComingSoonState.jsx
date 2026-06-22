import { Clock3 } from "lucide-react";
import { AppStateShell } from "./AppStateShell.jsx";

export function ComingSoonState({
  badge,
  className = "",
  description,
  futureCapability,
  primaryActionHref,
  primaryActionLabel,
  secondaryActionHref,
  secondaryActionLabel,
  stage,
  title,
}) {
  const resolvedStage = stage ? String(stage) : "Planned";

  return (
    <AppStateShell
      actions={{
        comingSoon: !primaryActionHref,
        disabled: !primaryActionHref,
        href: primaryActionHref,
        label: primaryActionLabel ?? `Coming in ${resolvedStage}`,
      }}
      badge={badge ?? resolvedStage}
      className={className}
      description={description}
      icon={Clock3}
      secondaryActions={
        secondaryActionLabel
          ? {
              href: secondaryActionHref,
              label: secondaryActionLabel,
              variant: "secondary",
            }
          : null
      }
      title={title}
      variant="comingSoon"
    >
      {futureCapability ? (
        <div className="rounded-2xl border border-[#E7E5E4] bg-white/80 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">
            Future capability
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#44403C]">
            {futureCapability}
          </p>
        </div>
      ) : null}
    </AppStateShell>
  );
}
