import { BarChart3, Eye, LockKeyhole, Radio, Search, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { formatCompactNumber } from "../../utils/index.js";

function getPercent(value) {
  return Math.max(0, Math.min(100, Number(value ?? 0) || 0));
}

export function ProfileAnalytics({
  activitySummary,
  analytics,
  isLoading = false,
  isOwner = true,
  profile = {},
  profileCompletion,
}) {
  if (!isOwner) {
    return null;
  }

  const ownerAnalytics = analytics ?? profile.analytics ?? {};
  const ownerActivity = activitySummary ?? profile.activitySummary ?? {};
  const completion = profileCompletion ?? profile.profileCompletion ?? {};
  const activitySignals =
    Number(ownerActivity.proofUpdatesCount ?? 0) +
    Number(ownerActivity.milestoneUpdatesCount ?? 0);
  const completionPercent = getPercent(completion.percentage);
  const items = [
    {
      description: "See how many people viewed your profile.",
      icon: Eye,
      label: "Profile views",
      value: ownerAnalytics.profileViews ?? profile.profileViews ?? 0,
    },
    {
      description: "Track visibility from posts and updates.",
      icon: TrendingUp,
      label: "Post impressions",
      value: ownerAnalytics.postImpressions ?? profile.postImpressions ?? 0,
    },
    {
      description: "Understand how often your profile appeared in discovery.",
      icon: Search,
      label: "Search appearances",
      value: ownerAnalytics.searchAppearances ?? profile.searchAppearances ?? 0,
    },
    {
      description: "Proof updates, milestone updates, and recent activity.",
      icon: Radio,
      label: "Activity signals",
      value: activitySignals,
    },
  ];

  return (
    <Card className="rounded-3xl" padding="lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            <LockKeyhole aria-hidden="true" className="h-4 w-4" />
            Private to you
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
            Analytics
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
            Profile insights are visible only to you.
          </p>
        </div>
        <BarChart3 aria-hidden="true" className="h-6 w-6 text-[#3F6212]" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4 transition hover:border-[#BEF264] hover:bg-white hover:shadow-[0_14px_36px_rgba(63, 98, 18, 0.08)]"
            key={item.label}
          >
            <item.icon aria-hidden="true" className="h-5 w-5 text-[#3F6212]" />
            <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
              {isLoading ? "..." : formatCompactNumber(item.value, { fallback: "0" })}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#78716C]">{item.label}</p>
            <p className="mt-2 text-xs font-semibold leading-5 text-[#78716C]">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-[#1C1917]">
              Profile strength: {isLoading ? "..." : `${completionPercent}%`}
            </p>
            <p className="mt-1 text-xs font-semibold leading-5 text-[#78716C]">
              Complete key sections to improve trust signals.
            </p>
          </div>
          <span className="rounded-full border border-[#ECFCCB] bg-white px-3 py-1 text-xs font-black text-[#365314]">
            Private
          </span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#3F6212,#65A30D)] transition-[width] duration-700"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
