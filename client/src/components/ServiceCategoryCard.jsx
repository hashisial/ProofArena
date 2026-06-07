const categoryStyles = {
  business: {
    accent: "bg-[#111111]",
    marker: "text-black/35",
  },
  crypto: {
    accent: "bg-[#7C3AED]",
    marker: "text-[#7C3AED]/45",
  },
  dev: {
    accent: "bg-[#5B21B6]",
    marker: "text-[#5B21B6]/45",
  },
  growth: {
    accent: "bg-black",
    marker: "text-black/35",
  },
};

export function ServiceCategoryCard({ className = "", index = 0, service }) {
  const style = categoryStyles[service.category] ?? categoryStyles.growth;
  const hasMedia = Boolean(service.mediaUrl);
  const isVideo = service.mediaType === "video";

  return (
    <article
      className={`magnetic-quiet group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition duration-500 hover:border-[#A78BFA]/45 hover:shadow-[0_30px_90px_rgba(124, 58, 237, 0.28)] ${className}`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#7C3AED]/10 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${style.accent} text-sm font-bold text-white shadow-[0_18px_45px_rgba(124, 58, 237, 0.18)]`}>
          {service.icon}
        </div>
        <span className={`text-6xl font-bold leading-none tracking-[-0.08em] ${style.marker}`}>
          0{index + 1}
        </span>
      </div>
      <h3 className="mt-9 max-w-sm text-3xl font-bold leading-[1] tracking-[-0.055em] text-black">
        {service.title}
      </h3>
      <p className="mt-5 max-w-md text-sm leading-6 text-black/56">
        {service.description}
      </p>
      {hasMedia ? (
        <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-[#7C3AED]/16">
          {isVideo ? (
            <video className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105" muted playsInline src={service.mediaUrl} />
          ) : (
            <img alt="" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" src={service.mediaUrl} />
          )}
        </div>
      ) : null}
      {service.outcome ? (
        <p className="mt-5 rounded-2xl border border-[#7C3AED]/16 bg-[#7C3AED]/6 px-4 py-3 text-sm font-semibold text-[#5B21B6]">
          {service.outcome}
        </p>
      ) : null}
      <ul className="mt-8 grid gap-3">
        {service.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm font-medium text-black/70">
            <span className="h-px w-7 bg-[#7C3AED]/50 transition duration-300 group-hover:w-10" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
