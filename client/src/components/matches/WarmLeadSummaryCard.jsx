import { Flame, RefreshCw, Target } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { getMatchStats } from "../../features/matches/matchUtils.js";
import { Button } from "../ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function WarmLeadSummaryCard({
  isLoading = false,
  isRefreshing = false,
  matches = [],
  onRefresh,
}) {
  const stats = getMatchStats(matches);

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
            <Flame aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>Warm Leads</CardTitle>
            <CardDescription>
              Matched challenges based on your outcome offers and provider profile.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              ["New matches", stats.new],
              ["Best match", `${stats.bestScore}%`],
              ["Saved", stats.saved],
              ["Applied", stats.applied],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={label}>
                <p className="text-sm font-bold text-[#6F657C]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" href={ROUTES.MATCHED_CHALLENGES}>
          <Target aria-hidden="true" className="h-4 w-4" />
          View Matched Challenges
        </Button>
        <Button
          isLoading={isRefreshing}
          loadingLabel="Refreshing..."
          onClick={onRefresh}
          type="button"
          variant="outline"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Refresh Matches
        </Button>
        <Button as="a" href={ROUTES.NEW_OUTCOME_OFFER} variant="secondary">
          Create Outcome Offer
        </Button>
      </CardFooter>
    </Card>
  );
}
