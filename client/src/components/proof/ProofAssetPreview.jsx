import { ExternalLink, FileText } from "lucide-react";
import { formatFileSize } from "../../utils/formatFileSize.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

export function ProofAssetPreview({ asset }) {
  if (!asset) {
    return null;
  }

  if (asset.sourceType === "link") {
    return (
      <Card padding="md" variant="muted">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">Link proof</p>
        <p className="mt-2 break-words text-lg font-black text-[#1C1917]">{asset.link?.label || asset.title}</p>
        <p className="mt-2 break-all text-sm leading-6 text-[#78716C]">{asset.link?.url}</p>
        {asset.link?.url ? (
          <Button as="a" className="mt-4" href={asset.link.url} rel="noreferrer" target="_blank" variant="outline">
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
            Open Link
          </Button>
        ) : null}
      </Card>
    );
  }

  if (asset.sourceType === "text") {
    return (
      <Card padding="md" variant="muted">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">Text proof</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#44403C]">
          {asset.textProof?.content || "No text proof content saved."}
        </p>
      </Card>
    );
  }

  return (
    <Card padding="md" variant="muted">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#3F6212]">
          <FileText aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="font-black text-[#1C1917]">{asset.file?.originalName || asset.file?.filename || "File proof"}</p>
          <p className="mt-1 text-sm text-[#78716C]">{formatFileSize(asset.file?.sizeBytes)}</p>
        </div>
      </div>
    </Card>
  );
}
