import {
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  FileText,
  Image,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";

function hasMedia(value) {
  return Boolean(typeof value === "string" ? value : value?.url);
}

function getCompletion(profileData = {}) {
  const user = profileData.user ?? {};
  const profile = profileData.profile ?? {};
  const providerProfile = profileData.providerProfile ?? {};
  const backendPercent = profile.profileCompletion?.percentage;

  if (typeof backendPercent === "number") {
    return Math.max(0, Math.min(100, backendPercent));
  }

  const checks = [
    Boolean(user.fullName || user.username),
    hasMedia(user.avatar),
    hasMedia(profile.coverImage),
    Boolean(profile.headline),
    Boolean(profile.bio),
    Boolean(profile.skills?.length || providerProfile.skills?.length),
    Boolean(profile.experience?.length),
    providerProfile.verificationStatus === "verified",
  ];
  const complete = checks.filter(Boolean).length;

  return Math.round((complete / checks.length) * 100);
}

function getSuggestions(profileData = {}) {
  const user = profileData.user ?? {};
  const profile = profileData.profile ?? {};
  const providerProfile = profileData.providerProfile ?? {};
  const verificationStatus = profile.verificationBadge?.status ?? providerProfile.verificationStatus;

  return [
    ["Add a profile photo", hasMedia(user.avatar), Camera],
    ["Add a cover photo", hasMedia(profile.coverImage), Image],
    ["Write a strong headline", Boolean(profile.headline), FileText],
    ["Add an About section", Boolean(profile.bio), Sparkles],
    ["Add skills", Boolean(profile.skills?.length || providerProfile.skills?.length), Wrench],
    ["Add experience", Boolean(profile.experience?.length), BriefcaseBusiness],
    ["Add services", Boolean(providerProfile.categories?.length), Star],
    [
      verificationStatus === "pending" ? "Verification pending" : "Verify your profile",
      verificationStatus === "verified",
      ShieldCheck,
    ],
  ];
}

export function EnhanceProfilePanel({
  onAddSection,
  onEditIntro,
  profileData,
}) {
  const completion = getCompletion(profileData);
  const suggestions = getSuggestions(profileData);

  return (
    <Card
      as="aside"
      className="rounded-3xl border-[#BEF264]/45 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBEB_58%,#F7FEE7_100%)] shadow-[0_24px_80px_rgba(63, 98, 18, 0.12)]"
      padding="lg"
      variant="elevated"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="primary">Owner toolkit</Badge>
          <h2 className="mt-3 text-2xl font-black leading-tight text-[#1C1917]">
            Enhance your profile
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#57534E]">
            Complete key sections to make your ProofArena profile more credible.
          </p>
        </div>
        <div className="rounded-2xl border border-[#3F6212]/20 bg-white px-4 py-3 text-center shadow-[0_12px_34px_rgba(63, 98, 18, 0.1)]">
          <p className="text-2xl font-black text-[#365314]">{completion}%</p>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
            Complete
          </p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#3F6212,#65A30D)]"
          style={{ width: `${completion}%` }}
        />
      </div>

      <div className="mt-6 grid gap-3">
        {suggestions.map(([title, complete, icon]) => {
          const SuggestionIcon = icon;
          const statusText = title === "Verification pending"
            ? "In review"
            : complete
              ? "Completed"
              : "Recommended";

          return (
            <div
              className="flex items-center gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-3"
              key={title}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                <SuggestionIcon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#1C1917]">{title}</p>
                <p className="text-xs font-semibold text-[#78716C]">
                  {statusText}
                </p>
              </div>
              {complete ? (
                <CheckCircle2 aria-label="Completed" className="h-5 w-5 shrink-0 text-[#65A30D]" />
              ) : (
                <Button
                  className="min-h-9 px-3 py-1.5 text-xs"
                  onClick={title.includes("headline") ? onEditIntro : onAddSection}
                  type="button"
                  variant="secondary"
                >
                  Add
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
