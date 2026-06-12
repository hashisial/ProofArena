import { CalendarDays, FileCheck2, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { OutcomeOfferActions } from "./OutcomeOfferActions.jsx";
import { OutcomeOfferStatusBadge, OutcomeOfferVisibilityBadge } from "./OutcomeOfferStatusBadge.jsx";
import { formatOfferPrice, formatTimeline } from "../../features/outcomeOffers/outcomeOfferUtils.js";

function getUpdatedLabel(value) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

export function OutcomeOfferCard({
  actionState = {},
  offer,
  onArchive,
  onDelete,
  onPause,
  onPublish,
  variant = "owner",
}) {
  const qualityScore = Number(offer?.qualityScore?.score ?? 0);
  const targetOutcome = offer?.targetOutcome?.outcomeStatement || "Outcome statement not added yet.";
  const proofCount = offer?.proofIncluded?.length ?? 0;

  return (
    <Card className="h-full" padding="md" variant="interactive">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {variant === "owner" ? <OutcomeOfferStatusBadge status={offer?.status} /> : null}
          {variant === "owner" ? <OutcomeOfferVisibilityBadge visibility={offer?.visibility} /> : null}
          <Badge variant="outline">{offer?.category || "Uncategorized"}</Badge>
        </div>
        <CardTitle className="text-xl">{offer?.title || "Untitled outcome offer"}</CardTitle>
        <CardDescription>{offer?.shortSummary || "Add a clear summary so clients understand the result."}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <div className="flex items-start gap-3">
            <Target aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6212]" />
            <p className="text-sm font-semibold leading-6 text-[#44403C]">{targetOutcome}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatTimeline(offer?.deliveryTimeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Price</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatOfferPrice(offer?.priceRange)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Quality</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{qualityScore}/100</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge leftIcon={<FileCheck2 className="h-3.5 w-3.5" />} variant="green">
            {proofCount} proof item{proofCount === 1 ? "" : "s"}
          </Badge>
          <Badge leftIcon={<CalendarDays className="h-3.5 w-3.5" />} variant="gray">
            Updated {getUpdatedLabel(offer?.updatedAt)}
          </Badge>
          {offer?.stats ? (
            <Badge variant="outline">
              {Number(offer.stats.views ?? 0)} views
            </Badge>
          ) : null}
        </div>
      </CardContent>
      {variant === "owner" ? (
        <CardFooter>
          <OutcomeOfferActions
            isArchiving={actionState.isArchiving}
            isDeleting={actionState.isDeleting}
            isPausing={actionState.isPausing}
            isPublishing={actionState.isPublishing}
            offer={offer}
            onArchive={onArchive}
            onDelete={onDelete}
            onPause={onPause}
            onPublish={onPublish}
          />
        </CardFooter>
      ) : (
        <CardFooter>
          {offer?.provider?.username && offer?.slug ? (
            <Button as={Link} to={ROUTES.OUTCOME_OFFER_DETAIL(offer.provider.username, offer.slug)}>
              View Offer
            </Button>
          ) : null}
          <Button as={Link} to={ROUTES.REGISTER} variant="outline">
            Invite to Challenge
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
