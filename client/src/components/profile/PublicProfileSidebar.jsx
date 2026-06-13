import { Copy, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { formatCompactNumber, formatPercentage } from "../../utils/index.js";
import { ProviderProofScoreCard } from "./ProviderProofScoreCard.jsx";

function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function hasOpenTo(profile = {}) {
  return Boolean(profile.openTo?.enabled);
}

export function PublicProfileSidebar({
  onCopyProfileLink,
  profile = {},
  providerProfile = null,
  statusMessage = "",
}) {
  const provider = providerProfile ?? {};
  const verification = profile.verification ?? {};
  const isVerified =
    verification.isVerified || provider.verificationStatus === "verified";
  const completedOutcomes = getNumber(provider.completedOutcomes ?? provider.completedProjects);
  const approvalRate = getNumber(provider.approvalRate);
  const proofScore = getNumber(provider.proofScore);
  const openToEnabled = hasOpenTo(profile);

  return (
    <aside className="grid min-w-0 content-start gap-5 lg:sticky lg:top-24">
      <ProviderProofScoreCard compact providerProfile={provider} />

      <Card className="rounded-3xl" padding="md">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-[-0.03em] text-[#1C1917]">
              ProofArena trust summary
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#78716C]">
              Public proof and credibility signals available on this profile.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
            <span className="text-sm font-bold text-[#44403C]">Verification</span>
            <Badge variant={isVerified ? "green" : "gray"}>
              {isVerified ? verification.label || "Verified" : "Not verified"}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
            <span className="text-sm font-bold text-[#44403C]">Proof score</span>
            <span className="text-sm font-black text-[#1C1917]">{proofScore}/100</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
            <span className="text-sm font-bold text-[#44403C]">Completed outcomes</span>
            <span className="text-sm font-black text-[#1C1917]">
              {formatCompactNumber(completedOutcomes, { fallback: "0" })}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3">
            <span className="text-sm font-bold text-[#44403C]">Approval rate</span>
            <span className="text-sm font-black text-[#1C1917]">
              {approvalRate > 0 ? formatPercentage(approvalRate, { fallback: "0%" }) : "0%"}
            </span>
          </div>
        </div>
      </Card>

      {openToEnabled ? (
        <Card className="rounded-3xl" padding="md">
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-[-0.03em] text-[#1C1917]">
                Open to
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#44403C]">
                {profile.openTo.title || "Open to outcome challenges and collaborations"}
              </p>
            </div>
          </div>
          {profile.openTo.note ? (
            <p className="mt-4 text-sm leading-6 text-[#78716C]">{profile.openTo.note}</p>
          ) : null}
          {profile.openTo.categories?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.openTo.categories.map((category) => (
                <Badge key={category} size="sm" variant="primary">
                  {category}
                </Badge>
              ))}
            </div>
          ) : null}
        </Card>
      ) : null}

      <Card className="rounded-3xl" padding="md">
        <h2 className="text-lg font-black tracking-[-0.03em] text-[#1C1917]">
          Profile actions
        </h2>
        <div className="mt-4 grid gap-2">
          <Button onClick={onCopyProfileLink} type="button" variant="outline">
            <Copy aria-hidden="true" className="mr-2 h-4 w-4" />
            Copy profile link
          </Button>
          <Button as="a" href={ROUTES.PROVIDERS} variant="secondary">
            <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
            View providers
          </Button>
          <Button as="a" href={ROUTES.CHALLENGES} variant="secondary">
            Explore challenges
          </Button>
        </div>
        {statusMessage ? (
          <p className="mt-4 rounded-2xl border border-[#ECFCCB] bg-[#F7FEE7] px-4 py-3 text-sm font-bold text-[#365314]">
            {statusMessage}
          </p>
        ) : null}
      </Card>
    </aside>
  );
}
