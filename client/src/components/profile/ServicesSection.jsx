import { Edit3, PackageCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { formatCurrency } from "../../utils/index.js";
import { ProfileSection } from "./ProfileSection.jsx";

const deliveryTypeLabels = {
  consultation: "Consultation",
  fixed_scope: "Fixed scope",
  hourly: "Hourly",
  managed_outcome: "Managed outcome",
  milestone: "Milestone-based",
};

function getServices(services, providerProfile) {
  const source =
    services ||
    providerProfile?.services ||
    providerProfile?.serviceListings ||
    providerProfile?.deliveryPackages ||
    [];

  return Array.isArray(source) ? source : [];
}

function getPrice(service) {
  const price = service.startingPrice ?? service.priceFrom ?? service.price;

  if (price === null || price === undefined || price === "") {
    return "";
  }

  return formatCurrency(price, service.currency || "USD", {
    fallback: "",
    maximumFractionDigits: 0,
  });
}

export function ServicesSection({
  isOwner = false,
  onAdd,
  onEditItem,
  providerProfile = null,
  services,
}) {
  const serviceItems = getServices(services, providerProfile)
    .filter(Boolean)
    .filter((service) => isOwner || service.isActive !== false)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  if (!serviceItems.length && !isOwner) {
    return null;
  }

  return (
    <ProfileSection
      addLabel="Add service"
      empty={!serviceItems.length}
      emptyActionText="Add services"
      emptyDescription="Show the outcomes, workflows, or delivery packages you can provide."
      emptyTitle="Add services"
      isOwner={isOwner}
      onAdd={onAdd}
      subtitle="Outcome-focused services and delivery packages connected to your ProofArena profile."
      title="Services"
    >
      <div className="grid gap-3">
        {serviceItems.map((service, index) => {
          const title = service.title || service.name || "Service";
          const category = service.category || service.type || "Outcome delivery";
          const price = getPrice(service);
          const deliveryType = deliveryTypeLabels[service.deliveryType] || "";
          const proofRequired = Array.isArray(service.proofRequired)
            ? service.proofRequired.filter(Boolean).slice(0, 10)
            : [];

          return (
            <article
              className="group rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4 transition hover:-translate-y-0.5 hover:border-[#BEF264] hover:shadow-[0_16px_42px_rgba(63, 98, 18, 0.1)]"
              key={service.id || service._id || `${title}-${index}`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  aria-hidden="true"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
                >
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-black text-[#1C1917]">
                        {title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge size="sm" variant="primary">
                          {category}
                        </Badge>
                        {deliveryType ? (
                          <Badge size="sm" variant="gray">
                            {deliveryType}
                          </Badge>
                        ) : null}
                        {isOwner ? (
                          <Badge size="sm" variant={service.isActive === false ? "gray" : "green"}>
                            {service.isActive === false ? "Inactive" : "Active"}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    {isOwner ? (
                      <button
                        aria-label={`Edit service: ${title}`}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#44403C] transition hover:border-[#3F6212]/40 hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10"
                        onClick={() => onEditItem?.(service)}
                        type="button"
                      >
                        <Edit3 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  {service.description ? (
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#44403C]">
                      {service.description}
                    </p>
                  ) : null}
                  {price ? (
                    <p className="mt-3 text-sm font-black text-[#365314]">
                      Starts at {price}
                    </p>
                  ) : null}
                  {proofRequired.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {proofRequired.map((proofItem) => (
                        <span
                          className="rounded-full border border-[#ECFCCB] bg-white px-3 py-1 text-xs font-black text-[#365314]"
                          key={proofItem}
                        >
                          {proofItem}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </ProfileSection>
  );
}
