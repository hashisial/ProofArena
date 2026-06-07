import { createContext, useContext } from "react";

export const MAX_COMPARE_PROVIDERS = 4;

export const ProviderComparisonContext = createContext(null);

export function getProviderCompareId(provider = {}) {
  return String(
    provider.userId ||
      provider.id ||
      provider._id ||
      provider.user?.id ||
      provider.user?._id ||
      "",
  ).trim();
}

export function useProviderComparisonState() {
  const context = useContext(ProviderComparisonContext);

  if (!context) {
    throw new Error("useProviderComparisonState must be used inside ProviderComparisonProvider");
  }

  return context;
}
