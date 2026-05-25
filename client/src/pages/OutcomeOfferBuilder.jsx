import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { OutcomeOfferForm } from "../components/outcomeOffers/OutcomeOfferForm.jsx";
import { OutcomeOfferPreview } from "../components/outcomeOffers/OutcomeOfferPreview.jsx";
import { OutcomeOfferQualityCard } from "../components/outcomeOffers/OutcomeOfferQualityCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveOutcomeOffer,
  useCreateOutcomeOffer,
  useOutcomeOffer,
  usePauseOutcomeOffer,
  usePublishOutcomeOffer,
  useUpdateOutcomeOffer,
} from "../features/outcomeOffers/useOutcomeOffers.js";
import {
  createInitialOutcomeOfferForm,
  formToOutcomeOfferPayload,
  getApiErrorMessage,
  outcomeOfferToForm,
  validateOutcomeOfferForm,
} from "../features/outcomeOffers/outcomeOfferUtils.js";

function getOfferId(offer) {
  return offer?.id ?? offer?._id;
}

export function OutcomeOfferBuilder() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const mode = offerId ? "edit" : "create";
  const [errors, setErrors] = useState({});
  const [formDraft, setFormDraft] = useState(() => (offerId ? null : createInitialOutcomeOfferForm()));
  const [notice, setNotice] = useState(null);
  const offerQuery = useOutcomeOffer(offerId);
  const createMutation = useCreateOutcomeOffer();
  const updateMutation = useUpdateOutcomeOffer();
  const publishMutation = usePublishOutcomeOffer();
  const pauseMutation = usePauseOutcomeOffer();
  const archiveMutation = useArchiveOutcomeOffer();
  const offer = offerQuery.data;
  const form = formDraft ?? outcomeOfferToForm(offer);

  function showError(error, fallback) {
    setErrors((current) => ({
      ...current,
      form: getApiErrorMessage(error, fallback),
    }));
  }

  async function saveOffer() {
    const nextErrors = validateOutcomeOfferForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    const payload = formToOutcomeOfferPayload(form);

    try {
      if (mode === "edit") {
        const updatedOffer = await updateMutation.mutateAsync({ id: offerId, payload });
        setNotice("Offer changes saved.");
        return updatedOffer;
      }

      const createdOffer = await createMutation.mutateAsync(payload);
      setNotice("Outcome offer draft saved.");
      return createdOffer;
    } catch (error) {
      showError(error, "Offer could not be saved. Please try again.");
      return null;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const savedOffer = await saveOffer();

    if (savedOffer) {
      navigate(ROUTES.OWNER_OUTCOME_OFFER(getOfferId(savedOffer)));
    }
  }

  async function handlePublish() {
    const nextErrors = validateOutcomeOfferForm(form, { requirePublishFields: true });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const savedOffer = mode === "edit"
        ? await updateMutation.mutateAsync({ id: offerId, payload: formToOutcomeOfferPayload(form) })
        : await createMutation.mutateAsync(formToOutcomeOfferPayload(form));
      const publishedOffer = await publishMutation.mutateAsync(getOfferId(savedOffer));
      navigate(ROUTES.OWNER_OUTCOME_OFFER(getOfferId(publishedOffer)));
    } catch (error) {
      showError(error, "Outcome offer could not be published. Check required fields and try again.");
    }
  }

  async function handlePause() {
    try {
      await pauseMutation.mutateAsync(offerId);
      navigate(ROUTES.OWNER_OUTCOME_OFFER(offerId));
    } catch (error) {
      showError(error, "Outcome offer could not be paused.");
    }
  }

  async function handleArchive() {
    try {
      await archiveMutation.mutateAsync(offerId);
      navigate(ROUTES.MY_OUTCOME_OFFERS);
    } catch (error) {
      showError(error, "Outcome offer could not be archived.");
    }
  }

  if (mode === "edit" && offerQuery.isLoading) {
    return (
      <PageLoader
        description="Loading your editable outcome offer."
        title="Loading outcome offer"
      />
    );
  }

  if (mode === "edit" && offerQuery.isError) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Offer unavailable</Badge>
        <h1 className="mt-3 text-3xl font-black text-[#1C1917]">Outcome offer could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getApiErrorMessage(offerQuery.error, "This offer may have moved or you may not have access.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.MY_OUTCOME_OFFERS}>
          Back to offers
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        backFallback={ROUTES.MY_OUTCOME_OFFERS}
        description="Turn a vague service into a clear, proof-based outcome clients can buy or invite you for."
        eyebrow="Outcome Offer Builder"
        showBack
        title={mode === "create" ? "Create Outcome Offer" : "Edit Outcome Offer"}
      />

      {notice ? (
        <div className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] px-4 py-3 text-sm font-bold text-[#365314]">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <OutcomeOfferForm
          errors={errors}
          form={form}
          isArchiving={archiveMutation.isPending}
          isPausing={pauseMutation.isPending}
          isPublishing={publishMutation.isPending || createMutation.isPending || updateMutation.isPending}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          mode={mode}
          offerStatus={offer?.status ?? "draft"}
          onArchive={handleArchive}
          onCancel={() => navigate(ROUTES.MY_OUTCOME_OFFERS)}
          onChange={(nextForm) => {
            setFormDraft(nextForm);
            setErrors((current) => ({ ...current, form: "" }));
            setNotice(null);
          }}
          onPause={handlePause}
          onPublish={handlePublish}
          onSubmit={handleSubmit}
        />
        <aside className="grid gap-5">
          <OutcomeOfferPreview form={form} offer={offer} />
          <OutcomeOfferQualityCard form={form} />
          <Card padding="md" variant="muted">
            <p className="text-sm font-black text-[#1C1917]">AI improvement is not enabled yet.</p>
            <p className="mt-2 text-sm leading-6 text-[#78716C]">
              The current builder is rule-based. AI-assisted offer improvement belongs to a later stage.
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
