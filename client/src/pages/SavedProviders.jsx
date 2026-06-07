import { Bookmark, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SavedProviderCard } from "../components/providers/SavedProviderCard.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useMySavedProviders,
  useUnsaveProvider,
  useUpdateSavedProvider,
} from "../features/savedProviders/useSavedProviders.js";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Saved", value: "saved" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Invite later", value: "invited_later" },
  { label: "Dismissed", value: "dismissed" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Proof score", value: "proof_score" },
  { label: "Completed outcomes", value: "completed_outcomes" },
];

function SavedProviderSkeleton() {
  return (
    <Card className="rounded-3xl" padding="md">
      <div className="flex gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="grid flex-1 gap-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <Skeleton className="mt-5 h-28 w-full rounded-2xl" />
      <Skeleton className="mt-5 h-10 w-full rounded-full" />
    </Card>
  );
}

export function SavedProviders() {
  const [filters, setFilters] = useState({
    q: "",
    sort: "newest",
    status: "all",
  });
  const queryFilters = useMemo(
    () => ({
      ...filters,
      limit: 24,
      page: 1,
    }),
    [filters],
  );
  const savedProvidersQuery = useMySavedProviders(queryFilters);
  const updateMutation = useUpdateSavedProvider();
  const unsaveMutation = useUnsaveProvider();
  const items = savedProvidersQuery.data?.items ?? [];
  const stats = savedProvidersQuery.data?.stats ?? {};

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function clearFilters() {
    setFilters({
      q: "",
      sort: "newest",
      status: "all",
    });
  }

  async function markShortlisted(item) {
    await updateMutation.mutateAsync({
      id: item.savedProviderId,
      payload: { status: "shortlisted" },
    });
  }

  async function removeSavedProvider(item) {
    await unsaveMutation.mutateAsync(item.providerId);
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-[#7C3AED]/16 bg-[linear-gradient(135deg,#ffffff,#F8F4FF)] p-6 shadow-[0_24px_80px_rgba(31,14,54,0.08)] md:p-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
              Client shortlist
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#07030D] md:text-5xl">
              Saved Providers
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-[#6F657C]">
              Keep track of providers you may want to invite to future outcome challenges.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Saved", stats.saved ?? 0],
              ["Shortlisted", stats.shortlisted ?? 0],
              ["Total", stats.total ?? 0],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#E9E2F3] bg-white p-4" key={label}>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#6F657C]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#07030D]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Card className="rounded-3xl" padding="md">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_14rem_auto] lg:items-end">
          <Input
            label="Search saved providers"
            leftIcon={<Search className="h-4 w-4" />}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search by name, skill, category, or note..."
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
          <Select
            label="Sort"
            onChange={(event) => updateFilter("sort", event.target.value)}
            options={sortOptions}
            placeholder=""
            value={filters.sort}
          />
          <Button onClick={clearFilters} type="button" variant="outline">
            Clear
          </Button>
        </div>
      </Card>

      {savedProvidersQuery.isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SavedProviderSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {savedProvidersQuery.isError ? (
        <EmptyState
          actionText="Retry"
          description="Something went wrong while loading your saved providers. Try again."
          icon={Bookmark}
          onAction={() => savedProvidersQuery.refetch()}
          title="Could not load saved providers"
          variant="bordered"
        />
      ) : null}

      {!savedProvidersQuery.isLoading && !savedProvidersQuery.isError && items.length === 0 ? (
        <EmptyState
          actionHref={ROUTES.PROVIDERS}
          actionText="Explore Providers"
          description="Browse providers and save the ones that match your challenge needs."
          icon={Bookmark}
          title="No saved providers yet"
          variant="spotlight"
        />
      ) : null}

      {!savedProvidersQuery.isLoading && !savedProvidersQuery.isError && items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <SavedProviderCard
              item={item}
              key={item.savedProviderId}
              onRemove={removeSavedProvider}
              onShortlist={markShortlisted}
              removing={unsaveMutation.isPending && unsaveMutation.variables === item.providerId}
              updating={updateMutation.isPending && updateMutation.variables?.id === item.savedProviderId}
            />
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button as="a" href={ROUTES.PROVIDERS}>
          Explore Providers
        </Button>
        <Button as="a" href={ROUTES.MY_CHALLENGES} variant="outline">
          View Challenges
        </Button>
      </div>
    </div>
  );
}
