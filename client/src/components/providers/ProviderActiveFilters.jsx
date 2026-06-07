import { X } from "lucide-react";
import { Button } from "../ui/Button.jsx";

const availabilityLabels = {
  available_now: "Available Now",
  available_this_week: "Available This Week",
  available_next_week: "Available Next Week",
  limited: "Limited",
  fully_booked: "Fully Booked",
};

function buildChips(filters = {}) {
  const chips = [];

  if (filters.q) {
    chips.push({ key: "q", label: `Search: ${filters.q}` });
  }

  if (filters.category) {
    chips.push({ key: "category", label: `Category: ${filters.category}` });
  }

  if (filters.skill) {
    chips.push({ key: "skill", label: `Skill: ${filters.skill}` });
  }

  if (filters.tool) {
    chips.push({ key: "tool", label: `Tool: ${filters.tool}` });
  }

  if (filters.availability) {
    chips.push({
      key: "availability",
      label: availabilityLabels[filters.availability] || `Availability: ${filters.availability}`,
    });
  }

  if (filters.minProofScore) {
    chips.push({ key: "minProofScore", label: `Proof Score: ${filters.minProofScore}+` });
  }

  if (filters.minCompletedOutcomes) {
    chips.push({ key: "minCompletedOutcomes", label: `Outcomes: ${filters.minCompletedOutcomes}+` });
  }

  if (filters.verified === "true") {
    chips.push({ key: "verified", label: "Verified" });
  }

  if (filters.hasOutcomeOffers === "true") {
    chips.push({ key: "hasOutcomeOffers", label: "Has outcome offers" });
  }

  return chips;
}

export function ProviderActiveFilters({ filters = {}, onClear, onRemove }) {
  const chips = buildChips(filters);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-3xl border border-[#E9E2F3] bg-white p-3">
      <span className="px-2 text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
        Active filters
      </span>
      {chips.map((chip) => (
        <button
          className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-[#EDE9FE] bg-[#F5F3FF] px-3 py-1.5 text-sm font-black leading-5 text-[#5B21B6] transition hover:border-[#A78BFA] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
          key={chip.key}
          onClick={() => onRemove(chip.key)}
          type="button"
        >
          <span className="min-w-0 break-words">{chip.label}</span>
          <X aria-hidden="true" className="h-4 w-4 shrink-0" />
        </button>
      ))}
      <Button className="min-h-9 px-4 py-2 text-xs" onClick={onClear} type="button" variant="secondary">
        Clear all
      </Button>
    </div>
  );
}
