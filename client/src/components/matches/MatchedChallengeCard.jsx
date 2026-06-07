import { ArrowRight, Bookmark, Eye, FileText, Sparkles, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatChallengeBudget, formatChallengeTimeline } from "../../features/challenges/challengeUtils.js";
import {
  buildExecutionPlanApplyPath,
  buildPublicChallengePath,
} from "../../features/matches/matchUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { MatchReasonList } from "./MatchReasonList.jsx";
import { MatchScoreBadge } from "./MatchScoreBadge.jsx";
import { MatchStatusBadge } from "./MatchStatusBadge.jsx";
import { MatchWeaknessList } from "./MatchWeaknessList.jsx";

function FieldPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function MatchedChallengeCard({
  isUpdating = false,
  match,
  onDismiss,
  onSave,
  onView,
}) {
  const challenge = match?.challenge ?? {};
  const viewPath = buildPublicChallengePath(challenge);
  const applyPath = buildExecutionPlanApplyPath(challenge);
  const proofCount = Array.isArray(challenge.proofRequirements)
    ? challenge.proofRequirements.length
    : Number(challenge.proofRequirementsCount ?? 0);
  const skills = Array.isArray(challenge.skillsNeeded) ? challenge.skillsNeeded.slice(0, 5) : [];

  return (
    <Card className="grid gap-5" variant="bordered">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <MatchScoreBadge score={match?.matchScore} />
          <MatchStatusBadge status={match?.status} />
          {challenge.category ? <Badge variant="outline">{challenge.category}</Badge> : null}
          {challenge.urgency ? <Badge variant="secondary">{challenge.urgency.replaceAll("_", " ")}</Badge> : null}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black tracking-normal text-[#1C1917]">{challenge.title || "Matched challenge"}</h2>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {challenge.shortSummary || "A matched outcome challenge is available for review."}
        </p>
      </div>

      {challenge.targetOutcome?.outcomeStatement ? (
        <div className="rounded-2xl border border-[#3F6212]/15 bg-[#F7FEE7] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            Target outcome
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#1C1917]">{challenge.targetOutcome.outcomeStatement}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <FieldPill label="Timeline" value={formatChallengeTimeline(challenge.timeline)} />
        <FieldPill label="Budget" value={formatChallengeBudget(challenge.budget)} />
        <FieldPill label="Proof" value={proofCount > 0 ? `${proofCount} requirement${proofCount === 1 ? "" : "s"}` : "Proof scoped"} />
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} size="sm" variant="gray">
              {skill}
            </Badge>
          ))}
        </div>
      ) : null}

      <MatchReasonList reasons={match?.matchReasons ?? []} />
      <MatchWeaknessList weaknesses={match?.weaknesses ?? []} />

      {match?.recommendedAction ? (
        <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Recommended action</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#1C1917]">{match.recommendedAction}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[#E7E5E4] pt-5 sm:flex-row sm:flex-wrap">
        <Button as={Link} onClick={() => onView?.(match)} to={viewPath} variant="secondary">
          <Eye aria-hidden="true" className="h-4 w-4" />
          View Challenge
        </Button>
        <Button as={Link} to={applyPath}>
          <FileText aria-hidden="true" className="h-4 w-4" />
          Submit Execution Plan
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
        <Button
          disabled={match?.status === "saved"}
          isLoading={isUpdating}
          onClick={() => onSave?.(match)}
          type="button"
          variant="outline"
        >
          <Bookmark aria-hidden="true" className="h-4 w-4" />
          Save
        </Button>
        <Button
          disabled={match?.status === "dismissed"}
          isLoading={isUpdating}
          onClick={() => onDismiss?.(match)}
          type="button"
          variant="secondary"
        >
          <XCircle aria-hidden="true" className="h-4 w-4" />
          Dismiss
        </Button>
      </div>
    </Card>
  );
}
