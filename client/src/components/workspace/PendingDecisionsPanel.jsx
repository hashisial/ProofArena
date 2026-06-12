import { AlertCircle, ArrowRight, ClipboardCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { buildPendingDecisions } from "../../features/workspace/workspaceUtils.js";

const priorityVariants = {
  high: "red",
  low: "gray",
  medium: "secondary",
};

export function PendingDecisionsPanel({ challenges = [] }) {
  const decisions = buildPendingDecisions(challenges);

  return (
    <Card as="section" padding="md" variant="elevated">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Pending Decisions</CardTitle>
          <Badge variant={decisions.length > 0 ? "secondary" : "green"}>{decisions.length}</Badge>
        </div>
        <CardDescription>Priority decisions derived from provider selection and plan activity.</CardDescription>
      </CardHeader>
      <CardContent>
        {decisions.length > 0 ? (
          <ol className="grid gap-3">
            {decisions.map((decision) => (
              <li className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={`${decision.challengeId}-${decision.title}`}>
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#A16207]">
                    <AlertCircle aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-sm font-black text-[#1C1917]">{decision.title}</h3>
                      <Badge size="sm" variant={priorityVariants[decision.priority] || "gray"}>
                        {decision.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 break-words text-xs font-bold text-[#57534E]">{decision.challengeTitle}</p>
                    <p className="mt-2 text-sm leading-6 text-[#78716C]">{decision.description}</p>
                    <Button as="a" className="mt-3 min-h-10 px-4 py-2 text-xs" href={decision.href} variant="outline">
                      {decision.label}
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            description="No provider or plan decisions currently require attention."
            icon={ClipboardCheck}
            size="sm"
            title="No pending decisions"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
