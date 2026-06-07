import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { PortfolioCard } from "../components/PortfolioCard.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { usePortfolio } from "../hooks/usePortfolio.js";

export function PortfolioPreview({ id = "portfolio" }) {
  const { error, isEmpty, isError, isLoading, portfolio } = usePortfolio();
  const [activeIndustry, setActiveIndustry] = useState("All");

  const industries = useMemo(
    () => ["All", ...new Set(portfolio.map((item) => item.industry))],
    [portfolio],
  );

  const filteredPortfolio = useMemo(() => {
    if (activeIndustry === "All") {
      return portfolio;
    }

    return portfolio.filter((item) => item.industry === activeIndustry);
  }, [activeIndustry, portfolio]);

  return (
    <section
      id={id}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#F8F4FF_54%,#ffffff_100%)] py-20 sm:py-24 lg:py-32"
    >
      <div className="absolute left-[12%] top-20 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="relative flex flex-col gap-8 lg:ml-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="A snapshot of the outcomes our systems are designed to create: more qualified demand, faster response, and cleaner delivery."
            eyebrow="Portfolio"
            title="Proof with numbers attached."
          />
          {!isLoading && !isError && portfolio.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition duration-300 ${
                    activeIndustry === industry
                      ? "border-black bg-black text-white shadow-[0_18px_50px_rgba(124, 58, 237, 0.22)]"
                      : "border-black/10 bg-white text-black/58 hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:bg-[#7C3AED] hover:text-white"
                  }`}
                  onClick={() => setActiveIndustry(industry)}
                  type="button"
                >
                  {industry}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-12">
          {isLoading ? (
            <LoadingSpinner label="Loading portfolio..." />
          ) : null}

          {isError ? (
            <ErrorState
              message={error}
              title="Portfolio could not be loaded"
            />
          ) : null}

          {isEmpty ? (
            <EmptyState
              description="No portfolio items are available yet. Add portfolio records from the admin panel to populate this grid."
              title="No portfolio items found"
            />
          ) : null}

          {!isLoading && !isError && !isEmpty && filteredPortfolio.length === 0 ? (
            <EmptyState
              description="No case studies match the selected industry filter."
              title="No matching case studies"
            />
          ) : null}

          {!isLoading && !isError && filteredPortfolio.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
              {filteredPortfolio.map((item, index) => (
                <PortfolioCard
                  className={index % 5 === 0 ? "xl:col-span-5" : index % 5 === 1 ? "xl:col-span-7" : "xl:col-span-4"}
                  key={item._id}
                  item={item}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex justify-center">
          <Button as="a" className="w-full sm:w-auto" href="/contact">
            Build Results Like These
          </Button>
        </div>
      </div>
    </section>
  );
}
