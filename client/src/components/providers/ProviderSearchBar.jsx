import { Search, X } from "lucide-react";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

const popularSearches = [
  "Lead Generation",
  "CRM Automation",
  "SaaS Delivery",
  "Website Development",
  "Customer Support",
];

export function ProviderSearchBar({ onChange, onClear, onPopularSearch, onSubmit, value }) {
  return (
    <div className="grid min-w-0 gap-3">
      <form className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]" onSubmit={onSubmit}>
        <Input
          id="provider-search"
          label="Search providers"
          leftIcon={<Search className="h-4 w-4" />}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by skill, outcome, category, or provider name..."
          type="search"
          value={value}
        />
        <Button className="mt-0 w-full self-end sm:w-auto" type="submit">
          Search
        </Button>
        <Button
          aria-label="Clear provider search"
          className="mt-0 w-full self-end sm:w-auto"
          disabled={!value}
          onClick={onClear}
          type="button"
          variant="outline"
        >
          <X aria-hidden="true" className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </form>
      {onPopularSearch ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
            Popular
          </span>
          {popularSearches.map((search) => (
            <button
              className="rounded-full border border-[#E7E5E4] bg-white px-3 py-1.5 text-xs font-black text-[#44403C] transition hover:border-[#65A30D] hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
              key={search}
              onClick={() => onPopularSearch(search)}
              type="button"
            >
              {search}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
