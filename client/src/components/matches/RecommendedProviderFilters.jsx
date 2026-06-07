import {
  MATCH_SCORE_OPTIONS,
  RECOMMENDED_PROVIDER_SORT_OPTIONS,
  RECOMMENDED_PROVIDER_STATUS_OPTIONS,
} from "../../features/matches/matchUtils.js";
import { Button } from "../ui/Button.jsx";
import { Select } from "../ui/Select.jsx";

export function RecommendedProviderFilters({ filters, onChange, onReset }) {
  function updateField(field, value) {
    onChange?.({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[12rem_10rem_12rem_auto] lg:items-end">
      <Select
        label="Status"
        onChange={(event) => updateField("status", event.target.value)}
        options={RECOMMENDED_PROVIDER_STATUS_OPTIONS}
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
        options={RECOMMENDED_PROVIDER_SORT_OPTIONS}
        placeholder=""
        value={filters.sort ?? "best"}
      />
      <Button onClick={onReset} type="button" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
