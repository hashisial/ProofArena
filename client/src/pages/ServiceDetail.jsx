import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { MarketplaceServiceCard } from "../components/MarketplaceServiceCard.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  getMarketplaceService,
  deleteSavedItem,
  getSavedItems,
  getServiceReviews,
  saveItem,
  searchMarketplaceServices,
  sendConversationMessage,
  startConversation,
} from "../services/api.js";
import { formatCurrency, getInitials } from "../utils/index.js";

const MotionDiv = motion.div;
const MotionSection = motion.section;

function formatPrice(service = {}) {
  if (!service.price || service.pricingType === "custom") {
    return "Custom quote";
  }

  const amount = formatCurrency(service.price, "USD", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return service.pricingType === "hourly" ? `${amount}/hr` : amount;
}

function getDisplayLabel(value = "") {
  return String(value || "Marketplace")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="m10 1.7 2.34 5.03 5.5.68-4.05 3.78 1.06 5.44L10 13.94l-4.85 2.69 1.06-5.44-4.05-3.78 5.5-.68L10 1.7Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m5 12 4.25 4.25L19 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function BookmarkIcon({ isSaved }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill={isSaved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
    </svg>
  );
}

function ProviderAvatar({ avatar, name, size = "lg" }) {
  const sizeClasses = size === "sm" ? "h-12 w-12 rounded-2xl" : "h-16 w-16 rounded-[1.25rem]";

  if (avatar) {
    return (
      <img
        alt=""
        className={`${sizeClasses} shrink-0 border border-black/10 object-cover shadow-[0_18px_44px_rgba(63, 98, 18, 0.12)]`}
        src={avatar}
      />
    );
  }

  return (
    <span
      className={`${sizeClasses} flex shrink-0 items-center justify-center bg-black text-sm font-black text-white shadow-[0_18px_44px_rgba(63, 98, 18, 0.14)]`}
    >
      {getInitials(name)}
    </span>
  );
}

function ServiceImageGallery({ images, selectedImage, selectedImageIndex, serviceTitle, setSelectedImageIndex }) {
  return (
    <div className="grid gap-3">
      <div className="relative min-h-[23rem] overflow-hidden rounded-[2rem] bg-[#1A2E05] shadow-[0_26px_80px_rgba(63, 98, 18, 0.2)] sm:min-h-[30rem]">
        {selectedImage ? (
          <img
            alt=""
            className="h-full min-h-[23rem] w-full object-cover sm:min-h-[30rem]"
            src={selectedImage}
          />
        ) : (
          <div className="h-full min-h-[23rem] bg-[radial-gradient(circle_at_22%_18%,rgba(101, 163, 13, 0.62),transparent_12rem),radial-gradient(circle_at_80%_16%,rgba(63, 98, 18, 0.42),transparent_11rem),linear-gradient(135deg,#1C1917,#1c0e2e_50%,#365314)] sm:min-h-[30rem]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 rounded-[1.35rem] border border-white/18 bg-white/12 p-4 text-white backdrop-blur-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D9F99D]">Service preview</p>
          <p className="mt-2 max-w-lg text-xl font-black leading-tight tracking-[-0.04em]">
            {serviceTitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {(images.length ? images : [""]).slice(0, 4).map((image, index) => (
          <button
            aria-label={`Show service image ${index + 1}`}
            className={`relative aspect-[4/3] overflow-hidden rounded-[1rem] border bg-[#1A2E05] transition duration-300 ${
              selectedImageIndex === index
                ? "border-[#3F6212] shadow-[0_18px_44px_rgba(63, 98, 18, 0.22)]"
                : "border-black/10 hover:border-[#3F6212]/45"
            }`}
            key={`${image || "placeholder"}-${index}`}
            onClick={() => setSelectedImageIndex(index)}
            type="button"
          >
            {image ? (
              <img alt="" className="h-full w-full object-cover" src={image} />
            ) : (
              <span className="block h-full w-full bg-[linear-gradient(135deg,#1C1917,#365314)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailSection({ children, eyebrow, title }) {
  return (
    <MotionSection
      className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] sm:p-8"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.055em] text-black sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </MotionSection>
  );
}

function ProviderMiniProfile({ provider }) {
  const providerName = provider?.name || provider?.fullName || "Marketplace provider";

  return (
    <DetailSection eyebrow="Provider" title="Built by a verified marketplace operator.">
      <div className="grid gap-5 rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <ProviderAvatar avatar={provider?.avatar} name={providerName} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-2xl font-black tracking-[-0.05em] text-black">{providerName}</h3>
            {provider?.isVerified ? (
              <span className="rounded-full bg-[#3F6212] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
            {provider?.headline || "Provider profile, delivery history, and marketplace reputation are shown before you start."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-black/58">
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
              {Number(provider?.rating ?? 0).toFixed(1)} rating
            </span>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
              {provider?.completedProjects ?? 0} projects
            </span>
            {provider?.location ? (
              <span className="rounded-full border border-black/10 bg-white px-3 py-1.5">
                {provider.location}
              </span>
            ) : null}
            {provider?.availability ? (
              <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-3 py-1.5 text-[#365314]">
                {getDisplayLabel(provider.availability)}
              </span>
            ) : null}
          </div>
        </div>
        {provider?.publicUrl ? (
          <Button as="a" className="w-full sm:w-auto" href={provider.publicUrl} variant="outline">
            View profile
          </Button>
        ) : null}
      </div>
    </DetailSection>
  );
}

function IncludedList({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div className="flex gap-3 rounded-[1.2rem] border border-black/10 bg-[#fffbeb] p-4" key={item}>
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3F6212] text-white">
            <CheckIcon />
          </span>
          <p className="text-sm font-semibold leading-6 text-black/68">{item}</p>
        </div>
      ))}
    </div>
  );
}

function InfoTiles({ items }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div className="rounded-[1.25rem] border border-black/10 bg-[#fffbeb] p-5" key={label}>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/42">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-[-0.05em] text-black">{value}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewsPlaceholder({ reviews = [], service }) {
  const hasReviews = reviews.length > 0;

  return (
    <DetailSection eyebrow="Reviews" title={hasReviews ? "Verified marketplace feedback." : "Verified reviews will live here."}>
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr]">
        <div className="rounded-[1.5rem] bg-black p-6 text-white">
          <div className="flex gap-1 text-[#65A30D]">
            {[0, 1, 2, 3, 4].map((index) => (
              <StarIcon key={index} />
            ))}
          </div>
          <p className="mt-4 text-5xl font-black tracking-[-0.07em]">
            {Number(service.ratingAverage ?? 0).toFixed(1)}
          </p>
          <p className="mt-2 text-sm font-semibold text-white/58">
            {service.totalReviews ?? 0} verified marketplace reviews
          </p>
        </div>
        {hasReviews ? (
          <div className="grid gap-3">
            {reviews.slice(0, 3).map((review) => (
              <article className="rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-5" key={review._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-black tracking-[-0.035em] text-black">
                    {review.heading || "Client feedback"}
                  </p>
                  <span className="rounded-full bg-[#3F6212] px-3 py-1 text-xs font-black text-white">
                    {Number(review.rating ?? review.stars ?? 5).toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-black/62">{review.comment || review.description}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-black/38">
                  {review.authorName || "Verified client"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-6">
            <p className="text-lg font-black tracking-[-0.035em] text-black">
              Buyer feedback appears after completed projects.
            </p>
            <p className="mt-3 text-sm leading-7 text-black/62">
              The review API is ready. Completed marketplace work can publish ratings,
              comments, delivery quality, and communication feedback here.
            </p>
          </div>
        )}
      </div>
    </DetailSection>
  );
}

export function ServiceDetail({ serviceId }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuth();
  const [selectedGallery, setSelectedGallery] = useState({ index: 0, serviceId: "" });
  const [reportedServiceId, setReportedServiceId] = useState("");
  const canSave = isAuthenticated && role === "client";

  const { data: service, error, isError, isLoading } = useQuery({
    enabled: Boolean(serviceId),
    queryFn: () => getMarketplaceService(serviceId),
    queryKey: ["marketplace", "service", serviceId],
    staleTime: 30_000,
  });

  const { data: relatedResult } = useQuery({
    enabled: Boolean(service?.category),
    queryFn: () =>
      searchMarketplaceServices({
        category: service.category,
        limit: 5,
        sort: "rating_desc",
      }),
    queryKey: ["marketplace", "services", "related", service?.category, service?._id],
    staleTime: 60_000,
  });
  const { data: serviceReviews = [] } = useQuery({
    enabled: Boolean(service?._id),
    queryFn: () => getServiceReviews(service._id),
    queryKey: ["reviews", "service", service?._id],
    staleTime: 60_000,
  });
  const { data: savedItems = [] } = useQuery({
    enabled: canSave,
    queryFn: getSavedItems,
    queryKey: ["saved-items"],
    staleTime: 20_000,
  });
  const savedServicesById = useMemo(
    () =>
      new Map(
        savedItems
          .filter((item) => item.itemType === "service" && item.serviceId)
          .map((item) => [item.serviceId, item]),
      ),
    [savedItems],
  );

  const favoriteMutation = useMutation({
    mutationFn: async (targetService) => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      if (role !== "client") {
        throw new Error("Only client accounts can save services.");
      }

      if (!targetService?._id) {
        throw new Error("Service is unavailable to save.");
      }

      if (targetService.savedItemId) {
        return deleteSavedItem(targetService.savedItemId);
      }

      return saveItem({
        itemType: "service",
        serviceId: targetService._id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace", "service", serviceId] });
      queryClient.invalidateQueries({ queryKey: ["marketplace", "services"] });
    },
  });

  const contactProviderMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      const participantId = service?.provider?.id || service?.providerId;

      if (!participantId) {
        throw new Error("Provider contact is unavailable.");
      }

      return startConversation(participantId);
    },
    onSuccess: (conversation) => {
      if (conversation) {
        sendConversationMessage(conversation._id, {
          text: `Hi, I'm interested in your service: ${service?.title ?? "this service"}`,
        })
          .catch(() => {})
          .finally(() => {
            window.location.href = `/messages?conversation=${encodeURIComponent(conversation._id)}`;
          });
      }
    },
  });

  const providerName = service?.provider?.name || service?.provider?.fullName || "Marketplace provider";
  const galleryImages = useMemo(() => {
    const images = Array.from(
      new Set([...(service?.images ?? []), service?.coverImage].filter(Boolean)),
    );

    return images;
  }, [service]);
  const selectedImageIndex =
    selectedGallery.serviceId === service?._id ? selectedGallery.index : 0;
  const reportMessage =
    reportedServiceId === service?._id
      ? "Report noted. Admin review tooling can connect to this action next."
      : "";
  const selectedImage = galleryImages[selectedImageIndex] ?? "";
  const relatedServices = (relatedResult?.items ?? [])
    .filter((item) => item._id !== service?._id)
    .map((item) => {
      const savedItem = savedServicesById.get(item._id);

      return {
        ...item,
        isSaved: Boolean(item.isSaved || savedItem),
        savedItemId: savedItem?._id ?? "",
      };
    })
    .slice(0, 3);
  const currentSavedItem = savedServicesById.get(service?._id);
  const serviceWithSavedState = service
    ? {
        ...service,
        isSaved: Boolean(service.isSaved || currentSavedItem),
        savedItemId: currentSavedItem?._id ?? "",
      }
    : service;
  const includedItems = useMemo(() => {
    const serviceSkills = service?.skills?.length ? service.skills : service?.tags ?? [];
    const dynamicItems = serviceSkills.slice(0, 5).map((item) => `${item} delivery and handoff`);
    const fallbackItems = [
      "Discovery call and scope confirmation",
      "Execution plan with clear milestones",
      "Implementation support and final handoff",
      "Quality review before delivery",
    ];
    const revisionItem =
      service?.revisions > 0 ? `${service.revisions} revision cycle${service.revisions > 1 ? "s" : ""}` : "";

    return Array.from(new Set([...(dynamicItems.length ? dynamicItems : fallbackItems), revisionItem].filter(Boolean))).slice(0, 6);
  }, [service]);
  const descriptionParagraphs = String(service?.description || service?.shortDescription || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const startProjectHref = isAuthenticated
      ? `/projects?serviceId=${encodeURIComponent(service?._id ?? "")}&providerId=${encodeURIComponent(service?.providerId ?? "")}`
    : "/login";
  const isSavingCurrent =
    favoriteMutation.isPending && favoriteMutation.variables?._id === service?._id;

  return (
    <section className="relative isolate overflow-hidden bg-white py-12 text-black sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_14%_20%,rgba(63,98,18,0.18),transparent_18rem),radial-gradient(circle_at_86%_8%,rgba(101,163,13,0.22),transparent_18rem),linear-gradient(180deg,#FEFCE8_0%,#ffffff_72%)]" />
        <MotionDiv
          animate={{ rotate: 360, y: [0, -14, 0] }}
          className="absolute right-[7%] top-20 h-40 w-40 rounded-[2rem] border border-[#3F6212]/14 bg-[#3F6212]/8 blur-[0.2px]"
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        />
        <MotionDiv
          animate={{ rotate: -360, x: [0, 18, 0] }}
          className="absolute left-[5%] top-[34rem] h-28 w-28 rounded-full border border-[#65A30D]/20 bg-white shadow-[0_26px_80px_rgba(63, 98, 18, 0.14)]"
          transition={{ duration: 34, ease: "linear", repeat: Infinity }}
        />
      </div>

      <Container className="relative z-10">
        {isLoading ? <LoadingState columns={3} /> : null}
        {isError ? (
          <ErrorState
            message={error?.message ?? "This marketplace service is unavailable."}
            title="Service could not be loaded"
          />
        ) : null}

        {!isLoading && service ? (
          <div className="grid gap-10">
            <MotionSection
              className="grid gap-8 rounded-[2.6rem] border border-[#3F6212]/14 bg-white p-4 shadow-[0_34px_110px_rgba(63, 98, 18, 0.12)] sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-2 py-4 sm:px-4 lg:px-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#3F6212] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_46px_rgba(63, 98, 18, 0.26)]">
                    {getDisplayLabel(service.category)}
                  </span>
                  {service.subCategory ? (
                    <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#365314]">
                      {getDisplayLabel(service.subCategory)}
                    </span>
                  ) : null}
                  {service.isFeatured ? (
                    <span className="rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                      Featured
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.08em] text-black sm:text-6xl lg:text-7xl">
                  {service.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-black/62 sm:text-lg">
                  {service.shortDescription || service.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button as="a" className="sm:min-w-44" href={startProjectHref}>
                    Start project
                  </Button>
                  <Button
                    className="sm:min-w-44"
                    isLoading={contactProviderMutation.isPending}
                    loadingLabel="Opening chat..."
                    onClick={() => contactProviderMutation.mutate()}
                    variant="secondary"
                  >
                    Contact provider
                  </Button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                  {[
                    ["Price", formatPrice(service)],
                    ["Delivery", service.deliveryTime || "Scoped"],
                    ["Orders", service.totalOrders ?? 0],
                    ["Views", service.viewCount ?? 0],
                  ].map(([label, value]) => (
                    <div className="rounded-[1.15rem] border border-black/10 bg-[#fffbeb] p-4" key={label}>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-black/42">{label}</p>
                      <p className="mt-2 text-xl font-black tracking-[-0.05em] text-black">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <ServiceImageGallery
                images={galleryImages}
                selectedImage={selectedImage}
                selectedImageIndex={selectedImageIndex}
                serviceTitle={service.title}
                setSelectedImageIndex={(index) =>
                  setSelectedGallery({ index, serviceId: service._id })
                }
              />
            </MotionSection>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">
              <main className="grid min-w-0 gap-7">
                <ProviderMiniProfile provider={service.provider} />

                <DetailSection eyebrow="Description" title="Service scope and execution approach.">
                  <div className="grid gap-5 text-base font-medium leading-8 text-black/64">
                    {(descriptionParagraphs.length ? descriptionParagraphs : [service.shortDescription]).map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </DetailSection>

                <DetailSection eyebrow="Included" title="What is included in this service.">
                  <IncludedList items={includedItems} />
                </DetailSection>

                <div className="grid gap-7 xl:grid-cols-2">
                  <DetailSection eyebrow="Pricing" title="Clear terms before kickoff.">
                    <InfoTiles
                      items={[
                        ["Pricing", formatPrice(service)],
                        ["Type", getDisplayLabel(service.pricingType)],
                        ["Reviews", service.totalReviews ?? 0],
                        ["Saved", service.saveCount ?? 0],
                      ]}
                    />
                  </DetailSection>
                  <DetailSection eyebrow="Delivery" title="Timeline and handoff details.">
                    <InfoTiles
                      items={[
                        ["Timeline", service.deliveryTime || "Scoped after kickoff"],
                        ["Revisions", service.revisions > 0 ? service.revisions : "Flexible"],
                        ["Status", getDisplayLabel(service.status)],
                        ["Provider", providerName],
                      ]}
                    />
                  </DetailSection>
                </div>

                <ReviewsPlaceholder reviews={serviceReviews} service={service} />

                {relatedServices.length > 0 ? (
                  <DetailSection eyebrow="Related services" title="Similar operators worth shortlisting.">
                    <div className="grid gap-5 md:grid-cols-6">
                      {relatedServices.map((item, index) => (
                        <MarketplaceServiceCard
                          index={index + 1}
                          isAuthenticated={isAuthenticated}
                          key={item._id}
                          onToggleSave={(targetService) => favoriteMutation.mutate(targetService)}
                          service={item}
                        />
                      ))}
                    </div>
                  </DetailSection>
                ) : null}

                <MotionSection
                  className="overflow-hidden rounded-[2.2rem] bg-black p-7 text-white shadow-[0_32px_90px_rgba(0,0,0,0.16)] sm:p-9"
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#65A30D]">
                        Start with confidence
                      </p>
                      <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.065em]">
                        Turn this service into a scoped project.
                      </h2>
                      <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/62">
                        Contact the provider, confirm scope, then move into projects and payments
                        when both sides are aligned.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button as="a" href={startProjectHref}>
                        Start project
                      </Button>
                      <Button
                        isLoading={contactProviderMutation.isPending}
                        loadingLabel="Opening chat..."
                        onClick={() => contactProviderMutation.mutate()}
                        variant="secondary"
                      >
                        Contact provider
                      </Button>
                    </div>
                  </div>
                </MotionSection>
              </main>

              <aside className="grid content-start gap-5 lg:sticky lg:top-24">
                <section className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_28px_90px_rgba(63, 98, 18, 0.12)]">
                  <div className="rounded-[1.5rem] bg-black p-6 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#65A30D]">
                      Pricing and contact
                    </p>
                    <p className="mt-4 text-5xl font-black tracking-[-0.075em]">
                      {formatPrice(service)}
                    </p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-white/58">
                      {service.deliveryTime || "Scoped delivery"} with provider-led execution.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <Button as="a" href={startProjectHref}>
                      Start project
                    </Button>
                    <Button
                      isLoading={contactProviderMutation.isPending}
                      loadingLabel="Opening chat..."
                      onClick={() => contactProviderMutation.mutate()}
                      variant="secondary"
                    >
                      Contact provider
                    </Button>
                    <Button
                      isLoading={isSavingCurrent}
                      loadingLabel="Saving..."
                      onClick={() => favoriteMutation.mutate(serviceWithSavedState)}
                      variant={serviceWithSavedState.isSaved ? "outline" : "secondary"}
                    >
                      <span className="inline-flex items-center gap-2">
                        <BookmarkIcon isSaved={Boolean(serviceWithSavedState.isSaved)} />
                        {serviceWithSavedState.isSaved ? "Remove saved" : "Save service"}
                      </span>
                    </Button>
                    <button
                      className="min-h-12 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black/58 transition duration-300 hover:border-[#3F6212]/45 hover:bg-[#3F6212] hover:text-white hover:shadow-[0_20px_58px_rgba(63, 98, 18, 0.18)]"
                      onClick={() => setReportedServiceId(service._id)}
                      type="button"
                    >
                      Report service
                    </button>
                  </div>

                  {(favoriteMutation.isError || contactProviderMutation.isError || reportMessage) ? (
                    <div className="mt-4 grid gap-3">
                      {favoriteMutation.isError ? (
                        <StatusBanner tone="error">{favoriteMutation.error?.message}</StatusBanner>
                      ) : null}
                      {contactProviderMutation.isError ? (
                        <StatusBanner tone="error">{contactProviderMutation.error?.message}</StatusBanner>
                      ) : null}
                      {reportMessage ? <StatusBanner tone="success">{reportMessage}</StatusBanner> : null}
                    </div>
                  ) : null}
                </section>

                <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">Provider</p>
                  <div className="mt-4 flex items-center gap-3">
                    <ProviderAvatar avatar={service.provider?.avatar} name={providerName} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-black">{providerName}</p>
                      <p className="truncate text-sm font-semibold text-black/48">
                        {service.provider?.headline || "Marketplace provider"}
                      </p>
                    </div>
                  </div>
                  {service.provider?.publicUrl ? (
                    <Button as="a" className="mt-5 w-full" href={service.provider.publicUrl} variant="outline">
                      Open public profile
                    </Button>
                  ) : null}
                </section>

                {(service.tags?.length || service.skills?.length) ? (
                  <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)]">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">Skills and tags</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {[...(service.tags ?? []), ...(service.skills ?? [])].slice(0, 12).map((tag) => (
                        <span
                          className="rounded-full border border-[#3F6212]/12 bg-[#3F6212]/8 px-3 py-1.5 text-xs font-black text-[#365314]"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}
              </aside>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/92 px-4 py-3 shadow-[0_-18px_50px_rgba(63, 98, 18, 0.12)] backdrop-blur-xl lg:hidden">
              <div className="mx-auto grid max-w-md grid-cols-[1fr_auto] items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">
                    {formatPrice(service)}
                  </p>
                  <p className="truncate text-sm font-black text-black">
                    {service.deliveryTime || "Scoped delivery"}
                  </p>
                </div>
                <Button as="a" className="min-h-11 px-5 py-2" href={startProjectHref}>
                  Start
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
