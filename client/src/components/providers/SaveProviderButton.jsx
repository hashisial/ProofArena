import { Bookmark, BookmarkCheck } from "lucide-react";
import { useMemo } from "react";
import { ROUTES, USER_ROLES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import {
  useSaveProvider,
  useSavedProviderStatus,
  useUnsaveProvider,
  useUpdateSavedProvider,
} from "../../features/savedProviders/useSavedProviders.js";
import { Button } from "../ui/Button.jsx";

function getProviderId(provider = {}) {
  return provider.userId || provider.id || provider._id || provider.user?.id || provider.user?._id || "";
}

function getRedirectHref() {
  if (typeof window === "undefined") {
    return ROUTES.LOGIN;
  }

  return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
}

export function SaveProviderButton({
  className = "",
  provider = {},
  source = "provider_discovery",
  statusOnSave,
  variant = "outline",
}) {
  const providerId = getProviderId(provider);
  const auth = useAuth();
  const role = auth.role || auth.user?.role;
  const canSave = auth.isAuthenticated && role === USER_ROLES.CLIENT && Boolean(providerId);
  const statusQuery = useSavedProviderStatus(providerId, { enabled: canSave });
  const saveMutation = useSaveProvider();
  const updateMutation = useUpdateSavedProvider();
  const unsaveMutation = useUnsaveProvider();
  const status = statusQuery.data?.status ?? null;
  const isSaved = Boolean(statusQuery.data?.saved);
  const isBusy =
    statusQuery.isLoading ||
    saveMutation.isPending ||
    updateMutation.isPending ||
    unsaveMutation.isPending;
  const label = useMemo(() => {
    if (statusOnSave === "shortlisted" && status === "shortlisted") {
      return "Shortlisted";
    }

    if (isSaved) {
      return "Remove Saved";
    }

    return statusOnSave === "shortlisted" ? "Shortlist for later" : "Save Provider";
  }, [isSaved, status, statusOnSave]);

  async function handleSave() {
    if (!providerId || isBusy) {
      return;
    }

    if (isSaved && !statusOnSave) {
      await unsaveMutation.mutateAsync(providerId);
      return;
    }

    const savedRecord = isSaved
      ? statusQuery.data
      : await saveMutation.mutateAsync({
          providerId,
          source,
        });
    const savedProviderId = savedRecord?.savedProviderId;

    if (statusOnSave && savedProviderId && savedRecord?.status !== statusOnSave) {
      await updateMutation.mutateAsync({
        id: savedProviderId,
        payload: { status: statusOnSave },
      });
    }
  }

  if (!auth.isAuthenticated) {
    return (
      <Button as="a" className={className} href={getRedirectHref()} variant={variant}>
        <Bookmark aria-hidden="true" className="mr-2 h-4 w-4" />
        {statusOnSave === "shortlisted" ? "Shortlist for later" : "Save Provider"}
      </Button>
    );
  }

  if (role !== USER_ROLES.CLIENT) {
    return (
      <Button className={className} disabled type="button" variant={variant}>
        <Bookmark aria-hidden="true" className="mr-2 h-4 w-4" />
        Clients can save providers
      </Button>
    );
  }

  return (
    <Button
      className={className}
      disabled={!providerId || isBusy}
      isLoading={isBusy}
      loadingLabel="Updating..."
      onClick={handleSave}
      type="button"
      variant={isSaved ? "secondary" : variant}
    >
      {isSaved ? (
        <BookmarkCheck aria-hidden="true" className="mr-2 h-4 w-4" />
      ) : (
        <Bookmark aria-hidden="true" className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
