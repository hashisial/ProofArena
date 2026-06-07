import { ArrowRight, FileCheck2, PackagePlus, RefreshCw, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { FirstClientChecklist } from "../components/firstClient/FirstClientChecklist.jsx";
import { MicroWinBadgeGrid } from "../components/firstClient/MicroWinBadgeGrid.jsx";
import { ProviderReadinessScore } from "../components/firstClient/ProviderReadinessScore.jsx";
import { StarterChallengeCard } from "../components/firstClient/StarterChallengeCard.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { getFirstClientApiErrorMessage } from "../features/firstClient/firstClientUtils.js";
import {
  useFirstClientStatus,
  useRefreshFirstClientStatus,
  useStarterChallenges,
} from "../features/firstClient/useFirstClient.js";

const actionCards = Object.freeze([
  {
    description: "Package one repeatable result with proof expectations.",
    href: ROUTES.NEW_OUTCOME_OFFER,
    icon: PackagePlus,
    label: "Create Outcome Offer",
  },
  {
    description: "Save proof links, reports, samples, and notes for future plans.",
    href: ROUTES.PROOF_VAULT,
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

export function FirstClientMode() {
  const statusQuery = useFirstClientStatus();
  const refreshMutation = useRefreshFirstClientStatus();
  const starterQuery = useStarterChallenges({ limit: 3 });
  const status = statusQuery.data ?? {};
  const starterChallenges = starterQuery.data?.items ?? [];

  async function handleRefresh() {
    try {
      await refreshMutation.mutateAsync();
    } catch {
      // The error panel below reflects query failures; refresh failure can be retried.
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <Button
            isLoading={refreshMutation.isPending}
            loadingLabel="Refreshing..."
            onClick={handleRefresh}
            type="button"
          >
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Refresh Status
          </Button>
        }
        description="Build your first proof-backed client win with starter challenges, clear offers, reusable proof, and guided actions."
        eyebrow="Provider onboarding"
        title="First Client Mode"
      />

      {statusQuery.isLoading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : statusQuery.isError ? (
        <Card variant="bordered">
          <Badge variant="red">Could not load First Client Mode</Badge>
          <p className="mt-3 text-sm leading-6 text-[#6F657C]">
            {getFirstClientApiErrorMessage(statusQuery.error)}
          </p>
          <Button className="mt-5" onClick={handleRefresh} type="button">
            Refresh Status
          </Button>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ProviderReadinessScore
            missingItems={status.missingItems ?? []}
            score={status.readinessScore ?? status.firstClientMode?.readinessScore ?? 0}
          />
          <FirstClientChecklist checklist={status.checklist ?? {}} />
        </div>
      )}

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Suggested actions</CardTitle>
          <CardDescription>
            These actions improve the signals clients and matching systems can use without faking reputation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((action) => {
            const Icon = action.icon;

            return (
              <Card as={Link} key={action.label} padding="sm" to={action.href} variant="interactive">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-black text-[#07030D]">{action.label}</p>
                <p className="mt-2 text-sm leading-6 text-[#6F657C]">{action.description}</p>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <MicroWinBadgeGrid badges={status.badges ?? []} />

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Starter challenges preview</CardTitle>
          <CardDescription>
            Smaller, clearer challenges designed to help new providers build a first proof-backed win.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {starterQuery.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {[0, 1, 2].map((item) => <Skeleton className="h-80" key={item} />)}
            </div>
          ) : starterChallenges.length === 0 ? (
            <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-5">
              <p className="text-sm font-black text-[#07030D]">No starter challenges found yet.</p>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                Browse all open challenges or check back after clients tag beginner-friendly opportunities.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {starterChallenges.map((challenge) => (
                <StarterChallengeCard challenge={challenge} key={challenge.id} />
              ))}
            </div>
          )}
        </CardContent>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to={ROUTES.STARTER_CHALLENGES}>
            View Starter Challenges
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button as={Link} to={ROUTES.CHALLENGES} variant="outline">
            View All Challenges
          </Button>
        </div>
      </Card>
    </div>
  );
}
