import { CalendarDays, ClipboardList, FileCheck2, Target, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
} from "../../features/challenges/challengeUtils.js";
import {
  getChallengeNextAction,
  getPlansCount,
  getRecommendedProvidersCount,
} from "../../utils/challengeNextAction.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { ChallengeActionMenu } from "./ChallengeActionMenu.jsx";
import { ChallengeStatusBadge, ChallengeVisibilityBadge } from "./ChallengeStatusBadge.jsx";

function getUpdatedLabel(value) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

function getChallengeUrl(challenge) {
  if (challenge?.client?.username && challenge?.slug) {
    return `/challenges/${encodeURIComponent(challenge.client.username)}/${encodeURIComponent(challenge.slug)}`;
  }

  return ROUTES.CHALLENGES;
}

export function ChallengeCard({
  actionState = {},
  challenge,
  onArchive,
  onClose,
  onPause,
  onPublish,
  variant = "owner",
}) {
  const qualityScore = Number(challenge?.qualityScore?.score ?? 0);
  const targetOutcome = challenge?.targetOutcome?.outcomeStatement || "Outcome statement not added yet.";
  const proofCount = challenge?.proofRequirements?.length ?? 0;
  const plansCount = getPlansCount(challenge);
  const recommendedCount = getRecommendedProvidersCount(challenge);
  const nextAction = getChallengeNextAction(challenge);

  return (
    <Card className="h-full" padding="md" variant="interactive">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {variant === "owner" ? <ChallengeStatusBadge status={challenge?.status} /> : null}
          {variant === "owner" ? <ChallengeVisibilityBadge visibility={challenge?.visibility} /> : null}
          <Badge variant="outline">{challenge?.category || "Uncategorized"}</Badge>
          {variant !== "owner" ? <Badge variant="secondary">{challenge?.urgency || "normal"}</Badge> : null}
        </div>
        <CardTitle className="text-xl">{challenge?.title || "Untitled outcome challenge"}</CardTitle>
        <CardDescription>{challenge?.shortSummary || "Add a clear summary so providers understand the result."}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <div className="flex items-start gap-3">
            <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6212]" />
            <p className="text-sm font-semibold leading-6 text-[#44403C]">{targetOutcome}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatChallengeTimeline(challenge?.timeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Budget</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatChallengeBudget(challenge?.budget)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
              {variant === "owner" ? "Quality" : "Plans"}
            </p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">
              {variant === "owner" ? `${qualityScore}/100` : `${Number(challenge?.applicationStats?.totalPlans ?? 0)} submitted`}
            </p>
          </div>
        </div>
        {variant === "owner" ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                <ClipboardList aria-hidden="true" className="h-3.5 w-3.5" />
                Plans
              </p>
              <p className="mt-1 text-sm font-black text-[#1C1917]">{plansCount} received</p>
            </div>
            <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                <UsersRound aria-hidden="true" className="h-3.5 w-3.5" />
                Matches
              </p>
              <p className="mt-1 text-sm font-black text-[#1C1917]">{recommendedCount} recommended</p>
            </div>
            <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Next action</p>
              <p className="mt-1 text-sm font-black text-[#1C1917]">{nextAction.label}</p>
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Badge leftIcon={<FileCheck2 className="h-3.5 w-3.5" />} variant="green">
            {proofCount} proof requirement{proofCount === 1 ? "" : "s"}
          </Badge>
          <Badge leftIcon={<CalendarDays className="h-3.5 w-3.5" />} variant="gray">
            Updated {getUpdatedLabel(challenge?.updatedAt ?? challenge?.publishedAt)}
          </Badge>
        </div>
      </CardContent>
      {variant === "owner" ? (
        <CardFooter>
          <ChallengeActionMenu
            challenge={challenge}
            isArchiving={actionState.isArchiving}
            isClosing={actionState.isClosing}
            isPausing={actionState.isPausing}
            isPublishing={actionState.isPublishing}
            onArchive={onArchive}
            onClose={onClose}
            onPause={onPause}
            onPublish={onPublish}
          />
        </CardFooter>
      ) : (
        <CardFooter>
          <Button as={Link} to={getChallengeUrl(challenge)}>
            View Challenge
          </Button>
          <Button as={Link} to={ROUTES.REGISTER} variant="outline">
            Submit Execution Plan
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
