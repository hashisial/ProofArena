import { RotateCcw } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

const verifiedOptions = [
  { label: "Any verification", value: "" },
  { label: "Verified only", value: "true" },
  { label: "Not verified", value: "false" },
];

const availabilityOptions = [
  { label: "Any availability", value: "" },
  { label: "Available for challenges", value: "true" },
];

const sortOptions = [
  { label: "Best proof reputation", value: "proof_score" },
  { label: "Most relevant", value: "relevance" },
  { label: "Newest profiles", value: "newest" },
  { label: "Completed outcomes", value: "completed_outcomes" },
  { label: "Rating", value: "rating" },
];

export function ProviderFilters({ filters, onChange, onReset }) {
  function updateField(field) {
    return (event) => onChange(field, event.target.value);
  }

  return (
    <div className="grid min-w-0 gap-4 rounded-3xl border border-[#ECFCCB] bg-white p-4 shadow-[0_20px_60px_rgba(28, 25, 23, 0.07)] sm:p-5">
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Input
          id="provider-category-filter"
          label="Category"
          onChange={updateField("category")}
          placeholder="Automation, CRM, growth"
          value={filters.category}
        />
        <Input
          id="provider-skill-filter"
          label="Skill"
          onChange={updateField("skill")}
          placeholder="React, HubSpot, ads"
          value={filters.skill}
        />
        <Input
          id="provider-location-filter"
          label="Location"
          onChange={updateField("location")}
          placeholder="City or country"
          value={filters.location}
        />
        <Select
          id="provider-verified-filter"
          label="Verification"
          onChange={updateField("verified")}
          options={verifiedOptions}
          placeholder=""
          value={filters.verified}
        />
        <Select
          id="provider-available-filter"
          label="Availability"
          onChange={updateField("available")}
          options={availabilityOptions}
          placeholder=""
          value={filters.available}
        />
        <Select
          id="provider-sort-filter"
          label="Sort"
          onChange={updateField("sort")}
          options={sortOptions}
          placeholder=""
          value={filters.sort}
        />
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,16rem)_auto] sm:items-end">
        <Input
          id="provider-min-proof-score"
          label="Minimum proof score"
          min="0"
          max="100"
          onChange={updateField("minProofScore")}
          placeholder="Example: 60"
          type="number"
          value={filters.minProofScore}
        />
        <Button
          className="w-full sm:w-auto"
          onClick={onReset}
          type="button"
          variant="outline"
        >
          <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </div>
  );
}
