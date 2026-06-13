import { ArrowRight, ClipboardList, UsersRound } from "lucide-react";
import { ChallengeStatusBadge } from "../challenges/ChallengeStatusBadge.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ChallengeHealthCard } from "./ChallengeHealthCard.jsx";
import { ROUTES } from "../../constants/routes.js";
import { formatDate } from "../../utils/formatDate.js";
import { getChallengeId, getPlansCount } from "../../utils/challengeNextAction.js";
import {
  getChallengeShortlistCount,
  getSelectedProviderName,
  getWorkspaceNextAction,
} from "../../features/workspace/workspaceUtils.js";

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E7E5E4] bg-[#FEFCE8] px-3 py-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function ActiveChallengeWorkspaceCard({
  challenge,
  focusPlans = [],
  isFocus = false,
  savedProviders = [],
  savedProvidersAvailable = true,
}) {
  const challengeId = getChallengeId(challenge);
  const nextAction = getWorkspaceNextAction(challenge);
  const shortlistCount = getChallengeShortlistCount(challenge, savedProviders);
  const selectedProvider = getSelectedProviderName(challenge, isFocus ? focusPlans : [], savedProviders);

  return (
    <Card as="article" padding="md" variant="bordered">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ChallengeStatusBadge status={challenge.status} />
            {isFocus ? <Badge variant="primary">Current focus</Badge> : null}
          </div>
          <h3 className="mt-3 break-words text-xl font-black tracking-normal text-[#1C1917]">
            {challenge.title || "Outcome challenge"}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#78716C]">
            {challenge.targetOutcome?.outcomeStatement || challenge.shortSummary || "Outcome target not specified."}
          </p>
        </div>
        <ChallengeHealthCard challenge={challenge} className="w-full lg:w-48" compact />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Plans received" value={getPlansCount(challenge)} />
        <Metric label="Shortlisted" value={savedProvidersAvailable ? shortlistCount : "Not available"} />
        <Metric label="Selected provider" value={selectedProvider || "Not selected"} />
        <Metric label="Last activity" value={formatDate(challenge.updatedAt || challenge.publishedAt || challenge.createdAt, { fallback: "Not available" })} />
      </div>

      <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-white p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">Next action</p>
        <p className="mt-2 text-sm font-black text-[#1C1917]">{nextAction.label}</p>
        <p className="mt-1 text-sm leading-6 text-[#78716C]">{nextAction.description}</p>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.OWNER_CHALLENGE(challengeId)}>
          View Challenge
          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
          <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
          Review Plans
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGE_PROVIDERS(challengeId)} variant="secondary">
          <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
          View Providers
        </Button>
      </div>
    </Card>
  );
}
