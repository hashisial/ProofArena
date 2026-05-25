const DEFAULT_FALLBACK = "—";

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatNumber(value, options = {}) {
  const number = parseNumber(value);

  if (number === null) {
    return options.fallback ?? DEFAULT_FALLBACK;
  }

  const { fallback: _FALLBACK, locale, ...numberFormatOptions } = options;
  return new Intl.NumberFormat(locale, numberFormatOptions).format(number);
}

export function formatCompactNumber(value, options = {}) {
  return formatNumber(value, {
    maximumFractionDigits: 1,
    notation: "compact",
    ...options,
  });
}

export function formatPercentage(value, options = {}) {
  const number = parseNumber(value);

  if (number === null) {
    return options.fallback ?? DEFAULT_FALLBACK;
  }

  const normalizedValue = Math.abs(number) > 1 ? number / 100 : number;
  const { fallback: _FALLBACK, locale, ...numberFormatOptions } = options;

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    style: "percent",
    ...numberFormatOptions,
  }).format(normalizedValue);
}
