import { Medal } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { EmptyState } from "../ui/EmptyState.jsx";

export function FirstClientEmptyState({
  actionText = "Improve First Client Setup",
  description = "Try refreshing your readiness status or browse starter challenges while clients add more beginner-friendly opportunities.",
  title = "No starter challenges found",
}) {
  return (
    <EmptyState
      actionHref={ROUTES.FIRST_CLIENT_MODE}
      actionText={actionText}
      description={description}
      icon={Medal}
      secondaryActionHref={ROUTES.CHALLENGES}
      secondaryActionText="View All Challenges"
      title={title}
      variant="spotlight"
    />
  );
}
