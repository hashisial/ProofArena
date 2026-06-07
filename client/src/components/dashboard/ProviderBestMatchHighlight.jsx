import { ArrowRight, Sparkles } from "lucide-react";
import { buildExecutionPlanApplyPath } from "../../features/matches/matchUtils.js";
import { MatchScoreBadge } from "../matches/MatchScoreBadge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function ProviderBestMatchHighlight({ match }) {
  if (!match?.challenge) {
    return null;
  }

  const challenge = match.challenge;
  const topReason = Array.isArray(match.matchReasons) ? match.matchReasons[0] : "";

  return (
    <Card
      as="section"
      aria-labelledby="provider-best-match-title"
      className="border-[#7C3AED]/25 bg-[linear-gradient(135deg,#F5F3FF,#ffffff)] shadow-[0_24px_70px_rgba(124,58,237,0.12)]"
      padding="lg"
      variant="bordered"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Best opportunity right now
          </p>
          <h2 id="provider-best-match-title" className="mt-3 break-words text-2xl font-black text-[#07030D] sm:text-3xl">
            {challenge.title || "Matched challenge"}
          </h2>
          <p className="mt-3 max-w-3xl break-words text-sm font-bold leading-6 text-[#493C5E]">
            {topReason || match.recommendedAction || "This is your strongest currently visible challenge match."}
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <MatchScoreBadge score={match.matchScore} />
          <Button
            as="a"
            className="w-full sm:w-auto"
            href={buildExecutionPlanApplyPath(challenge)}
          >
            Submit Execution Plan
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
