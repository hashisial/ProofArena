import { Eye, Link2, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import {
  PROOF_ASSET_TYPE_LABELS,
  PROOF_SOURCE_TYPE_LABELS,
} from "../../features/proofAssets/proofAssetUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { getProofAssetQuality, getProofAssetUsage } from "../../utils/proofReadiness.js";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ProofAssetStatusBadge } from "./ProofAssetStatusBadge.jsx";
import { ProofAssetVisibilityBadge } from "./ProofAssetVisibilityBadge.jsx";

export function ProofAssetCard({
  asset,
  isDeleting = false,
  onDelete,
  onEdit,
}) {
  const quality = getProofAssetQuality(asset);
  const usage = getProofAssetUsage(asset);
  const tags = [...(asset?.relatedSkills ?? []), ...(asset?.relatedTools ?? []), ...(asset?.tags ?? [])].slice(0, 5);

  return (
    <Card as="article" className="flex h-full flex-col" variant="bordered">
      <div className="flex flex-wrap gap-2">
        <ProofAssetStatusBadge status={asset?.verificationStatus} />
        <ProofAssetVisibilityBadge visibility={asset?.visibility} />
        <Badge variant="outline">{PROOF_ASSET_TYPE_LABELS[asset?.assetType] ?? "Proof"}</Badge>
        <Badge variant="gray">{PROOF_SOURCE_TYPE_LABELS[asset?.sourceType] ?? "Source"}</Badge>
      </div>
      <h2 className="mt-4 text-xl font-black tracking-normal text-[#07030D]">{asset?.title || "Untitled proof asset"}</h2>
      <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#6F657C]">
        {asset?.description || "No description added yet."}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Category</p>
          <p className="mt-1 text-sm font-black text-[#07030D]">{asset?.category || "Uncategorized"}</p>
        </div>
        <div className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Usage</p>
          <p className="mt-1 text-sm font-black text-[#07030D]">{usage.total} linked context{usage.total === 1 ? "" : "s"}</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-[#E9E2F3] bg-white p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Quality completeness</p>
          <p className="text-sm font-black text-[#07030D]">{quality.score}%</p>
        </div>
        <div aria-label={`Proof asset quality ${quality.score} percent`} className="mt-2 h-2 overflow-hidden rounded-full bg-[#F7F2FF]" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={quality.score}>
          <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: `${quality.score}%` }} />
        </div>
      </div>
      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} size="sm" variant="primary">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
      <p className="mt-4 text-xs font-bold text-[#6F657C]">
        Created {formatDate(asset?.createdAt, { fallback: "recently" })}
      </p>
      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:flex-wrap">
        <Button as={Link} className="w-full sm:w-auto" to={ROUTES.PROOF_ASSET_DETAIL(asset?.id)} variant="secondary">
          <Eye aria-hidden="true" className="h-4 w-4" />
          View
        </Button>
        <Button className="w-full sm:w-auto" onClick={() => onEdit?.(asset)} type="button" variant="outline">
          <Pencil aria-hidden="true" className="h-4 w-4" />
          Edit
        </Button>
        <Button as={Link} className="w-full sm:w-auto" to={`${ROUTES.PROOF_VAULT}?tab=readiness`} variant="outline">
          <Link2 aria-hidden="true" className="h-4 w-4" />
          Attach
        </Button>
        <Button className="w-full sm:w-auto" isLoading={isDeleting} onClick={() => onDelete?.(asset)} type="button" variant="secondary">
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
