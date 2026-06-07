import { Select } from "../ui/Select.jsx";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Proof Score", value: "proof_score" },
  { label: "Completed Outcomes", value: "completed_outcomes" },
  { label: "Availability", value: "availability" },
  { label: "Newest", value: "newest" },
];

export function ProviderSortSelect({ onChange, value }) {
  return (
    <Select
      id="provider-sort"
      label="Sort providers"
      onChange={(event) => onChange(event.target.value)}
      options={sortOptions}
      placeholder=""
      value={value}
    />
  );
}
