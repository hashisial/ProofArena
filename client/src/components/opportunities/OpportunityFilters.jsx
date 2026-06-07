import {
  OPPORTUNITY_PRIORITY_OPTIONS,
  OPPORTUNITY_SORT_OPTIONS,
  OPPORTUNITY_SOURCE_OPTIONS,
  OPPORTUNITY_STAGE_OPTIONS,
} from "../../features/opportunities/opportunityUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

export function OpportunityFilters({ filters, onChange, onReset }) {
  function updateField(field, value) {
    onChange?.({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))_auto] lg:items-end">
      <Input
        label="Search"
        onChange={(event) => updateField("q", event.target.value)}
        placeholder="Search title, challenge, client, or note"
        type="search"
        value={filters.q ?? ""}
      />
      <Select label="Stage" onChange={(event) => updateField("stage", event.target.value)} options={OPPORTUNITY_STAGE_OPTIONS} placeholder="" value={filters.stage ?? "all"} />
      <Select label="Source" onChange={(event) => updateField("source", event.target.value)} options={OPPORTUNITY_SOURCE_OPTIONS} placeholder="" value={filters.source ?? "all"} />
      <Select label="Priority" onChange={(event) => updateField("priority", event.target.value)} options={OPPORTUNITY_PRIORITY_OPTIONS} placeholder="" value={filters.priority ?? "all"} />
      <Select label="Sort" onChange={(event) => updateField("sort", event.target.value)} options={OPPORTUNITY_SORT_OPTIONS} placeholder="" value={filters.sort ?? "last_activity"} />
      <Button onClick={onReset} type="button" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
