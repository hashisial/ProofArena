import { useCallback, useEffect, useState } from "react";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../utils/storage.js";

function resolveInitialValue(initialValue) {
  return typeof initialValue === "function" ? initialValue() : initialValue;
}

function readStorageValue(key, initialValue, deserialize) {
  if (typeof window === "undefined") {
    return resolveInitialValue(initialValue);
  }

  const storedValue = getStorageItem(key);

  if (storedValue === null) {
    return resolveInitialValue(initialValue);
  }

  try {
    return deserialize(storedValue);
  } catch {
    return resolveInitialValue(initialValue);
  }
}

export function useLocalStorage(key, initialValue, options = {}) {
  const deserialize = options.deserialize ?? JSON.parse;
  const serialize = options.serialize ?? JSON.stringify;
  const [storedValue, setStoredValue] = useState(() =>
    readStorageValue(key, initialValue, deserialize),
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    function handleStorage(event) {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }

      try {
        setStoredValue(
          event.newValue === null
            ? resolveInitialValue(initialValue)
            : deserialize(event.newValue),
        );
      } catch {
        setStoredValue(resolveInitialValue(initialValue));
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [deserialize, initialValue, key]);

  const setValue = useCallback(
    (nextValue) => {
      setStoredValue((currentValue) => {
        const resolvedValue =
          typeof nextValue === "function" ? nextValue(currentValue) : nextValue;

        if (typeof window !== "undefined") {
          if (!setStorageItem(key, serialize(resolvedValue))) {
            return currentValue;
          }
        }

        return resolvedValue;
      });
    },
    [key, serialize],
  );

  const removeValue = useCallback(() => {
    if (typeof window !== "undefined") {
      if (!removeStorageItem(key)) {
        return;
      }
    }

    setStoredValue(resolveInitialValue(initialValue));
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}
