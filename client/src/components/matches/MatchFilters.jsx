import { MATCH_SCORE_OPTIONS, MATCH_SORT_OPTIONS, MATCH_STATUS_OPTIONS } from "../../features/matches/matchUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

export function MatchFilters({ filters, onChange, onReset }) {
  function updateField(field, value) {
    onChange?.({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_10rem_10rem_12rem_auto] lg:items-end">
      <Input
        label="Category"
        onChange={(event) => updateField("category", event.target.value)}
        placeholder="CRM Automation, Lead Generation..."
        value={filters.category ?? ""}
      />
      <Select
        label="Status"
        onChange={(event) => updateField("status", event.target.value)}
        options={MATCH_STATUS_OPTIONS}
        placeholder=""
        value={filters.status ?? "all"}
      />
      <Select
        label="Min score"
        onChange={(event) => updateField("minScore", event.target.value)}
        options={MATCH_SCORE_OPTIONS}
        placeholder=""
        value={filters.minScore ?? ""}
      />
      <Select
        label="Sort"
        onChange={(event) => updateField("sort", event.target.value)}
        options={MATCH_SORT_OPTIONS}
        placeholder=""
        value={filters.sort ?? "best"}
      />
      <Button onClick={onReset} type="button" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
