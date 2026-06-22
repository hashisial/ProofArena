import { AlertTriangle, LockKeyhole, SearchX, WifiOff } from "lucide-react";
import { AppStateShell } from "./AppStateShell.jsx";

const variantCopy = {
  generic: {
    description: "Something interrupted this page. Try again or return to a safer area.",
    icon: AlertTriangle,
    title: "This area could not load",
    variant: "error",
  },
  network: {
    description: "The app could not reach the server. Check the connection and try again.",
    icon: WifiOff,
    title: "No response from the server",
    variant: "error",
  },
  notFound: {
    description: "The requested record may have moved, been removed, or may not be available yet.",
    icon: SearchX,
    title: "This item was not found",
    variant: "warning",
  },
  permission: {
    description: "Your current account does not have permission to view this area.",
    icon: LockKeyhole,
    title: "Access is restricted",
    variant: "restricted",
  },
  validation: {
    description: "Review the highlighted fields and submit again.",
    icon: AlertTriangle,
    title: "Some information needs attention",
    variant: "warning",
  },
};

export function ErrorState({
  backHref,
  className = "",
  description,
  onRetry,
  retryLabel = "Try again",
  supportHref,
  title,
  variant = "generic",
}) {
  const config = variantCopy[variant] ?? variantCopy.generic;

  return (
    <AppStateShell
      actions={onRetry ? { label: retryLabel, onClick: onRetry } : null}
      className={className}
      description={description ?? config.description}
      icon={config.icon}
      secondaryActions={[
        backHref ? { href: backHref, label: "Go back", variant: "secondary" } : null,
        supportHref ? { href: supportHref, label: "Contact support", variant: "outline" } : null,
      ].filter(Boolean)}
      title={title ?? config.title}
      variant={config.variant}
    />
  );
}
