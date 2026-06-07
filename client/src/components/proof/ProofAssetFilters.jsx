import {
  PROOF_ASSET_TYPE_OPTIONS,
  PROOF_SORT_OPTIONS,
  PROOF_SOURCE_TYPE_OPTIONS,
  PROOF_VERIFICATION_OPTIONS,
  PROOF_VISIBILITY_OPTIONS,
} from "../../features/proofAssets/proofAssetUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

const allAssetTypes = [{ label: "All asset types", value: "all" }, ...PROOF_ASSET_TYPE_OPTIONS];
const allSourceTypes = [{ label: "All source types", value: "all" }, ...PROOF_SOURCE_TYPE_OPTIONS];
const allVisibility = [{ label: "All visibility", value: "all" }, ...PROOF_VISIBILITY_OPTIONS];

export function ProofAssetFilters({ filters, onChange, onReset }) {
  function updateField(field, value) {
    onChange?.({
      ...filters,
      [field]: value,
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(6,minmax(0,1fr))_auto] lg:items-end">
      <Input
        label="Search"
        onChange={(event) => updateField("q", event.target.value)}
        placeholder="Search title, skill, tool, or tag"
        type="search"
        value={filters.q ?? ""}
      />
      <Select label="Asset type" onChange={(event) => updateField("assetType", event.target.value)} options={allAssetTypes} placeholder="" value={filters.assetType ?? "all"} />
      <Select label="Source" onChange={(event) => updateField("sourceType", event.target.value)} options={allSourceTypes} placeholder="" value={filters.sourceType ?? "all"} />
      <Select label="Visibility" onChange={(event) => updateField("visibility", event.target.value)} options={allVisibility} placeholder="" value={filters.visibility ?? "all"} />
      <Select label="Verification" onChange={(event) => updateField("verificationStatus", event.target.value)} options={PROOF_VERIFICATION_OPTIONS} placeholder="" value={filters.verificationStatus ?? "all"} />
      <Input
        label="Category"
        onChange={(event) => updateField("category", event.target.value)}
        placeholder="Lead Generation"
        value={filters.category ?? ""}
      />
      <Select label="Sort" onChange={(event) => updateField("sort", event.target.value)} options={PROOF_SORT_OPTIONS} placeholder="" value={filters.sort ?? "newest"} />
      <Button onClick={onReset} type="button" variant="secondary">
        Reset
      </Button>
    </div>
  );
}
