import { Inbox } from "lucide-react";
import { AppStateShell } from "./AppStateShell.jsx";

function buildAction({ disabledAction, label, href, onClick }) {
  if (!label) {
    return null;
  }

  return {
    comingSoon: disabledAction,
    disabled: disabledAction,
    href,
    label,
    onClick,
  };
}

export function EmptyState({
  actionHref,
  actionLabel,
  badge,
  className = "",
  description,
  disabledAction = false,
  icon = Inbox,
  onAction,
  secondaryActionHref,
  secondaryActionLabel,
  title,
}) {
  return (
    <AppStateShell
      actions={buildAction({
        disabledAction,
        href: actionHref,
        label: actionLabel,
        onClick: onAction,
      })}
      badge={badge}
      className={className}
      description={description}
      icon={icon}
      secondaryActions={buildAction({
        href: secondaryActionHref,
        label: secondaryActionLabel,
      })}
      title={title}
      variant="empty"
    />
  );
}
