import { useCallback, useEffect, useState } from "react";

function resolveInitialValue(initialValue) {
  return typeof initialValue === "function" ? initialValue() : initialValue;
}

function readStorageValue(key, initialValue, deserialize) {
  if (typeof window === "undefined") {
    return resolveInitialValue(initialValue);
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? resolveInitialValue(initialValue) : deserialize(storedValue);
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
          try {
            window.localStorage.setItem(key, serialize(resolvedValue));
          } catch {
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
      try {
        window.localStorage.removeItem(key);
      } catch {
        return;
      }
    }

    setStoredValue(resolveInitialValue(initialValue));
  }, [initialValue, key]);

  return [storedValue, setValue, removeValue];
}
