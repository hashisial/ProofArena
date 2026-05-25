import { BarChart3, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";
import { Card } from "../ui/Card.jsx";

const controls = [
  {
    description: "Show clients and providers where you are available to contribute.",
    icon: UserRoundCheck,
    label: "Open to",
  },
  {
    description: "Prepare identity, execution proof, and provider trust checks.",
    icon: ShieldCheck,
    label: "Add verification badge",
  },
  {
    description: "Improve intro, skills, sections, and proof signals.",
    icon: Sparkles,
    label: "Enhance profile",
  },
  {
    description: "Review profile views, impressions, and search appearances.",
    icon: BarChart3,
    label: "Analytics",
  },
];

export function ProfileOwnerControls() {
  return (
    <Card className="rounded-3xl" padding="lg">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Owner controls
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
          Profile control center
        </h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {controls.map((item) => (
          <button
            className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:bg-white hover:shadow-[0_18px_48px_rgba(63, 98, 18, 0.12)] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10"
            key={item.label}
            type="button"
          >
            <item.icon aria-hidden="true" className="h-5 w-5 text-[#3F6212]" />
            <p className="mt-3 text-sm font-black text-[#1C1917]">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-[#78716C]">{item.description}</p>
          </button>
        ))}
      </div>
    </Card>
  );
}
