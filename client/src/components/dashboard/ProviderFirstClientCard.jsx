import { ArrowRight, Medal, RefreshCw } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { getReadinessLabel } from "../../features/firstClient/firstClientUtils.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

function getChecklistStats(checklist = {}) {
  const items = Object.values(checklist);
  return {
    complete: items.filter(Boolean).length,
    total: items.length,
  };
}

export function ProviderFirstClientCard({
  isError = false,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  status = {},
}) {
  const score = Number(status.readinessScore ?? status.firstClientMode?.readinessScore ?? 0);
  const checklist = getChecklistStats(status.checklist);
  const badges = status.badges ?? [];
  const nextAction = status.suggestedActions?.[0] ?? "No suggested action available";

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
            <Medal aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>First Client Mode</CardTitle>
            <CardDescription>Rule-based readiness for a first proof-backed client win.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((item) => <Skeleton className="h-28" key={item} />)}
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="First Client Mode readiness could not be loaded. Try again."
            icon={Medal}
            onAction={onRefresh}
            size="sm"
            title="Could not load First Client Mode"
            variant="minimal"
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">Readiness</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{score}/100</p>
                <p className="mt-1 text-xs font-bold text-[#6F657C]">{getReadinessLabel(score)}</p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">Checklist</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">
                  {checklist.complete}/{checklist.total || 0}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
                <p className="text-sm font-bold text-[#6F657C]">Earned badges</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{badges.length}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-[#E9E2F3] bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#7C3AED]">Next suggested action</p>
              <p className="mt-2 text-sm font-black leading-6 text-[#07030D]">{nextAction}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.FIRST_CLIENT_MODE}>
          Open First Client Mode
          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.STARTER_CHALLENGES} variant="outline">Browse Starter Challenges</Button>
        {onRefresh ? (
          <Button className="w-full sm:w-auto" isLoading={isRefreshing} loadingLabel="Refreshing..." onClick={onRefresh} type="button" variant="secondary">
            <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
