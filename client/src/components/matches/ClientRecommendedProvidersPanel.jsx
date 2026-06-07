import { Link } from "react-router-dom";
import { RefreshCw, UsersRound } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { getRecommendedProviderStats } from "../../features/matches/matchUtils.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ClientRecommendedProvidersPanel({
  challengeId,
  isLoading = false,
  isRefreshing = false,
  matches = [],
  onRefresh,
}) {
  const stats = getRecommendedProviderStats(matches);
  const recommendedPath = challengeId ? ROUTES.RECOMMENDED_PROVIDERS(challengeId) : ROUTES.MY_CHALLENGES;

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge variant="primary">Recommended Providers</Badge>
            <CardTitle className="mt-3">Recommended Providers</CardTitle>
            <CardDescription>
              See providers matched to this challenge by skills, outcome offers, availability, and proof score.
            </CardDescription>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
            <UsersRound aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Recommended", stats.total],
              ["Best score", `${stats.bestScore}%`],
              ["Invited", stats.invited],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={label}>
                <p className="text-sm font-bold text-[#6F657C]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{value}</p>
              </div>
            ))}
          </div>
        )}
        {!isLoading && matches.length === 0 ? (
          <p className="mt-4 text-sm leading-6 text-[#6F657C]">
            Refresh recommendations after publishing or improving this challenge.
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button as={Link} to={recommendedPath}>
          View Recommended Providers
        </Button>
        <Button isLoading={isRefreshing} loadingLabel="Refreshing..." onClick={onRefresh} type="button" variant="outline">
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Refresh Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
}
