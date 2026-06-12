import { ArrowRight, Bookmark, BookmarkCheck, Clock3, FileText, Target } from "lucide-react";
import { Link } from "react-router-dom";
import {
  buildChallengeViewPath,
  buildPlanApplyPath,
  formatStarterBudget,
  formatStarterTimeline,
  PROOF_SIMPLICITY_LABELS,
  STARTER_LEVEL_LABELS,
} from "../../features/firstClient/firstClientUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { MatchScoreBadge } from "../matches/MatchScoreBadge.jsx";

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
      <p className="mt-1 text-sm font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function StarterChallengeCard({
  challenge,
  isSaving = false,
  match = null,
  onSave,
}) {
  const starter = challenge?.starterChallenge ?? {};
  const skills = Array.isArray(challenge?.skillsNeeded) ? challenge.skillsNeeded.slice(0, 5) : [];
  const totalPlans = Number(challenge?.applicationStats?.totalPlans ?? 0);
  const isSaved = String(match?.status ?? "").toLowerCase() === "saved";

  return (
    <Card className="grid gap-5" variant="bordered">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">
            {STARTER_LEVEL_LABELS[starter.level] ?? "Starter"}
          </Badge>
          <Badge variant="secondary">
            {PROOF_SIMPLICITY_LABELS[starter.proofSimplicity] ?? "Proof scoped"}
          </Badge>
          {challenge?.category ? <Badge variant="outline">{challenge.category}</Badge> : null}
        </div>
        {match ? <MatchScoreBadge score={match.matchScore} /> : null}
      </div>

      <div>
        <h2 className="text-xl font-black tracking-normal text-[#1C1917]">{challenge?.title || "Starter challenge"}</h2>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {challenge?.shortSummary || "A beginner-friendly challenge is available."}
        </p>
      </div>

      {challenge?.targetOutcome?.outcomeStatement ? (
        <div className="rounded-2xl border border-[#3F6212]/15 bg-[#F7FEE7] p-4">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            <Target aria-hidden="true" className="h-4 w-4" />
            Target outcome
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#1C1917]">{challenge.targetOutcome.outcomeStatement}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="Budget" value={formatStarterBudget(challenge?.budget)} />
        <Detail label="Timeline" value={formatStarterTimeline(challenge?.timeline)} />
        <Detail
          label="Estimated"
          value={starter.estimatedHours ? `${starter.estimatedHours} hours` : "Small scope"}
        />
        <Detail
          label="Plans received"
          value={totalPlans === 0 ? "None yet" : totalPlans}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge size="sm" variant="gray">
          {challenge?.proofRequirementsCount ?? 0} proof requirement{challenge?.proofRequirementsCount === 1 ? "" : "s"}
        </Badge>
        {skills.map((skill) => (
          <Badge key={skill} size="sm" variant="gray">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E7E5E4] pt-5 sm:flex-row sm:flex-wrap">
        {match?.id ? (
          <Button
            disabled={isSaved}
            isLoading={isSaving}
            loadingLabel="Saving..."
            onClick={() => onSave?.(match)}
            type="button"
            variant="outline"
          >
            {isSaved ? (
              <BookmarkCheck aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Bookmark aria-hidden="true" className="h-4 w-4" />
            )}
            {isSaved ? "Saved" : "Save Match"}
          </Button>
        ) : null}
        <Button as={Link} to={buildChallengeViewPath(challenge)} variant="secondary">
          <Clock3 aria-hidden="true" className="h-4 w-4" />
          View Challenge
        </Button>
        <Button as={Link} to={buildPlanApplyPath(challenge)}>
          <FileText aria-hidden="true" className="h-4 w-4" />
          Submit Plan
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
