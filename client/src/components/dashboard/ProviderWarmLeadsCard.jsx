import { Bookmark, ClipboardCheck, Flame, RefreshCw, Target } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { getLatestMatchGeneratedAt, getMatchStats } from "../../features/matches/matchUtils.js";
import { formatRelativeDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderWarmLeadsCard({
  isError = false,
  isLoading = false,
  isRefreshing = false,
  matches = [],
  onRefresh,
  onRetry,
}) {
  const stats = getMatchStats(matches);
  const bestScore = matches.length > 0 ? `${stats.bestScore}%` : "Not available";
  const latestGeneratedAt = getLatestMatchGeneratedAt(matches);

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
            <Flame aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>Warm Leads</CardTitle>
            <CardDescription>Challenge matches generated from your public acquisition signals.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Warm lead metrics could not be loaded. Try again."
            icon={Flame}
            onAction={onRetry}
            size="sm"
            title="Could not load warm leads"
            variant="minimal"
          />
        ) : matches.length === 0 ? (
          <EmptyState
            actionHref={ROUTES.NEW_OUTCOME_OFFER}
            actionText="Create Outcome Offer"
            description="No warm leads yet. Create outcome offers and refresh matches to find relevant challenges."
            icon={Flame}
            secondaryActionHref={ROUTES.MATCHED_CHALLENGES}
            secondaryActionText="Open Matches"
            size="sm"
            title="No warm leads yet"
            variant="minimal"
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["New matches", stats.new],
                ["Saved matches", stats.saved],
                ["Applied matches", stats.applied],
                ["Best match score", bestScore],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={label}>
                  <p className="text-sm font-bold text-[#6F657C]">{label}</p>
                  <p className="mt-2 text-2xl font-black text-[#07030D]">{value}</p>
                </div>
              ))}
            </div>
            {latestGeneratedAt ? (
              <p className="mt-4 text-xs font-bold text-[#6F657C]">
                Last refreshed {formatRelativeDate(latestGeneratedAt, { fallback: "recently" })}
              </p>
            ) : null}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.MATCHED_CHALLENGES}>
          <Target aria-hidden="true" className="mr-2 h-4 w-4" />
          View Matched Challenges
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.SAVED_MATCHES} variant="outline">
          <Bookmark aria-hidden="true" className="mr-2 h-4 w-4" />
          Saved
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.APPLIED_MATCHES} variant="outline">
          <ClipboardCheck aria-hidden="true" className="mr-2 h-4 w-4" />
          Applied
        </Button>
        <Button
          isLoading={isRefreshing}
          className="w-full sm:w-auto"
          loadingLabel="Refreshing..."
          onClick={onRefresh}
          type="button"
          variant="outline"
        >
          <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
          Refresh Matches
        </Button>
      </CardFooter>
    </Card>
  );
}
