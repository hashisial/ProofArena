import { LayoutGrid, ListFilter, TableProperties, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Viewed", value: "viewed" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
  { label: "Archived", value: "archived" },
];

const scoreOptions = [
  { label: "Any plan score", value: "all" },
  { label: "90-100", value: "90_plus" },
  { label: "70-89", value: "70_89" },
  { label: "40-69", value: "40_69" },
  { label: "Under 40", value: "under_40" },
];

const dateOptions = [
  { label: "Any submitted date", value: "all" },
  { label: "Last 30 days", value: "last_30" },
  { label: "Last 90 days", value: "last_90" },
  { label: "Last year", value: "last_year" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Highest plan score", value: "score" },
  { label: "Shortlisted first", value: "shortlisted" },
  { label: "Accepted first", value: "accepted" },
  { label: "Needs improvement", value: "needs_improvement" },
];

export function ProviderPlanFilters({
  activeFilterCount,
  categoryOptions,
  filters,
  onChange,
  onClear,
  onViewModeChange,
  viewMode,
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  function updateFilter(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Card padding="md" variant="bordered">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <Input
            label="Search plans"
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search plan, challenge, or category"
            type="search"
            value={filters.search}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            aria-expanded={filtersOpen}
            className="md:hidden"
            onClick={() => setFiltersOpen((current) => !current)}
            type="button"
            variant="secondary"
          >
            <ListFilter aria-hidden="true" className="mr-2 h-4 w-4" />
            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
          </Button>
          <Button
            aria-label="Show plans as cards"
            aria-pressed={viewMode === "cards"}
            onClick={() => onViewModeChange("cards")}
            title="Card view"
            type="button"
            variant={viewMode === "cards" ? "primary" : "secondary"}
          >
            <LayoutGrid aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Show plans as table"
            aria-pressed={viewMode === "table"}
            onClick={() => onViewModeChange("table")}
            title="Table view"
            type="button"
            variant={viewMode === "table" ? "primary" : "secondary"}
          >
            <TableProperties aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className={`${filtersOpen ? "grid" : "hidden"} mt-5 gap-4 md:grid md:grid-cols-2 xl:grid-cols-5`}>
        <Select label="Status" onChange={(event) => updateFilter("status", event.target.value)} options={statusOptions} placeholder="" value={filters.status} />
        <Select label="Challenge category" onChange={(event) => updateFilter("category", event.target.value)} options={categoryOptions} placeholder="" value={filters.category} />
        <Select label="Plan score" onChange={(event) => updateFilter("scoreRange", event.target.value)} options={scoreOptions} placeholder="" value={filters.scoreRange} />
        <Select label="Submitted date" onChange={(event) => updateFilter("dateRange", event.target.value)} options={dateOptions} placeholder="" value={filters.dateRange} />
        <Select label="Sort plans" onChange={(event) => updateFilter("sort", event.target.value)} options={sortOptions} placeholder="" value={filters.sort} />
      </div>
      {activeFilterCount > 0 ? (
        <Button className="mt-4" onClick={onClear} type="button" variant="outline">
          <X aria-hidden="true" className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      ) : null}
    </Card>
  );
}
