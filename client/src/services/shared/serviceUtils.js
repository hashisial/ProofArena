const DEFAULT_OMITTED_QUERY_VALUES = Object.freeze([undefined, null, ""]);

export function buildQueryString(params = {}, options = {}) {
  const query = new URLSearchParams();
  const omittedValues = new Set([
    ...DEFAULT_OMITTED_QUERY_VALUES,
    ...(options.omitValues ?? []),
  ]);

  Object.entries(params).forEach(([key, value]) => {
    if (omittedValues.has(value)) {
      return;
    }

    if (Array.isArray(value)) {
      const values = value.filter((item) => !omittedValues.has(item));

      if (values.length === 0) {
        return;
      }

      if (options.arrayFormat === "repeat") {
        values.forEach((item) => query.append(key, String(item)));
        return;
      }

      query.set(key, values.join(","));
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
}

export function mapItemsResponse(result, fallback = {}) {
  if (Array.isArray(result)) {
    return {
      ...fallback,
      items: result,
    };
  }

  if (result && typeof result === "object") {
    return {
      ...fallback,
      ...result,
      items: Array.isArray(result.items) ? result.items : [],
    };
  }

  return {
    ...fallback,
    items: [],
  };
}

export function mapCollectionItems(result) {
  if (Array.isArray(result)) {
    return result;
  }

  return Array.isArray(result?.items) ? result.items : [];
}
