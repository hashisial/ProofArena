import { Badge } from "../../components/ui/Badge.jsx";

export function SectionHeader({
  align = "left",
  badge,
  className = "",
  description,
  title,
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "mx-auto text-center" : ""} min-w-0 max-w-3xl ${className}`}>
      {badge ? (
        <Badge className={centered ? "mx-auto" : ""} variant="primary">
          {badge}
        </Badge>
      ) : null}
      <h2 className="mt-4 break-words text-3xl font-black leading-tight text-[#1C1917] [text-wrap:balance] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 break-words text-base leading-8 text-[#57534E] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
