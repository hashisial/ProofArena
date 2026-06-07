import { lazy, Suspense } from "react";
import { Button } from "../components/Button.jsx";
import { LazySection } from "../components/LazySection.jsx";
import { PageFallback } from "../components/PageFallback.jsx";
import { ROUTES } from "../constants/index.js";

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
const PortfolioPreview = lazy(() =>
  import("../sections/PortfolioPreview.jsx").then((module) => ({
    default: module.PortfolioPreview,
  })),
);
const PlacedArticles = lazy(() =>
  import("../sections/PlacedArticles.jsx").then((module) => ({
    default: module.PlacedArticles,
  })),
);

export function Portfolio() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="absolute left-[10%] top-16 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#7C3AED]">
              Portfolio
            </p>
            <h1 className="mobile-safe-text mt-5 max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
              Case studies built around outcomes, not decoration.
            </h1>
          </div>
          <div>
            <p className="max-w-xl text-base leading-7 text-black/58">
              Filter by industry, inspect result highlights, compare before and
              after states, and use the proof to choose your next growth system.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.CONTACT}>Start Your Project</Button>
              <Button as="a" className="w-full sm:w-auto" href={ROUTES.BLOG} variant="outline">Read Strategy</Button>
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<PageFallback label="Loading portfolio..." />}>
        <PortfolioPreview />
      </Suspense>
      <LazySection fallbackLabel="Loading portfolio articles...">
        <PlacedArticles placement="portfolio" title="Articles placed on portfolio." />
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
