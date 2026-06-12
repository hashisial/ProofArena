import { lazy, Suspense } from "react";
import { Button } from "../components/Button.jsx";
import { LazySection } from "../components/LazySection.jsx";
import { PageFallback } from "../components/PageFallback.jsx";

const ContactSection = lazy(() =>
  import("../sections/ContactSection.jsx").then((module) => ({
    default: module.ContactSection,
  })),
);
const CTASection = lazy(() =>
  import("../sections/CTASection.jsx").then((module) => ({
    default: module.CTASection,
  })),
);
const ServicesPreview = lazy(() =>
  import("../sections/ServicesPreview.jsx").then((module) => ({
    default: module.ServicesPreview,
  })),
);
const PlacedArticles = lazy(() =>
  import("../sections/PlacedArticles.jsx").then((module) => ({
    default: module.PlacedArticles,
  })),
);

const serviceCapabilities = [
  ["Strategy", "Market analysis", "Offer positioning", "Funnel architecture"],
  ["Execution", "Landing pages", "CRM automations", "Outbound workflows"],
  ["Operations", "Support desk", "Admin systems", "Reporting dashboards"],
  ["Scale", "SaaS builds", "Analytics", "Optimization cycles"],
];

export function Services() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="absolute right-[8%] top-16 h-72 w-72 rounded-full bg-[#3F6212]/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#3F6212]">
              Services
            </p>
            <h1 className="mobile-safe-text mt-5 max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
              Solutions built for growth, support, and scalable technology.
            </h1>
          </div>
          <div>
            <p className="max-w-xl text-base leading-7 text-black/58">
              Every service category is connected to a business outcome: more
              qualified leads, faster operations, cleaner systems, and stronger
              delivery across industries.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" className="w-full sm:w-auto" href="/contact">Get Free Consultation</Button>
              <Button as="a" className="w-full sm:w-auto" href="/portfolio" variant="outline">View Results</Button>
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<PageFallback label="Loading services..." />}>
        <ServicesPreview />
      </Suspense>
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#3F6212]">
                Capability matrix
              </p>
              <h2 className="mobile-safe-text mt-4 text-3xl font-bold tracking-[-0.055em] text-black sm:text-4xl">
                Built to cover the whole growth system.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {serviceCapabilities.map(([title, ...items]) => (
                <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] transition hover:-translate-y-1 hover:border-[#3F6212]/35" key={title}>
                  <h3 className="text-2xl font-bold text-black">{title}</h3>
                  <ul className="mt-5 grid gap-3">
                    {items.map((item) => (
                      <li className="flex items-center gap-3 text-sm font-semibold text-black/62" key={item}>
                        <span className="h-px w-7 bg-[#3F6212]/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LazySection fallbackLabel="Loading service articles...">
        <PlacedArticles placement="services" title="Articles placed on services." />
      </LazySection>
      <LazySection fallbackLabel="Loading call to action...">
        <CTASection />
      </LazySection>
      <LazySection anchorId="contact" fallbackLabel="Loading contact form...">
        <ContactSection id={undefined} />
      </LazySection>
    </>
  );
}
