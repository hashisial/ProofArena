import { Filter, LayoutGrid, Table2 } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
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
  { label: "Any score", value: "0" },
  { label: "70+ plan score", value: "70" },
  { label: "80+ plan score", value: "80" },
  { label: "90+ plan score", value: "90" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Highest plan score", value: "highest_score" },
  { label: "Lowest price", value: "lowest_price" },
  { label: "Fastest timeline", value: "fastest_timeline" },
  { label: "Shortlisted first", value: "shortlisted_first" },
];

export function ExecutionPlanFilters({
  activeFilterCount = 0,
  filters,
  onChange,
  onClear,
  resultCount = 0,
  totalCount = 0,
  viewMode = "cards",
}) {
  function updateFilter(key, value) {
    onChange?.({ ...filters, [key]: value });
  }

  return (
    <Card padding="md" variant="bordered">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge leftIcon={<Filter className="h-3.5 w-3.5" />} variant="primary">
                Filters
              </Badge>
              {activeFilterCount > 0 ? <Badge variant="outline">{activeFilterCount} active</Badge> : null}
            </div>
            <p className="mt-2 text-sm font-bold text-[#6F657C]">
              Showing {resultCount} of {totalCount} execution plans
            </p>
          </div>
          <Button className="w-full sm:w-auto" disabled={activeFilterCount === 0} onClick={onClear} type="button" variant="secondary">
            Clear filters
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(11rem,0.75fr)_minmax(11rem,0.75fr)_minmax(12rem,0.8fr)]">
          <Input
            label="Search plans"
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search provider, approach, proof plan, tools..."
            type="search"
            value={filters.q}
          />
          <Select
            label="Status"
            onChange={(event) => updateFilter("status", event.target.value)}
            options={statusOptions}
            placeholder=""
            value={filters.status}
          />
          <Select
            label="Minimum score"
            onChange={(event) => updateFilter("minPlanScore", event.target.value)}
            options={scoreOptions}
            placeholder=""
            value={filters.minPlanScore}
          />
          <Select
            label="Sort"
            onChange={(event) => updateFilter("sort", event.target.value)}
            options={sortOptions}
            placeholder=""
            value={filters.sort}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            aria-pressed={viewMode === "cards"}
            onClick={() => updateFilter("viewMode", "cards")}
            type="button"
            variant={viewMode === "cards" ? "primary" : "secondary"}
          >
            <LayoutGrid aria-hidden="true" className="mr-2 h-4 w-4" />
            Card View
          </Button>
          <Button
            aria-pressed={viewMode === "comparison"}
            onClick={() => updateFilter("viewMode", "comparison")}
            type="button"
            variant={viewMode === "comparison" ? "primary" : "secondary"}
          >
            <Table2 aria-hidden="true" className="mr-2 h-4 w-4" />
            Comparison View
          </Button>
        </div>
      </div>
    </Card>
  );
}
