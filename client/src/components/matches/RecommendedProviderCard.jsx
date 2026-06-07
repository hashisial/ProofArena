import { ArrowRight, Bookmark, Eye, MailPlus, MapPin, PackageCheck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  buildMatchedOfferPath,
  buildProviderProfilePath,
} from "../../features/matches/matchUtils.js";
import { formatOfferPrice, formatTimeline } from "../../features/outcomeOffers/outcomeOfferUtils.js";
import { cn } from "../../utils/cn.js";
import { getInitials } from "../../utils/getInitials.js";
import { VerificationBadge } from "../profile/VerificationBadge.jsx";
import { ProviderProofSummary } from "../providers/ProviderProofSummary.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ClientMatchReasonList } from "./ClientMatchReasonList.jsx";
import { MatchStatusBadge } from "./MatchStatusBadge.jsx";
import { ProviderMatchScoreBadge } from "./ProviderMatchScoreBadge.jsx";
import { ProviderMatchWeaknessList } from "./ProviderMatchWeaknessList.jsx";

function getProviderName(provider = {}) {
  return provider.fullName || provider.username || provider.title || "Recommended provider";
}

function formatAvailability(value = "") {
  return String(value || "availability scoped").replaceAll("_", " ");
}

function MatchedOfferSummary({ offer, provider }) {
  if (!offer) {
    return (
      <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Matched outcome offer</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#6F657C]">
          No public outcome offer was attached to this match yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#7C3AED]/15 bg-[#F5F3FF] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            <PackageCheck aria-hidden="true" className="h-4 w-4" />
            Matched outcome offer
          </p>
          <h3 className="mt-2 text-lg font-black text-[#07030D]">{offer.title}</h3>
          {offer.targetOutcome?.outcomeStatement ? (
            <p className="mt-2 text-sm font-semibold leading-6 text-[#5B21B6]">{offer.targetOutcome.outcomeStatement}</p>
          ) : null}
        </div>
        <Button as={Link} className="w-full sm:w-auto" to={buildMatchedOfferPath(provider, offer)} variant="outline">
          View Offer
        </Button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["Category", offer.category || "Uncategorized"],
          ["Timeline", formatTimeline(offer.deliveryTimeline)],
          ["Price", formatOfferPrice(offer.priceRange)],
        ].map(([label, value]) => (
          <div className="rounded-2xl border border-[#E9E2F3] bg-white/80 p-3" key={label}>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">{label}</p>
            <p className="mt-1 text-sm font-black text-[#07030D]">{value}</p>
          </div>
        ))}
      </div>
      <Badge className="mt-4" variant="green">
        {Number(offer.proofIncludedCount ?? 0)} proof item{Number(offer.proofIncludedCount ?? 0) === 1 ? "" : "s"}
      </Badge>
    </div>
  );
}

export function RecommendedProviderCard({
  challenge,
  isUpdating = false,
  match,
  onDismiss,
  onInvite,
  onSave,
  onView,
}) {
  const provider = match?.provider ?? {};
  const providerName = getProviderName(provider);
  const matchedOffers = Array.isArray(match?.matchedOffers) ? match.matchedOffers : [];
  const primaryOffer = matchedOffers[0];
  const profilePath = buildProviderProfilePath(provider);
  const skills = Array.isArray(provider.skills) ? provider.skills.slice(0, 6) : [];

  return (
    <Card as="article" className="grid gap-5" variant="bordered">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {provider.avatar ? (
            <img
              alt={`${providerName} profile photo`}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F5F3FF]"
              src={provider.avatar}
            />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#07030D,#7C3AED)] text-lg font-black text-white ring-4 ring-[#F5F3FF]">
              {getInitials(providerName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-2xl font-black tracking-normal text-[#07030D]">{providerName}</h2>
              <VerificationBadge
                isVerified={provider.verificationStatus === "verified"}
                label="Verified"
                size="sm"
                status={provider.verificationStatus}
              />
              <MatchStatusBadge status={match?.status} />
            </div>
            {provider.username ? <p className="mt-1 text-sm font-bold text-[#6F657C]">@{provider.username}</p> : null}
            {provider.headline ? <p className="mt-2 text-sm font-semibold leading-6 text-[#6F657C]">{provider.headline}</p> : null}
            {provider.location ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-[#6F657C]">
                <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                <span className="min-w-0 break-words">{provider.location}</span>
              </p>
            ) : null}
          </div>
        </div>
        <ProviderMatchScoreBadge score={match?.matchScore} />
      </div>

      <ProviderProofSummary provider={provider} />

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="primary">
            {skill}
          </Badge>
        ))}
        <Badge variant="green">{formatAvailability(provider.availability)}</Badge>
        {provider.categories?.slice(0, 3).map((category) => (
          <Badge key={category} variant="outline">
            {category}
          </Badge>
        ))}
      </div>

      <MatchedOfferSummary offer={primaryOffer} provider={provider} />

      <ClientMatchReasonList reasons={match?.matchReasons ?? []} />
      <ProviderMatchWeaknessList weaknesses={match?.weaknesses ?? []} />

      {match?.recommendedAction ? (
        <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">Recommended action</p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#07030D]">{match.recommendedAction}</p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[#E9E2F3] pt-5 sm:flex-row sm:flex-wrap">
        <Button as={Link} onClick={() => onView?.(match)} to={profilePath} variant="secondary">
          <Eye aria-hidden="true" className="h-4 w-4" />
          View Profile
        </Button>
        <Button onClick={() => onInvite?.(match)} type="button">
          <MailPlus aria-hidden="true" className="h-4 w-4" />
          Invite Provider
        </Button>
        <Button
          className={cn(match?.status === "saved" && "opacity-70")}
          disabled={match?.status === "saved"}
          isLoading={isUpdating}
          onClick={() => onSave?.(match)}
          type="button"
          variant="outline"
        >
          <Bookmark aria-hidden="true" className="h-4 w-4" />
          Save
        </Button>
        <Button
          disabled={match?.status === "dismissed"}
          isLoading={isUpdating}
          onClick={() => onDismiss?.(match)}
          type="button"
          variant="secondary"
        >
          <XCircle aria-hidden="true" className="h-4 w-4" />
          Dismiss
        </Button>
        {primaryOffer ? (
          <Button as={Link} to={buildMatchedOfferPath(provider, primaryOffer)} variant="outline">
            View Matched Offer
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
      <span className="sr-only">{challenge?.title ? `Recommendation for ${challenge.title}` : "Recommended provider"}</span>
    </Card>
  );
}
