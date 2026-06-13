import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { MarketplaceServiceCard } from "../components/MarketplaceServiceCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  deleteSavedItem,
  getMarketplaceCategories,
  getMarketplaceCategoryBySlug,
  getSavedItems,
  saveItem,
  searchMarketplaceServices,
  searchProviders,
} from "../services/api.js";
import { getInitials } from "../utils/index.js";

const MotionAnchor = motion.a;
const MotionDiv = motion.div;
const MotionSection = motion.section;

function createInitialFilters(categorySlug = "") {
  return {
    category: categorySlug,
    deliveryTime: "",
    limit: 12,
    maxPrice: "",
    minPrice: "",
    page: 1,
    pricingType: "",
    rating: "",
    search: "",
    sort: "featured",
    tags: "",
  };
}

const sortOptions = [
  ["featured", "Curated first"],
  ["relevance", "Best match"],
  ["popular", "Most ordered"],
  ["rating_desc", "Highest rated"],
  ["newest", "Newest"],
  ["price_asc", "Lowest price"],
  ["price_desc", "Highest price"],
];

const pricingOptions = [
  ["", "All"],
  ["fixed", "Fixed"],
  ["hourly", "Hourly"],
  ["custom", "Custom"],
];

const deliveryOptions = [
  ["", "Any delivery"],
  ["24h", "24 hours"],
  ["3d", "Up to 3 days"],
  ["7d", "Up to 7 days"],
  ["14d", "Up to 14 days"],
  ["30d", "Up to 30 days"],
];

const ratingOptions = [
  ["", "Any rating"],
  ["4.5", "4.5+"],
  ["4", "4.0+"],
  ["3", "3.0+"],
];

const fieldClass =
  "h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black outline-none transition placeholder:text-black/30 focus:border-[#3F6212]/50 focus:ring-4 focus:ring-[#3F6212]/10";

function getCategoryLabel(categoryId, categories = []) {
  return categories.find((category) => category.slug === categoryId)?.name ?? categoryId;
}

function toQueryFilters(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  );
}

function normalizeProviderFilters(filters) {
  return {
    category: filters.category,
    limit: 5,
    maxRate: filters.maxPrice,
    minRate: filters.minPrice,
    minRating: filters.rating,
    q: filters.search || filters.tags,
    skills: filters.tags,
    sort: "rating_desc",
  };
}

function FilterLabel({ children, label }) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-black/45">
      {label}
      {children}
    </label>
  );
}

function SegmentedFilter({ label, name, onChange, options, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map(([optionValue, optionLabel]) => {
          const isActive = value === optionValue;

          return (
            <button
              className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-300 ${
                isActive
                  ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_14px_40px_rgba(63, 98, 18, 0.24)]"
                  : "border-black/10 bg-white text-black/58 hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:bg-[#3F6212] hover:text-white"
              }`}
              key={optionValue || "all"}
              onClick={() => onChange(name, optionValue)}
              type="button"
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const horizontalScrollClass =
  "flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function CategoryNavigation({ activeCategory, categories }) {
  return (
    <nav className={horizontalScrollClass} aria-label="Marketplace categories">
      <a
        className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold shadow-[0_18px_48px_rgba(0,0,0,0.12)] transition hover:bg-[#3F6212] hover:text-white ${
          !activeCategory
            ? "border-black/10 bg-black text-white"
            : "border-[#3F6212]/16 bg-white text-black/62"
        }`}
        href="/marketplace"
      >
        All categories
      </a>
      {categories.map((category) => (
        <a
          className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:border-[#3F6212]/40 hover:bg-[#3F6212] hover:text-white hover:shadow-[0_18px_48px_rgba(63, 98, 18, 0.18)] ${
            activeCategory === category.slug
              ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_18px_48px_rgba(63, 98, 18, 0.22)]"
              : "border-[#3F6212]/16 bg-white text-black/62"
          }`}
          href={`/marketplace/category/${category.slug}`}
          key={category.slug}
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}

function CategoryFilters({ activeCategory, categories, onChange }) {
  return (
    <div className={horizontalScrollClass}>
      <button
        className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
          !activeCategory
            ? "border-[#3F6212] bg-black text-white shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
            : "border-black/10 bg-white text-black/58 hover:border-[#3F6212]/35 hover:text-black"
        }`}
        onClick={() => onChange("category", "")}
        type="button"
      >
        All categories
      </button>
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;

        return (
          <button
            className={`shrink-0 rounded-full border px-5 py-3 text-sm font-bold transition ${
              isActive
                ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_18px_48px_rgba(63, 98, 18, 0.22)]"
                : "border-black/10 bg-white text-black/58 hover:border-[#3F6212]/35 hover:text-black"
            }`}
            key={category.slug}
            onClick={() => onChange("category", category.slug)}
            type="button"
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

function ActiveFilterBar({ categories, filters, onClear, onRemove }) {
  const chips = [
    filters.category ? ["category", getCategoryLabel(filters.category, categories)] : null,
    filters.pricingType ? ["pricingType", filters.pricingType] : null,
    filters.deliveryTime ? ["deliveryTime", deliveryOptions.find(([value]) => value === filters.deliveryTime)?.[1]] : null,
    filters.rating ? ["rating", `${filters.rating}+ rating`] : null,
    filters.tags ? ["tags", filters.tags] : null,
    filters.minPrice ? ["minPrice", `from $${filters.minPrice}`] : null,
    filters.maxPrice ? ["maxPrice", `under $${filters.maxPrice}`] : null,
  ].filter(Boolean);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map(([key, label]) => (
        <button
          className="rounded-full border border-[#3F6212]/20 bg-[#F7FEE7] px-3 py-1.5 text-xs font-bold text-[#365314] transition hover:bg-[#3F6212] hover:text-white"
          key={`${key}-${label}`}
          onClick={() => onRemove(key)}
          type="button"
        >
          {label} x
        </button>
      ))}
      <button
        className="rounded-full px-3 py-1.5 text-xs font-bold text-black/45 underline decoration-black/20 underline-offset-4 transition hover:text-black"
        onClick={onClear}
        type="button"
      >
        Clear all
      </button>
    </div>
  );
}

function ProviderSpotlight({ provider }) {
  const name = provider.user?.name || provider.user?.fullName || "Provider";
  const isVerified =
    provider.verificationStatus === "verified" ||
    provider.user?.verificationStatus === "verified" ||
    provider.user?.isVerified;

  return (
    <MotionAnchor
      className="group relative grid gap-4 overflow-hidden rounded-[1.7rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] transition hover:border-[#3F6212]/34"
      href={provider.publicUrl || `/providers/${provider.user?.username ?? ""}`}
      initial={{ opacity: 0, x: 18 }}
      layout
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ x: 3 }}
      whileInView={{ opacity: 1, x: 0 }}
    >
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#3F6212]/10 blur-3xl transition group-hover:bg-[#3F6212]/18" />
      <div className="relative flex items-center gap-3">
        {provider.profilePicture ? (
          <img alt="" className="h-14 w-14 rounded-2xl object-cover" src={provider.profilePicture} />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3F6212] text-sm font-bold text-white">
            {getInitials(name)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-black">{name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-[#3F6212]">
              {provider.availability}
            </p>
            {isVerified ? (
              <span className="rounded-full bg-[#3F6212] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white">
                Verified
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <p className="relative line-clamp-2 text-sm leading-6 text-black/58">
        {provider.title}
      </p>
      <div className="relative flex flex-wrap gap-2">
        {provider.skills?.slice(0, 4).map((skill) => (
          <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-bold text-black/58" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </MotionAnchor>
  );
}

function CategoryLandingPanel({ categories, filters, onChange, providers, selectedCategory, services }) {
  if (!selectedCategory) {
    return null;
  }

  const relatedCategories = categories
    .filter((category) => category.slug !== selectedCategory.slug)
    .slice(0, 4);
  const popularServices = services.slice(0, 3);
  const topProviders = providers.slice(0, 3);

  return (
    <MotionSection
      className="overflow-hidden rounded-[2.35rem] border border-[#3F6212]/14 bg-white shadow-[0_28px_90px_rgba(63, 98, 18, 0.09)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.45 }}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3F6212]">
            {selectedCategory.name}
          </p>
          <h2 className="mt-3 max-w-3xl break-words text-[2.2rem] font-black leading-[0.98] tracking-[-0.055em] text-black sm:text-5xl sm:tracking-[-0.065em]">
            A focused category page for finding serious operators faster.
          </h2>
          <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-black/58">
            {selectedCategory.description}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              className="min-h-[3.25rem] rounded-[1.2rem] border border-black/10 bg-[#fefce8] px-5 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/50 focus:ring-4 focus:ring-[#3F6212]/10"
              name="search"
              onChange={(event) => onChange("search", event.target.value)}
              placeholder={`Search inside ${selectedCategory.name.toLowerCase()}...`}
              value={filters.search}
            />
            <Button as="a" href="/providers" variant="outline">
              Browse providers
            </Button>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {popularServices.length > 0 ? popularServices.map((service) => (
              <a
                className="group rounded-[1.35rem] border border-black/10 bg-[#fefce8] p-4 transition hover:-translate-y-0.5 hover:border-[#3F6212]/34 hover:bg-white hover:shadow-[0_18px_55px_rgba(63, 98, 18, 0.12)]"
                href={`/marketplace/service/${service.slug || service._id}`}
                key={service._id}
              >
                <p className="line-clamp-2 text-lg font-black leading-tight tracking-[-0.04em] text-black">
                  {service.title}
                </p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                  {service.deliveryTime || "Scoped delivery"}
                </p>
              </a>
            )) : (
              <div className="rounded-[1.35rem] border border-dashed border-[#3F6212]/22 bg-[#fefce8] p-4 md:col-span-3">
                <p className="text-sm font-bold text-black/54">
                  Popular services will appear here as this category grows.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="grid min-w-0 content-between gap-6 border-t border-black/10 bg-black p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#65A30D]">
              Top providers
            </p>
            <div className="mt-5 grid gap-3">
              {topProviders.length > 0 ? topProviders.map((provider) => {
                const name = provider.user?.name || provider.user?.fullName || provider.title || "Provider";
                const isVerified =
                  provider.verificationStatus === "verified" ||
                  provider.user?.verificationStatus === "verified" ||
                  provider.user?.isVerified;

                return (
                  <a
                    className="rounded-[1.25rem] border border-white/12 bg-white/8 p-4 transition hover:border-[#65A30D]/45 hover:bg-white/12"
                    href={provider.publicUrl || `/providers/${provider.user?.username ?? ""}`}
                    key={provider.id || provider._id || provider.username || provider.user?.username}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-base font-black">{name}</p>
                      {isVerified ? (
                        <span className="rounded-full bg-[#3F6212] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                          Verified
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">{provider.title}</p>
                  </a>
                );
              }) : (
                <p className="rounded-[1.25rem] border border-white/12 bg-white/8 p-4 text-sm font-semibold text-white/58">
                  Top providers will appear after provider profiles match this category.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#65A30D]">
              Related categories
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedCategories.map((category) => (
                <a
                  className="rounded-full border border-white/12 bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-[#3F6212] hover:text-white"
                  href={`/marketplace/category/${category.slug}`}
                  key={category.slug}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </MotionSection>
  );
}

function MobileFilterDrawer({
  categories,
  filters,
  isOpen,
  onChange,
  onClear,
  onClose,
  onFieldChange,
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close filters"
            className="absolute inset-0 bg-black/34 backdrop-blur-sm"
            onClick={onClose}
            type="button"
          />
          <MotionDiv
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] border border-[#3F6212]/16 bg-white p-5 shadow-[0_-24px_80px_rgba(63, 98, 18, 0.2)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">Filters</p>
                <h3 className="mt-1 text-2xl font-black tracking-[-0.055em] text-black">Refine marketplace</h3>
              </div>
              <button
                className="h-11 w-11 rounded-full border border-black/10 bg-white text-xl font-black text-black transition hover:bg-[#3F6212] hover:text-white"
                onClick={onClose}
                type="button"
              >
                x
              </button>
            </div>

            <div className="grid gap-5">
              <FilterLabel label="Search">
                <input
                  className={fieldClass}
                  name="search"
                  onChange={onFieldChange}
                  placeholder="Search services or skills"
                  value={filters.search}
                />
              </FilterLabel>
              <CategoryFilters activeCategory={filters.category} categories={categories} onChange={onChange} />
              <SegmentedFilter
                label="Pricing model"
                name="pricingType"
                onChange={onChange}
                options={pricingOptions}
                value={filters.pricingType}
              />
              <SegmentedFilter
                label="Rating"
                name="rating"
                onChange={onChange}
                options={ratingOptions}
                value={filters.rating}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={fieldClass} min="0" name="minPrice" onChange={onFieldChange} placeholder="Minimum price/rate" type="number" value={filters.minPrice} />
                <input className={fieldClass} min="0" name="maxPrice" onChange={onFieldChange} placeholder="Maximum price/rate" type="number" value={filters.maxPrice} />
                <select className={fieldClass} name="deliveryTime" onChange={onFieldChange} value={filters.deliveryTime}>
                  {deliveryOptions.map(([value, label]) => (
                    <option key={value || "all"} value={value}>{label}</option>
                  ))}
                </select>
                <input className={fieldClass} name="tags" onChange={onFieldChange} placeholder="Skills or tags" value={filters.tags} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={onClose} type="button">Apply</Button>
                <Button onClick={onClear} type="button" variant="outline">Reset</Button>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}

function Pagination({ pagination, onPageChange }) {
  const page = pagination?.page ?? 1;
  const total = pagination?.total ?? 0;
  const limit = pagination?.limit ?? 12;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-black/10 bg-white p-3 shadow-[0_18px_55px_rgba(63, 98, 18, 0.07)] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold text-black/52">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)} type="button" variant="secondary">
          Previous
        </Button>
        <Button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} type="button">
          Next
        </Button>
      </div>
    </div>
  );
}

export function Marketplace({ categorySlug = "" }) {
  const landingCategorySlug = String(categorySlug ?? "").trim();
  const baseFilters = useMemo(
    () => createInitialFilters(landingCategorySlug),
    [landingCategorySlug],
  );
  const [filters, setFilters] = useState(baseFilters);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState("grid");
  const deferredFilters = useDeferredValue(filters);
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuth();
  const serviceFilters = useMemo(() => toQueryFilters(deferredFilters), [deferredFilters]);
  const providerFilters = useMemo(() => toQueryFilters(normalizeProviderFilters(deferredFilters)), [deferredFilters]);
  const canSave = isAuthenticated && role === "client";

  const categoriesQuery = useQuery({
    queryFn: getMarketplaceCategories,
    queryKey: ["marketplace", "categories"],
    staleTime: 120_000,
  });
  const categoryQuery = useQuery({
    enabled: Boolean(landingCategorySlug),
    queryFn: () => getMarketplaceCategoryBySlug(landingCategorySlug),
    queryKey: ["marketplace", "category", landingCategorySlug],
    staleTime: 120_000,
  });
  const servicesQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () => searchMarketplaceServices(serviceFilters),
    queryKey: ["marketplace", "services", serviceFilters],
    staleTime: 20_000,
  });
  const providersQuery = useQuery({
    placeholderData: (previousData) => previousData,
    queryFn: () => searchProviders(providerFilters),
    queryKey: ["marketplace", "providers", providerFilters],
    staleTime: 20_000,
  });
  const savedItemsQuery = useQuery({
    enabled: canSave,
    queryFn: getSavedItems,
    queryKey: ["saved-items"],
    staleTime: 20_000,
  });
  const savedServicesById = useMemo(
    () =>
      new Map(
        (savedItemsQuery.data ?? [])
          .filter((item) => item.itemType === "service" && item.serviceId)
          .map((item) => [item.serviceId, item]),
      ),
    [savedItemsQuery.data],
  );
  const favoriteMutation = useMutation({
    mutationFn: async (service) => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      if (role !== "client") {
        throw new Error("Only client accounts can save services.");
      }

      if (service.savedItemId) {
        return deleteSavedItem(service.savedItemId);
      }

      return saveItem({
        itemType: "service",
        serviceId: service._id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace", "services"] });
    },
  });
  const services = (servicesQuery.data?.items ?? []).map((service) => {
    const savedItem = savedServicesById.get(service._id);

    return {
      ...service,
      isSaved: Boolean(service.isSaved || savedItem),
      savedItemId: savedItem?._id ?? "",
    };
  });
  const providers = providersQuery.data?.items ?? [];
  const isRefreshing = servicesQuery.isFetching && !servicesQuery.isLoading;
  const categories = categoriesQuery.data ?? [];
  const selectedCategory =
    categoryQuery.data ?? categories.find((category) => category.slug === filters.category);

  function updateFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: name === "page" ? value : 1,
    }));
  }

  function updateField(event) {
    updateFilter(event.target.name, event.target.value);
  }

  function clearFilters() {
    setFilters(baseFilters);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fefce8_48%,#ffffff_100%)] text-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <MotionDiv
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          className="absolute right-[6%] top-24 h-80 w-80 rounded-[6rem] border border-[#3F6212]/14 bg-[#3F6212]/6 blur-[1px]"
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        />
        <MotionDiv
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          className="absolute left-[7%] top-[34rem] h-52 w-52 rounded-full bg-[#65A30D]/18 blur-3xl"
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <MotionDiv className="min-w-0" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3F6212]">
              {selectedCategory ? "Category marketplace" : "Services marketplace"}
            </p>
            <h1 className="mt-5 max-w-[9.6ch] break-words text-[2.55rem] font-bold leading-[0.96] tracking-[-0.055em] text-black sm:max-w-4xl sm:text-7xl sm:leading-[0.94] sm:tracking-[-0.075em]">
              {selectedCategory
                ? `${selectedCategory.name} services built for serious execution.`
                : "Find the right operator before you open a project."}
            </h1>
          </MotionDiv>
          <MotionDiv
            className="grid min-w-0 gap-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
          >
            <p className="max-w-[30ch] text-base leading-7 text-black/60 sm:max-w-xl">
              {selectedCategory?.description ||
                "Search services by title, provider, skills, tags, delivery speed, price, and rating. Save strong matches, inspect profiles, then move into messages and projects."}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Active services", servicesQuery.data?.pagination?.total ?? services.length],
                ["Featured providers", providersQuery.data?.pagination?.total ?? providers.length],
                ["Filter latency", isRefreshing ? "Refreshing" : "Instant"],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-[#3F6212]/14 bg-white p-4 shadow-[0_16px_45px_rgba(63, 98, 18, 0.07)]" key={label}>
                  <p className="text-2xl font-bold tracking-[-0.05em] text-black">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-black/42">{label}</p>
                </div>
              ))}
            </div>
          </MotionDiv>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">Browse categories</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-black">
                Move by market need, not by template.
              </h2>
            </div>
            {categoriesQuery.isError ? (
              <p className="text-sm font-semibold text-black/46">Using default categories.</p>
            ) : null}
          </div>
          <CategoryNavigation activeCategory={filters.category} categories={categories} />
        </div>

        <CategoryLandingPanel
          categories={categories}
          filters={filters}
          onChange={updateFilter}
          providers={providers}
          selectedCategory={selectedCategory}
          services={services}
        />

        <div className="sticky top-0 z-30 -mx-4 grid gap-3 border-y border-[#3F6212]/12 bg-white/92 px-4 py-3 shadow-[0_18px_50px_rgba(63, 98, 18, 0.08)] backdrop-blur-xl lg:hidden">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <input
              className="min-h-12 min-w-0 rounded-[1.1rem] border border-black/10 bg-white px-4 text-sm font-semibold text-black outline-none placeholder:text-black/32 focus:border-[#3F6212]/50 focus:ring-4 focus:ring-[#3F6212]/10"
              name="search"
              onChange={updateField}
              placeholder="Search marketplace..."
              value={filters.search}
            />
            <Button
              className="min-h-12 px-5"
              onClick={() => setMobileFiltersOpen(true)}
              type="button"
              variant="outline"
            >
              Filters
            </Button>
          </div>
        </div>

        <MotionSection
          className="hidden rounded-[2.2rem] border border-[#3F6212]/16 bg-white/88 p-4 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] backdrop-blur-2xl md:p-6 lg:block"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <div className="grid gap-5">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_220px_180px]">
              <FilterLabel label="Search services, providers, skills">
                <div className="relative">
                  <input
                    className="h-14 w-full rounded-[1.35rem] border border-black/10 bg-white px-5 pr-14 text-base font-semibold text-black outline-none transition placeholder:text-black/30 focus:border-[#3F6212]/50 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="search"
                    onChange={updateField}
                    placeholder="Funnels, React, Web3 support, provider name..."
                    value={filters.search}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-[#3F6212] px-3 py-1 text-xs font-black text-white">
                    Search
                  </span>
                </div>
              </FilterLabel>
              <FilterLabel label="Sort">
                <select className={fieldClass} name="sort" onChange={updateField} value={filters.sort}>
                  {sortOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </FilterLabel>
              <FilterLabel label="View">
                <div className="grid h-12 grid-cols-2 rounded-2xl border border-black/10 bg-white p-1">
                  {["grid", "list"].map((viewMode) => (
                    <button
                      className={`rounded-xl text-sm font-bold capitalize transition ${
                        view === viewMode ? "bg-black text-white" : "text-black/52 hover:bg-[#3F6212]/8 hover:text-black"
                      }`}
                      key={viewMode}
                      onClick={() => setView(viewMode)}
                      type="button"
                    >
                      {viewMode}
                    </button>
                  ))}
                </div>
              </FilterLabel>
            </div>

            <CategoryFilters
              activeCategory={filters.category}
              categories={categories}
              onChange={updateFilter}
            />

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <SegmentedFilter
                label="Pricing model"
                name="pricingType"
                onChange={updateFilter}
                options={pricingOptions}
                value={filters.pricingType}
              />
              <SegmentedFilter
                label="Rating"
                name="rating"
                onChange={updateFilter}
                options={ratingOptions}
                value={filters.rating}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_1.2fr]">
              <input className={fieldClass} min="0" name="minPrice" onChange={updateField} placeholder="Minimum price/rate" type="number" value={filters.minPrice} />
              <input className={fieldClass} min="0" name="maxPrice" onChange={updateField} placeholder="Maximum price/rate" type="number" value={filters.maxPrice} />
              <select className={fieldClass} name="deliveryTime" onChange={updateField} value={filters.deliveryTime}>
                {deliveryOptions.map(([value, label]) => (
                  <option key={value || "all"} value={value}>{label}</option>
                ))}
              </select>
              <input className={fieldClass} name="tags" onChange={updateField} placeholder="Skills or tags: CRM, SaaS, support" value={filters.tags} />
            </div>

            <ActiveFilterBar
              categories={categories}
              filters={filters}
              onClear={clearFilters}
              onRemove={(key) => updateFilter(key, "")}
            />
          </div>
        </MotionSection>

        <MobileFilterDrawer
          categories={categories}
          filters={filters}
          isOpen={isMobileFiltersOpen}
          onChange={updateFilter}
          onClear={clearFilters}
          onClose={() => setMobileFiltersOpen(false)}
          onFieldChange={updateField}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="grid gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">Service listings</p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-0.055em] text-black">
                  {servicesQuery.data?.pagination?.total ?? services.length} marketplace services
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {isRefreshing ? (
                  <span className="rounded-full border border-[#3F6212]/18 bg-[#F7FEE7] px-3 py-1.5 text-xs font-bold text-[#365314]">
                    Updating results
                  </span>
                ) : null}
                <a className="text-sm font-bold text-[#365314] underline decoration-[#65A30D]/40 underline-offset-4 transition hover:text-[#3F6212]" href="/provider-services">
                  Create provider listing
                </a>
              </div>
            </div>

            {servicesQuery.isError ? <ErrorState message={servicesQuery.error?.message ?? "Unable to load services."} title="Marketplace failed" /> : null}
            {servicesQuery.isLoading ? <LoadingState columns={4} /> : null}
            {!servicesQuery.isLoading && services.length === 0 ? (
              <EmptyState description="Try a wider keyword, remove a price filter, or browse all categories." title="No services found" />
            ) : null}

            <AnimatePresence mode="popLayout">
              <div className="grid gap-5 md:grid-cols-6">
                {services.map((service, index) => (
                  <MarketplaceServiceCard
                    index={index}
                    isAuthenticated={isAuthenticated}
                    key={service._id}
                    onToggleSave={(item) => favoriteMutation.mutate(item)}
                    service={service}
                    view={view}
                  />
                ))}
              </div>
            </AnimatePresence>

            <Pagination
              pagination={servicesQuery.data?.pagination}
              onPageChange={(page) => updateFilter("page", page)}
            />
          </main>

          <aside className="grid content-start gap-5 xl:sticky xl:top-24">
            <section className="rounded-[2rem] border border-black/10 bg-black p-6 text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#65A30D]">Shortlist</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.06em]">Build a serious hiring path.</h2>
              <p className="mt-4 text-sm leading-6 text-white/66">
                Save services, inspect provider profiles, then use projects and payments once the scope is ready.
              </p>
              <Button as="a" className="mt-5 w-full" href={isAuthenticated ? "/projects" : "/login"}>
                {isAuthenticated ? "Open Projects" : "Login to Save"}
              </Button>
            </section>

            <section className="grid gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">Featured providers</p>
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-black">Matched operators</h2>
              </div>
              {providersQuery.isError ? (
                <ErrorState message={providersQuery.error?.message ?? "Unable to load providers."} title="Providers failed" />
              ) : null}
              {providersQuery.isLoading ? <LoadingState columns={2} /> : null}
              {!providersQuery.isLoading && providers.length === 0 ? (
                <EmptyState description="Provider matches will appear as marketplace data grows." title="No providers matched" />
              ) : null}
              {!providersQuery.isLoading && providers.map((provider) => (
                <ProviderSpotlight
                  key={provider.id || provider._id || provider.username || provider.user?.username}
                  provider={provider}
                />
              ))}
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
