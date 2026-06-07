import { CheckCircle2, Clock } from "lucide-react";
import { opportunityDueState } from "../../features/opportunities/opportunityUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

const dueVariants = {
  none: "gray",
  overdue: "red",
  scheduled: "outline",
  soon: "secondary",
};

const dueLabels = {
  none: "No due date",
  overdue: "Overdue",
  scheduled: "Scheduled",
  soon: "Due soon",
};

export function OpportunityNextActionCard({ isCompleting = false, nextAction = {}, onComplete }) {
  const dueState = opportunityDueState(nextAction);

  return (
    <Card padding="sm" variant="muted">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Clock aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
            <p className="font-black text-[#07030D]">{nextAction.title || "No next action set"}</p>
            <Badge size="sm" variant={dueVariants[dueState] ?? "gray"}>{dueLabels[dueState]}</Badge>
          </div>
          {nextAction.description ? (
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">{nextAction.description}</p>
          ) : null}
          <p className="mt-2 text-xs font-bold text-[#6F657C]">
            Due {formatDate(nextAction.dueAt, { fallback: "not scheduled" })}
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          disabled={!nextAction.title}
          isLoading={isCompleting}
          onClick={() => onComplete?.(!nextAction.completed)}
          type="button"
          variant={nextAction.completed ? "secondary" : "outline"}
        >
          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          {nextAction.completed ? "Reopen" : "Complete"}
        </Button>
      </div>
    </Card>
  );
}
