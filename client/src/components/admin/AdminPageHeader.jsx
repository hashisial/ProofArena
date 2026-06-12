import { Badge } from "../ui/Badge.jsx";

export function AdminPageHeader({ description, eyebrow = "Trust operations", title }) {
  return (
    <header className="border-b border-[#E7E5E4] pb-6">
      <Badge variant="primary">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-black tracking-normal text-[#1C1917] sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#57534E] sm:text-base">{description}</p>
    </header>
  );
}
