import { ArrowRight, Lightbulb, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { buildChallengeViewPath, buildPlanApplyPath, formatStarterBudget, formatStarterTimeline } from "../../features/firstClient/firstClientUtils.js";
import { buildExecutionPlanApplyPath, buildPublicChallengePath } from "../../features/matches/matchUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";

function scoreChallenge(challenge = {}, profileSkills = []) {
  const starter = challenge.starterChallenge ?? {};
  const levelScore = starter.level === "beginner" ? 35 : starter.level === "easy" ? 25 : 10;
  const proofScore = starter.proofSimplicity === "simple" ? 20 : starter.proofSimplicity === "moderate" ? 12 : 4;
  const hoursScore = starter.estimatedHours ? Math.max(0, 20 - Number(starter.estimatedHours)) : 12;
  const skillSet = new Set(profileSkills.map((skill) => String(skill).toLowerCase()));
  const skillMatches = (challenge.skillsNeeded ?? [])
    .filter((skill) => skillSet.has(String(skill).toLowerCase()))
    .length;

  return levelScore + proofScore + hoursScore + Math.min(skillMatches * 8, 24);
}

function suggestionFromStarter(challenge, label, profileSkills) {
  return {
    budget: formatStarterBudget(challenge.budget),
    category: challenge.category,
    href: buildChallengeViewPath(challenge),
    label,
    planHref: buildPlanApplyPath(challenge),
    score: scoreChallenge(challenge, profileSkills),
    timeline: formatStarterTimeline(challenge.timeline),
    title: challenge.title || "Starter challenge",
    type: "starter",
  };
}

function suggestionFromMatch(match) {
  const challenge = match.challenge ?? {};

  return {
    budget: challenge.budget?.customLabel || "Budget scoped",
    category: challenge.category,
    href: buildPublicChallengePath(challenge),
    label: "Highest match score",
    planHref: buildExecutionPlanApplyPath(challenge),
    score: Number(match.matchScore ?? 0),
    status: match.status,
    timeline: challenge.timeline?.customLabel || "Timeline scoped",
    title: challenge.title || "Matched challenge",
    type: "match",
  };
}

export function FirstClientOpportunitySuggestions({
  matches = [],
  profileSkills = [],
  starterChallenges = [],
}) {
  const bestStarter = [...starterChallenges]
    .sort((left, right) => scoreChallenge(right, profileSkills) - scoreChallenge(left, profileSkills))[0];
  const easiestStarter = starterChallenges.find((challenge) =>
    ["beginner", "easy"].includes(challenge?.starterChallenge?.level) ||
    challenge?.starterChallenge?.proofSimplicity === "simple",
  );
  const noPlanStarter = [...starterChallenges]
    .filter((challenge) => Number(challenge?.applicationStats?.totalPlans ?? 0) === 0)
    .sort((left, right) => scoreChallenge(right, profileSkills) - scoreChallenge(left, profileSkills))[0];
  const bestMatch = [...matches]
    .filter((match) => match?.challenge)
    .sort((left, right) => Number(right.matchScore ?? 0) - Number(left.matchScore ?? 0))[0];
  const suggestions = [
    bestStarter ? suggestionFromStarter(bestStarter, "Best first opportunity", profileSkills) : null,
    easiestStarter && easiestStarter.id !== bestStarter?.id
      ? suggestionFromStarter(easiestStarter, "Easiest entry opportunity", profileSkills)
      : null,
    noPlanStarter &&
    noPlanStarter.id !== bestStarter?.id &&
    noPlanStarter.id !== easiestStarter?.id
      ? suggestionFromStarter(noPlanStarter, "No plans submitted yet", profileSkills)
      : null,
    bestMatch ? suggestionFromMatch(bestMatch) : null,
  ].filter(Boolean);

  return (
    <Card as="section" aria-labelledby="first-client-opportunity-suggestions-title" className="h-full" variant="bordered">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
            <Lightbulb aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle id="first-client-opportunity-suggestions-title">
              Opportunity Suggestions
            </CardTitle>
            <CardDescription>
              Data-driven suggestions from starter challenges and matched challenge records. No fake recommendations.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <EmptyState
            description="Suggestions will appear after starter challenges or matched challenges are available."
            icon={Target}
            size="sm"
            title="No suggestions yet"
            variant="minimal"
          />
        ) : (
          <div className="grid gap-3">
            {suggestions.map((suggestion) => (
              <article className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={`${suggestion.label}-${suggestion.title}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="primary">{suggestion.label}</Badge>
                  {suggestion.category ? <Badge variant="outline">{suggestion.category}</Badge> : null}
                  {suggestion.status ? <Badge variant="gray">{String(suggestion.status).replaceAll("_", " ")}</Badge> : null}
                </div>
                <h3 className="mt-3 text-lg font-black text-[#1C1917]">{suggestion.title}</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">Fit signal</p>
                    <p className="mt-1 text-sm font-black text-[#1C1917]">{Math.round(suggestion.score)}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">Budget</p>
                    <p className="mt-1 text-sm font-black text-[#1C1917]">{suggestion.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">Timeline</p>
                    <p className="mt-1 text-sm font-black text-[#1C1917]">{suggestion.timeline}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button as={Link} to={suggestion.href} variant="secondary">
                    View Challenge
                  </Button>
                  <Button as={Link} to={suggestion.planHref}>
                    Submit Plan
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
