import { Search } from "lucide-react";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

export function ProviderSearchBar({ onChange, onSubmit, value }) {
  return (
    <form className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]" onSubmit={onSubmit}>
      <Input
        id="provider-search"
        label="Search providers"
        leftIcon={<Search className="h-4 w-4" />}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by skill, service, outcome, location, or name"
        type="search"
        value={value}
      />
      <Button className="mt-0 w-full self-end sm:w-auto" type="submit">
        Search
      </Button>
    </form>
  );
}
