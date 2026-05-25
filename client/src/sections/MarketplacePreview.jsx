import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import {
  getMarketplaceCategories,
  searchMarketplaceServices,
  searchProviders,
} from "../services/api.js";

const MotionSection = motion.section;

function CategoryPill({ category, index }) {
  return (
    <a
      className={`group rounded-[1.4rem] border p-5 transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/40 hover:shadow-[0_24px_70px_rgba(63, 98, 18, 0.14)] ${
        index === 0
          ? "border-black bg-black text-white md:col-span-2"
          : "border-black/10 bg-white text-black"
      }`}
      href={`/marketplace/category/${category.slug}`}
    >
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-xs font-black ${
          index === 0 ? "bg-[#3F6212] text-white" : "bg-[#3F6212]/10 text-[#365314]"
        }`}
      >
        {(category.icon || category.name || "M").slice(0, 2).toUpperCase()}
      </span>
      <h3 className="mt-5 text-2xl font-black leading-[1.02] tracking-[-0.055em]">
        {category.name}
      </h3>
      <p className={`mt-3 line-clamp-3 text-sm leading-6 ${index === 0 ? "text-white/62" : "text-black/56"}`}>
        {category.description}
      </p>
    </a>
  );
}

function MiniService({ service }) {
  return (
    <a
      className="group grid grid-cols-[74px_minmax(0,1fr)] gap-4 rounded-[1.35rem] border border-black/10 bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:shadow-[0_20px_58px_rgba(63, 98, 18, 0.13)]"
      href={`/marketplace/service/${service.slug || service._id}`}
    >
      <div className="overflow-hidden rounded-[1rem] bg-[#1A2E05]">
        {service.coverImage ? (
          <img alt="" className="h-full min-h-[74px] w-full object-cover transition duration-700 group-hover:scale-105" src={service.coverImage} />
        ) : (
          <div className="h-full min-h-[74px] bg-[linear-gradient(135deg,#1C1917,#365314)]" />
        )}
      </div>
      <div className="min-w-0 py-1">
        <p className="line-clamp-2 text-sm font-black leading-5 text-black">{service.title}</p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
          {service.deliveryTime || "Scoped delivery"}
        </p>
      </div>
    </a>
  );
}

function MiniProvider({ provider }) {
  const name = provider.user?.name || provider.user?.fullName || provider.title || "Provider";
  const isVerified =
    provider.verificationStatus === "verified" ||
    provider.user?.verificationStatus === "verified" ||
    provider.user?.isVerified;

  return (
    <a
      className="rounded-[1.35rem] border border-white/12 bg-white/8 p-4 transition hover:border-[#65A30D]/42 hover:bg-white/12"
      href={provider.publicUrl || `/providers/${provider.user?.username ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-base font-black text-white">{name}</p>
        {isVerified ? (
          <span className="rounded-full bg-[#3F6212] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
            Verified
          </span>
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/58">{provider.title}</p>
    </a>
  );
}

export function MarketplacePreview() {
  const { data: categories = [] } = useQuery({
    queryFn: getMarketplaceCategories,
    queryKey: ["marketplace", "categories"],
    staleTime: 120_000,
  });
  const { data: servicesResult } = useQuery({
    queryFn: () => searchMarketplaceServices({ limit: 4, sort: "featured" }),
    queryKey: ["marketplace", "home-services"],
    staleTime: 60_000,
  });
  const { data: providersResult } = useQuery({
    queryFn: () => searchProviders({ limit: 3, sort: "rating_desc" }),
    queryKey: ["marketplace", "home-providers"],
    staleTime: 60_000,
  });
  const services = servicesResult?.items ?? [];
  const providers = providersResult?.items ?? [];

  return (
    <MotionSection
      className="relative isolate overflow-hidden bg-white py-24 text-black sm:py-32"
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-120px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.08, 1] }}
          className="absolute right-[8%] top-20 h-64 w-64 rounded-[5rem] border border-[#3F6212]/12 bg-[#3F6212]/7"
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        />
        <div className="absolute left-[-10rem] top-40 h-[26rem] w-[26rem] rounded-full bg-[#65A30D]/16 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3F6212]">
              Marketplace
            </p>
            <h2 className="mobile-safe-text mt-5 max-w-4xl text-3xl font-black leading-[1] tracking-[-0.052em] sm:text-5xl sm:leading-[0.94] sm:tracking-[-0.075em] lg:text-7xl">
              Hire trusted experts or sell your best work.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base font-medium leading-8 text-black/60">
              Clients can discover vetted specialists by category, proof, price, and availability.
              Providers can publish polished services and build reputation inside the same platform.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" href="/marketplace">Find trusted experts</Button>
              <Button as="a" href="/provider-services" variant="outline">Sell your services</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2">
            {categories.slice(0, 5).map((category, index) => (
              <CategoryPill category={category} index={index} key={category.slug} />
            ))}
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-4 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] sm:rounded-[2rem] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">
                    Featured services
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.055em] text-black">
                    Ready-to-start offers
                  </h3>
                </div>
                <a className="text-sm font-black text-[#365314] underline decoration-[#65A30D]/40 underline-offset-4" href="/marketplace">
                  View all
                </a>
              </div>
              <div className="mt-5 grid gap-3">
                {services.length ? services.map((service) => (
                  <MiniService key={service._id} service={service} />
                )) : (
                  <p className="rounded-[1.25rem] border border-dashed border-[#3F6212]/22 bg-white p-4 text-sm font-bold text-black/54">
                    Featured services will appear when providers publish active listings.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-black p-4 text-white shadow-[0_28px_90px_rgba(0,0,0,0.16)] sm:rounded-[2rem] sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#65A30D]">
                Top providers
              </p>
              <h3 className="mt-2 text-3xl font-black tracking-[-0.055em]">Operators worth shortlisting</h3>
              <div className="mt-5 grid gap-3">
                {providers.length ? providers.map((provider) => (
                  <MiniProvider key={provider._id} provider={provider} />
                )) : (
                  <p className="rounded-[1.25rem] border border-white/12 bg-white/8 p-4 text-sm font-semibold text-white/58">
                    Top providers will appear as profiles are activated.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
