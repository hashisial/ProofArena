import { Target } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";

export function MatchEmptyState({ isRefreshing = false, onRefresh }) {
  return (
    <section className="grid justify-items-center rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7]/45 px-6 py-12 text-center shadow-[0_20px_58px_rgba(63,98,18,0.16)]">
      <div aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl border border-[#3F6212]/20 bg-[#F7FEE7] text-[#3F6212]">
        <Target className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-2xl font-black tracking-normal text-[#1C1917]">No matched challenges yet</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-[#78716C]">
        Create outcome offers, add skills, and refresh matches to find relevant client challenges.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.NEW_OUTCOME_OFFER}>
          Create Outcome Offer
        </Button>
        <Button
          className="w-full sm:w-auto"
          isLoading={isRefreshing}
          loadingLabel="Refreshing..."
          onClick={onRefresh}
          type="button"
          variant="outline"
        >
          Refresh Matches
        </Button>
      </div>
    </section>
  );
}
