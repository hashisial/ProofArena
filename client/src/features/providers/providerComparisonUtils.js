import { formatCompactNumber, formatDate, formatPercentage } from "../../utils/index.js";

export function getProviderId(provider = {}) {
  return String(provider.userId || provider.id || provider._id || provider.username || "").trim();
}

export function getProviderName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

export function getProviderProfileHref(provider = {}) {
  return provider.publicProfileUrl || provider.profileUrl || (provider.username ? `/profile/${provider.username}` : "");
}

export function getMainCategory(provider = {}) {
  return provider.categories?.[0] || provider.outcomeOffersSummary?.categories?.[0] || "Not available";
}

export function getTopOutcomeOffer(provider = {}) {
  return (
    provider.topPublicOutcomeOffer ||
    provider.outcomeOffers?.top ||
    provider.outcomeOffersSummary?.top ||
    provider.outcomeOffers?.offers?.[0] ||
    null
  );
}

export function getPrimaryService(provider = {}) {
  return provider.serviceSummary?.titles?.[0] || provider.servicesSummary?.titles?.[0] || "Not available";
}

export function metricAvailable(provider = {}, key) {
  if (provider.proofMetricsAvailable === false) {
    return false;
  }

  return provider[key] !== undefined && provider[key] !== null && provider[key] !== "";
}

export function getNumericMetric(provider = {}, key) {
  if (!metricAvailable(provider, key)) {
    return null;
  }

  const value = Number(provider[key]);

  return Number.isFinite(value) ? value : null;
}

export function formatScore(value) {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  const number = Number(value);

  return Number.isFinite(number) ? `${Math.round(number)}/100` : "Not available";
}

export function formatCount(value) {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  return formatCompactNumber(value, { fallback: "Not available" });
}

export function formatRate(value) {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  return formatPercentage(value, { fallback: "Not available" });
}

export function formatProviderSince(value) {
  return formatDate(value, {
    fallback: "Not available",
    month: "short",
    year: "numeric",
  });
}

export function availabilityLabel(value) {
  return value ? String(value).replaceAll("_", " ") : "Not available";
}

function availabilityRank(value) {
  return {
    available_now: 5,
    available_this_week: 4,
    available_next_week: 3,
    limited: 2,
    fully_booked: 1,
  }[value] ?? 0;
}

function topByNumeric(providers, key) {
  const values = providers
    .map((provider) => ({
      provider,
      value: getNumericMetric(provider, key),
    }))
    .filter((item) => item.value !== null);

  if (values.length === 0) {
    return null;
  }

  const bestValue = Math.max(...values.map((item) => item.value));

  return {
    providerIds: values
      .filter((item) => item.value === bestValue)
      .map((item) => getProviderId(item.provider)),
    value: bestValue,
  };
}

function topByOfferCount(providers) {
  const values = providers
    .map((provider) => ({
      provider,
      value: Number(provider.outcomeOfferCount ?? provider.outcomeOffers?.count ?? 0),
    }))
    .filter((item) => Number.isFinite(item.value));
  const bestValue = Math.max(...values.map((item) => item.value), -1);

  if (bestValue < 0) {
    return null;
  }

  return {
    providerIds: values
      .filter((item) => item.value === bestValue)
      .map((item) => getProviderId(item.provider)),
    value: bestValue,
  };
}

function topByAvailability(providers) {
  const values = providers
    .map((provider) => ({
      provider,
      value: availabilityRank(provider.availability),
    }))
    .filter((item) => item.value > 0);

  if (values.length === 0) {
    return null;
  }

  const bestValue = Math.max(...values.map((item) => item.value));

  return {
    providerIds: values
      .filter((item) => item.value === bestValue)
      .map((item) => getProviderId(item.provider)),
    value: bestValue,
  };
}

export function buildDecisionMatrix(providers = []) {
  const matrix = [
    {
      description: "Highest visible proof score",
      format: (value) => formatScore(value),
      key: "proofScore",
      label: "Highest Proof Score",
      result: topByNumeric(providers, "proofScore"),
      rowKey: "proofScore",
    },
    {
      description: "Most completed outcomes",
      format: (value) => formatCount(value),
      key: "completedOutcomes",
      label: "Most Outcomes",
      result: topByNumeric(providers, "completedOutcomes"),
      rowKey: "completedOutcomes",
    },
    {
      description: "Highest visible approval rate",
      format: (value) => formatRate(value),
      key: "approvalRate",
      label: "Highest Approval Rate",
      result: topByNumeric(providers, "approvalRate"),
      rowKey: "approvalRate",
    },
    {
      description: "Highest visible on-time rate",
      format: (value) => formatRate(value),
      key: "onTimeRate",
      label: "Highest On-Time Rate",
      result: topByNumeric(providers, "onTimeRate"),
      rowKey: "onTimeRate",
    },
    {
      description: "Most public outcome offers",
      format: (value) => formatCount(value),
      key: "outcomeOffers",
      label: "Most Active Offers",
      result: topByOfferCount(providers),
      rowKey: "outcomeOffers",
    },
    {
      description: "Best listed availability",
      format: () => "Best visible availability",
      key: "availability",
      label: "Best Availability",
      result: topByAvailability(providers),
      rowKey: "availability",
    },
  ];

  return matrix.filter((item) => item.result?.providerIds?.length);
}

export function buildWinnerMap(matrix = []) {
  const winnerMap = new Map();

  matrix.forEach((item) => {
    winnerMap.set(item.rowKey, new Set(item.result.providerIds));
  });

  return winnerMap;
}

export function buildComparisonSummary(providers = [], matrix = buildDecisionMatrix(providers)) {
  return matrix.slice(0, 4).map((item) => {
    const names = item.result.providerIds
      .map((providerId) => providers.find((provider) => getProviderId(provider) === providerId))
      .filter(Boolean)
      .map(getProviderName);

    return `${names.join(", ")}: ${item.description}.`;
  });
}
