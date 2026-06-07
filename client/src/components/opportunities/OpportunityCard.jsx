import { Archive, Eye } from "lucide-react";
import {
  OPPORTUNITY_STAGE_UPDATE_OPTIONS,
  formatOpportunityValue,
} from "../../features/opportunities/opportunityUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Select } from "../ui/Select.jsx";
import {
  OpportunityPriorityBadge,
  OpportunitySourceBadge,
  OpportunityStageBadge,
} from "./OpportunityStageBadge.jsx";

export function OpportunityCard({
  isArchiving = false,
  isUpdatingStage = false,
  onArchive,
  onStageChange,
  onView,
  opportunity,
}) {
  const challengeTitle = opportunity?.challenge?.title || "No challenge linked";
  const nextAction = opportunity?.nextAction ?? {};

  return (
    <Card as="article" className="grid h-full gap-4" padding="sm" variant="bordered">
      <div className="flex flex-wrap gap-2">
        <OpportunityStageBadge stage={opportunity.stage} />
        <OpportunitySourceBadge source={opportunity.source} />
        <OpportunityPriorityBadge priority={opportunity.priority} />
      </div>
      <div>
        <h3 className="text-lg font-black tracking-normal text-[#07030D]">{opportunity.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F657C]">{opportunity.summary || challengeTitle}</p>
      </div>
      <div className="grid gap-3 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-[#6F657C]">Challenge</span>
          <span className="text-right font-black text-[#07030D]">{challengeTitle}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-[#6F657C]">Value</span>
          <span className="font-black text-[#07030D]">{formatOpportunityValue(opportunity.value)}</span>
        </div>
        {Number(opportunity.matchScore) > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[#6F657C]">Match</span>
            <span className="font-black text-[#7C3AED]">{Math.round(opportunity.matchScore)}%</span>
          </div>
        ) : null}
      </div>
      <div className="rounded-2xl border border-[#E9E2F3] bg-white p-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">Next action</p>
        <p className="mt-1 text-sm font-black text-[#07030D]">{nextAction.title || "No next action set"}</p>
        <p className="mt-1 text-xs font-bold text-[#6F657C]">
          Due {formatDate(nextAction.dueAt, { fallback: "not scheduled" })}
        </p>
      </div>
      <Select
        disabled={isUpdatingStage}
        label="Move stage"
        onChange={(event) => onStageChange?.(opportunity, event.target.value)}
        options={OPPORTUNITY_STAGE_UPDATE_OPTIONS}
        placeholder=""
        value={opportunity.stage}
      />
      <p className="text-xs font-bold text-[#6F657C]">
        Last activity {formatDate(opportunity.lastActivityAt ?? opportunity.updatedAt)}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button className="w-full sm:w-auto" onClick={() => onView?.(opportunity)} type="button" variant="secondary">
          <Eye aria-hidden="true" className="h-4 w-4" />
          View
        </Button>
        <Button className="w-full sm:w-auto" isLoading={isArchiving} onClick={() => onArchive?.(opportunity)} type="button" variant="outline">
          <Archive aria-hidden="true" className="h-4 w-4" />
          Archive
        </Button>
      </div>
    </Card>
  );
}
