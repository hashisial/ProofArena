import { useMemo } from "react";
import { useProofArenaStore } from "@/store/useProofArenaStore.js";

export function useProofArenaModule(options = {}) {
  const enabled = options.enabled ?? true;
  const activeRole = useProofArenaStore((state) => state.activeRole);
  const clearActiveRole = useProofArenaStore((state) => state.clearActiveRole);
  const setActiveRole = useProofArenaStore((state) => state.setActiveRole);

  return useMemo(
    () => ({
      activeRole,
      clearActiveRole,
      enabled: Boolean(enabled),
      moduleId: "proofarena",
      parentPlatform: "scaleops",
      setActiveRole,
      status: enabled ? "ready" : "disabled",
    }),
    [activeRole, clearActiveRole, enabled, setActiveRole],
  );
}

// Keep remote domain data, dashboard filters, and opportunity filters in React
// Query or local state until real cross-page coordination requires otherwise.
