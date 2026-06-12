import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ChallengeForm } from "../components/challenges/ChallengeForm.jsx";
import { ChallengePreview } from "../components/challenges/ChallengePreview.jsx";
import { ChallengeQualityCard } from "../components/challenges/ChallengeQualityCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveChallenge,
  useChallenge,
  useCloseChallenge,
  useCreateChallenge,
  usePauseChallenge,
  usePublishChallenge,
  useUpdateChallenge,
} from "../features/challenges/useChallenges.js";
import {
  challengeToForm,
  createInitialChallengeForm,
  formToChallengePayload,
  getChallengeApiErrorMessage,
  validateChallengeForm,
} from "../features/challenges/challengeUtils.js";

function getChallengeId(challenge) {
  return challenge?.id ?? challenge?._id;
}

export function ChallengeBuilder() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const mode = challengeId ? "edit" : "create";
  const [errors, setErrors] = useState({});
  const [formDraft, setFormDraft] = useState(() => (challengeId ? null : createInitialChallengeForm()));
  const [notice, setNotice] = useState(null);
  const challengeQuery = useChallenge(challengeId);
  const createMutation = useCreateChallenge();
  const updateMutation = useUpdateChallenge();
  const publishMutation = usePublishChallenge();
  const pauseMutation = usePauseChallenge();
  const closeMutation = useCloseChallenge();
  const archiveMutation = useArchiveChallenge();
  const challenge = challengeQuery.data;
  const form = formDraft ?? challengeToForm(challenge);

  function showError(error, fallback) {
    setErrors((current) => ({
      ...current,
      form: getChallengeApiErrorMessage(error, fallback),
    }));
  }

  async function saveChallenge() {
    const nextErrors = validateChallengeForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    const payload = formToChallengePayload(form);

    try {
      if (mode === "edit") {
        const updatedChallenge = await updateMutation.mutateAsync({ id: challengeId, payload });
        setNotice("Challenge changes saved.");
        return updatedChallenge;
      }

      const createdChallenge = await createMutation.mutateAsync(payload);
      setNotice("Outcome challenge draft saved.");
      return createdChallenge;
    } catch (error) {
      showError(error, "Challenge could not be saved. Please try again.");
      return null;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const savedChallenge = await saveChallenge();

    if (savedChallenge) {
      navigate(ROUTES.OWNER_CHALLENGE(getChallengeId(savedChallenge)));
    }
  }

  async function handlePublish() {
    const nextErrors = validateChallengeForm(form, { requirePublishFields: true });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const savedChallenge = mode === "edit"
        ? await updateMutation.mutateAsync({ id: challengeId, payload: formToChallengePayload(form) })
        : await createMutation.mutateAsync(formToChallengePayload(form));
      const publishedChallenge = await publishMutation.mutateAsync(getChallengeId(savedChallenge));
      navigate(ROUTES.OWNER_CHALLENGE(getChallengeId(publishedChallenge)));
    } catch (error) {
      showError(error, "Challenge could not be published. Check required fields and try again.");
    }
  }

  async function handlePause() {
    try {
      await pauseMutation.mutateAsync(challengeId);
      navigate(ROUTES.OWNER_CHALLENGE(challengeId));
    } catch (error) {
      showError(error, "Challenge could not be paused.");
    }
  }

  async function handleClose() {
    try {
      await closeMutation.mutateAsync(challengeId);
      navigate(ROUTES.OWNER_CHALLENGE(challengeId));
    } catch (error) {
      showError(error, "Challenge could not be closed.");
    }
  }

  async function handleArchive() {
    try {
      await archiveMutation.mutateAsync(challengeId);
      navigate(ROUTES.MY_CHALLENGES);
    } catch (error) {
      showError(error, "Challenge could not be archived.");
    }
  }

  if (mode === "edit" && challengeQuery.isLoading) {
    return (
      <PageLoader
        description="Loading your editable outcome challenge."
        title="Loading challenge"
      />
    );
  }

  if (mode === "edit" && challengeQuery.isError) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Challenge unavailable</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#1C1917]">Challenge could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getChallengeApiErrorMessage(challengeQuery.error, "This challenge may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.MY_CHALLENGES}>
          Back to challenges
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        backFallback={ROUTES.MY_CHALLENGES}
        description="Turn a business need into a clear outcome providers can understand, plan for, and prove."
        eyebrow="Challenge Builder"
        showBack
        title={mode === "create" ? "Create Outcome Challenge" : "Edit Outcome Challenge"}
      />

      {notice ? (
        <div className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] px-4 py-3 text-sm font-bold text-[#365314]">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <ChallengeForm
          challengeStatus={challenge?.status ?? "draft"}
          errors={errors}
          form={form}
          isArchiving={archiveMutation.isPending}
          isClosing={closeMutation.isPending}
          isPausing={pauseMutation.isPending}
          isPublishing={publishMutation.isPending || createMutation.isPending || updateMutation.isPending}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={mode}
          onArchive={handleArchive}
          onCancel={() => navigate(ROUTES.MY_CHALLENGES)}
          onChange={(nextForm) => {
            setFormDraft(nextForm);
            setErrors((current) => ({ ...current, form: "" }));
            setNotice(null);
          }}
          onClose={handleClose}
          onPause={handlePause}
          onPublish={handlePublish}
          onSubmit={handleSubmit}
        />
        <aside className="grid gap-5">
          <ChallengePreview challenge={challenge} form={form} />
          <ChallengeQualityCard form={form} />
          <Card padding="md" variant="muted">
            <p className="text-sm font-black text-[#1C1917]">AI challenge drafting is not enabled yet.</p>
            <p className="mt-2 text-sm leading-6 text-[#78716C]">
              The current builder is rule-based. AI-assisted challenge improvement belongs to a later stage.
            </p>
            <Button className="mt-4 w-full" disabled type="button" variant="secondary">
              Improve with AI - coming later
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
