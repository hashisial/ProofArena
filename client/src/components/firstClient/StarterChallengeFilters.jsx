import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Button } from "../ui/Button.jsx";

const levelOptions = Object.freeze([
  { label: "All levels", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Easy", value: "easy" },
  { label: "Standard", value: "standard" },
]);

const sortOptions = Object.freeze([
  { label: "Starter level", value: "level" },
  { label: "Newest", value: "newest" },
  { label: "Best match signal", value: "best_match" },
  { label: "Budget low", value: "budget_low" },
  { label: "Budget high", value: "budget_high" },
]);

export function StarterChallengeFilters({ filters, onChange, onReset }) {
  function updateField(field, value) {
    onChange?.({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6 xl:items-end">
      <Select
        label="Level"
        onChange={(event) => updateField("level", event.target.value)}
        options={levelOptions}
        placeholder=""
        value={filters.level}
      />
      <Input
        label="Category"
        onChange={(event) => updateField("category", event.target.value)}
        placeholder="CRM automation"
        value={filters.category}
      />
      <Input
        label="Minimum budget"
        min="0"
        onChange={(event) => updateField("minBudget", event.target.value)}
        placeholder="250"
        type="number"
        value={filters.minBudget}
      />
      <Input
        label="Maximum budget"
        min="0"
        onChange={(event) => updateField("maxBudget", event.target.value)}
        placeholder="1000"
        type="number"
        value={filters.maxBudget}
      />
      <Select
        label="Sort"
        onChange={(event) => updateField("sort", event.target.value)}
        options={sortOptions}
        placeholder=""
        value={filters.sort}
      />
      <Button className="w-full" onClick={onReset} type="button" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
