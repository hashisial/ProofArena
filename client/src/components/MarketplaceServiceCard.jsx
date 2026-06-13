import { motion } from "framer-motion";
import { formatCurrency, getInitials } from "../utils/index.js";
import { DEFAULT_MARKETPLACE_CATEGORIES, SERVICE_CATEGORY_META } from "../utils/constants.js";

const MotionArticle = motion.article;

function getCategoryLabel(categoryId) {
  return (
    SERVICE_CATEGORY_META.find((category) => category.id === categoryId)?.label ??
    DEFAULT_MARKETPLACE_CATEGORIES.find((category) => category.slug === categoryId)?.name ??
    categoryId
  );
}

function formatPrice(service) {
  if (!service.price || service.pricingType === "custom") {
    return "Custom quote";
  }

  const amount = formatCurrency(service.price, "USD", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return service.pricingType === "hourly" ? `From ${amount}/hr` : `From ${amount}`;
}

function getCardSpan(index, view) {
  if (view === "list") {
    return "md:col-span-6";
  }

  if (index === 0) {
    return "md:col-span-6 xl:col-span-4";
  }

  if (index === 1 || index % 5 === 0) {
    return "md:col-span-3 xl:col-span-2";
  }

  return "md:col-span-3";
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path d="m10 1.7 2.34 5.03 5.5.68-4.05 3.78 1.06 5.44L10 13.94l-4.85 2.69 1.06-5.44-4.05-3.78 5.5-.68L10 1.7Z" />
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

function VerifiedMiniBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#3F6212] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
      <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </svg>
      Verified
    </span>
  );
}

function ProviderAvatar({ avatar, name }) {
  if (avatar) {
    return (
      <img
        alt=""
        className="h-10 w-10 rounded-xl border border-black/10 object-cover shadow-[0_10px_28px_rgba(63, 98, 18, 0.12)]"
        loading="lazy"
        src={avatar}
      />
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-xs font-black text-white shadow-[0_10px_28px_rgba(63, 98, 18, 0.16)]">
      {getInitials(name)}
    </span>
  );
}

export function MarketplaceServiceCard({
  index = 0,
  isAuthenticated = false,
  onToggleSave,
  service,
  view = "grid",
}) {
  const providerName = service.provider?.name || service.provider?.fullName || "Marketplace provider";
  const providerUrl = service.provider?.publicUrl || `/providers/${service.provider?.username ?? ""}`;
  const serviceUrl = `/marketplace/service/${service.slug || service._id}`;
  const rating = Number(service.ratingAverage || service.provider?.rating || 0);
  const orders = service.totalOrders ?? service.provider?.completedProjects ?? 0;
  const isWide = view === "list" || index === 0;
  const image = service.coverImage || service.images?.[0] || "";
  const isProviderVerified =
    service.provider?.isVerified || service.provider?.verificationStatus === "verified";

  return (
    <MotionArticle
      className={`group relative min-w-0 overflow-hidden rounded-[1.45rem] border border-black/10 bg-white shadow-[0_18px_54px_rgba(63, 98, 18, 0.08)] transition-colors duration-300 hover:border-[#3F6212]/42 hover:shadow-[0_30px_84px_rgba(63, 98, 18, 0.18)] ${getCardSpan(index, view)}`}
      initial={{ opacity: 0, y: 18 }}
      layout
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ y: -5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#3F6212]/55 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className={isWide ? "grid h-full lg:grid-cols-[0.9fr_1.1fr]" : "grid h-full"}>
        <a
          aria-label={`View ${service.title}`}
          className={`relative block overflow-hidden bg-[#26350F] ${isWide ? "min-h-72" : "aspect-[16/10]"}`}
          href={serviceUrl}
        >
          {image ? (
            <img
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.045]"
              loading="lazy"
              src={image}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_18%,rgba(101, 163, 13, 0.58),transparent_12rem),radial-gradient(circle_at_82%_18%,rgba(63, 98, 18, 0.5),transparent_10rem),linear-gradient(135deg,#1C1917,#1c0e2e_52%,#365314)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/14 px-3 py-1.5 text-xs font-black uppercase tracking-[0.13em] text-white backdrop-blur-xl">
              {getCategoryLabel(service.category)}
            </span>
            {service.isFeatured || index === 0 ? (
              <span className="rounded-full border border-white/20 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.13em] text-black shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
                Featured
              </span>
            ) : null}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black shadow-[0_16px_38px_rgba(0,0,0,0.16)]">
              {formatPrice(service)}
            </span>
            <span className="rounded-full border border-white/18 bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-xl">
              {service.deliveryTime || "Scoped delivery"}
            </span>
          </div>
        </a>

        <div className="relative flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <a
                className={`${isWide ? "text-3xl md:text-4xl" : "text-2xl"} block font-bold leading-[1.02] tracking-[-0.055em] text-black transition hover:text-[#365314]`}
                href={serviceUrl}
              >
                {service.title}
              </a>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-black/50">
                <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 text-black/66">
                  <span className="text-[#3F6212]"><StarIcon /></span>
                  {rating.toFixed(1)}
                </span>
                <span>{orders} orders</span>
              </div>
            </div>
            <button
              aria-label={service.isSaved ? "Remove saved service" : "Save service"}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
                service.isSaved
                  ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_16px_42px_rgba(63, 98, 18, 0.24)]"
                  : "border-black/10 bg-white text-black/52 hover:border-[#3F6212]/45 hover:bg-[#3F6212] hover:text-white hover:shadow-[0_16px_42px_rgba(63, 98, 18, 0.2)]"
              }`}
              onClick={() => onToggleSave?.(service)}
              type="button"
            >
              <BookmarkIcon isSaved={Boolean(service.isSaved)} />
            </button>
          </div>

          <p className={`${isWide ? "line-clamp-4" : "line-clamp-3"} mt-4 text-sm leading-6 text-black/58`}>
            {service.shortDescription || service.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(service.tags?.length ? service.tags : service.skills ?? []).slice(0, isWide ? 7 : 4).map((tag) => (
              <span
                className="rounded-full border border-[#3F6212]/12 bg-[#3F6212]/7 px-3 py-1.5 text-xs font-bold text-[#365314]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <div className="grid gap-3 rounded-[1.15rem] border border-black/10 bg-[#fefce8] p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <a className="flex min-w-0 items-center gap-3" href={providerUrl}>
                <ProviderAvatar avatar={service.provider?.avatar} name={providerName} />
                <span className="min-w-0">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="block truncate text-sm font-black text-black">{providerName}</span>
                    {isProviderVerified ? <VerifiedMiniBadge /> : null}
                  </span>
                  <span className="block truncate text-xs font-semibold text-black/45">
                    {service.provider?.headline || "Verified marketplace provider"}
                  </span>
                </span>
              </a>
              <div className="flex gap-2">
                <a
                  className="rounded-full border border-[#3F6212]/18 bg-white px-3 py-2 text-xs font-black text-[#365314] transition hover:bg-[#3F6212] hover:text-white"
                  href={providerUrl}
                >
                  Profile
                </a>
                <a
                  className="rounded-full bg-black px-3 py-2 text-xs font-black text-white shadow-[0_14px_34px_rgba(0,0,0,0.14)] transition hover:bg-[#3F6212] hover:shadow-[0_18px_44px_rgba(63, 98, 18, 0.22)]"
                  href={serviceUrl}
                >
                  Details
                </a>
              </div>
            </div>
            {!isAuthenticated ? (
              <p className="mt-3 text-xs font-semibold text-black/38">
                Login to save this service to your shortlist.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </MotionArticle>
  );
}
