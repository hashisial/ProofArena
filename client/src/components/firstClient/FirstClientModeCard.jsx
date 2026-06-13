import { ArrowRight, Medal, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getReadinessLabel } from "../../features/firstClient/firstClientUtils.js";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";

export function FirstClientModeCard({
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  status,
}) {
  const score = Number(status?.readinessScore ?? status?.firstClientMode?.readinessScore ?? 0);
  const badges = status?.badges ?? [];
  const nextAction = status?.suggestedActions?.[0] ?? "Browse starter challenges";

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
          <Medal aria-hidden="true" className="h-5 w-5" />
        </div>
        <CardTitle>First Client Mode</CardTitle>
        <CardDescription>Your path to a first proof-backed client win.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
            <p className="text-sm font-bold text-[#78716C]">Readiness</p>
            <p className="mt-2 text-2xl font-black text-[#1C1917]">{isLoading ? "..." : `${score}/100`}</p>
            <p className="mt-1 text-xs font-bold text-[#57534E]">{getReadinessLabel(score)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
            <p className="text-sm font-bold text-[#78716C]">Next action</p>
            <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">{nextAction}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
            <p className="text-sm font-bold text-[#78716C]">Badges</p>
            <p className="mt-2 text-2xl font-black text-[#1C1917]">{badges.length}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button as={Link} to={ROUTES.FIRST_CLIENT_MODE}>
          Open First Client Mode
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Button>
        <Button as={Link} to={ROUTES.STARTER_CHALLENGES} variant="outline">
          Browse Starter Challenges
        </Button>
        {onRefresh ? (
          <Button isLoading={isRefreshing} loadingLabel="Refreshing..." onClick={onRefresh} type="button" variant="secondary">
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Refresh
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
