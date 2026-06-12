import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { ServiceCategoryCard } from "../components/ServiceCategoryCard.jsx";
import { useServices } from "../hooks/useServices.js";
import { SERVICE_CATEGORY_META } from "../utils/constants.js";

function buildServiceCategories(services) {
  return SERVICE_CATEGORY_META.map((category) => {
    const categoryServices = services.filter(
      (service) => service.category === category.id,
    );

    if (categoryServices.length === 0) {
      return null;
    }

    const representative = categoryServices[0];
    const featureSet = new Set();

    categoryServices.forEach((service) => {
      if (service.features?.length) {
        service.features.forEach((feature) => featureSet.add(feature));
        return;
      }

      featureSet.add(service.title);
    });

    return {
      _id: category.id,
      category: category.id,
      description: representative.description || category.description,
      features: Array.from(featureSet).slice(0, 3),
      icon: representative.icon || category.label.slice(0, 2).toUpperCase(),
      mediaType: representative.mediaType,
      mediaUrl: representative.mediaUrl,
      outcome: representative.outcome,
      title: category.label,
    };
  }).filter(Boolean);
}

export function ServicesPreview({ id = "services" }) {
  const { error, isEmpty, isError, isLoading, services } = useServices();
  const serviceCategories = buildServiceCategories(services);

  return (
    <section id={id} className="ambient-line relative overflow-hidden border-t border-[#65A30D]/15 bg-[linear-gradient(180deg,#365314_0%,#1A2E05_52%,#1A2E05_100%)] py-20 sm:py-24 lg:py-32">
      <div className="absolute left-0 top-0 h-28 w-full bg-gradient-to-b from-[#365314] to-transparent" />
      <div className="absolute left-1/2 top-0 h-px w-[82%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#65A30D]/70 to-transparent" />
      <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#3F6212]/25 blur-3xl" />
      <div className="absolute bottom-10 left-8 h-72 w-72 rounded-full bg-[#365314]/20 blur-3xl" />
      <div className="absolute left-[8%] top-32 h-24 w-24 rounded-[1.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl animate-float-diagonal" />
      <div className="absolute bottom-28 right-[12%] h-36 w-36 rounded-full border border-[#65A30D]/12 animate-orbit-wide" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative flex flex-col gap-8 lg:ml-16 lg:max-w-5xl">
          <SectionHeading
            description="Four operating systems, designed as one connected engine: demand, Web3 support, product development, and business operations."
            eyebrow="Services"
            tone="light"
            title="Built like a senior team, not a menu of tasks."
          />
          <p className="max-w-md text-sm leading-6 text-white/52 lg:ml-auto lg:-mt-10">
            Every engagement is shaped around the bottleneck: where revenue leaks,
            where response slows down, and where software needs to carry more of
            the workload.
          </p>
        </div>

        <div className="relative mt-16">
          {isLoading ? (
            <LoadingSpinner label="Loading services..." />
          ) : null}

          {isError ? (
            <ErrorState
              message={error}
              title="Services could not be loaded"
            />
          ) : null}

          {isEmpty || (!isError && serviceCategories.length === 0 && !isLoading) ? (
            <EmptyState
              description="No services are available yet. Add service records from the admin panel to populate this section."
              title="No services found"
            />
          ) : null}

          {!isLoading && !isError && serviceCategories.length > 0 ? (
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-12">
              {serviceCategories.map((service, index) => (
                <ServiceCategoryCard
                  className={
                    index === 0
                      ? "xl:col-span-7 xl:min-h-[430px]"
                      : index === 1
                        ? "xl:col-span-5 xl:min-h-[430px]"
                        : index === 2
                          ? "xl:col-span-5 xl:min-h-[360px]"
                          : "xl:col-span-7 xl:min-h-[360px]"
                  }
                  index={index}
                  key={service._id}
                  service={service}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
