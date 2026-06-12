import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

function formatRate(value) {
  return value === null ? "Not available" : `${value}%`;
}

export function ProviderPlanStats({ isError = false, isLoading = false, stats }) {
  const items = [
    ["Total plans", stats.total],
    ["Draft", stats.draft],
    ["Submitted", stats.submitted],
    ["Viewed", stats.viewed],
    ["Shortlisted", stats.shortlisted],
    ["Accepted", stats.accepted],
    ["Rejected", stats.rejected],
    ["Archived", stats.archived],
    ["Shortlist rate", formatRate(stats.shortlistRate)],
    ["Win rate", formatRate(stats.winRate)],
  ];

  return (
    <section aria-labelledby="provider-plan-stats-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">Performance overview</p>
          <h2 className="mt-2 text-2xl font-black text-[#1C1917]" id="provider-plan-stats-title">
            Acquisition results at a glance
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#78716C]">
          Win rate uses accepted and rejected decisions. Shortlist rate includes shortlisted and accepted plans.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([label, value]) => (
          <Card key={label} padding="sm" variant="muted">
            <p className="text-sm font-bold text-[#78716C]">{label}</p>
            {isLoading ? (
              <Skeleton className="mt-3 h-9 w-24" />
            ) : (
              <p className="mt-2 break-words text-3xl font-black text-[#1C1917]">
                {isError ? "Not available" : value}
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
