import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { useBlogs } from "../hooks/useBlogs.js";

function isVideo(url) {
  return /^data:video\//.test(url ?? "") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url ?? "");
}

function BlogMedia({ article }) {
  if (!article.mediaUrl) {
    return (
      <div className="aspect-[16/10] rounded-[1.5rem] bg-[radial-gradient(circle_at_80%_10%,rgba(167, 139, 250, 0.45),transparent_28%),linear-gradient(135deg,#07030D,#7C3AED)]" />
    );
  }

  return isVideo(article.mediaUrl) ? (
    <video className="aspect-[16/10] w-full rounded-[1.5rem] object-cover" muted playsInline src={article.mediaUrl} />
  ) : (
    <img alt="" className="aspect-[16/10] w-full rounded-[1.5rem] object-cover" loading="lazy" src={article.mediaUrl} />
  );
}

export function Blogs() {
  const { blogs, error, isEmpty, isError, isLoading } = useBlogs();

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute left-[10%] top-12 h-72 w-72 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="absolute right-[10%] top-56 h-56 w-56 rounded-full border border-[#7C3AED]/12 animate-orbit-wide" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <SectionHeading
            description="Practical articles on lead systems, automation, Web3 support, SaaS builds, and operational growth."
            eyebrow="Insights"
            title="Field notes for scaling smarter."
          />
          <p className="max-w-xl text-sm leading-6 text-black/56 lg:justify-self-end">
            Articles are controlled from the admin dashboard with SEO metadata,
            media, tags, status, and placement controls.
          </p>
        </div>

        <div className="mt-12">
          {isLoading ? <LoadingSpinner label="Loading articles..." /> : null}
          {isError ? <ErrorState message={error} title="Articles could not be loaded" /> : null}
          {isEmpty ? (
            <EmptyState
              description="Publish articles from the admin panel and they will appear here."
              title="No articles published yet"
            />
          ) : null}
          {!isLoading && !isError && blogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {blogs.map((article, index) => (
                <article
                  className={`group rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_24px_70px_rgba(17,17,17,0.07)] transition hover:-translate-y-1 hover:border-[#7C3AED]/35 hover:shadow-[0_30px_90px_rgba(124, 58, 237, 0.16)] ${
                    index === 0 ? "md:col-span-2 xl:col-span-2" : ""
                  }`}
                  key={article._id}
                >
                  <BlogMedia article={article} />
                  <div className="p-3">
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(article.tags ?? []).slice(0, 3).map((tag) => (
                        <span className="rounded-full border border-[#7C3AED]/18 bg-[#7C3AED]/8 px-3 py-1 text-xs font-bold text-[#5B21B6]" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 text-3xl font-bold leading-[1] tracking-[-0.055em] text-black">
                      {article.title}
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-black/58">
                      {article.excerpt || article.description || article.seoDescription}
                    </p>
                    <Button as="a" className="mt-5" href="/contact" variant={index === 0 ? "primary" : "outline"}>
                      Discuss This Strategy
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
