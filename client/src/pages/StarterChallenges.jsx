import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FirstClientEmptyState } from "../components/firstClient/FirstClientEmptyState.jsx";
import { StarterChallengeCard } from "../components/firstClient/StarterChallengeCard.jsx";
import { StarterChallengeFilters } from "../components/firstClient/StarterChallengeFilters.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { getFirstClientApiErrorMessage } from "../features/firstClient/firstClientUtils.js";
import { useStarterChallenges } from "../features/firstClient/useFirstClient.js";

const initialFilters = Object.freeze({
  category: "",
  level: "all",
  maxBudget: "",
  minBudget: "",
  sort: "level",
});

export function StarterChallenges() {
  const [filters, setFilters] = useState(initialFilters);
  const starterQuery = useStarterChallenges(filters);
  const challenges = starterQuery.data?.items ?? [];
  const total = starterQuery.data?.pagination?.total ?? challenges.length;

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => starterQuery.refetch()} type="button" variant="secondary">
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              Refresh
            </Button>
            <Button as={Link} to={ROUTES.CHALLENGES} variant="outline">
              View All Challenges
            </Button>
          </div>
        }
        description="Smaller, clearer challenges designed to help new providers build their first proof-backed win."
        eyebrow="First Client Mode"
        title="Starter Challenges"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card padding="sm" variant="muted">
          <p className="text-sm font-bold text-[#6F657C]">Starter challenges</p>
          <p className="mt-2 text-3xl font-black text-[#07030D]">{total}</p>
        </Card>
        <Card padding="sm" variant="muted">
          <p className="text-sm font-bold text-[#6F657C]">Current level</p>
          <p className="mt-2 text-3xl font-black text-[#07030D]">
            {filters.level === "all" ? "All" : filters.level}
          </p>
        </Card>
        <Card padding="sm" variant="muted">
          <p className="text-sm font-bold text-[#6F657C]">Sort</p>
          <p className="mt-2 text-3xl font-black text-[#07030D]">{filters.sort.replaceAll("_", " ")}</p>
        </Card>
      </div>

      <Card variant="bordered">
        <StarterChallengeFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(initialFilters)}
        />
      </Card>

      {starterQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <Skeleton className="h-[28rem]" key={item} />)}
        </div>
      ) : starterQuery.isError ? (
        <Card variant="bordered">
          <Badge variant="red">Could not load starter challenges</Badge>
          <p className="mt-3 text-sm leading-6 text-[#6F657C]">
            {getFirstClientApiErrorMessage(starterQuery.error)}
          </p>
          <Button className="mt-5" onClick={() => starterQuery.refetch()} type="button">
            Refresh Challenges
          </Button>
        </Card>
      ) : challenges.length === 0 ? (
        <FirstClientEmptyState />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {challenges.map((challenge) => (
            <StarterChallengeCard challenge={challenge} key={challenge.id} />
          ))}
        </div>
      )}
    </div>
  );
}
