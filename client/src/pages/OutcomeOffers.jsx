import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PackagePlus, RotateCcw } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { OutcomeOfferCard } from "../components/outcomeOffers/OutcomeOfferCard.jsx";
import { OutcomeOfferEmptyState } from "../components/outcomeOffers/OutcomeOfferEmptyState.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveOutcomeOffer,
  useDeleteOutcomeOffer,
  useMyOutcomeOffers,
  usePauseOutcomeOffer,
  usePublishOutcomeOffer,
} from "../features/outcomeOffers/useOutcomeOffers.js";
import { getApiErrorMessage } from "../features/outcomeOffers/outcomeOfferUtils.js";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

const visibilityOptions = [
  { label: "All visibility", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Unlisted", value: "unlisted" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Quality score", value: "quality_score" },
  { label: "Views", value: "views" },
];

function StatCard({ label, value }) {
  return (
    <Card padding="sm" variant="muted">
      <p className="text-sm font-bold text-[#6F657C]">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#07030D]">{value}</p>
    </Card>
  );
}

function getOfferId(offer) {
  return offer?.id ?? offer?._id;
}

export function OutcomeOffers() {
  const [filters, setFilters] = useState({
    category: "",
    q: "",
    sort: "newest",
    status: "all",
    visibility: "all",
  });
  const queryFilters = {
    status: filters.status === "all" ? "" : filters.status,
    visibility: filters.visibility === "all" ? "" : filters.visibility,
  };
  const offersQuery = useMyOutcomeOffers(queryFilters);
  const publishMutation = usePublishOutcomeOffer();
  const pauseMutation = usePauseOutcomeOffer();
  const archiveMutation = useArchiveOutcomeOffer();
  const deleteMutation = useDeleteOutcomeOffer();
  const offers = useMemo(() => offersQuery.data?.items ?? [], [offersQuery.data?.items]);
  const filteredOffers = useMemo(() => {
    const search = filters.q.trim().toLowerCase();
    const category = filters.category.trim().toLowerCase();
    const result = offers.filter((offer) => {
      const matchesSearch = !search ||
        [offer.title, offer.shortSummary, offer.targetOutcome?.outcomeStatement]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesCategory = !category || String(offer.category ?? "").toLowerCase().includes(category);

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((left, right) => {
      if (filters.sort === "quality_score") {
        return Number(right.qualityScore?.score ?? 0) - Number(left.qualityScore?.score ?? 0);
      }

      if (filters.sort === "views") {
        return Number(right.stats?.views ?? 0) - Number(left.stats?.views ?? 0);
      }

      return new Date(right.updatedAt ?? right.createdAt ?? 0) - new Date(left.updatedAt ?? left.createdAt ?? 0);
    });
  }, [filters, offers]);
  const stats = useMemo(() => {
    const totalQuality = offers.reduce((sum, offer) => sum + Number(offer.qualityScore?.score ?? 0), 0);

    return {
      drafts: offers.filter((offer) => offer.status === "draft").length,
      published: offers.filter((offer) => offer.status === "published").length,
      quality: offers.length > 0 ? Math.round(totalQuality / offers.length) : 0,
      total: offers.length,
    };
  }, [offers]);
  const actionState = {
    isArchiving: archiveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isPausing: pauseMutation.isPending,
    isPublishing: publishMutation.isPending,
  };

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters({ category: "", q: "", sort: "newest", status: "all", visibility: "all" });
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <>
            <Button as={Link} to={ROUTES.PROFILE} variant="secondary">
              View public profile
            </Button>
            <Button as={Link} to={ROUTES.NEW_OUTCOME_OFFER}>
              <PackagePlus aria-hidden="true" className="mr-2 h-4 w-4" />
              Create Outcome Offer
            </Button>
          </>
        }
        description="Package your services into measurable results clients can understand, compare, and trust."
        eyebrow="Provider Client Acquisition"
        title="Outcome Offers"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total offers" value={stats.total} />
        <StatCard label="Published offers" value={stats.published} />
        <StatCard label="Draft offers" value={stats.drafts} />
        <StatCard label="Average quality score" value={`${stats.quality}/100`} />
      </div>

      <Card padding="md" variant="default">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))_auto] lg:items-end">
          <Input
            label="Search offers"
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search by outcome, proof, or title"
            type="search"
            value={filters.q}
          />
          <Select
            label="Status"
            onChange={(event) => updateFilter("status", event.target.value)}
            options={statusOptions}
            placeholder=""
            value={filters.status}
          />
          <Input
            label="Category"
            onChange={(event) => updateFilter("category", event.target.value)}
            placeholder="Lead Generation"
            value={filters.category}
          />
          <Select
            label="Visibility"
            onChange={(event) => updateFilter("visibility", event.target.value)}
            options={visibilityOptions}
            placeholder=""
            value={filters.visibility}
          />
          <Select
            label="Sort"
            onChange={(event) => updateFilter("sort", event.target.value)}
            options={sortOptions}
            placeholder=""
            value={filters.sort}
          />
          <Button className="lg:min-h-12" onClick={resetFilters} type="button" variant="secondary">
            <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      {offersQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load offers</Badge>
          <h2 className="mt-3 text-2xl font-black text-[#07030D]">Outcome offers unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">
            {getApiErrorMessage(offersQuery.error, "Offer list could not be loaded. Please try again.")}
          </p>
          <Button className="mt-5" onClick={() => offersQuery.refetch()} type="button">
            Retry
          </Button>
        </Card>
      ) : null}

      {offersQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-72" key={index} />
          ))}
        </div>
      ) : null}

      {!offersQuery.isLoading && !offersQuery.isError && offers.length === 0 ? (
        <OutcomeOfferEmptyState />
      ) : null}

      {!offersQuery.isLoading && !offersQuery.isError && offers.length > 0 && filteredOffers.length === 0 ? (
        <Card padding="lg" variant="bordered">
          <h2 className="text-2xl font-black text-[#07030D]">No offers match these filters</h2>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">
            Adjust search, status, visibility, or category filters to see more offers.
          </p>
          <Button className="mt-5" onClick={resetFilters} type="button" variant="outline">
            Clear filters
          </Button>
        </Card>
      ) : null}

      {filteredOffers.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredOffers.map((offer) => (
            <OutcomeOfferCard
              actionState={actionState}
              key={getOfferId(offer)}
              offer={offer}
              onArchive={(offerId) => archiveMutation.mutateAsync(offerId)}
              onDelete={(offerId) => deleteMutation.mutateAsync(offerId)}
              onPause={(offerId) => pauseMutation.mutateAsync(offerId)}
              onPublish={(offerId) => publishMutation.mutateAsync(offerId)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
