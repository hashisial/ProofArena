const industryGradients = {
  Business: "from-black via-[#5B21B6] to-[#A78BFA]",
  Crypto: "from-[#7C3AED] via-black to-[#A78BFA]",
  "Real Estate": "from-black via-[#7C3AED] to-white",
  SaaS: "from-[#5B21B6] via-black to-[#A78BFA]",
};

function isImageUrl(value) {
  return (
    typeof value === "string" &&
    (/^https?:\/\//.test(value) ||
      /^data:image\//.test(value) ||
      /\.(avif|webp|png|jpe?g|gif|svg)(\?.*)?$/i.test(value))
  );
}

function isVideoUrl(value) {
  return (
    typeof value === "string" &&
    (/^data:video\//.test(value) ||
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(value))
  );
}

export function PortfolioCard({ className = "", item }) {
  const gradient =
    industryGradients[item.industry] ?? "from-black via-[#7C3AED] to-[#A78BFA]";
  const hasImage = isImageUrl(item.image);
  const hasVideo = isVideoUrl(item.image);

  return (
    <article className={`magnetic-quiet group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)] transition duration-500 hover:border-[#7C3AED]/35 hover:shadow-[0_32px_95px_rgba(124, 58, 237, 0.18)] ${className}`}>
      <div className={`relative aspect-[16/11] bg-gradient-to-br ${gradient} p-5`}>
        {hasImage && !hasVideo ? (
          <img
            alt={`${item.title} project visual`}
            className="absolute inset-0 h-full w-full object-cover opacity-[0.82] transition duration-700 group-hover:scale-105"
            decoding="async"
            loading="lazy"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={item.image}
          />
        ) : null}
        {hasVideo ? (
          <video
            aria-label={`${item.title} project visual`}
            autoPlay
            className="absolute inset-0 h-full w-full object-cover opacity-[0.82] transition duration-700 group-hover:scale-105"
            loop
            muted
            playsInline
            src={item.image}
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(180deg,rgba(17,17,17,0.05),rgba(17,17,17,0.78))]" />
        <div className="relative flex h-full flex-col justify-between">
          <span className="w-fit rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xl">
            {item.industry}
          </span>
          <p className="max-w-xs text-4xl font-bold leading-[0.95] tracking-[-0.07em] text-white">
            {item.results?.[0] ?? "Measurable growth"}
          </p>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-black">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-black/56">{item.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(item.results ?? []).slice(0, 3).map((result) => (
            <span
              key={result}
              className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/[0.07] px-3 py-1 text-xs font-semibold text-[#5B21B6]"
            >
              {result}
            </span>
          ))}
        </div>
        {(item.beforeState || item.afterState) ? (
          <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
            {item.beforeState ? (
              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/40">
                  Before
                </p>
                <p className="mt-2 leading-6 text-black/62">{item.beforeState}</p>
              </div>
            ) : null}
            {item.afterState ? (
              <div className="rounded-2xl border border-[#7C3AED]/18 bg-[#7C3AED]/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7C3AED]">
                  After
                </p>
                <p className="mt-2 leading-6 text-black/68">{item.afterState}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {item.testimonial ? (
          <blockquote className="mt-5 rounded-2xl border-l-4 border-[#7C3AED] bg-[#F8F4FF] px-4 py-3 text-sm font-medium leading-6 text-black/66">
            {item.testimonial}
          </blockquote>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <span className="text-xs font-bold text-black/42" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
