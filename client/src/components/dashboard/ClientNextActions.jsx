import { ClipboardCheck, FileCheck2, Search, Send, Target } from "lucide-react";
import { DashboardActionCard } from "./DashboardActionCard.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/index.js";

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

function buildActions({ activeChallenge, challenges = [], plans = [], recommendations = [] }) {
  const draftChallenge = challenges.find((challenge) => challenge.status === "draft");
  const actions = [];

  if (challenges.length === 0) {
    actions.push({
      ctaLabel: "Create Challenge",
      description: "Start with a measurable outcome, proof requirements, budget, and timeline.",
      href: ROUTES.NEW_CHALLENGE,
      icon: Target,
      priority: "high",
      title: "Create your first outcome challenge.",
    });
  }

  if (draftChallenge) {
    const draftId = getChallengeId(draftChallenge);
    actions.push({
      ctaLabel: "Finish Draft",
      description: "Complete the challenge details and publish when it is provider-ready.",
      href: draftId ? ROUTES.EDIT_CHALLENGE(draftId) : ROUTES.MY_CHALLENGES,
      icon: Send,
      priority: "high",
      title: "Finish and publish your draft challenge.",
    });
  }

  if (activeChallenge && plans.length > 0) {
    const challengeId = getChallengeId(activeChallenge);
    actions.push({
      ctaLabel: "Review Plans",
      description: "Compare provider execution plans before shortlisting or accepting work.",
      href: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
      icon: ClipboardCheck,
      priority: "high",
      title: "Review execution plans submitted by providers.",
    });
  }

  if (activeChallenge && plans.length === 0) {
    const challengeId = getChallengeId(activeChallenge);
    actions.push({
      ctaLabel: "View Recommended",
      description: "Use recommendations to find providers that fit the active challenge.",
      href: challengeId ? ROUTES.RECOMMENDED_PROVIDERS(challengeId) : ROUTES.MY_CHALLENGES,
      icon: Search,
      priority: "normal",
      title: "View recommended providers and invite best-fit providers.",
    });
  }

  if (activeChallenge && recommendations.length > 0) {
    const challengeId = getChallengeId(activeChallenge);
    actions.push({
      ctaLabel: "Compare Providers",
      description: "Review proof score, availability, skills, and offer fit for this challenge.",
      href: challengeId ? ROUTES.RECOMMENDED_PROVIDERS(challengeId) : ROUTES.PROVIDERS,
      icon: Search,
      priority: "normal",
      title: "Compare recommended providers for your active challenge.",
    });
  }

  const proofReviewChallenge = challenges.find((challenge) => challenge.status === "proof_review");

  if (proofReviewChallenge) {
    const challengeId = getChallengeId(proofReviewChallenge);
    actions.push({
      ctaLabel: "Open Challenge",
      description: "Proof review is a later workflow; use the challenge record as the current control point.",
      href: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
      icon: FileCheck2,
      priority: "normal",
      title: "Review proof when the proof workflow is ready.",
    });
  }

  if (actions.length === 0) {
    actions.push({
      ctaLabel: "Find Providers",
      description: "Browse proof-backed providers while your challenge pipeline is quiet.",
      href: ROUTES.PROVIDERS,
      icon: Search,
      priority: "low",
      title: "Explore providers for future outcome work.",
    });
  }

  return actions.slice(0, 4);
}

export function ClientNextActions({ activeChallenge, challenges, plans, recommendations }) {
  const actions = buildActions({ activeChallenge, challenges, plans, recommendations });

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle>Next Actions</CardTitle>
        <CardDescription>Priority steps generated from your current challenge workflow.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.length > 0 ? (
          actions.map((action) => <DashboardActionCard key={action.title} {...action} />)
        ) : (
          <EmptyState
            description="Create or publish a challenge to surface clear next actions."
            size="sm"
            title="No actions available"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
