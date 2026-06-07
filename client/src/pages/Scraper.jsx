import { useState } from "react";
import { Button } from "../components/Button.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useLeadScrapeJobs, useStartLeadScrape } from "../hooks/useLeadScraper.js";
import { useMySubscription } from "../hooks/useSubscription.js";

const statusClasses = {
  completed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  failed: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  pending: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  queued: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  running: "border-sky-300/20 bg-sky-300/10 text-sky-100",
};

function formatLimit(value) {
  return value === null || value === undefined ? "Unlimited" : value;
}

export function Scraper() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useAuth();
  const { error, isError, isLoading, jobs } = useLeadScrapeJobs(isAuthenticated);
  const { subscription } = useMySubscription(isAuthenticated);
  const startScrapeMutation = useStartLeadScrape();
  const limits = subscription?.limits ?? {};

  async function handleSubmit(event) {
    event.preventDefault();

    if (keyword.trim().length < 3) {
      setMessage("Enter a keyword with at least 3 characters.");
      return;
    }

    try {
      await startScrapeMutation.mutateAsync({
        keyword: keyword.trim(),
        location: location.trim(),
      });
      setKeyword("");
      setLocation("");
      setMessage("Scrape job queued. New leads will appear after processing.");
    } catch (requestError) {
      setMessage(requestError.message ?? "Unable to start scrape job.");
    }
  }

  return (
    <SaaSLayout eyebrow="Automation" title="Lead Scraper">
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl border border-[#A78BFA]/20 bg-[linear-gradient(135deg,rgba(124, 58, 237, 0.28),rgba(255,255,255,0.06)_45%,rgba(109,40,217,0.18))] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-[#A78BFA]/20 blur-3xl animate-pulse-glow" />
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Prospecting
          </p>
          <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            Scrape public lead data
          </h2>
          <p className="relative mt-4 max-w-2xl text-sm leading-6 text-white/72">
            Enter a market keyword, queue an async scrape, and save discovered
            company records directly into your CRM.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            className="rounded-3xl border border-[#A78BFA]/15 bg-white/[0.065] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-bold text-white">Start scrape</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Current usage: {limits.scrapeRequestsToday ?? limits.scrapeRequestsThisMonth ?? 0} /{" "}
              {formatLimit(limits.scrapeLimitDaily ?? limits.scrapeLimitMonthly)} scrape requests.
            </p>

            <div className="mt-6 grid gap-3">
              <input
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-[#07030D]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => {
                  setKeyword(event.target.value);
                  setMessage("");
                }}
                placeholder="real estate USA"
                value={keyword}
              />
              <input
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-[#07030D]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => {
                  setLocation(event.target.value);
                  setMessage("");
                }}
                placeholder="Location, optional"
                value={location}
              />
              <Button
                disabled={!keyword.trim()}
                isLoading={startScrapeMutation.isPending}
                loadingLabel="Queueing..."
                type="submit"
              >
                Start Scrape
              </Button>
            </div>

            {message ? <StatusBanner className="mt-5">{message}</StatusBanner> : null}
            {isError ? (
              <StatusBanner className="mt-5" tone="error">
                {error}
              </StatusBanner>
            ) : null}
          </form>

          <section className="rounded-3xl border border-[#A78BFA]/15 bg-white/[0.065] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Jobs
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  Recent scrape activity
                </h3>
              </div>
              {isLoading ? <span className="text-xs text-slate-500">Loading...</span> : null}
            </div>

            <div className="mt-6 grid gap-3">
              {!isLoading && jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#07030D]/55 px-4 py-8 text-sm text-white/48">
                  No scrape jobs yet.
                </div>
              ) : null}
              {jobs.map((job) => (
                <div
                  className="rounded-2xl border border-white/10 bg-[#07030D]/70 p-4"
                  key={job._id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{job.keyword}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Found {job.discoveredCount} / saved {job.savedCount}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClasses[job.status] ?? statusClasses.queued}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  {job.errorMessage ? (
                    <p className="mt-3 text-xs leading-5 text-rose-200">
                      {job.errorMessage}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SaaSLayout>
  );
}
