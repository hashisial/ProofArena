import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout.jsx";
import { deleteSavedItem, getSavedItems } from "../services/api.js";
import { formatCurrency, formatDate, getInitials } from "../utils/index.js";

function formatPrice(service = {}) {
  if (!service?.price || service.pricingType === "custom") {
    return "Custom";
  }

  const amount = formatCurrency(service.price, "USD", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return service.pricingType === "hourly" ? `${amount}/hr` : amount;
}

function ProviderAvatar({ provider }) {
  const name = provider?.name || provider?.fullName || "Provider";

  if (provider?.avatar) {
    return (
      <img
        alt=""
        className="h-14 w-14 rounded-2xl border border-black/10 object-cover shadow-[0_14px_34px_rgba(63, 98, 18, 0.1)]"
        src={provider.avatar}
      />
    );
  }

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-sm font-black text-white">
      {getInitials(name)}
    </span>
  );
}

function SavedServiceCard({ item, onRemove, removing }) {
  const service = item.service;
  const provider = item.provider;

  return (
    <article className="group overflow-hidden rounded-[1.7rem] border border-black/10 bg-white shadow-[0_20px_62px_rgba(63, 98, 18, 0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/38 hover:shadow-[0_28px_84px_rgba(63, 98, 18, 0.16)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#26350F]">
        {service?.coverImage ? (
          <img
            alt=""
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            src={service.coverImage}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_18%,rgba(101, 163, 13, 0.58),transparent_12rem),linear-gradient(135deg,#1C1917,#365314)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black">
            {service?.category || "Service"}
          </span>
          <span className="rounded-full border border-white/18 bg-black/45 px-3 py-1.5 text-xs font-black text-white backdrop-blur-xl">
            {formatPrice(service)}
          </span>
        </div>
      </div>
      <div className="grid gap-5 p-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            Saved service
          </p>
          <h2 className="mt-2 text-2xl font-black leading-[1.04] tracking-[-0.055em] text-black">
            {service?.title || "Unavailable service"}
          </h2>
          <p className="mt-2 text-sm font-semibold text-black/48">
            {formatDate(item.createdAt, { fallback: "Saved recently", locale: "en" })}
          </p>
        </div>
        {provider ? (
          <a className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fefce8] p-3" href={provider.publicUrl || "#"}>
            <ProviderAvatar provider={provider} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-black">{provider.name || provider.fullName}</span>
              <span className="block truncate text-xs font-semibold text-black/48">
                {provider.headline || "Marketplace provider"}
              </span>
            </span>
          </a>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {service?.slug ? (
            <Button as="a" className="min-h-11 px-4 py-2" href={`/marketplace/service/${service.slug}`}>
              View service
            </Button>
          ) : null}
          <Button
            className="min-h-11 px-4 py-2"
            isLoading={removing}
            loadingLabel="Removing..."
            onClick={() => onRemove(item._id)}
            variant="outline"
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}

function SavedProviderCard({ item, onRemove, removing }) {
  const provider = item.provider;

  return (
    <article className="group relative overflow-hidden rounded-[1.7rem] border border-black/10 bg-white p-5 shadow-[0_20px_62px_rgba(63, 98, 18, 0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/38 hover:shadow-[0_28px_84px_rgba(63, 98, 18, 0.16)]">
      <div aria-hidden="true" className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#3F6212]/10 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <ProviderAvatar provider={provider} />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            Saved provider
          </p>
          <h2 className="mt-2 truncate text-2xl font-black tracking-[-0.055em] text-black">
            {provider?.name || provider?.fullName || "Unavailable provider"}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/56">
            {provider?.headline || "Provider profile is unavailable or private."}
          </p>
        </div>
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-2">
        {[
          ["Rating", Number(provider?.rating ?? 0).toFixed(1)],
          ["Projects", provider?.completedProjects ?? 0],
          ["Rate", provider?.hourlyRate ? `$${provider.hourlyRate}/hr` : "Custom"],
        ].map(([label, value]) => (
          <div className="rounded-2xl border border-black/10 bg-[#fefce8] p-3" key={label}>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-black/38">{label}</p>
            <p className="mt-1 truncate text-sm font-black text-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-5 flex flex-col gap-3 sm:flex-row">
        {provider?.publicUrl ? (
          <Button as="a" className="min-h-11 px-4 py-2" href={provider.publicUrl}>
            View profile
          </Button>
        ) : null}
        <Button
          className="min-h-11 px-4 py-2"
          isLoading={removing}
          loadingLabel="Removing..."
          onClick={() => onRemove(item._id)}
          variant="outline"
        >
          Remove
        </Button>
      </div>
    </article>
  );
}

export function Saved() {
  const queryClient = useQueryClient();
  const { data: savedItems = [], error, isError, isLoading } = useQuery({
    queryFn: getSavedItems,
    queryKey: ["saved-items"],
    staleTime: 20_000,
  });
  const removeMutation = useMutation({
    mutationFn: deleteSavedItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace", "services"] });
      queryClient.invalidateQueries({ queryKey: ["provider-public-profile"] });
    },
  });
  const groupedItems = useMemo(
    () => ({
      providers: savedItems.filter((item) => item.itemType === "provider"),
      services: savedItems.filter((item) => item.itemType === "service"),
    }),
    [savedItems],
  );

  return (
    <WorkspaceLayout eyebrow="Client shortlist" title="Saved">
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_92%_12%,rgba(63, 98, 18, 0.2),transparent_34%),linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] md:p-8">
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3F6212]/16 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3F6212]">
                Saved workspace
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.07em] text-black md:text-6xl">
                Keep strong services and providers in one shortlist.
              </h1>
              <p className="mt-5 max-w-2xl text-sm font-semibold leading-6 text-black/58">
                Save marketplace matches while researching, then return here before opening a project or starting a conversation.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-black/10 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-black/42">Services</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-black">{groupedItems.services.length}</p>
              </div>
              <div className="rounded-[1.3rem] border border-black/10 bg-black p-4 text-white">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Providers</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.06em]">{groupedItems.providers.length}</p>
              </div>
            </div>
          </div>
        </section>

        {removeMutation.isError ? (
          <StatusBanner tone="error">{removeMutation.error?.message}</StatusBanner>
        ) : null}
        {isError ? (
          <ErrorState message={error?.message ?? "Unable to load saved items."} title="Saved items failed" />
        ) : null}
        {isLoading ? <LoadingState columns={3} /> : null}
        {!isLoading && savedItems.length === 0 ? (
          <EmptyState
            description="Save services from marketplace cards or save providers from profile pages."
            title="No saved items yet"
          />
        ) : null}

        {!isLoading && groupedItems.services.length > 0 ? (
          <section className="grid gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">Saved services</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-black">Services to compare</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupedItems.services.map((item) => (
                <SavedServiceCard
                  item={item}
                  key={item._id}
                  onRemove={(id) => removeMutation.mutate(id)}
                  removing={removeMutation.isPending && removeMutation.variables === item._id}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!isLoading && groupedItems.providers.length > 0 ? (
          <section className="grid gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">Saved providers</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-black">People worth contacting</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {groupedItems.providers.map((item) => (
                <SavedProviderCard
                  item={item}
                  key={item._id}
                  onRemove={(id) => removeMutation.mutate(id)}
                  removing={removeMutation.isPending && removeMutation.variables === item._id}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </WorkspaceLayout>
  );
}
