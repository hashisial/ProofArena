import { CheckCircle2, Flag, MessageCircle, PenLine, Radio, Sparkles } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { formatCompactNumber, formatRelativeDate } from "../../utils/index.js";
import { ProfileSection } from "./ProfileSection.jsx";

function getNumber(...values) {
  const value = values.find((item) => item !== undefined && item !== null);
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

export function ActivitySection({ isOwner = false, onCreatePost, profile = {} }) {
  const activitySummary = profile.activitySummary ?? profile.activity ?? {};
  const postsCount = getNumber(profile.postsCount, activitySummary.postsCount);
  const commentsCount = getNumber(profile.commentsCount, activitySummary.commentsCount);
  const proofUpdatesCount = getNumber(activitySummary.proofUpdatesCount);
  const milestoneUpdatesCount = getNumber(activitySummary.milestoneUpdatesCount);
  const lastActiveAt = profile.lastActiveAt || activitySummary.lastActiveAt;
  const hasActivity =
    postsCount > 0 ||
    commentsCount > 0 ||
    proofUpdatesCount > 0 ||
    milestoneUpdatesCount > 0 ||
    Boolean(lastActiveAt);
  const metricItems = [
    { icon: Radio, label: "Posts", value: formatCompactNumber(postsCount, { fallback: "0" }) },
    ...(isOwner
      ? [
          {
            icon: MessageCircle,
            label: "Comments",
            value: formatCompactNumber(commentsCount, { fallback: "0" }),
          },
        ]
      : []),
    {
      icon: CheckCircle2,
      label: "Proof updates",
      value: formatCompactNumber(proofUpdatesCount, { fallback: "0" }),
    },
    {
      icon: Flag,
      label: "Milestones",
      value: formatCompactNumber(milestoneUpdatesCount, { fallback: "0" }),
    },
    {
      icon: Sparkles,
      label: "Last active",
      value: lastActiveAt ? formatRelativeDate(lastActiveAt, { fallback: "Not available" }) : "Not available",
    },
  ];
  const previewRows = [
    {
      label: "Proof update",
      text: "Verified outcome activity will appear here after approved proof submissions.",
    },
    {
      label: "Milestone update",
      text: "Challenge milestone progress will appear here as work is completed.",
    },
    {
      label: "Profile update",
      text: "Professional updates and posts will appear here.",
    },
  ];

  return (
    <ProfileSection
      action={
        isOwner ? (
          <div className="flex flex-wrap gap-2">
            <Button
              className="min-h-10 px-4 py-2 text-xs"
              onClick={onCreatePost}
              type="button"
              variant="outline"
            >
              <PenLine aria-hidden="true" className="mr-2 h-4 w-4" />
              Create post
            </Button>
            <Button
              className="min-h-10 px-4 py-2 text-xs"
              onClick={onCreatePost}
              type="button"
              variant="secondary"
            >
              Share proof update
            </Button>
          </div>
        ) : null
      }
      isOwner={isOwner}
      subtitle="Posts, proof updates, and milestone activity will appear here."
      title="Activity"
    >
      {hasActivity ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {metricItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4 transition hover:border-[#C4B5FD] hover:bg-white"
                key={item.label}
              >
                <Icon aria-hidden="true" className="h-5 w-5 text-[#7C3AED]" />
                <p className="mt-3 break-words text-lg font-black text-[#07030D]">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-[#6F657C]">{item.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#C4B5FD] bg-[#F8F4FF] p-5">
          <p className="text-sm font-black text-[#07030D]">
            {isOwner ? "Start sharing proof-based updates" : "No recent activity"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6F657C]">
            {isOwner
              ? "Share milestones, delivery notes, lessons, and verified outcome stories as your ProofArena activity grows."
              : "Activity from this profile will appear here."}
          </p>
          {isOwner ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="min-h-11 px-4 py-2"
                onClick={onCreatePost}
                type="button"
                variant="outline"
              >
                Create post
              </Button>
              <Button
                className="min-h-11 px-4 py-2"
                onClick={onCreatePost}
                type="button"
                variant="secondary"
              >
                Share proof update
              </Button>
            </div>
          ) : null}
          <div className="mt-5 grid gap-3">
            {previewRows.map((row) => (
              <div
                className="rounded-2xl border border-[#E9E2F3] bg-white p-4"
                key={row.label}
              >
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
                  {row.label}
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#6F657C]">
                  {row.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ProfileSection>
  );
}
