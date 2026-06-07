import { Archive, Eye } from "lucide-react";
import {
  OPPORTUNITY_STAGE_UPDATE_OPTIONS,
  formatOpportunityValue,
} from "../../features/opportunities/opportunityUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";
import {
  OpportunityPriorityBadge,
  OpportunitySourceBadge,
  OpportunityStageBadge,
} from "./OpportunityStageBadge.jsx";

export function OpportunityTable({
  isArchiving = false,
  isUpdatingStage = false,
  onArchive,
  onStageChange,
  onView,
  opportunities = [],
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E9E2F3] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[64rem] table-auto text-left">
          <thead className="bg-[#F8F4FF] text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
            <tr>
              <th className="px-4 py-3">Opportunity</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Next action</th>
              <th className="px-4 py-3">Last activity</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E9E2F3]">
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-black text-[#07030D]">{opportunity.title}</p>
                  <p className="mt-1 text-sm text-[#6F657C]">{opportunity.challenge?.title || opportunity.client?.fullName || "Manual opportunity"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <OpportunitySourceBadge source={opportunity.source} />
                    <OpportunityPriorityBadge priority={opportunity.priority} />
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="grid gap-2">
                    <OpportunityStageBadge stage={opportunity.stage} />
                    <Select
                      disabled={isUpdatingStage}
                      label="Move stage"
                      onChange={(event) => onStageChange?.(opportunity, event.target.value)}
                      options={OPPORTUNITY_STAGE_UPDATE_OPTIONS}
                      placeholder=""
                      value={opportunity.stage}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-sm font-black text-[#07030D]">
                  {formatOpportunityValue(opportunity.value)}
                </td>
                <td className="px-4 py-4 align-top">
                  <p className="text-sm font-black text-[#07030D]">{opportunity.nextAction?.title || "No next action"}</p>
                  <p className="mt-1 text-xs font-bold text-[#6F657C]">
                    Due {formatDate(opportunity.nextAction?.dueAt, { fallback: "not scheduled" })}
                  </p>
                </td>
                <td className="px-4 py-4 align-top text-sm text-[#6F657C]">
                  {formatDate(opportunity.lastActivityAt ?? opportunity.updatedAt)}
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => onView?.(opportunity)} type="button" variant="secondary">
                      <Eye aria-hidden="true" className="h-4 w-4" />
                      View
                    </Button>
                    <Button isLoading={isArchiving} onClick={() => onArchive?.(opportunity)} type="button" variant="outline">
                      <Archive aria-hidden="true" className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
