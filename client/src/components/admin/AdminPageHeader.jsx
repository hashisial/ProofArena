import { Badge } from "../ui/Badge.jsx";

export function AdminPageHeader({ description, eyebrow = "Trust operations", title }) {
  return (
    <header className="border-b border-[#E9E2F3] pb-6">
      <Badge variant="primary">{eyebrow}</Badge>
      <h2 className="mt-4 text-3xl font-black tracking-normal text-[#07030D] sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6F657C] sm:text-base">{description}</p>
    </header>
  );
}
