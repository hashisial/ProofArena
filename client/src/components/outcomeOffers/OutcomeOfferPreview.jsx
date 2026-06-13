import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { OutcomeOfferStatusBadge, OutcomeOfferVisibilityBadge } from "./OutcomeOfferStatusBadge.jsx";
import {
  formatOfferPrice,
  formatTimeline,
  formToOutcomeOfferPayload,
  splitList,
} from "../../features/outcomeOffers/outcomeOfferUtils.js";

function getPreviewOffer({ form, offer }) {
  return form ? formToOutcomeOfferPayload(form) : offer ?? {};
}

export function OutcomeOfferPreview({ form, offer }) {
  const preview = getPreviewOffer({ form, offer });
  const skills = preview.skills ?? splitList(form?.skillsText);
  const tools = preview.tools ?? splitList(form?.toolsText);
  const proofItems = preview.proofIncluded ?? [];

  return (
    <Card className="lg:sticky lg:top-24" padding="md" variant="elevated">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Client preview</Badge>
          <OutcomeOfferStatusBadge status={offer?.status ?? "draft"} />
          <OutcomeOfferVisibilityBadge visibility={preview.visibility ?? "public"} />
        </div>
        <CardTitle className="text-2xl">
          {preview.title || "Generate 30 qualified real estate seller leads"}
        </CardTitle>
        <CardDescription>
          {preview.shortSummary || "A concise summary of the measurable result, proof included, and delivery path."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A16207]">Target outcome</p>
          <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
            {preview.targetOutcome?.outcomeStatement || "Generate a measurable outcome with proof-backed delivery."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatTimeline(preview.deliveryTimeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Price</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatOfferPrice(preview.priceRange)}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Proof included</p>
          <div className="flex flex-wrap gap-2">
            {proofItems.length > 0 ? proofItems.slice(0, 5).map((item) => (
              <Badge key={`${item.title}-${item.proofType}`} variant="green">
                {item.title}
              </Badge>
            )) : <Badge variant="gray">Add proof items</Badge>}
          </div>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Skills and tools</p>
          <div className="flex flex-wrap gap-2">
            {[...skills, ...tools].slice(0, 8).map((item) => (
              <Badge key={item} variant="outline">{item}</Badge>
            ))}
            {skills.length + tools.length === 0 ? <Badge variant="gray">Add skills and tools</Badge> : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-[#365314]">
            Client action preview
          </p>
          <span className="rounded-full bg-[#3F6212] px-4 py-2 text-center text-sm font-black text-white">
            Invite provider to challenge
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
