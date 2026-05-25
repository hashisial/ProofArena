import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanCard } from "../components/executionPlans/ExecutionPlanCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  getExecutionPlanApiErrorMessage,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useMyExecutionPlans,
  useWithdrawExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";
import { Target } from "lucide-react";
import { useMemo, useState } from "react";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Withdrawn", value: "withdrawn" },
];

export function ExecutionPlans() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const filters = status === "all" ? {} : { status };
  const plansQuery = useMyExecutionPlans(filters);
  const withdrawMutation = useWithdrawExecutionPlan();
  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data]);
  const visiblePlans = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return plans;
    return plans.filter((plan) =>
      [plan.title, plan.summary, plan.challenge?.title]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term)),
    );
  }, [plans, search]);
  const stats = {
    accepted: plans.filter((plan) => plan.status === "accepted").length,
    rejected: plans.filter((plan) => plan.status === "rejected").length,
    shortlisted: plans.filter((plan) => plan.status === "shortlisted").length,
    submitted: plans.filter((plan) => plan.status === "submitted").length,
    total: plans.length,
  };

  async function handleWithdraw(plan) {
    if (!window.confirm("Withdraw this execution plan?")) {
      return;
    }

    await withdrawMutation.mutateAsync(plan.id);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={<Button as={Link} to={ROUTES.CHALLENGES}>Explore Challenges</Button>}
        description="Track the structured plans you submitted for client outcome challenges."
        eyebrow="Provider workspace"
        title="Execution Plans"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total plans", stats.total],
          ["Submitted", stats.submitted],
          ["Shortlisted", stats.shortlisted],
          ["Accepted", stats.accepted],
          ["Rejected", stats.rejected],
        ].map(([label, value]) => (
          <Card key={label} padding="sm" variant="muted">
            <p className="text-sm font-bold text-[#78716C]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#1C1917]">{value}</p>
          </Card>
        ))}
      </div>

      <Card padding="md" variant="bordered">
        <div className="grid gap-4 md:grid-cols-[1fr_14rem]">
          <Input
            label="Search plans"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, summary, or challenge"
            type="search"
            value={search}
          />
          <Select
            label="Status"
            onChange={(event) => setStatus(event.target.value)}
            options={statusOptions}
            placeholder=""
            value={status}
          />
        </div>
      </Card>

      {plansQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)}
        </div>
      ) : plansQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load plans</Badge>
          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            {getExecutionPlanApiErrorMessage(plansQuery.error, "Execution plans could not be loaded.")}
          </p>
        </Card>
      ) : visiblePlans.length === 0 ? (
        <EmptyState
          actionHref={ROUTES.CHALLENGES}
          actionText="Explore Challenges"
          description="Browse outcome challenges and submit structured plans with milestones, proof, and timeline."
          icon={Target}
          title="No execution plans yet"
          variant="spotlight"
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visiblePlans.map((plan) => (
            <ExecutionPlanCard
              key={plan.id}
              onWithdraw={handleWithdraw}
              plan={plan}
              variant="provider"
            />
          ))}
        </div>
      )}
    </div>
  );
}
