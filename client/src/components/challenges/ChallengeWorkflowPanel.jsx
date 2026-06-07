import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { ChallengeStatusBadge } from "./ChallengeStatusBadge.jsx";
import { getChallengeNextAction } from "../../utils/challengeNextAction.js";
import { cn } from "../../utils/cn.js";

const workflowStages = [
  {
    description: "Complete the challenge brief, outcome, proof requirements, budget, and timeline.",
    label: "Draft",
    statuses: ["draft"],
  },
  {
    description: "Providers can discover the challenge and submit execution plans.",
    label: "Open",
    statuses: ["open", "paused"],
  },
  {
    description: "Compare submitted plans and shortlist the strongest providers.",
    label: "Reviewing Plans",
    statuses: ["reviewing_plans"],
  },
  {
    description: "A provider has been selected and the work setup is ready for later milestones.",
    label: "Provider Selected",
    statuses: ["provider_selected"],
  },
  {
    description: "Milestone tracking will be connected in a later stage.",
    label: "In Progress",
    statuses: ["in_progress"],
  },
  {
    description: "Proof review will become available after proof submission stages.",
    label: "Proof Review Later",
    statuses: ["proof_review"],
  },
  {
    description: "The outcome is complete and can be reviewed as a record.",
    label: "Completed",
    statuses: ["completed", "archived", "cancelled"],
  },
];

function getStageIndex(status) {
  const index = workflowStages.findIndex((stage) => stage.statuses.includes(status));
  return index >= 0 ? index : 0;
}

export function ChallengeWorkflowPanel({
  challenge,
  isPublishing = false,
  onPublish,
}) {
  const status = challenge?.status ?? "draft";
  const currentIndex = getStageIndex(status);
  const currentStage = workflowStages[currentIndex] ?? workflowStages[0];
  const nextAction = getChallengeNextAction(challenge);

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Challenge Workflow</CardTitle>
            <CardDescription>
              See where this challenge is now and what the next client action should be.
            </CardDescription>
          </div>
          <ChallengeStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-7">
          {workflowStages.map((stage, index) => {
            const isCurrent = index === currentIndex;
            const isComplete = index < currentIndex;
            const Icon = isCurrent ? CircleDot : isComplete ? CheckCircle2 : Circle;

            return (
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "rounded-2xl border p-3",
                  isCurrent
                    ? "border-[#7C3AED]/30 bg-[#F5F3FF]"
                    : isComplete
                      ? "border-[#A78BFA]/20 bg-white"
                      : "border-[#E9E2F3] bg-[#F8F4FF]",
                )}
                key={stage.label}
              >
                <div className="flex items-start gap-2 md:grid md:justify-items-start">
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isCurrent || isComplete ? "text-[#7C3AED]" : "text-[#A69AB5]",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black leading-5 text-[#07030D]">{stage.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#6F657C]">
                      {isCurrent ? "Current step" : isComplete ? "Passed" : "Later"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Current step</Badge>
                <p className="text-sm font-black text-[#07030D]">{currentStage.label}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">{currentStage.description}</p>
              <p className="mt-3 text-sm font-bold leading-6 text-[#493C5E]">
                Next: {nextAction.description}
              </p>
            </div>
            {nextAction.disabled ? (
              <Button className="w-full lg:w-auto" disabled type="button" variant="secondary">
                {nextAction.label}
              </Button>
            ) : nextAction.action === "publish" ? (
              <Button
                className="w-full lg:w-auto"
                isLoading={isPublishing}
                loadingLabel={status === "paused" ? "Resuming..." : "Publishing..."}
                onClick={() => onPublish?.()}
                type="button"
              >
                {nextAction.label}
              </Button>
            ) : nextAction.route ? (
              <Button as={Link} className="w-full lg:w-auto" to={nextAction.route}>
                {nextAction.label}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
