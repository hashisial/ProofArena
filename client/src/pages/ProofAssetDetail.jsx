import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ProofAssetForm } from "../components/proof/ProofAssetForm.jsx";
import { ProofAssetPreview } from "../components/proof/ProofAssetPreview.jsx";
import { ProofQualityChecklist } from "../components/proof/ProofQualityChecklist.jsx";
import { ProofAssetStatusBadge } from "../components/proof/ProofAssetStatusBadge.jsx";
import { ProofUsageSummary } from "../components/proof/ProofUsageSummary.jsx";
import { ProofAssetVisibilityBadge } from "../components/proof/ProofAssetVisibilityBadge.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { Modal } from "../components/ui/Modal.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  PROOF_ASSET_TYPE_LABELS,
  PROOF_SOURCE_TYPE_LABELS,
  buildProofAssetPayload,
  getProofAssetApiErrorMessage,
} from "../features/proofAssets/proofAssetUtils.js";
import {
  useDeleteProofAsset,
  useProofAsset,
  useUpdateProofAsset,
} from "../features/proofAssets/useProofAssets.js";
import { formatDate } from "../utils/formatDate.js";
import { getProofUsageSummary } from "../utils/proofReadiness.js";

function ChipList({ emptyText = "None added", items = [] }) {
  const visibleItems = items.filter(Boolean);

  if (visibleItems.length === 0) {
    return <p className="text-sm leading-6 text-[#78716C]">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {visibleItems.map((item) => (
        <Badge key={item} size="sm" variant="primary">
          {item}
        </Badge>
      ))}
    </div>
  );
}

function ContextRow({ label, values = [] }) {
  const count = values.length;

  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
      <p className="text-sm font-black text-[#1C1917]">{label}</p>
      <p className="mt-1 text-sm text-[#78716C]">{count} linked {count === 1 ? "item" : "items"}</p>
    </div>
  );
}

const visibilityDescriptions = {
  private: "Only you can access this asset. It will not appear on public trust surfaces.",
  public: "This asset is prepared for public trust surfaces when those surfaces support proof display.",
  unlisted: "This asset is shareable by direct context without being broadly listed.",
};

export function ProofAssetDetail() {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const assetQuery = useProofAsset(assetId);
  const updateMutation = useUpdateProofAsset();
  const deleteMutation = useDeleteProofAsset();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const asset = assetQuery.data;

  async function handleSubmit(form) {
    const payload = buildProofAssetPayload(form);
    setFormError("");

    try {
      await updateMutation.mutateAsync({ id: asset.id, payload });
      setIsEditOpen(false);
    } catch (error) {
      setFormError(getProofAssetApiErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!asset?.id || !window.confirm("Delete this proof asset?")) {
      return;
    }

    await deleteMutation.mutateAsync(asset.id);
    navigate(ROUTES.PROOF_VAULT);
  }

  if (assetQuery.isLoading) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-32" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (assetQuery.isError) {
    return (
      <Card padding="lg" variant="bordered">
        <Badge variant="red">Could not load proof asset</Badge>
        <h1 className="mt-3 text-2xl font-black text-[#1C1917]">Proof asset unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          {getProofAssetApiErrorMessage(assetQuery.error, "Proof asset could not be loaded.")}
        </p>
        <Button as={Link} className="mt-5" to={ROUTES.PROOF_VAULT} variant="secondary">
          Back to Proof Vault
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <>
            <Button onClick={() => setIsEditOpen(true)} type="button" variant="secondary">
              <Pencil aria-hidden="true" className="h-4 w-4" />
              Edit
            </Button>
            <Button isLoading={deleteMutation.isPending} onClick={handleDelete} type="button" variant="outline">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete
            </Button>
          </>
        }
        backFallback={ROUTES.PROOF_VAULT}
        description={asset.description || "Reusable proof asset for future offers, execution plans, and proof submissions."}
        eyebrow="Proof asset"
        showBack
        title={asset.title}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-6">
          <Card padding="lg" variant="bordered">
            <div className="flex flex-wrap gap-2">
              <ProofAssetStatusBadge status={asset.verificationStatus} />
              <ProofAssetVisibilityBadge visibility={asset.visibility} />
              <Badge variant="outline">{PROOF_ASSET_TYPE_LABELS[asset.assetType] ?? "Proof"}</Badge>
              <Badge variant="gray">{PROOF_SOURCE_TYPE_LABELS[asset.sourceType] ?? "Source"}</Badge>
            </div>
            <CardContent>
              <ProofAssetPreview asset={asset} />
            </CardContent>
          </Card>

          <ProofQualityChecklist asset={asset} />

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Related proof context</CardTitle>
              <CardDescription>Skills, tools, industries, and tags used to find this asset later.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div>
                <p className="mb-2 text-sm font-black text-[#1C1917]">Related skills</p>
                <ChipList items={asset.relatedSkills} />
              </div>
              <div>
                <p className="mb-2 text-sm font-black text-[#1C1917]">Related tools</p>
                <ChipList items={asset.relatedTools} />
              </div>
              <div>
                <p className="mb-2 text-sm font-black text-[#1C1917]">Related industries</p>
                <ChipList items={asset.relatedIndustries} />
              </div>
              <div>
                <p className="mb-2 text-sm font-black text-[#1C1917]">Tags</p>
                <ChipList items={asset.tags} />
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Linked contexts</CardTitle>
              <CardDescription>Track where this asset is already used. Attachment editing remains a workflow foundation.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <ContextRow label="Outcome offers" values={asset.linkedContexts?.outcomeOfferIds ?? []} />
              <ContextRow label="Execution plans" values={asset.linkedContexts?.executionPlanIds ?? []} />
              <ContextRow label="Challenges" values={asset.linkedContexts?.challengeIds ?? []} />
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <Card variant="muted">
            <CardHeader>
              <CardTitle className="text-lg">Asset status</CardTitle>
              <CardDescription>Private by default. Public and unlisted assets can be reused in public trust surfaces later.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3">
                <span className="text-sm font-bold text-[#78716C]">Created</span>
                <span className="text-sm font-black text-[#1C1917]">{formatDate(asset.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3">
                <span className="text-sm font-bold text-[#78716C]">Updated</span>
                <span className="text-sm font-black text-[#1C1917]">{formatDate(asset.updatedAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3">
                <span className="text-sm font-bold text-[#78716C]">Views</span>
                <span className="text-sm font-black text-[#1C1917]">{Number(asset.stats?.views ?? 0)}</span>
              </div>
            </CardContent>
          </Card>

          <ProofUsageSummary compact usage={getProofUsageSummary([asset])} />

          <Card variant="bordered">
            <CardHeader>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
                <ShieldCheck aria-hidden="true" className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Visibility and verification</CardTitle>
              <CardDescription>Keep sharing intentional and treat verification as a server-controlled trust signal.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4 text-sm leading-6 text-[#44403C]">
                {visibilityDescriptions[asset.visibility] ?? visibilityDescriptions.private}
              </p>
              <p className="rounded-2xl border border-[#E7E5E4] bg-white p-4 text-sm leading-6 text-[#78716C]">
                Verification status: <span className="font-black text-[#1C1917]">{asset.verificationStatus === "verified" ? "Verified" : "Not verified yet"}</span>. A future review workflow will manage verification without exposing internal notes.
              </p>
            </CardContent>
            <CardFooter>
              <Button as={Link} to={ROUTES.PROOF_VAULT} variant="secondary">
                Back to Proof Vault
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>

      <Modal
        description="Update title, source, tags, category, and visibility. Verification remains server-controlled."
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        size="xl"
        title="Edit Proof Asset"
      >
        <ProofAssetForm
          asset={asset}
          error={formError}
          isSubmitting={updateMutation.isPending}
          key={asset.id}
          onCancel={() => setIsEditOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
