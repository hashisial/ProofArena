const DEFAULT_FALLBACK = "—";

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getFormatterOptions(options, fallbackOptions) {
  const { fallback, locale, ...intlOptions } = options;
  const hasIntlOptions = Object.keys(intlOptions).length > 0;

  return {
    fallback: fallback ?? DEFAULT_FALLBACK,
    formatterOptions: hasIntlOptions ? intlOptions : fallbackOptions,
    locale,
  };
}

export function formatDate(date, options = {}) {
  const parsedDate = parseDate(date);
  const { fallback, formatterOptions, locale } = getFormatterOptions(options, {
    dateStyle: "medium",
  });

  if (!parsedDate) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, formatterOptions).format(parsedDate);
}

export function formatDateTime(date, options = {}) {
  const parsedDate = parseDate(date);
  const { fallback, formatterOptions, locale } = getFormatterOptions(options, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  if (!parsedDate) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, formatterOptions).format(parsedDate);
}

export function formatRelativeDate(date, options = {}) {
  const parsedDate = parseDate(date);
  const { fallback = DEFAULT_FALLBACK, locale } = options;

  if (!parsedDate) {
    return fallback;
  }

  const diffInSeconds = Math.round((parsedDate.getTime() - Date.now()) / 1000);
  const units = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const [unit, secondsInUnit] =
    units.find(([, seconds]) => Math.abs(diffInSeconds) >= seconds) ?? units.at(-1);

  return formatter.format(Math.round(diffInSeconds / secondsInUnit), unit);
}

export function isPastDate(date) {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.getTime() < Date.now() : false;
}

export function isFutureDate(date) {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.getTime() > Date.now() : false;
}
