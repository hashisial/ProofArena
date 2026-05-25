const DEFAULT_FALLBACK = "—";

export function formatCurrency(amount, currency = "USD", options = {}) {
  const value = Number(amount);

  if (amount === null || amount === undefined || !Number.isFinite(value)) {
    return options.fallback ?? DEFAULT_FALLBACK;
  }

  const {
    compact = false,
    fallback: _FALLBACK,
    locale = "en-US",
    ...numberFormatOptions
  } = options;

  return new Intl.NumberFormat(locale, {
    currency,
    notation: compact ? "compact" : "standard",
    style: "currency",
    ...numberFormatOptions,
  }).format(value);
}
