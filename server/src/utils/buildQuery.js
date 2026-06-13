const unsafeFieldNames = new Set(["__proto__", "constructor", "prototype"]);

function isSafeFieldPath(field) {
  return (
    typeof field === "string" &&
    field.length > 0 &&
    !field.startsWith("$") &&
    field
      .split(".")
      .every((part) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(part) && !unsafeFieldNames.has(part))
  );
}

function isSafeFilterValue(value) {
  if (value === null || ["boolean", "number", "string"].includes(typeof value)) {
    return true;
  }

  return Array.isArray(value) && value.every(isSafeFilterValue);
}

export function escapeRegex(value) {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function createSearchRegex(value, options = {}) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const pattern = options.exact ? `^${escapeRegex(normalized)}$` : escapeRegex(normalized);
  return new RegExp(pattern, options.flags ?? "i");
}

export function buildQuery(filters = {}, options = {}) {
  const {
    aliases = {},
    allowedFilters = [],
    searchFields = [],
    searchKey = "q",
    transforms = {},
  } = options;
  const query = {};

  for (const filterName of allowedFilters) {
    const value = filters[filterName];

    if (value === undefined || value === null || value === "" || !isSafeFilterValue(value)) {
      continue;
    }

    const field = aliases[filterName] ?? filterName;

    if (!isSafeFieldPath(field)) {
      continue;
    }

    const transform = transforms[filterName];
    query[field] = typeof transform === "function" ? transform(value, filters) : value;
  }

  const searchRegex = createSearchRegex(filters[searchKey]);
  const safeSearchFields = searchFields.filter(isSafeFieldPath);

  if (searchRegex && safeSearchFields.length > 0) {
    query.$or = safeSearchFields.map((field) => ({ [field]: searchRegex }));
  }

  return query;
}
