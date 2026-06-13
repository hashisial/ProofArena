import { Trophy } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import {
  buildDecisionMatrix,
  getProviderName,
} from "../../features/providers/providerComparisonUtils.js";

export function ProviderDecisionMatrix({ providers = [] }) {
  const matrix = buildDecisionMatrix(providers);

  if (matrix.length === 0) {
    return (
      <Card className="rounded-3xl" padding="lg" variant="muted">
        <p className="text-sm font-black text-[#1C1917]">Comparison highlights unavailable</p>
        <p className="mt-2 text-sm leading-6 text-[#78716C]">
          Highlights appear when providers expose comparable public proof, offer, or availability signals.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl" padding="lg">
      <div className="flex min-w-0 items-start gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
        >
          <Trophy className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Decision matrix
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-normal text-[#1C1917]">
            Visible comparison highlights
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            These highlights use public provider fields only and do not infer a final recommendation.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {matrix.map((item) => {
          const winnerNames = item.result.providerIds
            .map((providerId) =>
              providers.find((provider) => {
                const id = provider.userId || provider.id || provider._id || provider.username;

                return String(id) === String(providerId);
              }),
            )
            .filter(Boolean)
            .map(getProviderName);

          return (
            <div
              className="rounded-2xl border border-[#ECFCCB] bg-[#F7FEE7] p-4"
              key={item.key}
            >
              <Badge variant="green">{item.label}</Badge>
              <p className="mt-3 text-sm font-black leading-6 text-[#1C1917]">
                {winnerNames.join(", ")}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-[#78716C]">
                {item.format(item.result.value)}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
