import { useMemo, useState } from "react";
import { ArrowRight, FileCheck2, PackagePlus, RefreshCw, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../common/PageHeader.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";
import { ROUTES } from "../../constants/index.js";
import { useMyExecutionPlans } from "../../features/executionPlans/useExecutionPlans.js";
import { getFirstClientApiErrorMessage } from "../../features/firstClient/firstClientUtils.js";
import {
  useFirstClientStatus,
  useRefreshFirstClientStatus,
  useStarterChallenges,
} from "../../features/firstClient/useFirstClient.js";
import { getMatchApiErrorMessage } from "../../features/matches/matchUtils.js";
import {
  useMyMatchedChallenges,
  useUpdateProviderMatchStatus,
} from "../../features/matches/useMatches.js";
import { useMyOutcomeOffers } from "../../features/outcomeOffers/useOutcomeOffers.js";
import { useMyProfile } from "../../features/profile/useProfile.js";
import { useMyProofAssets } from "../../features/proofAssets/useProofAssets.js";
import { FirstClientChallengeFeed } from "./FirstClientChallengeFeed.jsx";
import { FirstClientChecklist } from "./FirstClientChecklist.jsx";
import { FirstClientOpportunitySuggestions } from "./FirstClientOpportunitySuggestions.jsx";
import { FirstClientProgressTracker } from "./FirstClientProgressTracker.jsx";
import { FirstClientReadinessScore } from "./FirstClientReadinessScore.jsx";
import { MicroWinBadgeGrid } from "./MicroWinBadgeGrid.jsx";
import { TrustBuildingGuide } from "./TrustBuildingGuide.jsx";

const ACTIVE_AVAILABILITY = new Set([
  "available",
  "available_now",
  "available_this_week",
  "available_next_week",
  "limited",
]);

const actionCards = Object.freeze([
  {
    description: "Package one repeatable result with proof expectations.",
    href: ROUTES.NEW_OUTCOME_OFFER,
    icon: PackagePlus,
    label: "Create Outcome Offer",
  },
  {
    description: "Save proof links, reports, samples, and notes for future plans.",
    href: `${ROUTES.PROOF_VAULT}?new=1`,
    icon: FileCheck2,
    label: "Add Proof Asset",
  },
  {
    description: "Find smaller challenges designed for new providers.",
    href: ROUTES.STARTER_CHALLENGES,
    icon: Target,
    label: "Browse Starter Challenges",
  },
  {
    description: "Review warm opportunities from the matching engine.",
    href: ROUTES.MATCHED_CHALLENGES,
    icon: Target,
    label: "View Matched Challenges",
  },
]);

function hasText(value, minLength = 1) {
  return String(value ?? "").trim().length >= minLength;
}

function listValues(values = []) {
  return values
    .map((value) => {
      if (typeof value === "string") return value;
      return value?.name ?? value?.label ?? value?.title ?? "";
    })
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function getProfileSignals(profileData = {}) {
  const profile = profileData?.profile ?? {};
  const providerProfile = profileData?.providerProfile ?? {};
  const headline = profile.headline || providerProfile.headline || providerProfile.title;
  const bio = profile.bio || providerProfile.professionalSummary;
  const profileSkills = listValues([
    ...(Array.isArray(profile.skills) ? profile.skills : []),
    ...(Array.isArray(providerProfile.skills) ? providerProfile.skills : []),
  ]);
  const availability = String(providerProfile.availability ?? "").toLowerCase();

  return {
    availabilityEnabled:
      ACTIVE_AVAILABILITY.has(availability) &&
      providerProfile.isAvailableForChallenges !== false,
    headlineAdded: hasText(headline, 12) && headline !== "Outcome-driven professional on ProofArena",
    profileCompleted:
      Number(profile.profileCompletion ?? 0) >= 70 ||
      (hasText(bio, 80) && hasText(headline, 12) && profileSkills.length > 0),
    profileSkills,
    skillsAdded: profileSkills.length > 0,
  };
}

function buildCommandCenterState({
  matches = [],
  offers = [],
  plans = [],
  profileData = {},
  proofAssets = [],
  status = {},
}) {
  const profileSignals = getProfileSignals(profileData);
  const hasProof = proofAssets.length > 0 || Boolean(status.checklist?.proofAssetAdded);
  const hasAnyOffer = offers.length > 0 || Boolean(status.checklist?.outcomeOfferCreated);
  const hasPublishedOffer = offers.some((offer) => offer.status === "published") || Boolean(status.checklist?.outcomeOfferCreated);
  const hasPlan = plans.length > 0 || Boolean(status.checklist?.executionPlanSubmitted);
  const hasShortlist = plans.some((plan) => plan.status === "shortlisted") || Boolean(status.checklist?.shortlistedOnce);
  const hasAcceptedPlan = plans.some((plan) => plan.status === "accepted") || Boolean(status.checklist?.firstChallengeWon);
  const hasSavedChallenge =
    matches.some((match) => ["applied", "saved"].includes(String(match.status ?? "").toLowerCase())) ||
    Number(status.starterChallengeStats?.applied ?? status.firstClientMode?.starterChallengesApplied ?? 0) > 0;
  const proofReadyProfile =
    profileSignals.profileCompleted &&
    profileSignals.headlineAdded &&
    profileSignals.skillsAdded &&
    hasProof &&
    hasAnyOffer;
  const scoreChecks = [
    { complete: profileSignals.profileCompleted, key: "profileCompleted", label: "Profile completed", points: 20 },
    { complete: profileSignals.headlineAdded, key: "headlineAdded", label: "Headline added", points: 10 },
    { complete: profileSignals.skillsAdded, key: "skillsAdded", label: "Skills added", points: 10 },
    { complete: hasProof, key: "proofAssetAdded", label: "Proof asset exists", points: 20 },
    { complete: hasAnyOffer, key: "outcomeOfferCreated", label: "Outcome offer exists", points: 15 },
    { complete: profileSignals.availabilityEnabled, key: "availabilityEnabled", label: "Availability enabled", points: 10 },
    { complete: hasPlan, key: "executionPlanSubmitted", label: "First execution plan submitted", points: 15 },
  ];
  const score = scoreChecks.reduce((total, item) => total + (item.complete ? item.points : 0), 0);
  const checklistItems = [
    {
      complete: profileSignals.profileCompleted,
      description: "Bio, public profile, and core work history are clear.",
      key: "profileCompleted",
      label: "Complete profile",
    },
    {
      complete: profileSignals.headlineAdded,
      description: "Use a specific outcome-focused provider headline.",
      key: "headlineAdded",
      label: "Add headline",
    },
    {
      complete: profileSignals.skillsAdded,
      description: "List the skills clients can match to challenges.",
      key: "skillsAdded",
      label: "Add skills",
    },
    {
      complete: hasProof,
      description: "Store reusable evidence in the Proof Vault.",
      key: "proofAssetAdded",
      label: "Upload first proof asset",
    },
    {
      complete: hasPublishedOffer,
      description: "Package a measurable result clients can understand.",
      key: "outcomeOfferCreated",
      label: "Publish first outcome offer",
    },
    {
      complete: profileSignals.availabilityEnabled,
      description: "Make it clear whether you can take on challenge work.",
      key: "availabilityEnabled",
      label: "Enable availability",
    },
    {
      complete: hasSavedChallenge,
      description: "Keep one first-client opportunity ready for follow-up.",
      key: "challengeSaved",
      label: "Save first challenge",
    },
    {
      complete: hasPlan,
      description: "Apply with milestones, proof, timeline, and price.",
      key: "executionPlanSubmitted",
      label: "Submit first execution plan",
    },
    {
      complete: proofReadyProfile,
      description: "Connect profile, offer, and proof signals into one trust story.",
      key: "proofReadyProfile",
      label: "Build proof-ready profile",
    },
    {
      complete: hasShortlist,
      description: "Earn the first client shortlist signal.",
      key: "shortlistedOnce",
      label: "Reach first shortlist",
    },
  ];
  const milestones = [
    { complete: profileSignals.profileCompleted && profileSignals.headlineAdded && profileSignals.skillsAdded, key: "profileReady", label: "Profile Ready" },
    { complete: hasProof, key: "proofReady", label: "Proof Ready" },
    { complete: hasPublishedOffer, key: "offerReady", label: "Offer Ready" },
    { complete: hasSavedChallenge, key: "challengeSaved", label: "First Challenge Saved" },
    { complete: hasPlan, key: "firstPlanSubmitted", label: "First Plan Submitted" },
    { complete: hasShortlist, key: "firstShortlist", label: "First Shortlist" },
    { complete: hasAcceptedPlan, key: "firstClientWon", label: "First Client Won" },
  ];

  return {
    checklistItems,
    milestones,
    profileSkills: profileSignals.profileSkills,
    score,
    scoreChecks,
  };
}

export function FirstClientDashboard() {
  const [matchActionError, setMatchActionError] = useState("");
  const statusQuery = useFirstClientStatus();
  const refreshMutation = useRefreshFirstClientStatus();
  const starterQuery = useStarterChallenges({ limit: 6, sort: "best_match" });
  const profileQuery = useMyProfile();
  const proofAssetsQuery = useMyProofAssets({ limit: 50, sort: "newest" });
  const offersQuery = useMyOutcomeOffers({ limit: 50, sort: "newest" });
  const plansQuery = useMyExecutionPlans({ limit: 50, sort: "newest" });
  const matchesQuery = useMyMatchedChallenges({ limit: 50, sort: "best" });
  const matchStatusMutation = useUpdateProviderMatchStatus();
  const starterChallenges = starterQuery.data?.items ?? [];
  const commandCenter = useMemo(
    () => {
      const status = statusQuery.data ?? {};
      const proofAssets = proofAssetsQuery.data?.items ?? [];
      const offers = offersQuery.data?.items ?? [];
      const plans = plansQuery.data?.items ?? [];
      const matches = matchesQuery.data?.items ?? [];

      return buildCommandCenterState({
        matches,
        offers,
        plans,
        profileData: profileQuery.data ?? {},
        proofAssets,
        status,
      });
    },
    [
      matchesQuery.data?.items,
      offersQuery.data?.items,
      plansQuery.data?.items,
      profileQuery.data,
      proofAssetsQuery.data?.items,
      statusQuery.data,
    ],
  );
  const matches = matchesQuery.data?.items ?? [];
  const status = statusQuery.data ?? {};
  const isReadinessLoading = [
    statusQuery,
    profileQuery,
    proofAssetsQuery,
    offersQuery,
    plansQuery,
    matchesQuery,
  ].some((query) => query.isLoading);

  async function handleRefresh() {
    try {
      await refreshMutation.mutateAsync();
      statusQuery.refetch();
      starterQuery.refetch();
      matchesQuery.refetch();
    } catch {
      // Error messaging is handled by the status card below.
    }
  }

  async function handleSaveMatch(match) {
    if (!match?.id || String(match.status ?? "").toLowerCase() === "saved") {
      return;
    }

    setMatchActionError("");

    try {
      await matchStatusMutation.mutateAsync({
        id: match.id,
        payload: { status: "saved" },
      });
      statusQuery.refetch();
    } catch (error) {
      setMatchActionError(
        getMatchApiErrorMessage(error, "This matched challenge could not be saved. Please try again."),
      );
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              isLoading={refreshMutation.isPending}
              loadingLabel="Refreshing..."
              onClick={handleRefresh}
              type="button"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Refresh Status
            </Button>
            <Button as={Link} to={ROUTES.STARTER_CHALLENGES} variant="outline">
              Starter Challenges
            </Button>
          </div>
        }
        description="Everything you need to win your first client and build trust faster."
        eyebrow="Provider onboarding"
        title="First Client Mode"
      />

      {statusQuery.isError ? (
        <Card variant="bordered">
          <Badge variant="red">Could not load First Client Mode status</Badge>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            {getFirstClientApiErrorMessage(statusQuery.error)}
          </p>
          <Button className="mt-5" onClick={handleRefresh} type="button">
            Refresh Status
          </Button>
        </Card>
      ) : null}

      {isReadinessLoading ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <FirstClientReadinessScore
            checks={commandCenter.scoreChecks}
            score={commandCenter.score}
          />
          <FirstClientChecklist items={commandCenter.checklistItems} />
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <FirstClientProgressTracker milestones={commandCenter.milestones} />
        <FirstClientOpportunitySuggestions
          matches={matches}
          profileSkills={commandCenter.profileSkills}
          starterChallenges={starterChallenges}
        />
      </div>

      <Card variant="bordered">
        <div>
          <Badge variant="primary">Fastest useful actions</Badge>
          <h2 className="mt-3 text-2xl font-black text-[#1C1917]">Move one trust signal forward today</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#78716C]">
            These shortcuts use existing provider workflows only: offers, proof, starter challenges, and matched challenges.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((action) => {
            const Icon = action.icon;

            return (
              <Card as={Link} key={action.label} padding="sm" to={action.href} variant="interactive">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-black text-[#1C1917]">{action.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#78716C]">{action.description}</p>
              </Card>
            );
          })}
        </div>
      </Card>

      <FirstClientChallengeFeed
        actionError={matchActionError}
        challenges={starterChallenges}
        error={starterQuery.error}
        isError={starterQuery.isError}
        isLoading={starterQuery.isLoading}
        matches={matches}
        onSaveMatch={handleSaveMatch}
        onRetry={() => starterQuery.refetch()}
        profileSkills={commandCenter.profileSkills}
        savingMatchId={matchStatusMutation.isPending ? matchStatusMutation.variables?.id : ""}
      />

      <MicroWinBadgeGrid badges={status.badges ?? []} />
      <TrustBuildingGuide />
    </div>
  );
}
