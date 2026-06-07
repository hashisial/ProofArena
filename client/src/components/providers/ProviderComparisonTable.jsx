import { Badge } from "../ui/Badge.jsx";
import {
  buildDecisionMatrix,
  buildWinnerMap,
  formatCount,
  formatProviderSince,
  formatRate,
  formatScore,
  getMainCategory,
  getPrimaryService,
  getProviderId,
  getProviderName,
  getTopOutcomeOffer,
} from "../../features/providers/providerComparisonUtils.js";
import { ProviderAvailabilityBadge } from "./ProviderAvailabilityBadge.jsx";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";

function proofValue(provider, key) {
  return provider.proofMetricsAvailable === false ? undefined : provider[key];
}

function formatSkills(provider = {}) {
  const skills = provider.skills?.slice(0, 6) ?? [];

  return skills.length ? skills.join(", ") : "Not available";
}

function formatCategories(provider = {}) {
  const categories = provider.categories?.slice(0, 5) ?? [];

  return categories.length ? categories.join(", ") : "Not available";
}

function latestOfferTitle(provider = {}) {
  return getTopOutcomeOffer(provider)?.title || "No public outcome offer yet";
}

const rows = [
  {
    key: "name",
    label: "Name",
    render: getProviderName,
  },
  {
    key: "headline",
    label: "Headline",
    render: (provider) => provider.headline || "Not available",
  },
  {
    key: "verification",
    label: "Verification",
    render: (provider) => (
      <ProviderVerificationBadge
        verification={provider.verificationBadge ?? provider.verification}
        verificationStatus={provider.verificationStatus}
      />
    ),
  },
  {
    key: "proofScore",
    label: "Proof Score",
    render: (provider) => formatScore(proofValue(provider, "proofScore")),
  },
  {
    key: "completedOutcomes",
    label: "Completed Outcomes",
    render: (provider) => formatCount(proofValue(provider, "completedOutcomes")),
  },
  {
    key: "approvalRate",
    label: "Approval Rate",
    render: (provider) => formatRate(proofValue(provider, "approvalRate")),
  },
  {
    key: "onTimeRate",
    label: "On-Time Rate",
    render: (provider) => formatRate(proofValue(provider, "onTimeRate")),
  },
  {
    key: "outcomeOffers",
    label: "Outcome Offers",
    render: (provider) => formatCount(provider.outcomeOfferCount ?? provider.outcomeOffers?.count),
  },
  {
    key: "skills",
    label: "Skills",
    render: formatSkills,
  },
  {
    key: "categories",
    label: "Categories",
    render: formatCategories,
  },
  {
    key: "availability",
    label: "Availability",
    render: (provider) => <ProviderAvailabilityBadge availability={provider.availability} />,
  },
  {
    key: "providerSince",
    label: "Provider Since",
    render: (provider) => formatProviderSince(provider.providerSince),
  },
  {
    key: "latestOffer",
    label: "Latest Outcome Offer",
    render: latestOfferTitle,
  },
  {
    key: "primaryService",
    label: "Primary Service",
    render: getPrimaryService,
  },
  {
    key: "mainCategory",
    label: "Main Category",
    render: getMainCategory,
  },
];

function isWinner(winnerMap, rowKey, provider) {
  return winnerMap.get(rowKey)?.has(getProviderId(provider));
}

function CellContent({ provider, row, winnerMap }) {
  const highlighted = isWinner(winnerMap, row.key, provider);

  return (
    <div className={highlighted ? "rounded-xl border border-[#BEF264] bg-[#F7FEE7] p-2" : ""}>
      <div className="text-sm font-semibold leading-6 text-[#44403C]">
        {row.render(provider)}
      </div>
      {highlighted ? <Badge className="mt-2" variant="green">Visible leader</Badge> : null}
    </div>
  );
}

export function ProviderComparisonTable({ providers = [] }) {
  const matrix = buildDecisionMatrix(providers);
  const winnerMap = buildWinnerMap(matrix);

  return (
    <div className="grid gap-5">
      <div className="hidden overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-[#E7E5E4] bg-[#FFFBEB]">
              <th className="w-44 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#78716C]">
                Compare
              </th>
              {providers.map((provider) => (
                <th
                  className="px-4 py-3 text-sm font-black text-[#1C1917]"
                  key={getProviderId(provider)}
                >
                  {getProviderName(provider)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-[#E7E5E4] align-top last:border-0" key={row.key}>
                <th className="bg-[#FFFBEB] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
                  {row.label}
                </th>
                {providers.map((provider) => (
                  <td className="px-4 py-3" key={`${row.key}-${getProviderId(provider)}`}>
                    <CellContent provider={provider} row={row} winnerMap={winnerMap} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {providers.map((provider) => (
          <div
            className="rounded-2xl border border-[#E7E5E4] bg-white p-4"
            key={`mobile-${getProviderId(provider)}`}
          >
            <h3 className="text-lg font-black text-[#1C1917]">{getProviderName(provider)}</h3>
            <div className="mt-4 grid gap-3">
              {rows.slice(1).map((row) => (
                <div
                  className="grid gap-1 rounded-xl border border-[#E7E5E4] bg-[#FFFBEB] p-3"
                  key={`${row.key}-${getProviderId(provider)}`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
                    {row.label}
                  </p>
                  <CellContent provider={provider} row={row} winnerMap={winnerMap} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {matrix.length ? (
        <p className="text-sm font-semibold leading-6 text-[#78716C]">
          Highlighted cells mark the strongest visible public signal for that row.
        </p>
      ) : null}
    </div>
  );
}
