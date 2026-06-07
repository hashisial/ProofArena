import { Target } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { EmptyState } from "../ui/EmptyState.jsx";

export function ChallengeEmptyState() {
  return (
    <EmptyState
      actionHref={ROUTES.NEW_CHALLENGE}
      actionText="Create Challenge"
      className="border border-[#E9E2F3]"
      description="Challenges help providers understand the result you need, the proof you expect, and how success will be measured."
      icon={Target}
      title="Create your first outcome challenge"
      variant="spotlight"
    />
  );
}
