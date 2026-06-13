import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { OutcomeOfferActions } from "../components/outcomeOffers/OutcomeOfferActions.jsx";
import { OutcomeOfferPreview } from "../components/outcomeOffers/OutcomeOfferPreview.jsx";
import { OutcomeOfferQualityCard } from "../components/outcomeOffers/OutcomeOfferQualityCard.jsx";
import { OutcomeOfferStatusBadge, OutcomeOfferVisibilityBadge } from "../components/outcomeOffers/OutcomeOfferStatusBadge.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveOutcomeOffer,
  useDeleteOutcomeOffer,
  useOutcomeOffer,
  usePauseOutcomeOffer,
  usePublishOutcomeOffer,
} from "../features/outcomeOffers/useOutcomeOffers.js";
import {
  formatOfferPrice,
  formatTimeline,
  getApiErrorMessage,
} from "../features/outcomeOffers/outcomeOfferUtils.js";

function DetailList({ items = [], title }) {
  return (
    <Card padding="md" variant="default">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.length > 0 ? items.map((item, index) => (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={`${item.title}-${index}`}>
            <p className="font-black text-[#1C1917]">{item.title}</p>
            {item.description ? <p className="mt-1 text-sm leading-6 text-[#78716C]">{item.description}</p> : null}
            {item.proofType ? <Badge className="mt-3" variant="green">{item.proofType.replaceAll("_", " ")}</Badge> : null}
          </div>
        )) : (
          <p className="text-sm leading-6 text-[#78716C]">Nothing added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function OutcomeOfferDetail() {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const offerQuery = useOutcomeOffer(offerId);
  const publishMutation = usePublishOutcomeOffer();
  const pauseMutation = usePauseOutcomeOffer();
  const archiveMutation = useArchiveOutcomeOffer();
  const deleteMutation = useDeleteOutcomeOffer();
  const offer = offerQuery.data;

  if (offerQuery.isLoading) {
    return <PageLoader description="Loading owner preview and offer details." title="Loading outcome offer" />;
  }

  if (offerQuery.isError || !offer) {
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
        actions={
          <OutcomeOfferActions
            isArchiving={archiveMutation.isPending}
            isDeleting={deleteMutation.isPending}
            isPausing={pauseMutation.isPending}
            isPublishing={publishMutation.isPending}
            offer={offer}
            onArchive={(id) => archiveMutation.mutateAsync(id).then(() => navigate(ROUTES.MY_OUTCOME_OFFERS))}
            onDelete={(id) => deleteMutation.mutateAsync(id).then(() => navigate(ROUTES.MY_OUTCOME_OFFERS))}
            onPause={(id) => pauseMutation.mutateAsync(id)}
            onPublish={(id) => publishMutation.mutateAsync(id)}
            showView={false}
          />
        }
        backFallback={ROUTES.MY_OUTCOME_OFFERS}
        description={offer.shortSummary}
        eyebrow="Owner offer preview"
        showBack
        title={offer.title}
      />

      <div className="flex flex-wrap gap-2">
        <OutcomeOfferStatusBadge status={offer.status} />
        <OutcomeOfferVisibilityBadge visibility={offer.visibility} />
        <Badge variant="outline">{offer.category}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="grid gap-5">
          <Card padding="lg" variant="default">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Target outcome</p>
            <h2 className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
              {offer.targetOutcome?.outcomeStatement}
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatTimeline(offer.deliveryTimeline)}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Price</p>
                <p className="mt-1 font-black text-[#1C1917]">{formatOfferPrice(offer.priceRange)}</p>
              </div>
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Stats</p>
                <p className="mt-1 font-black text-[#1C1917]">{Number(offer.stats?.views ?? 0)} views</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#44403C]">{offer.description}</p>
          </Card>
          <DetailList items={offer.successCriteria} title="Success criteria" />
          <DetailList items={offer.proofIncluded} title="Proof included" />
          <DetailList items={offer.milestoneTemplate} title="Milestone template" />
        </div>
        <aside className="grid gap-5">
          <OutcomeOfferPreview offer={offer} />
          <OutcomeOfferQualityCard offer={offer} />
        </aside>
      </div>
    </div>
  );
}
