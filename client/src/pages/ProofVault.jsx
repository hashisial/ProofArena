import { Link, useSearchParams } from "react-router-dom";
import { Gauge, Layers3, LayoutGrid, PackagePlus, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ProofAssetCard } from "../components/proof/ProofAssetCard.jsx";
import { ProofCategoryCoverage } from "../components/proof/ProofCategoryCoverage.jsx";
import { ProofAssetFilters } from "../components/proof/ProofAssetFilters.jsx";
import { ProofAssetForm } from "../components/proof/ProofAssetForm.jsx";
import { ProofGapAnalysis } from "../components/proof/ProofGapAnalysis.jsx";
import { ProofReadinessScore } from "../components/proof/ProofReadinessScore.jsx";
import { ProofUsageSummary } from "../components/proof/ProofUsageSummary.jsx";
import { ProofVaultEmptyState } from "../components/proof/ProofVaultEmptyState.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  buildProofAssetPayload,
  getProofAssetApiErrorMessage,
} from "../features/proofAssets/proofAssetUtils.js";
import {
  useCreateProofAsset,
  useDeleteProofAsset,
  useMyProofAssets,
  useUpdateProofAsset,
} from "../features/proofAssets/useProofAssets.js";
import { useMyExecutionPlans } from "../features/executionPlans/useExecutionPlans.js";
import { useMyOutcomeOffers } from "../features/outcomeOffers/useOutcomeOffers.js";
import { useMyProfile } from "../features/profile/useProfile.js";
import { calculateProofReadiness } from "../utils/proofReadiness.js";

const defaultFilters = {
  assetType: "all",
  category: "",
  q: "",
  sort: "newest",
  sourceType: "all",
  verificationStatus: "all",
  visibility: "all",
};

function StatCard({ label, value }) {
  return (
    <Card padding="sm" variant="muted">
      <p className="text-sm font-bold text-[#78716C]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#1C1917]">{value}</p>
    </Card>
  );
}

const TABS = [
  { icon: LayoutGrid, label: "Assets", value: "assets" },
  { icon: Gauge, label: "Readiness", value: "readiness" },
  { icon: Layers3, label: "Coverage", value: "coverage" },
];

export function ProofVault() {
  const [searchParams, setSearchParams] = useSearchParams();
  const shouldOpenNewAssetForm = searchParams.get("new") === "1";
  const requestedTab = searchParams.get("tab") ?? "assets";
  const activeTab = TABS.some((tab) => tab.value === requestedTab) ? requestedTab : "assets";
  const [filters, setFilters] = useState(defaultFilters);
  const [isFormOpen, setIsFormOpen] = useState(() => shouldOpenNewAssetForm);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const assetsQuery = useMyProofAssets(filters);
  const readinessAssetsQuery = useMyProofAssets({ limit: 50, sort: "newest" });
  const offersQuery = useMyOutcomeOffers({ limit: 50, sort: "newest" });
  const plansQuery = useMyExecutionPlans({ limit: 50, sort: "newest" });
  const profileQuery = useMyProfile();
  const createMutation = useCreateProofAsset();
  const updateMutation = useUpdateProofAsset();
  const deleteMutation = useDeleteProofAsset();
  const assets = useMemo(() => assetsQuery.data?.items ?? [], [assetsQuery.data?.items]);
  const readinessAssets = useMemo(() => readinessAssetsQuery.data?.items ?? [], [readinessAssetsQuery.data?.items]);
  const offers = useMemo(() => offersQuery.data?.items ?? [], [offersQuery.data?.items]);
  const plans = useMemo(() => plansQuery.data?.items ?? [], [plansQuery.data?.items]);
  const readiness = useMemo(() => calculateProofReadiness({
    assets: readinessAssets,
    offers,
    plans,
    profileData: profileQuery.data ?? {},
  }), [offers, plans, profileQuery.data, readinessAssets]);
  const stats = readiness.usage;
  const readinessQueries = [readinessAssetsQuery, offersQuery, plansQuery, profileQuery];
  const readinessLoading = readinessQueries.some((query) => query.isLoading);
  const readinessError = readinessQueries.some((query) => query.isError);
  const readinessMetric = (value) => readinessLoading ? "Loading..." : readinessError ? "Not available" : value;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  function openCreateForm() {
    setEditingAsset(null);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(asset) {
    setEditingAsset(asset);
    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSubmitting) return;
    setIsFormOpen(false);
    setEditingAsset(null);
    setFormError("");
  }

  async function handleSubmit(form) {
    const payload = buildProofAssetPayload(form);
    setFormError("");

    try {
      if (editingAsset?.id) {
        await updateMutation.mutateAsync({ id: editingAsset.id, payload });
        setNotice("Proof asset updated.");
      } else {
        await createMutation.mutateAsync(payload);
        setNotice("Proof asset saved.");
      }
      closeForm();
    } catch (error) {
      setFormError(getProofAssetApiErrorMessage(error));
    }
  }

  async function handleDelete(asset) {
    if (!asset?.id || !window.confirm("Delete this proof asset?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(asset.id);
      setNotice("Proof asset deleted.");
    } catch (error) {
      setNotice(getProofAssetApiErrorMessage(error, "Proof asset could not be deleted."));
    }
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  function selectTab(tab) {
    const nextParams = new URLSearchParams(searchParams);
    if (tab === "assets") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <>
            <Button as={Link} to={ROUTES.NEW_OUTCOME_OFFER} variant="secondary">
              <PackagePlus aria-hidden="true" className="h-4 w-4" />
              Create Outcome Offer
            </Button>
            <Button onClick={openCreateForm} type="button">
              <ShieldCheck aria-hidden="true" className="h-4 w-4" />
              Add Proof Asset
            </Button>
          </>
        }
        description="Organize reusable proof assets and strengthen your credibility before applying to challenges."
        eyebrow="Provider trust system"
        title="Proof Vault"
      />

      {notice ? (
        <Card padding="sm" variant="muted">
          <p className="text-sm font-bold text-[#3F6212]">{notice}</p>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total assets" value={readinessMetric(readinessAssetsQuery.data?.pagination?.total ?? stats.total)} />
        <StatCard label="Shareable assets" value={readinessMetric(stats.shareable)} />
        <StatCard label="Used in workflows" value={readinessMetric(stats.attached)} />
        <StatCard label="Readiness score" value={readinessMetric(`${readiness.score}/100`)} />
      </div>

      <div aria-label="Proof Vault sections" className="grid grid-cols-3 gap-2 rounded-2xl border border-[#E7E5E4] bg-white p-2" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              aria-controls={`proof-${tab.value}-panel`}
              aria-selected={isActive}
              className={`flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl px-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#3F6212]/15 ${
                isActive ? "bg-[#3F6212] text-white" : "bg-[#FFFBEB] text-[#44403C] hover:bg-[#F7FEE7]"
              }`}
              id={`proof-${tab.value}-tab`}
              key={tab.value}
              onClick={() => selectTab(tab.value)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "assets" ? (
        <div aria-labelledby="proof-assets-tab" className="grid gap-6" id="proof-assets-panel" role="tabpanel">
          <Card padding="md" variant="bordered">
            <ProofAssetFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
          </Card>

          {assetsQuery.isError ? (
            <Card padding="lg" variant="bordered">
              <Badge variant="red">Could not load proof assets</Badge>
              <h2 className="mt-3 text-2xl font-black text-[#1C1917]">Proof Vault unavailable</h2>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                {getProofAssetApiErrorMessage(assetsQuery.error, "Proof assets could not be loaded.")}
              </p>
              <Button className="mt-5" onClick={() => assetsQuery.refetch()} type="button">Retry</Button>
            </Card>
          ) : null}

          {assetsQuery.isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((item) => <Skeleton className="h-96" key={item} />)}
            </div>
          ) : null}

          {!assetsQuery.isLoading && !assetsQuery.isError && assets.length === 0 ? (
            <ProofVaultEmptyState onAdd={openCreateForm} />
          ) : null}

          {!assetsQuery.isLoading && !assetsQuery.isError && assets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {assets.map((asset) => (
                <ProofAssetCard
                  asset={asset}
                  isDeleting={deleteMutation.isPending}
                  key={asset.id}
                  onDelete={handleDelete}
                  onEdit={openEditForm}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTab === "readiness" ? (
        <div aria-labelledby="proof-readiness-tab" className="grid gap-6" id="proof-readiness-panel" role="tabpanel">
          {readinessLoading ? (
            <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)]">
              <Skeleton className="h-[32rem]" />
              <Skeleton className="h-[32rem]" />
            </div>
          ) : readinessError ? (
            <Card padding="lg" variant="bordered">
              <Badge variant="red">Could not calculate proof readiness</Badge>
              <p className="mt-3 text-sm leading-6 text-[#78716C]">Some Proof Vault, offer, plan, or profile data could not be loaded.</p>
              <Button className="mt-5" onClick={() => readinessQueries.filter((query) => query.isError).forEach((query) => query.refetch())} type="button">Retry</Button>
            </Card>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-[24rem_minmax(0,1fr)] xl:items-start">
                <ProofReadinessScore readiness={readiness} />
                <ProofGapAnalysis readiness={readiness} />
              </div>
              <ProofUsageSummary usage={readiness.usage} />
            </>
          )}
        </div>
      ) : null}

      {activeTab === "coverage" ? (
        <div aria-labelledby="proof-coverage-tab" className="grid gap-6" id="proof-coverage-panel" role="tabpanel">
          {readinessLoading ? (
            <Skeleton className="h-[32rem]" />
          ) : readinessError ? (
            <Card padding="lg" variant="bordered">
              <Badge variant="red">Could not calculate proof coverage</Badge>
              <p className="mt-3 text-sm leading-6 text-[#78716C]">Proof coverage needs current asset, profile, offer, and plan data.</p>
              <Button className="mt-5" onClick={() => readinessQueries.filter((query) => query.isError).forEach((query) => query.refetch())} type="button">Retry</Button>
            </Card>
          ) : (
            <ProofCategoryCoverage coverage={readiness.coverage} />
          )}
        </div>
      ) : null}

      <Modal
        description="Save reusable link or text proof. File uploads will be connected when storage is configured."
        isOpen={isFormOpen}
        onClose={closeForm}
        size="xl"
        title={editingAsset ? "Edit Proof Asset" : "Add Proof Asset"}
      >
        <ProofAssetForm
          asset={editingAsset}
          error={formError}
          isSubmitting={isSubmitting}
          key={editingAsset?.id ?? "create"}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
