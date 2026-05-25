import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { ProviderFilters } from "../components/providers/ProviderFilters.jsx";
import { ProviderResultsGrid } from "../components/providers/ProviderResultsGrid.jsx";
import { ProviderSearchBar } from "../components/providers/ProviderSearchBar.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Container } from "../components/Container.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useProviderSearch } from "../features/providers/useProviders.js";

const initialFilters = {
  available: "",
  category: "",
  location: "",
  minProofScore: "",
  q: "",
  skill: "",
  sort: "proof_score",
  verified: "",
};

function getActiveFilterCount(filters) {
  return Object.entries(filters).filter(([key, value]) => {
    if (key === "sort") {
      return value !== initialFilters.sort;
    }

    return Boolean(value);
  }).length;
}

export function Providers() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [draftSearch, setDraftSearch] = useState(initialFilters.q);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const queryFilters = useMemo(
    () => ({
      ...filters,
      limit: 12,
      page,
      role: "provider",
    }),
    [filters, page],
  );
  const providerQuery = useProviderSearch(queryFilters);
  const providers = providerQuery.data?.items ?? [];
  const pagination = providerQuery.data?.pagination ?? {
    hasMore: false,
    limit: 12,
    page,
    total: 0,
  };
  const activeFilterCount = getActiveFilterCount(filters);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
    setPage(1);
  }

  function submitSearch(event) {
    event.preventDefault();
    setFilters((current) => ({ ...current, q: draftSearch.trim() }));
    setPage(1);
  }

  function resetFilters() {
    setDraftSearch("");
    setFilters(initialFilters);
    setPage(1);
  }

  function handleMessage(provider) {
    const username = provider.username || provider.user?.username;
    const targetPath = `${ROUTES.MESSAGES}${username ? `?to=${encodeURIComponent(username)}` : ""}`;

    if (isAuthenticated) {
      navigate(targetPath);
      return;
    }

    navigate(`${ROUTES.LOGIN}?redirect=${encodeURIComponent(targetPath)}`);
  }

  return (
    <section className="min-w-0 bg-[#FFFBEB] py-8 text-[#1C1917] sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto grid max-w-7xl gap-6">
          <div className="grid min-w-0 gap-5 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_24px_80px_rgba(28, 25, 23, 0.08)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="min-w-0">
              <Badge variant="primary">Provider discovery</Badge>
              <h1 className="mt-4 max-w-4xl break-words text-4xl font-black leading-tight tracking-normal text-[#1C1917] sm:text-5xl lg:text-6xl">
                Find providers by proof, skills, and outcomes.
              </h1>
              <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[#57534E]">
                Search public ProofArena profiles by skills, services, proof score,
                availability, and verified outcome signals.
              </p>
            </div>

            <Card className="rounded-3xl" padding="md" variant="muted">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">
                Discovery status
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-2xl font-black text-[#1C1917]">{pagination.total ?? 0}</p>
                  <p className="mt-1 text-xs font-bold text-[#78716C]">public results</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-2xl font-black text-[#1C1917]">{activeFilterCount}</p>
                  <p className="mt-1 text-xs font-bold text-[#78716C]">active filters</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="rounded-3xl" padding="lg">
            <ProviderSearchBar
              onChange={setDraftSearch}
              onSubmit={submitSearch}
              value={draftSearch}
            />
            <div className="mt-5">
              <ProviderFilters
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
              />
            </div>
          </Card>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
                Results
              </p>
              <h2 className="mt-2 break-words text-2xl font-black tracking-normal text-[#1C1917] sm:text-3xl">
                {pagination.total ?? providers.length} provider profiles
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-[#78716C]">
              Results exclude private, hidden, suspended, and discovery-disabled profiles.
            </p>
          </div>

          <ProviderResultsGrid
            error={providerQuery.error}
            isError={providerQuery.isError}
            isLoading={providerQuery.isLoading}
            onMessage={handleMessage}
            onRetry={() => providerQuery.refetch()}
            providers={providers}
          />

          {!providerQuery.isLoading && !providerQuery.isError && providers.length > 0 ? (
            <div className="flex flex-col gap-3 rounded-3xl border border-[#E7E5E4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-[#78716C]">
                Page {pagination.page ?? page}
                {pagination.total ? ` of ${Math.max(1, Math.ceil(pagination.total / (pagination.limit ?? 12)))}` : ""}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  type="button"
                  variant="outline"
                >
                  Previous
                </Button>
                <Button
                  disabled={!pagination.hasMore}
                  onClick={() => setPage((current) => current + 1)}
                  type="button"
                >
                  Next page
                  <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-3xl" padding="lg" variant="muted">
              <UserRoundPlus aria-hidden="true" className="h-6 w-6 text-[#3F6212]" />
              <h2 className="mt-3 text-2xl font-black tracking-normal text-[#1C1917]">
                Build your provider profile
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Add services, proof signals, and availability so clients can evaluate
                your public profile without leaving ProofArena.
              </p>
              <Button as="a" className="mt-5 w-full sm:w-auto" href={ROUTES.REGISTER}>
                Become a Provider
              </Button>
            </Card>
            <Card className="rounded-3xl" padding="lg" variant="muted">
              <h2 className="text-2xl font-black tracking-normal text-[#1C1917]">
                Need outcome-based work?
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Create a challenge when the challenge workflow is ready, then use proof
                signals to evaluate provider execution.
              </p>
              <Button as="a" className="mt-5 w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="outline">
                Create a Challenge
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
