import { PackagePlus } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderOutcomeOffersCard({ isError = false, isLoading = false, offers = [], onRetry, total }) {
  const published = offers.filter((offer) => offer.status === "published").length;
  const drafts = offers.filter((offer) => offer.status === "draft").length;
  const scoredOffers = offers.filter((offer) => Number.isFinite(Number(offer.qualityScore?.score)));
  const averageQuality = scoredOffers.length > 0
    ? Math.round(scoredOffers.reduce((sum, offer) => sum + Number(offer.qualityScore.score), 0) / scoredOffers.length)
    : null;
  const latestOffers = [...offers]
    .sort((left, right) => new Date(right.updatedAt || right.createdAt || 0) - new Date(left.updatedAt || left.createdAt || 0))
    .slice(0, 3);

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Outcome Offers</CardTitle>
        <CardDescription>Measurable offers that strengthen discovery and matching.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {[0, 1, 2].map((item) => <Skeleton className="h-20" key={item} />)}
            </div>
            <Skeleton className="h-28" />
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Outcome offer data could not be loaded. Try again."
            icon={PackagePlus}
            onAction={onRetry}
            size="sm"
            title="Could not load outcome offers"
            variant="minimal"
          />
        ) : (
          <>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Total offers", total ?? offers.length],
            ["Published", published],
            ["Drafts", drafts],
          ].map(([label, value]) => (
            <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3" key={label}>
              <p className="text-xs font-bold text-[#78716C]">{label}</p>
              <p className="mt-1 text-xl font-black text-[#1C1917]">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-bold text-[#57534E]">
          Average quality: {averageQuality === null ? "Not available" : `${averageQuality}/100`}
        </p>
        {latestOffers.length > 0 ? (
          <div className="mt-4 grid gap-2">
            {latestOffers.map((offer) => (
              <a className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3 transition hover:border-[#65A30D]" href={ROUTES.OWNER_OUTCOME_OFFER(offer.id)} key={offer.id}>
                <p className="min-w-0 break-words font-black text-[#1C1917]">{offer.title || "Outcome offer"}</p>
                <Badge variant={offer.status === "published" ? "primary" : "gray"}>{offer.status || "draft"}</Badge>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState
            actionHref={ROUTES.NEW_OUTCOME_OFFER}
            actionText="Create Outcome Offer"
            description="Your first offer should describe a measurable result and expected proof."
            icon={PackagePlus}
            size="sm"
            title="No outcome offers yet"
            variant="minimal"
          />
        )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.MY_OUTCOME_OFFERS}>Manage Offers</Button>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.NEW_OUTCOME_OFFER} variant="outline">Create Offer</Button>
      </CardFooter>
    </Card>
  );
}
