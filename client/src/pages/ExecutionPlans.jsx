import { Target } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanCard } from "../components/executionPlans/ExecutionPlanCard.jsx";
import { ProviderPlanFilters } from "../components/executionPlans/ProviderPlanFilters.jsx";
import { ProviderPlanStats } from "../components/executionPlans/ProviderPlanStats.jsx";
import { ProviderPlanTable } from "../components/executionPlans/ProviderPlanTable.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { getExecutionPlanApiErrorMessage } from "../features/executionPlans/executionPlanUtils.js";
import {
  filterAndSortProviderPlans,
  getProviderPlanStats,
} from "../features/executionPlans/providerPlanPerformanceUtils.js";
import {
  useMyExecutionPlans,
  useWithdrawExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";

const initialFilters = Object.freeze({
  category: "all",
  dateRange: "all",
  scoreRange: "all",
  search: "",
  sort: "newest",
  status: "all",
});

export function ExecutionPlans() {
  const [filters, setFilters] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("cards");
  const plansQuery = useMyExecutionPlans({ limit: 50 });
  const withdrawMutation = useWithdrawExecutionPlan();
  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const visiblePlans = useMemo(() => filterAndSortProviderPlans(plans, filters), [filters, plans]);
  const stats = useMemo(() => ({
    ...getProviderPlanStats(plans),
    total: plansQuery.data?.pagination?.total ?? plans.length,
  }), [plans, plansQuery.data?.pagination?.total]);
  const categoryOptions = useMemo(() => [
    { label: "All categories", value: "all" },
    ...Array.from(new Set(plans.map((plan) => plan.challenge?.category).filter(Boolean)))
      .sort((left, right) => left.localeCompare(right))
      .map((category) => ({ label: category, value: category })),
  ], [plans]);
  const activeFilterCount = [
    filters.search.trim(),
    filters.status !== "all",
    filters.category !== "all",
    filters.scoreRange !== "all",
    filters.dateRange !== "all",
  ].filter(Boolean).length;

  async function handleWithdraw(plan) {
    if (!window.confirm("Archive this execution plan?")) {
      return;
    }

    await withdrawMutation.mutateAsync(plan.id);
  }

  return (
    <div className="grid gap-8">
      <PageHeader
        actions={<Button as={Link} to={ROUTES.CHALLENGES}>Explore Challenges</Button>}
        description="Track every plan you submitted, understand shortlist performance, and improve your client acquisition strategy."
        eyebrow="Provider performance center"
        title="Execution Plans"
      />

      <ProviderPlanStats isError={plansQuery.isError} isLoading={plansQuery.isLoading} stats={stats} />

      <ProviderPlanFilters
        activeFilterCount={activeFilterCount}
        categoryOptions={categoryOptions}
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters(initialFilters)}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Plan library</p>
          <h2 className="mt-2 text-2xl font-black text-[#1C1917]">
            {visiblePlans.length} plan{visiblePlans.length === 1 ? "" : "s"} shown
          </h2>
        </div>
        {plansQuery.data?.pagination?.total > plans.length ? (
          <Badge variant="secondary">Showing the latest {plans.length} of {plansQuery.data.pagination.total}</Badge>
        ) : null}
      </div>

      {plansQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <Skeleton className="h-80" key={item} />)}
        </div>
      ) : plansQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load plans</Badge>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            {getExecutionPlanApiErrorMessage(plansQuery.error, "Execution plans could not be loaded. Try again.")}
          </p>
          <Button className="mt-5" onClick={() => plansQuery.refetch()} type="button">Retry</Button>
        </Card>
      ) : visiblePlans.length === 0 ? (
        <EmptyState
          actionHref={activeFilterCount > 0 ? undefined : ROUTES.CHALLENGES}
          actionText={activeFilterCount > 0 ? "Clear filters" : "Explore Challenges"}
          description={activeFilterCount > 0
            ? "Try a broader search, score range, category, or submitted date."
            : "Browse outcome challenges and submit structured plans with milestones, proof, and timeline."}
          icon={Target}
          onAction={activeFilterCount > 0 ? () => setFilters(initialFilters) : undefined}
          title={activeFilterCount > 0 ? "No plans matched your filters" : "No execution plans yet"}
          variant="spotlight"
        />
      ) : viewMode === "table" ? (
        <>
          <div className="grid gap-4 md:hidden">
            {visiblePlans.map((plan) => (
              <ExecutionPlanCard key={plan.id} onWithdraw={handleWithdraw} plan={plan} variant="provider" />
            ))}
          </div>
          <ProviderPlanTable plans={visiblePlans} />
        </>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visiblePlans.map((plan) => (
            <ExecutionPlanCard key={plan.id} onWithdraw={handleWithdraw} plan={plan} variant="provider" />
          ))}
        </div>
      )}
    </div>
  );
}
