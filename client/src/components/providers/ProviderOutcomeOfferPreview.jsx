import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { ROUTES } from "../../constants/index.js";
import { cn, formatCurrency } from "../../utils/index.js";

function getTopOffer(provider = {}) {
  return (
    provider.topPublicOutcomeOffer ||
    provider.outcomeOffers?.top ||
    provider.outcomeOffersSummary?.top ||
    provider.outcomeOffers?.offers?.[0] ||
    provider.outcomeOffersSummary?.offers?.[0] ||
    null
  );
}

function getUsername(provider = {}) {
  return provider.username || provider.user?.username || "";
}

function getTargetOutcome(offer = {}) {
  if (typeof offer.targetOutcome === "string") {
    return offer.targetOutcome;
  }

  return (
    offer.targetOutcome?.outcomeStatement ||
    offer.targetOutcome?.summary ||
    offer.targetOutcome?.title ||
    ""
  );
}

function formatTimeline(timeline) {
  if (!timeline) {
    return "";
  }

  if (typeof timeline === "string") {
    return timeline;
  }

  if (timeline.customLabel) {
    return timeline.customLabel;
  }

  if (timeline.label) {
    return timeline.label;
  }

  const min = Number(timeline.minDays ?? timeline.min ?? timeline.days);
  const max = Number(timeline.maxDays ?? timeline.max);

  if (timeline.type === "weekly") {
    return "Weekly";
  }

  if (timeline.type === "monthly") {
    return "Monthly";
  }

  if (Number.isFinite(min) && Number.isFinite(max) && min !== max) {
    return `${min}-${max} days`;
  }

  if (Number.isFinite(min)) {
    return `${min} day${min === 1 ? "" : "s"}`;
  }

  return "";
}

function formatPrice(priceRange) {
  if (
    !priceRange ||
    priceRange.isPublic === false ||
    priceRange.hidden === true ||
    priceRange.type === "hidden"
  ) {
    return "";
  }

  if (priceRange.label || priceRange.customLabel) {
    return priceRange.label || priceRange.customLabel;
  }

  const currency = priceRange.currency || "USD";
  const min = Number(priceRange.min ?? priceRange.amount ?? priceRange.startingAt);
  const max = Number(priceRange.max);

  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return `${formatCurrency(min, currency, { maximumFractionDigits: 0 })}-${formatCurrency(max, currency, { maximumFractionDigits: 0 })}`;
  }

  if (Number.isFinite(min)) {
    return priceRange.type === "fixed"
      ? formatCurrency(min, currency, { maximumFractionDigits: 0 })
      : `Starting at ${formatCurrency(min, currency, { maximumFractionDigits: 0 })}`;
  }

  return "";
}

export function ProviderOutcomeOfferPreview({
  className = "",
  compact = false,
  provider = {},
}) {
  const offer = getTopOffer(provider);
  const username = getUsername(provider);
  const profileHref = username ? `/profile/${username}` : "";

  if (!offer) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <BriefcaseBusiness aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            Outcome offer
          </p>
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#6F657C]">
          No public outcome offer yet.
        </p>
      </div>
    );
  }

  const timeline = formatTimeline(offer.deliveryTimeline ?? offer.timeline);
  const price = formatPrice(offer.priceRange);
  const targetOutcome = getTargetOutcome(offer);
  const offerHref =
    username && offer.slug && ROUTES.OUTCOME_OFFER_DETAIL
      ? ROUTES.OUTCOME_OFFER_DETAIL(username, offer.slug)
      : profileHref;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <BriefcaseBusiness aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
          Outcome offer
        </p>
      </div>
      <h3 className="mt-3 line-clamp-2 text-base font-black leading-6 text-[#07030D]">
        {offer.title || "Public outcome offer"}
      </h3>
      {targetOutcome ? (
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#6F657C]">
          {targetOutcome}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {offer.category ? <Badge variant="primary">{offer.category}</Badge> : null}
        {timeline ? <Badge variant="gray">{timeline}</Badge> : null}
        {price ? <Badge variant="secondary">{price}</Badge> : null}
        <Badge variant="outline">
          {Number(offer.proofIncludedCount ?? 0)} proof item
          {Number(offer.proofIncludedCount ?? 0) === 1 ? "" : "s"}
        </Badge>
      </div>
      {!compact && offerHref ? (
        <Button as="a" className="mt-4 min-h-10 w-full px-4 py-2 text-xs" href={offerHref} variant="secondary">
          {offer.slug ? "View offer" : "View profile"}
          <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
