import { RotateCcw } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

const availabilityOptions = [
  { label: "Any availability", value: "" },
  { label: "Available now", value: "available_now" },
  { label: "Available this week", value: "available_this_week" },
  { label: "Available next week", value: "available_next_week" },
  { label: "Limited", value: "limited" },
  { label: "Fully booked", value: "fully_booked" },
];

const proofScoreOptions = [
  { label: "Any proof score", value: "" },
  { label: "70+", value: "70" },
  { label: "80+", value: "80" },
  { label: "90+", value: "90" },
];

const completedOutcomeOptions = [
  { label: "Any outcome count", value: "" },
  { label: "1+", value: "1" },
  { label: "5+", value: "5" },
  { label: "10+", value: "10" },
  { label: "25+", value: "25" },
];

function optionList(values = [], fallbackLabel = "Any") {
  return [
    { label: fallbackLabel, value: "" },
    ...values.slice(0, 80).map((value) => ({ label: value, value })),
  ];
}

export function ProviderFilters({
  activeFilterCount = 0,
  filterOptions = {},
  filters,
  onChange,
  onReset,
}) {
  function updateField(field) {
    return (event) => onChange(field, event.target.value);
  }

  function updateCheckbox(field) {
    return (event) => onChange(field, event.target.checked ? "true" : "");
  }

  return (
    <div className="grid min-w-0 gap-5 rounded-3xl border border-[#ECFCCB] bg-white p-4 shadow-[0_20px_60px_rgba(28,25,23,0.07)] sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">
            Filters
          </p>
          <p className="mt-1 text-sm font-semibold text-[#78716C]">
            {activeFilterCount} active filter{activeFilterCount === 1 ? "" : "s"}
          </p>
        </div>
        <Button className="min-h-10 px-4 py-2 text-xs" onClick={onReset} type="button" variant="secondary">
          <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Select
          id="provider-category-filter"
          label="Category"
          onChange={updateField("category")}
          options={optionList(filterOptions.categories, "Any category")}
          placeholder=""
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
          id="provider-tool-filter"
          label="Tool"
          onChange={updateField("tool")}
          placeholder="HubSpot, Stripe, GA4"
          value={filters.tool}
        />
        <Select
          id="provider-availability-filter"
          label="Availability"
          onChange={updateField("availability")}
          options={availabilityOptions}
          placeholder=""
          value={filters.availability}
        />
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Select
          id="provider-min-proof-score"
          label="Minimum proof score"
          onChange={updateField("minProofScore")}
          options={proofScoreOptions}
          placeholder=""
          value={filters.minProofScore}
        />
        <Select
          id="provider-min-completed-outcomes"
          label="Completed outcomes"
          onChange={updateField("minCompletedOutcomes")}
          options={completedOutcomeOptions}
          placeholder=""
          value={filters.minCompletedOutcomes}
        />
        <div className="grid gap-3">
          <Checkbox
            checked={filters.verified === "true"}
            id="provider-verified-filter"
            label="Verified only"
            onChange={updateCheckbox("verified")}
          />
          <Checkbox
            checked={filters.hasOutcomeOffers === "true"}
            id="provider-outcome-offers-filter"
            label="Has outcome offers"
            onChange={updateCheckbox("hasOutcomeOffers")}
          />
        </div>
      </div>
    </div>
  );
}
