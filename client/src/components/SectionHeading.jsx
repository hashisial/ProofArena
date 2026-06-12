export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  tone = "dark",
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  const titleClass = tone === "light" ? "text-white" : "text-black";
  const descriptionClass = tone === "light" ? "text-white/62" : "text-black/58";
  const eyebrowClass = tone === "light" ? "text-[#BEF264]" : "text-[#3F6212]";

  return (
    <div className={`min-w-0 max-w-3xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className={`premium-kicker ${eyebrowClass}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`premium-heading mobile-safe-text mt-4 text-3xl sm:text-5xl lg:text-6xl ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 max-w-2xl break-words text-base leading-7 sm:text-lg ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
