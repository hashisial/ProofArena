import { Button } from "../components/Button.jsx";
import { ROUTES } from "../constants/index.js";
import { useBlogs } from "../hooks/useBlogs.js";

export function PlacedArticles({ placement = "home", title = "Recommended articles" }) {
  const { blogs } = useBlogs(placement);

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#7C3AED]">
              Admin placed
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-black">
              {title}
            </h2>
          </div>
          <Button as="a" href={ROUTES.BLOG} variant="outline">All Blogs</Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogs.slice(0, 3).map((article) => (
            <article className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(17,17,17,0.06)]" key={article._id}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7C3AED]">
                {article.tags?.[0] ?? "Article"}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.04em] text-black">
                {article.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/56">
                {article.excerpt || article.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
