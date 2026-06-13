import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query, serverValue = false) {
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return () => {};
      }

      const mediaQuery = window.matchMedia(query);

      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", callback);
        return () => mediaQuery.removeEventListener("change", callback);
      }

      mediaQuery.addListener(callback);
      return () => mediaQuery.removeListener(callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return serverValue;
    }

    return window.matchMedia(query).matches;
  }, [query, serverValue]);

  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
