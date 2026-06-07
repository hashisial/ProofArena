import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";

export function ProviderDiscoveryHeader({ activeFilterCount = 0, total = 0 }) {
  return (
    <div className="grid min-w-0 gap-5 rounded-3xl border border-[#E9E2F3] bg-white p-5 shadow-[0_24px_80px_rgba(31,14,54,0.08)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
      <div className="min-w-0">
        <Badge variant="primary">Provider discovery</Badge>
        <h1 className="mt-4 max-w-4xl break-words text-4xl font-black leading-tight tracking-normal text-[#07030D] sm:text-5xl lg:text-6xl">
          Find providers by proof, not promises.
        </h1>
        <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-[#6F657C]">
          Compare providers by skills, outcome offers, availability, proof score,
          completed outcomes, and verified reputation signals.
        </p>
        <p className="mt-4 max-w-3xl text-sm font-black uppercase tracking-[0.14em] text-[#7C3AED]">
          Built for clients who want measurable outcomes and providers who can prove execution.
        </p>
      </div>

      <Card className="rounded-3xl" padding="md" variant="muted">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7C3AED]">
          Discovery status
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-3">
            <p className="text-2xl font-black text-[#07030D]">{total}</p>
            <p className="mt-1 text-xs font-bold text-[#6F657C]">public results</p>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <p className="text-2xl font-black text-[#07030D]">{activeFilterCount}</p>
            <p className="mt-1 text-xs font-bold text-[#6F657C]">active filters</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
