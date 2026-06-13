function resolveStorage(storage = "localStorage") {
  if (typeof window === "undefined") {
    return null;
  }

  if (storage && typeof storage === "object" && typeof storage.getItem === "function") {
    return storage;
  }

  return storage === "sessionStorage" ? window.sessionStorage : window.localStorage;
}

export function getStorageItem(key, fallback = null, options = {}) {
  try {
    const value = resolveStorage(options.storage)?.getItem(key);
    return value === null || value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value, options = {}) {
  try {
    const storage = resolveStorage(options.storage);

    if (!storage) {
      return false;
    }

    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key, options = {}) {
  try {
    const storage = resolveStorage(options.storage);

    if (!storage) {
      return false;
    }

    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getJsonStorageItem(key, fallback = null, options = {}) {
  const rawValue = getStorageItem(key, null, options);

  if (rawValue === null) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) ?? fallback;
  } catch {
    return fallback;
  }
}

export function setJsonStorageItem(key, value, options = {}) {
  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? false : setStorageItem(key, serialized, options);
  } catch {
    return false;
  }
}
