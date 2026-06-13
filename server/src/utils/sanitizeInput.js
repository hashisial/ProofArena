const defaultBlockedKeys = new Set(["__proto__", "constructor", "prototype"]);

function shouldPreserveObject(value) {
  return (
    !value ||
    value instanceof Date ||
    Buffer.isBuffer(value) ||
    (typeof value === "object" &&
      ("buffer" in value || "mimetype" in value || "originalname" in value))
  );
}

export function sanitizeString(value, options = {}) {
  const normalized = String(value ?? "")
    .replace(/\0/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
  const compacted = options.collapseWhitespace === false
    ? normalized
    : normalized.replace(/\s{2,}/g, " ");
  const trimmed = options.trim === false ? compacted : compacted.trim();

  return Number.isFinite(options.maxLength)
    ? trimmed.slice(0, Math.max(0, options.maxLength))
    : trimmed;
}

export function sanitizeInput(value, options = {}) {
  if (typeof value === "string") {
    return sanitizeString(value, options);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInput(item, options));
  }

  if (shouldPreserveObject(value) || typeof value !== "object") {
    return value;
  }

  const blockedKeys = options.blockedKeys ?? defaultBlockedKeys;
  const removeKeys = options.removeKeys ?? new Set();
  const allowedRemovedKeys = options.allowedRemovedKeys ?? new Set();

  return Object.entries(value).reduce((sanitized, [key, entryValue]) => {
    if (
      blockedKeys.has(key) ||
      key.startsWith("$") ||
      key.includes(".") ||
      (removeKeys.has(key) && !allowedRemovedKeys.has(key))
    ) {
      return sanitized;
    }

    sanitized[key] = sanitizeInput(entryValue, options);
    return sanitized;
  }, {});
}
