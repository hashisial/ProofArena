import { Archive, CheckCircle2, ClipboardList, PauseCircle, Rocket, Target } from "lucide-react";
import { createElement } from "react";
import { Card } from "../ui/Card.jsx";
import { formatNumber } from "../../utils/formatNumber.js";

const statsConfig = [
  {
    icon: Target,
    label: "Total",
    value: (items) => items.length,
  },
  {
    icon: PauseCircle,
    label: "Draft",
    value: (items) => items.filter((challenge) => challenge.status === "draft").length,
  },
  {
    icon: Rocket,
    label: "Open",
    value: (items) => items.filter((challenge) => challenge.status === "open").length,
  },
  {
    icon: ClipboardList,
    label: "Reviewing",
    value: (items) => items.filter((challenge) => challenge.status === "reviewing_plans").length,
  },
  {
    icon: Archive,
    label: "Active",
    value: (items) =>
      items.filter((challenge) => ["provider_selected", "in_progress", "proof_review"].includes(challenge.status)).length,
  },
  {
    icon: CheckCircle2,
    label: "Completed",
    value: (items) => items.filter((challenge) => challenge.status === "completed").length,
  },
];

export function ChallengeStatsStrip({ challenges = [] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      {statsConfig.map((stat) => (
        <Card className="h-full" key={stat.label} padding="sm" variant="muted">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#78716C]">{stat.label}</p>
              <p className="mt-2 text-3xl font-black tracking-normal text-[#1C1917]">
                {formatNumber(stat.value(challenges), { fallback: "0" })}
              </p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#3F6212]">
              {createElement(stat.icon, { "aria-hidden": "true", className: "h-5 w-5" })}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
