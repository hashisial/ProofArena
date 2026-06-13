import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getProviderCompareId,
  MAX_COMPARE_PROVIDERS,
  ProviderComparisonContext,
} from "./providerComparisonState.js";
import { getJsonStorageItem, setJsonStorageItem } from "../../utils/storage.js";

const comparisonStorageKey = "proofarena.providerComparison.selected";
const savedComparisonsStorageKey = "proofarena.providerComparison.saved";

function readJsonStorage(key, fallback) {
  return getJsonStorageItem(key, fallback);
}

function writeJsonStorage(key, value) {
  setJsonStorageItem(key, value);
}

function normalizeProviderSnapshot(provider = {}) {
  const providerId = getProviderCompareId(provider);

  if (!providerId) {
    return null;
  }

  return {
    availability: provider.availability ?? "",
    avatar: provider.avatarUrl || provider.avatar || provider.profilePicture || provider.user?.avatar || "",
    avatarUrl: provider.avatarUrl || provider.avatar || provider.profilePicture || provider.user?.avatar || "",
    categories: (provider.categories ?? []).slice(0, 8),
    completedOutcomes: provider.completedOutcomes,
    displayName: provider.displayName || provider.fullName || provider.name || provider.username || "Provider",
    fullName: provider.fullName || provider.displayName || provider.name || "",
    headline: provider.headline || provider.title || "",
    id: providerId,
    outcomeOfferCount: provider.outcomeOfferCount ?? provider.outcomeOffers?.count ?? provider.outcomeOffersSummary?.count,
    outcomeOffers: provider.outcomeOffers ?? null,
    outcomeOffersSummary: provider.outcomeOffersSummary ?? null,
    profileUrl: provider.publicProfileUrl || provider.profileUrl || (provider.username ? `/profile/${provider.username}` : ""),
    proofMetricsAvailable: provider.proofMetricsAvailable,
    proofScore: provider.proofScore,
    publicProfileUrl: provider.publicProfileUrl || provider.profileUrl || (provider.username ? `/profile/${provider.username}` : ""),
    providerSince: provider.providerSince ?? null,
    skills: (provider.skills ?? []).slice(0, 12),
    topPublicOutcomeOffer:
      provider.topPublicOutcomeOffer ||
      provider.outcomeOffers?.top ||
      provider.outcomeOffersSummary?.top ||
      null,
    userId: providerId,
    username: provider.username || provider.user?.username || "",
    verification: provider.verification ?? null,
    verificationBadge: provider.verificationBadge ?? null,
    verificationStatus: provider.verificationStatus ?? "",
    approvalRate: provider.approvalRate,
    onTimeRate: provider.onTimeRate,
  };
}

function readInitialProviders() {
  return readJsonStorage(comparisonStorageKey, [])
    .map(normalizeProviderSnapshot)
    .filter(Boolean)
    .slice(0, MAX_COMPARE_PROVIDERS);
}

function createSavedComparisonId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `comparison-${Date.now()}`;
}

export function ProviderComparisonProvider({ children }) {
  const [selectedProviders, setSelectedProviders] = useState(readInitialProviders);

  useEffect(() => {
    writeJsonStorage(comparisonStorageKey, selectedProviders);
  }, [selectedProviders]);

  const selectedIds = useMemo(
    () => selectedProviders.map(getProviderCompareId).filter(Boolean),
    [selectedProviders],
  );
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const removeProvider = useCallback((providerOrId) => {
    const providerId =
      typeof providerOrId === "string" ? providerOrId : getProviderCompareId(providerOrId);

    setSelectedProviders((current) =>
      current.filter((provider) => getProviderCompareId(provider) !== providerId),
    );

    return { ok: true };
  }, []);

  const addProvider = useCallback((provider) => {
    const snapshot = normalizeProviderSnapshot(provider);

    if (!snapshot) {
      return {
        message: "This provider cannot be compared yet.",
        ok: false,
      };
    }

    let result = { ok: true };

    setSelectedProviders((current) => {
      const alreadySelected = current.some(
        (item) => getProviderCompareId(item) === snapshot.userId,
      );

      if (alreadySelected) {
        return current;
      }

      if (current.length >= MAX_COMPARE_PROVIDERS) {
        result = {
          message: "Maximum 4 providers can be compared.",
          ok: false,
        };

        return current;
      }

      return [...current, snapshot];
    });

    return result;
  }, []);

  const toggleProvider = useCallback(
    (provider) => {
      const providerId = getProviderCompareId(provider);

      if (!providerId) {
        return {
          message: "This provider cannot be compared yet.",
          ok: false,
        };
      }

      if (selectedIdSet.has(providerId)) {
        return removeProvider(providerId);
      }

      return addProvider(provider);
    },
    [addProvider, removeProvider, selectedIdSet],
  );

  const clearComparison = useCallback(() => {
    setSelectedProviders([]);

    return { ok: true };
  }, []);

  const isSelected = useCallback(
    (providerOrId) => {
      const providerId =
        typeof providerOrId === "string" ? providerOrId : getProviderCompareId(providerOrId);

      return selectedIdSet.has(providerId);
    },
    [selectedIdSet],
  );

  const saveComparison = useCallback((providers = selectedProviders) => {
    const providerSnapshots = providers.map(normalizeProviderSnapshot).filter(Boolean);

    if (providerSnapshots.length < 2) {
      return {
        message: "Select at least 2 providers before saving a comparison.",
        ok: false,
      };
    }

    const savedComparisons = readJsonStorage(savedComparisonsStorageKey, []);
    const savedComparison = {
      createdAt: new Date().toISOString(),
      id: createSavedComparisonId(),
      providerIds: providerSnapshots.map((provider) => provider.userId),
      providers: providerSnapshots,
    };

    writeJsonStorage(savedComparisonsStorageKey, [savedComparison, ...savedComparisons].slice(0, 20));

    return {
      comparison: savedComparison,
      message: "Comparison saved on this device.",
      ok: true,
    };
  }, [selectedProviders]);

  const contextValue = useMemo(
    () => ({
      addProvider,
      clearComparison,
      count: selectedProviders.length,
      isLimitReached: selectedProviders.length >= MAX_COMPARE_PROVIDERS,
      isSelected,
      maxProviders: MAX_COMPARE_PROVIDERS,
      removeProvider,
      saveComparison,
      selectedIdSet,
      selectedIds,
      selectedProviders,
      toggleProvider,
    }),
    [
      addProvider,
      clearComparison,
      isSelected,
      removeProvider,
      saveComparison,
      selectedIdSet,
      selectedIds,
      selectedProviders,
      toggleProvider,
    ],
  );

  return (
    <ProviderComparisonContext.Provider value={contextValue}>
      {children}
    </ProviderComparisonContext.Provider>
  );
}
