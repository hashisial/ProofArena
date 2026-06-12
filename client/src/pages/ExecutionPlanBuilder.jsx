import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ExecutionPlanForm } from "../components/executionPlans/ExecutionPlanForm.jsx";
import { ExecutionPlanPreview } from "../components/executionPlans/ExecutionPlanPreview.jsx";
import { ExecutionPlanQualityCard } from "../components/executionPlans/ExecutionPlanQualityCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import { usePublicChallenge } from "../features/challenges/useChallenges.js";
import { formatChallengeBudget, formatChallengeTimeline } from "../features/challenges/challengeUtils.js";
import { useMyOutcomeOffers } from "../features/outcomeOffers/useOutcomeOffers.js";
import {
  createInitialExecutionPlanForm,
  executionPlanToForm,
  formToExecutionPlanPayload,
  getExecutionPlanApiErrorMessage,
  validateExecutionPlanForm,
} from "../features/executionPlans/executionPlanUtils.js";
import {
  useExecutionPlan,
  useSubmitExecutionPlan,
  useUpdateExecutionPlan,
  useWithdrawExecutionPlan,
} from "../features/executionPlans/useExecutionPlans.js";

function ChallengeSummary({ challenge, challengeId }) {
  return (
    <Card padding="md" variant="muted">
      <Badge variant="primary">Challenge summary</Badge>
      <h2 className="mt-3 text-xl font-black text-[#1C1917]">
        {challenge?.title || "Outcome challenge"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">
        {challenge?.shortSummary || "The plan will be submitted against the selected challenge."}
      </p>
      <div className="mt-4 grid gap-3">
        {challenge?.targetOutcome?.outcomeStatement ? (
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Target outcome</p>
            <p className="mt-1 text-sm font-bold text-[#1C1917]">{challenge.targetOutcome.outcomeStatement}</p>
          </div>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Badge variant="outline">{challenge?.category || "Challenge"} </Badge>
          <Badge variant="outline">{challenge ? formatChallengeTimeline(challenge.timeline) : `ID ${challengeId}`}</Badge>
          {challenge ? <Badge variant="outline">{formatChallengeBudget(challenge.budget)}</Badge> : null}
        </div>
      </div>
    </Card>
  );
}

export function ExecutionPlanBuilder() {
  const { planId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = Boolean(planId) && location.pathname.endsWith("/edit");
  const challengeIdFromQuery = searchParams.get("challengeId") ?? "";
  const username = searchParams.get("username") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const challengeQuery = usePublicChallenge(username, slug);
  const planQuery = useExecutionPlan(planId);
  const offersQuery = useMyOutcomeOffers({ status: "published" }, { enabled: !isEditMode });
  const submitMutation = useSubmitExecutionPlan();
  const updateMutation = useUpdateExecutionPlan();
  const withdrawMutation = useWithdrawExecutionPlan();
  const [formState, setFormState] = useState(() => ({
    sourceId: "create",
    values: createInitialExecutionPlanForm(),
  }));
  const [errors, setErrors] = useState({});
  const plan = planQuery.data;
  const challenge = isEditMode ? plan?.challenge : challengeQuery.data;
  const challengeId = isEditMode ? plan?.challengeId ?? plan?.challenge?.id : challenge?.id ?? challengeIdFromQuery;
  const formSourceId = isEditMode ? plan?.id ?? "loading" : "create";
  const form = useMemo(() => {
    if (formState.sourceId === formSourceId) {
      return formState.values;
    }

    if (isEditMode && plan) {
      return executionPlanToForm(plan);
    }

    return formState.values;
  }, [formSourceId, formState, isEditMode, plan]);

  const handleFormChange = useCallback((nextValueOrUpdater) => {
    setFormState((current) => {
      const baseValues = current.sourceId === formSourceId ? current.values : form;
      const values = typeof nextValueOrUpdater === "function"
        ? nextValueOrUpdater(baseValues)
        : nextValueOrUpdater;

      return {
        sourceId: formSourceId,
        values,
      };
    });
  }, [form, formSourceId]);

  const offerOptions = useMemo(() => {
    const offers = offersQuery.data?.items ?? [];
    return offers
      .filter((offer) => offer.status === "published")
      .map((offer) => ({ label: offer.title, value: offer.id }));
  }, [offersQuery.data]);

  const previewPlan = useMemo(() => formToExecutionPlanPayload(form), [form]);

  if (isEditMode && planQuery.isLoading) {
    return <PageLoader description="Loading execution plan for editing." title="Loading execution plan" />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateExecutionPlanForm(form, { challengeId });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      if (isEditMode) {
        const payload = formToExecutionPlanPayload(form);
        const updatedPlan = await updateMutation.mutateAsync({ id: planId, payload });
        navigate(ROUTES.EXECUTION_PLAN_DETAIL(updatedPlan.id));
      } else {
        const payload = formToExecutionPlanPayload(form, {
          challengeId,
          includeChallenge: true,
        });
        const createdPlan = await submitMutation.mutateAsync(payload);
        navigate(ROUTES.EXECUTION_PLAN_DETAIL(createdPlan.id));
      }
    } catch (error) {
      setErrors({
        general: getExecutionPlanApiErrorMessage(error),
      });
    }
  }

  async function handleWithdraw() {
    if (!window.confirm("Withdraw this execution plan?")) {
      return;
    }

    await withdrawMutation.mutateAsync(planId);
    navigate(ROUTES.MY_EXECUTION_PLANS);
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={<Button as={Link} to={ROUTES.MY_EXECUTION_PLANS} variant="secondary">My Plans</Button>}
        backFallback={ROUTES.MY_EXECUTION_PLANS}
        description="Compete with a clear plan, milestones, proof, timeline, risks, and price instead of a generic proposal."
        eyebrow="Execution plan"
        showBack
        title={isEditMode ? "Edit Execution Plan" : "Submit Execution Plan"}
      />

      {challengeQuery.isError && !isEditMode ? (
        <Card padding="md" variant="bordered">
          <Badge variant="secondary">Challenge lookup</Badge>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            The public challenge summary could not be loaded, but the plan can still be submitted if the challenge ID is valid.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <ExecutionPlanForm
          errors={errors}
          form={form}
          isSubmitting={submitMutation.isPending || updateMutation.isPending}
          isWithdrawing={withdrawMutation.isPending}
          mode={isEditMode ? "edit" : "create"}
          offerOptions={offerOptions}
          onCancel={() => navigate(isEditMode ? ROUTES.EXECUTION_PLAN_DETAIL(planId) : ROUTES.CHALLENGES)}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onWithdraw={handleWithdraw}
          planStatus={plan?.status}
        />
        <aside className="grid gap-5 xl:sticky xl:top-6">
          <ChallengeSummary challenge={challenge} challengeId={challengeId} />
          <ExecutionPlanQualityCard plan={form} />
          <ExecutionPlanPreview plan={previewPlan} />
        </aside>
      </div>
    </div>
  );
}
