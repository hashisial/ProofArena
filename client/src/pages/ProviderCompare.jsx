import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart3, Bookmark, Search, Scale } from "lucide-react";
import { Container } from "../components/Container.jsx";
import { ProviderCompareTray } from "../components/providers/ProviderCompareTray.jsx";
import { ProviderComparisonCard } from "../components/providers/ProviderComparisonCard.jsx";
import { ProviderComparisonTable } from "../components/providers/ProviderComparisonTable.jsx";
import { ProviderDecisionMatrix } from "../components/providers/ProviderDecisionMatrix.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  getProviderCompareId,
  useProviderComparisonState,
} from "../features/providers/providerComparisonState.js";
import {
  buildComparisonSummary,
  buildDecisionMatrix,
} from "../features/providers/providerComparisonUtils.js";
import { useProviderComparison } from "../features/providers/useProviders.js";
import { useToast } from "../hooks/useToast.js";

function readProviderIds(searchParams) {
  return Array.from(
    new Set(
      [
        ...searchParams.getAll("providerIds[]"),
        ...searchParams.getAll("providerIds"),
        ...(searchParams.get("ids") ?? "").split(","),
      ]
        .flatMap((value) => String(value ?? "").split(","))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ).slice(0, 4);
}

function ComparisonSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card className="rounded-3xl" key={index} padding="lg">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="grid flex-1 gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Skeleton className="mt-5 h-28 rounded-2xl" />
          <Skeleton className="mt-5 h-32 rounded-2xl" />
        </Card>
      ))}
    </div>
  );
}

export function ProviderCompare() {
  const [searchParams] = useSearchParams();
  const {
    clearComparison,
    removeProvider,
    saveComparison,
    selectedIds,
    selectedProviders,
  } = useProviderComparisonState();
  const { showToast } = useToast();
  const queryProviderIds = useMemo(() => readProviderIds(searchParams), [searchParams]);
  const providerIds = queryProviderIds.length ? queryProviderIds : selectedIds;
  const comparisonQuery = useProviderComparison(providerIds, {
    enabled: providerIds.length >= 2,
  });
  const liveProviders = comparisonQuery.data?.items ?? [];
  const providers = liveProviders.length ? liveProviders : selectedProviders;
  const matrix = useMemo(() => buildDecisionMatrix(providers), [providers]);
  const summary = useMemo(() => buildComparisonSummary(providers, matrix), [matrix, providers]);

  function handleSaveComparison() {
    const result = saveComparison(providers);

    showToast({
      message: result.message,
      type: result.ok ? "success" : "error",
    });
  }

  return (
    <section className="min-w-0 bg-[#F8F4FF] py-8 text-[#07030D] sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto grid max-w-7xl gap-6 pb-20">
          <section className="rounded-[2rem] border border-[#7C3AED]/16 bg-[linear-gradient(135deg,#ffffff,#F8F4FF)] p-6 shadow-[0_24px_80px_rgba(31,14,54,0.08)] md:p-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
                  Provider comparison engine
                </p>
                <h1 className="mt-3 break-words text-4xl font-black tracking-normal text-[#07030D] md:text-5xl">
                  Compare providers by proof-backed signals.
                </h1>
                <p className="mt-4 max-w-3xl text-sm font-semibold leading-6 text-[#6F657C]">
                  Review public proof score, completed outcomes, availability, outcome offers,
                  skills, categories, and reputation signals side-by-side.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Button as="a" href={ROUTES.PROVIDERS} variant="outline">
                  <Search aria-hidden="true" className="mr-2 h-4 w-4" />
                  Explore Providers
                </Button>
                <Button
                  disabled={providers.length < 2}
                  onClick={handleSaveComparison}
                  type="button"
                  variant="secondary"
                >
                  <Bookmark aria-hidden="true" className="mr-2 h-4 w-4" />
                  Save Comparison
                </Button>
              </div>
            </div>
          </section>

          {providerIds.length < 2 ? (
            <EmptyState
              actionHref={ROUTES.PROVIDERS}
              actionText="Select Providers"
              description="Choose at least 2 providers from discovery or public profiles to open a proof-backed comparison."
              icon={Scale}
              title="Select at least 2 providers to compare"
              variant="spotlight"
            />
          ) : null}

          {providerIds.length >= 2 && comparisonQuery.isLoading ? <ComparisonSkeleton /> : null}

          {providerIds.length >= 2 && comparisonQuery.isError ? (
            <EmptyState
              actionText="Retry"
              description="Something went wrong while loading public provider comparison data. Try again."
              icon={BarChart3}
              onAction={() => comparisonQuery.refetch()}
              title="Could not load comparison"
              variant="bordered"
            />
          ) : null}

          {providerIds.length >= 2 && !comparisonQuery.isLoading && !comparisonQuery.isError && providers.length < 2 ? (
            <EmptyState
              actionHref={ROUTES.PROVIDERS}
              actionText="Explore Providers"
              description="Some selected providers may be private, inactive, or no longer discoverable."
              icon={Scale}
              title="Not enough public providers to compare"
              variant="bordered"
            />
          ) : null}

          {providers.length >= 2 ? (
            <>
              <Card className="rounded-3xl" padding="lg">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
                  Comparison summary
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-normal text-[#07030D]">
                  What stands out
                </h2>
                {summary.length ? (
                  <ul className="mt-4 grid gap-3">
                    {summary.map((item) => (
                      <li
                        className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] px-4 py-3 text-sm font-semibold leading-6 text-[#493C5E]"
                        key={item}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm font-semibold leading-6 text-[#6F657C]">
                    Summary highlights will appear when comparable public proof and offer data is available.
                  </p>
                )}
              </Card>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {providers.map((provider) => (
                  <ProviderComparisonCard
                    key={getProviderCompareId(provider)}
                    provider={provider}
                  />
                ))}
              </div>

              <ProviderDecisionMatrix providers={providers} />

              <Card className="rounded-3xl" padding="lg">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
                    Side-by-side matrix
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-normal text-[#07030D]">
                    Provider decision table
                  </h2>
                </div>
                <ProviderComparisonTable providers={providers} />
              </Card>
            </>
          ) : null}
        </div>
      </Container>

      <ProviderCompareTray
        onClear={clearComparison}
        onCompare={() => window.scrollTo({ behavior: "smooth", top: 0 })}
        onRemove={removeProvider}
        providers={selectedProviders}
      />
    </section>
  );
}
