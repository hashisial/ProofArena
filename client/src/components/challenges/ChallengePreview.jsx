import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import {
  formatChallengeBudget,
  formatChallengeTimeline,
  formToChallengePayload,
  splitList,
} from "../../features/challenges/challengeUtils.js";
import { ChallengeStatusBadge, ChallengeVisibilityBadge } from "./ChallengeStatusBadge.jsx";

function getPreviewChallenge({ challenge, form }) {
  return form ? formToChallengePayload(form) : challenge ?? {};
}

export function ChallengePreview({ challenge, form }) {
  const preview = getPreviewChallenge({ challenge, form });
  const skills = preview.skillsNeeded ?? splitList(form?.skillsNeededText);
  const tools = preview.toolsNeeded ?? splitList(form?.toolsNeededText);
  const proofItems = preview.proofRequirements ?? [];

  return (
    <Card className="lg:sticky lg:top-24" padding="md" variant="elevated">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Provider preview</Badge>
          <ChallengeStatusBadge status={challenge?.status ?? "draft"} />
          <ChallengeVisibilityBadge visibility={preview.visibility ?? "public"} />
        </div>
        <CardTitle className="text-2xl">
          {preview.title || "Clean 500 leads and upload them into CRM weekly"}
        </CardTitle>
        <CardDescription>
          {preview.shortSummary || "A concise summary of the measurable outcome, proof requirements, and timeline."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A16207]">Target outcome</p>
          <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">
            {preview.targetOutcome?.outcomeStatement || "Define a measurable outcome providers can plan for and prove."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Timeline</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatChallengeTimeline(preview.timeline)}</p>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-white p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Budget</p>
            <p className="mt-1 text-sm font-black text-[#1C1917]">{formatChallengeBudget(preview.budget)}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">Proof required</p>
          <div className="flex flex-wrap gap-2">
            {proofItems.length > 0 ? proofItems.slice(0, 5).map((item) => (
              <Badge key={`${item.title}-${item.proofType}`} variant="green">
                {item.title}
              </Badge>
            )) : <Badge variant="gray">Add proof requirements</Badge>}
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
          <p className="text-sm font-bold text-[#365314]">Provider action preview</p>
          <span className="rounded-full bg-[#3F6212] px-4 py-2 text-center text-sm font-black text-white">
            Submit execution plan
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
