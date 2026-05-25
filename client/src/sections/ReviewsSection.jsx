import { SectionHeading } from "../components/SectionHeading.jsx";
import { useReviews } from "../hooks/useReviews.js";
import { getInitials } from "../utils/index.js";

const fallbackReviews = [
  {
    _id: "fallback-growth",
    authorName: "ScaleOps client",
    description:
      "The handoff felt clear from day one. We knew what was being built, why it mattered, and how every campaign connected back to revenue.",
    heading: "A growth system that finally felt organized.",
    image: "",
    stars: 5,
  },
  {
    _id: "fallback-support",
    authorName: "Operations lead",
    description:
      "Support, lead capture, and reporting stopped living in separate places. The team gave us one workflow we could actually manage.",
    heading: "Cleaner operations with less manual work.",
    image: "",
    stars: 5,
  },
  {
    _id: "fallback-product",
    authorName: "SaaS founder",
    description:
      "The site, CRM, and automation all shipped with the same standard. It looked premium and worked like a serious internal product.",
    heading: "Premium execution without the usual drag.",
    image: "",
    stars: 5,
  },
];

export function ReviewsSection() {
  const { reviews } = useReviews();
  const visibleReviews = reviews.length > 0 ? reviews.slice(0, 6) : fallbackReviews;

  return (
    <section className="relative overflow-hidden bg-[#1C1917] py-24 text-white sm:py-28">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#3F6212]/28 blur-3xl" />
      <div className="absolute right-[8%] top-28 h-44 w-44 rounded-[2rem] border border-[#65A30D]/18 bg-[#3F6212]/10 backdrop-blur-xl animate-breathe-rotate" />
      <div className="absolute bottom-0 left-[42%] h-80 w-80 rounded-full bg-[#365314]/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <SectionHeading
            description="Reviews submitted from user workspaces appear here after admin approval, so public proof stays controlled and credible."
            eyebrow="Testimonials"
            title="What clients feel when the system starts working."
            tone="light"
          />
          <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-white/72 shadow-[0_28px_90px_rgba(63, 98, 18, 0.16)] backdrop-blur-xl lg:ml-auto">
            Admin-approved reviews are connected to the homepage. New reviews stay private until they are approved in the admin panel.
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleReviews.map((review, index) => (
            <article
              className={`group relative overflow-hidden rounded-[2rem] border p-6 transition duration-300 hover:-translate-y-1 ${
                index === 0
                  ? "border-[#65A30D]/35 bg-[#3F6212] text-white shadow-[0_34px_100px_rgba(63, 98, 18, 0.32)]"
                  : "border-white/12 bg-white text-black shadow-[0_24px_70px_rgba(0,0,0,0.18)] hover:border-[#3F6212]/45 hover:shadow-[0_34px_90px_rgba(63, 98, 18, 0.24)]"
              }`}
              key={review._id}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#65A30D]/20 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center gap-4">
                {review.image ? (
                  <img
                    alt=""
                    className="h-14 w-14 rounded-2xl object-cover shadow-[0_14px_38px_rgba(0,0,0,0.16)]"
                    loading="lazy"
                    src={review.image}
                  />
                ) : (
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${
                      index === 0 ? "bg-white text-[#365314]" : "bg-black text-white"
                    }`}
                  >
                    {getInitials(review.authorName)}
                  </div>
                )}
                <div>
                  <p className={`font-bold ${index === 0 ? "text-white" : "text-black"}`}>
                    {review.authorName}
                  </p>
                  <div className="mt-2 flex gap-1.5" aria-label={`${review.stars ?? 5} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          starIndex < Number(review.stars ?? 5)
                            ? index === 0
                              ? "bg-white"
                              : "bg-[#3F6212]"
                            : index === 0
                              ? "bg-white/25"
                              : "bg-black/12"
                        }`}
                        key={starIndex}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <h3 className={`relative mt-7 text-2xl font-bold leading-[1.05] tracking-[-0.045em] ${index === 0 ? "text-white" : "text-black"}`}>
                {review.heading}
              </h3>
              <p className={`relative mt-4 text-sm leading-6 ${index === 0 ? "text-white/82" : "text-black/62"}`}>
                {review.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
