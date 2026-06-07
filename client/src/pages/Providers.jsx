import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { ProviderActiveFilters } from "../components/providers/ProviderActiveFilters.jsx";
import { ProviderCompareTray } from "../components/providers/ProviderCompareTray.jsx";
import { ProviderDiscoveryHeader } from "../components/providers/ProviderDiscoveryHeader.jsx";
import { ProviderFilters } from "../components/providers/ProviderFilters.jsx";
import { ProviderResultsGrid } from "../components/providers/ProviderResultsGrid.jsx";
import { ProviderSearchBar } from "../components/providers/ProviderSearchBar.jsx";
import { ProviderSortSelect } from "../components/providers/ProviderSortSelect.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Container } from "../components/Container.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useProviderComparisonState } from "../features/providers/providerComparisonState.js";
import { useProviderFilters, usePublicProviders } from "../features/providers/useProviders.js";

const initialFilters = {
  availability: "",
  category: "",
  hasOutcomeOffers: "",
  minCompletedOutcomes: "",
  minProofScore: "",
  q: "",
  skill: "",
  sort: "relevance",
  tool: "",
  verified: "",
};

function readFilters(searchParams) {
  return {
    availability: searchParams.get("availability") ?? "",
    category: searchParams.get("category") ?? "",
    hasOutcomeOffers: searchParams.get("hasOutcomeOffers") ?? "",
    minCompletedOutcomes: searchParams.get("minCompletedOutcomes") ?? "",
    minProofScore: searchParams.get("minProofScore") ?? "",
    q: searchParams.get("q") ?? "",
    skill: searchParams.get("skill") ?? "",
    sort: searchParams.get("sort") ?? initialFilters.sort,
    tool: searchParams.get("tool") ?? "",
    verified: searchParams.get("verified") ?? "",
  };
}

function readPage(searchParams) {
  return Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
}

function getActiveFilterCount(filters) {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === "sort") {
      return false;
    }

    return Boolean(value);
  }).length;
}

function buildSearchParams(filters, page) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (key === "sort" && value === initialFilters.sort)) {
      return;
    }

    params.set(key, value);
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  return params;
}

export function Providers() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamString = searchParams.toString();
  const filters = useMemo(() => readFilters(new URLSearchParams(searchParamString)), [searchParamString]);
  const page = useMemo(() => readPage(new URLSearchParams(searchParamString)), [searchParamString]);
  const [draftSearch, setDraftSearch] = useState(() => filters.q);
  const { clearComparison, removeProvider, selectedProviders } = useProviderComparisonState();
  const { isAuthenticated, role } = useAuth();
  const queryFilters = useMemo(
    () => ({
      ...filters,
      limit: 12,
      page,
      role: "provider",
    }),
    [filters, page],
  );
  const providerQuery = usePublicProviders(queryFilters);
  const filterQuery = useProviderFilters();
  const providers = providerQuery.data?.items ?? [];
  const pagination = providerQuery.data?.pagination ?? {
    hasMore: false,
    limit: 12,
    page,
    pages: 1,
    total: 0,
  };
  const filterOptions = filterQuery.data ?? providerQuery.data?.filters ?? {};
  const activeFilterCount = getActiveFilterCount(filters);
  const hasAnyFilters = activeFilterCount > 0;

  function applyFilters(nextFilters, nextPage = 1) {
    setSearchParams(buildSearchParams(nextFilters, nextPage));
  }

  function updateFilter(field, value) {
    applyFilters({ ...filters, [field]: value }, 1);
  }

  function submitSearch(event) {
    event.preventDefault();
    applyFilters({ ...filters, q: draftSearch.trim() }, 1);
  }

  function clearSearch() {
    setDraftSearch("");
    applyFilters({ ...filters, q: "" }, 1);
  }

  function applyPopularSearch(search) {
    setDraftSearch(search);
    applyFilters({ ...filters, q: search }, 1);
  }

  function removeFilter(field) {
    const nextFilters = { ...filters, [field]: "" };

    if (field === "q") {
      setDraftSearch("");
    }

    applyFilters(nextFilters, 1);
  }

  function resetFilters() {
    setDraftSearch("");
    applyFilters(initialFilters, 1);
  }

  function changePage(nextPage) {
    const safePage = Math.max(1, nextPage);

    setSearchParams(buildSearchParams(filters, safePage));
  }

  return (
    <section className="min-w-0 bg-[#F8F4FF] py-8 text-[#07030D] sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto grid max-w-7xl gap-6">
          <ProviderDiscoveryHeader
            activeFilterCount={activeFilterCount}
            total={pagination.total ?? 0}
          />

          <Card className="rounded-3xl" padding="lg">
            <ProviderSearchBar
              onChange={setDraftSearch}
              onClear={clearSearch}
              onPopularSearch={applyPopularSearch}
              onSubmit={submitSearch}
              value={draftSearch}
            />
          </Card>

          <ProviderActiveFilters
            filters={filters}
            onClear={resetFilters}
            onRemove={removeFilter}
          />

          <div className="grid min-w-0 gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            <aside className="min-w-0 lg:sticky lg:top-24">
              <ProviderFilters
                activeFilterCount={activeFilterCount}
                filterOptions={filterOptions}
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
              />
            </aside>

            <div className="grid min-w-0 gap-5">
              <div className="grid min-w-0 gap-4 rounded-3xl border border-[#E9E2F3] bg-white p-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
                    Results
                  </p>
                  <h2 className="mt-2 break-words text-2xl font-black tracking-normal text-[#07030D] sm:text-3xl">
                    {pagination.total ?? providers.length} provider profiles
                  </h2>
                  <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-[#6F657C]">
                    Results exclude private, hidden, suspended, and discovery-disabled profiles.
                  </p>
                </div>
                <ProviderSortSelect
                  onChange={(value) => updateFilter("sort", value)}
                  value={filters.sort}
                />
              </div>

              <ProviderResultsGrid
                hasAnyFilters={hasAnyFilters}
                isAuthenticated={isAuthenticated}
                isError={providerQuery.isError}
                isLoading={providerQuery.isLoading}
                onClearFilters={resetFilters}
                onRetry={() => providerQuery.refetch()}
                providers={providers}
                viewerRole={role}
              />

              {!providerQuery.isLoading && !providerQuery.isError && providers.length > 0 ? (
                <div className="flex flex-col gap-3 rounded-3xl border border-[#E9E2F3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-bold text-[#6F657C]">
                    Page {pagination.page ?? page} of {pagination.pages ?? 1}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      disabled={page <= 1}
                      onClick={() => changePage(page - 1)}
                      type="button"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={!pagination.hasMore}
                      onClick={() => changePage(page + 1)}
                      type="button"
                    >
                      Next page
                      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-3xl" padding="lg" variant="muted">
              <UserRoundPlus aria-hidden="true" className="h-6 w-6 text-[#7C3AED]" />
              <h2 className="mt-3 text-2xl font-black tracking-normal text-[#07030D]">
                Build your provider profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                Add offers, proof assets, skills, and availability so clients can
                evaluate your public profile with concrete signals.
              </p>
              <Button as="a" className="mt-5 w-full sm:w-auto" href={ROUTES.REGISTER}>
                Become a Provider
              </Button>
            </Card>
            <Card className="rounded-3xl" padding="lg" variant="muted">
              <h2 className="text-2xl font-black tracking-normal text-[#07030D]">
                Need outcome-based work?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                Create a challenge, then compare providers by proof, skills,
                outcome offers, availability, and public reputation.
              </p>
              <Button as="a" className="mt-5 w-full sm:w-auto" href={ROUTES.NEW_CHALLENGE} variant="outline">
                Create a Challenge
              </Button>
            </Card>
          </div>
        </div>
      </Container>
      <ProviderCompareTray
        onClear={clearComparison}
        onCompare={() => navigate(ROUTES.PROVIDER_COMPARE)}
        onRemove={removeProvider}
        providers={selectedProviders}
      />
    </section>
  );
}
