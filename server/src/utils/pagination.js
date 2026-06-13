const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const DEFAULT_MAX_LIMIT = 100;

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPagination(input = {}, options = {}) {
  const defaultLimit = toPositiveInteger(options.defaultLimit, DEFAULT_LIMIT);
  const maxLimit = toPositiveInteger(options.maxLimit, DEFAULT_MAX_LIMIT);
  const page = toPositiveInteger(input.page, DEFAULT_PAGE);
  const requestedLimit = toPositiveInteger(input.limit, defaultLimit);
  const limit = Math.min(requestedLimit, maxLimit);

  return {
    limit,
    page,
    skip: (page - 1) * limit,
  };
}

export function getTotalPages(total = 0, limit = DEFAULT_LIMIT) {
  const safeTotal = Math.max(Number(total) || 0, 0);
  const safeLimit = toPositiveInteger(limit, DEFAULT_LIMIT);
  return Math.max(1, Math.ceil(safeTotal / safeLimit));
}

export function createPaginationMeta({ limit, page, total } = {}) {
  const providedLimit = toPositiveInteger(limit, DEFAULT_LIMIT);
  const normalized = getPagination(
    { limit: providedLimit, page },
    { defaultLimit: providedLimit, maxLimit: providedLimit },
  );
  const safeTotal = Math.max(Number(total) || 0, 0);
  const totalPages = getTotalPages(safeTotal, normalized.limit);

  return {
    hasNextPage: normalized.page < totalPages,
    hasPreviousPage: normalized.page > 1,
    limit: normalized.limit,
    page: normalized.page,
    pages: totalPages,
    total: safeTotal,
    totalPages,
  };
}
