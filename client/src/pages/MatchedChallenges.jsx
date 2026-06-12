import { RefreshCw, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { MatchedChallengeCard } from "../components/matches/MatchedChallengeCard.jsx";
import { MatchEmptyState } from "../components/matches/MatchEmptyState.jsx";
import { MatchFilters } from "../components/matches/MatchFilters.jsx";
import { WarmLeadSummaryCard } from "../components/matches/WarmLeadSummaryCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { getMatchApiErrorMessage, getMatchStats } from "../features/matches/matchUtils.js";
import {
  useMyMatchedChallenges,
  useRefreshMyMatches,
  useUpdateProviderMatchStatus,
} from "../features/matches/useMatches.js";
import { useMemo, useState } from "react";

function createInitialFilters(status = "all") {
  return {
    category: "",
    minScore: "",
    sort: "best",
    status,
  };
}

export function MatchedChallenges({ initialStatus = "all" }) {
  const initialFilters = useMemo(() => createInitialFilters(initialStatus), [initialStatus]);
  const [filters, setFilters] = useState(() => initialFilters);
  const [actionError, setActionError] = useState("");
  const matchesQuery = useMyMatchedChallenges(filters);
  const refreshMutation = useRefreshMyMatches();
  const statusMutation = useUpdateProviderMatchStatus();
  const matches = useMemo(() => matchesQuery.data?.items ?? [], [matchesQuery.data]);
  const stats = getMatchStats(matches);
  const pageTitle = initialStatus === "saved"
    ? "Saved Matches"
    : initialStatus === "applied"
      ? "Applied Matches"
      : "Matched Challenges";
  const pageDescription = initialStatus === "saved"
    ? "Review outcome challenges you saved for focused follow-up and execution planning."
    : initialStatus === "applied"
      ? "Track matched challenges where you already submitted an execution plan."
      : "Relevant outcome challenges matched to your skills, offers, availability, and proof profile.";

  async function handleRefresh() {
    setActionError("");

    try {
      await refreshMutation.mutateAsync();
    } catch (error) {
      setActionError(getMatchApiErrorMessage(error, "Matches could not be refreshed. Please try again."));
    }
  }

  async function updateStatus(match, status) {
    if (!match?.id) {
      return;
    }

    setActionError("");

    try {
      await statusMutation.mutateAsync({
        id: match.id,
        payload: { status },
      });
    } catch (error) {
      setActionError(getMatchApiErrorMessage(error, "Match status could not be updated. Please try again."));
    }
  }

  function handleView(match) {
    if (match?.status === "new") {
      statusMutation.mutate({
        id: match.id,
        payload: { status: "viewed" },
      });
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
              Refresh Matches
            </Button>
            <Button as={Link} to={ROUTES.MY_OUTCOME_OFFERS} variant="secondary">
              Improve Outcome Offers
            </Button>
            <Button as={Link} to={ROUTES.CHALLENGES} variant="outline">
              Explore All Challenges
            </Button>
          </div>
        }
        description={pageDescription}
        eyebrow="Provider warm leads"
        title={pageTitle}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["New matches", stats.new],
          ["Saved matches", stats.saved],
          ["Applied matches", stats.applied],
          ["Average score", `${stats.averageScore}%`],
        ].map(([label, value]) => (
          <Card key={label} padding="sm" variant="muted">
            <p className="text-sm font-bold text-[#78716C]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#1C1917]">{value}</p>
          </Card>
        ))}
      </div>

      <Card padding="md" variant="bordered">
        <MatchFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      </Card>

      {actionError ? (
        <Card padding="md" variant="bordered">
          <Badge variant="red">Action needed</Badge>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">{actionError}</p>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
        <div className="grid gap-4">
          {matchesQuery.isLoading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((item) => <Skeleton className="h-[32rem]" key={item} />)}
            </div>
          ) : matchesQuery.isError ? (
            <Card padding="lg" variant="bordered">
              <Badge variant="red">Could not load matches</Badge>
              <p className="mt-3 text-sm leading-6 text-[#78716C]">
                {getMatchApiErrorMessage(matchesQuery.error)}
              </p>
              <Button className="mt-5" onClick={handleRefresh} type="button">
                Refresh Matches
              </Button>
            </Card>
          ) : matches.length === 0 ? (
            <MatchEmptyState isRefreshing={refreshMutation.isPending} onRefresh={handleRefresh} />
          ) : (
            matches.map((match) => (
              <MatchedChallengeCard
                isUpdating={statusMutation.isPending}
                key={match.id}
                match={match}
                onDismiss={(item) => updateStatus(item, "dismissed")}
                onSave={(item) => updateStatus(item, "saved")}
                onView={handleView}
              />
            ))
          )}
        </div>

        <aside className="grid gap-5 xl:sticky xl:top-6">
          <WarmLeadSummaryCard
            isLoading={matchesQuery.isLoading}
            isRefreshing={refreshMutation.isPending}
            matches={matches}
            onRefresh={handleRefresh}
          />
          <Card padding="md" variant="muted">
            <Badge variant="primary">How to use matches</Badge>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[#57534E]">
              <p>Review the reasons first, then check the weaknesses before submitting a plan.</p>
              <p>Strong matches still need a specific execution plan with milestones and proof.</p>
              <p>Dismiss poor-fit matches so the feed stays focused as the engine improves.</p>
            </div>
            <Button as={Link} className="mt-5 w-full" to={ROUTES.NEW_OUTCOME_OFFER} variant="outline">
              <Target aria-hidden="true" className="h-4 w-4" />
              Improve Offer Signal
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
