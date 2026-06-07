import {
  AtSign,
  Building2,
  Camera,
  Edit3,
  MapPin,
  ShieldCheck,
  Trophy,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Card } from "../ui/Card.jsx";
import { getRealtimeBaseUrl } from "../../services/apiClient.js";
import { cn, formatCompactNumber, getInitials } from "../../utils/index.js";
import { ProfileActions } from "./ProfileActions.jsx";
import { VerificationBadge } from "./VerificationBadge.jsx";

const noop = () => {};

const fallbackCoverClass =
  "bg-[radial-gradient(circle_at_16%_12%,rgba(255,255,255,0.72),transparent_13rem),radial-gradient(circle_at_82%_20%,rgba(167, 139, 250, 0.38),transparent_18rem),linear-gradient(135deg,#F8F4FF_0%,#EDE9FE_48%,#7C3AED_100%)]";

function toAssetUrl(value) {
  const source = typeof value === "string" ? value : value?.url ?? "";

  if (!source) {
    return "";
  }

  if (source.startsWith("/uploads/")) {
    return `${getRealtimeBaseUrl()}${source}`;
  }

  return source;
}

function getDisplayName(user = {}) {
  return user.fullName || user.name || user.username || "ProofArena Member";
}

function getUsername(user = {}) {
  return user.username ? `@${user.username}` : "";
}

function getStringValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  return value?.name || value?.title || value?.companyName || "";
}

function getCompanyLine(profile = {}, providerProfile = {}) {
  const currentPosition =
    getStringValue(profile.currentPosition) ||
    getStringValue(profile.position) ||
    getStringValue(providerProfile?.title);
  const currentCompany =
    getStringValue(profile.currentCompany) ||
    getStringValue(profile.companyName) ||
    getStringValue(profile.company);

  if (currentPosition && currentCompany) {
    return `${currentPosition} at ${currentCompany}`;
  }

  return (
    currentCompany ||
    currentPosition ||
    getStringValue(profile.industry) ||
    "ProofArena member"
  );
}

function getLocationText(location) {
  if (typeof location === "string") {
    return location.trim() || "Location not added";
  }

  const value = [location?.city, location?.state, location?.country]
    .filter(Boolean)
    .join(", ");

  return value || "Location not added";
}

function getCount(value) {
  return formatCompactNumber(value ?? 0, { fallback: "0" });
}

function normalizeStatus(value) {
  return String(value ?? "").trim().toLowerCase();
}

function getVerificationState(profile = {}, providerProfile = {}) {
  const publicVerification = profile.verification ?? {};
  const badgeStatus = normalizeStatus(
    typeof profile.verificationBadge === "string"
      ? profile.verificationBadge
      : profile.verificationBadge?.status,
  );
  const providerStatus = normalizeStatus(providerProfile?.verificationStatus);

  if (publicVerification.isVerified || badgeStatus === "verified" || providerStatus === "verified") {
    return "verified";
  }

  if (badgeStatus === "pending") {
    return "pending";
  }

  if (
    badgeStatus === "rejected" ||
    badgeStatus === "needs_review"
  ) {
    return "rejected";
  }

  return "none";
}

function IconButton({ ariaLabel, children, className = "", onClick = noop }) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white text-[#07030D] shadow-[0_14px_34px_rgba(0,0,0,0.16)] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-white/45",
        className,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function ProfileHeader({
  isOwner = false,
  showPublicActions = true,
  connectLabel = "Connect",
  onAddSection = noop,
  onConnect = noop,
  onEditAvatar = noop,
  onEditCover = noop,
  onEditIntro = noop,
  onEnhanceProfile = noop,
  onFollow = noop,
  onMessage = noop,
  onMore = noop,
  onOpenTo = noop,
  onRequestVerification = noop,
  followLabel = "Follow",
  profileData = {},
}) {
  const ownerMode = Boolean(isOwner);
  const user = profileData.user ?? {};
  const profile = profileData.profile ?? {};
  const providerProfile = profileData.providerProfile ?? {};

  const displayName = getDisplayName(user);
  const username = getUsername(user);
  const avatarUrl = toAssetUrl(user.avatar || profile.avatar || profile.profilePicture);
  const coverUrl = toAssetUrl(profile.coverImage || profile.bannerImage);
  const headline =
    profile.headline ||
    providerProfile?.headline ||
    providerProfile?.title ||
    "Outcome-driven professional on ProofArena";
  const companyLine = getCompanyLine(profile, providerProfile);
  const location = profile.locationLabel || getLocationText(profile.location);
  const verificationState = getVerificationState(profile, providerProfile);
  const verificationLabel =
    profile.verification?.label ||
    profile.verificationBadge?.label ||
    "Verified";
  const connectionsCount = getCount(profile.connectionsCount ?? user.connectionsCount);
  const followersCount = getCount(profile.followersCount ?? user.followersCount);
  const proofScore = Number(providerProfile?.proofScore ?? 0) || 0;
  const completedOutcomes =
    Number(providerProfile?.completedOutcomes ?? providerProfile?.completedProjects ?? 0) || 0;
  const openTo = profile.openTo ?? {};
  const isOpenToEnabled = Boolean(openTo.enabled);
  const openToLabel = openTo.title || "Open to outcomes";

  return (
    <Card
      as="section"
      className="relative overflow-visible rounded-3xl border-[#E9E2F3] bg-white shadow-[0_24px_80px_rgba(31, 14, 54, 0.1)]"
      padding="none"
      variant="elevated"
    >
      <div className="relative h-36 overflow-hidden bg-[#F5F3FF] sm:h-48 lg:h-56">
        {coverUrl ? (
          <img
            alt={`${displayName} cover image`}
            className="h-full w-full object-cover"
            src={coverUrl}
          />
        ) : (
          <div aria-hidden="true" className={cn("h-full w-full", fallbackCoverClass)} />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.02)_0%,rgba(10,10,10,0.2)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.52)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:54px_54px]"
        />

        {ownerMode ? (
          <IconButton
            ariaLabel="Edit cover photo"
            className="absolute right-3 top-3 sm:right-5 sm:top-5"
            onClick={onEditCover}
          >
            <Camera aria-hidden="true" className="h-4 w-4" />
          </IconButton>
        ) : null}
      </div>

      <div className="relative px-4 pb-6 sm:px-6 sm:pb-7 lg:px-8 lg:pb-8">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 lg:-mt-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 rounded-full border-4 border-white bg-[#F5F3FF] shadow-[0_18px_48px_rgba(31, 14, 54, 0.18)] sm:h-32 sm:w-32">
              {avatarUrl ? (
                <img
                  alt={`${displayName} profile photo`}
                  className="h-full w-full rounded-full object-cover"
                  src={avatarUrl}
                />
              ) : (
                <div className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(135deg,#07030D,#7C3AED)] text-2xl font-black text-white sm:text-4xl">
                  {getInitials(displayName)}
                </div>
              )}
              {ownerMode ? (
                <button
                  aria-label="Edit profile photo"
                  className="absolute bottom-0 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#07030D] text-white shadow-[0_14px_30px_rgba(0,0,0,0.22)] transition hover:bg-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/20"
                  onClick={onEditAvatar}
                  type="button"
                >
                  <Camera aria-hidden="true" className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="min-w-0 pb-1 sm:pt-16 lg:pt-0">
              <div className="flex flex-wrap items-center gap-2.5">
                {ownerMode ? (
                  <Badge leftIcon={<UserRoundCheck className="h-3.5 w-3.5" />} variant="primary">
                    Owner view
                  </Badge>
                ) : null}
                <VerificationBadge
                  isOwner={ownerMode}
                  isVerified={verificationState === "verified"}
                  label={verificationLabel}
                  onRequest={onRequestVerification}
                  status={verificationState}
                />
                {isOpenToEnabled ? (
                  <Badge variant="primary">{openToLabel}</Badge>
                ) : null}
                {proofScore > 0 ? (
                  <Badge
                    leftIcon={<Trophy className="h-3.5 w-3.5" />}
                    variant="primary"
                  >
                    Proof Score {proofScore}
                  </Badge>
                ) : null}
                {completedOutcomes > 0 ? (
                  <Badge variant="gray">
                    {formatCompactNumber(completedOutcomes, { fallback: "0" })} outcomes
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2.5">
                <h1 className="min-w-0 break-words text-3xl font-black leading-tight tracking-normal text-[#07030D] sm:text-4xl">
                  {displayName}
                </h1>
                {ownerMode ? (
                  <button
                    aria-label="Edit profile intro"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E9E2F3] bg-white text-[#493C5E] transition hover:border-[#7C3AED]/40 hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
                    onClick={onEditIntro}
                    type="button"
                  >
                    <Edit3 aria-hidden="true" className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              {username ? (
                <p className="mt-1 inline-flex max-w-full items-center gap-1.5 break-words text-sm font-bold text-[#6F657C]">
                  <AtSign aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  {username.replace(/^@/, "")}
                </p>
              ) : null}

              <p className="mt-3 max-w-3xl break-words text-sm font-semibold leading-6 text-[#493C5E] sm:text-base">
                {headline}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold leading-6 text-[#6F657C]">
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  <span className="break-words">{companyLine}</span>
                </span>
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  <span className="break-words">{location}</span>
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#E9E2F3] bg-[#F8F4FF] px-3 text-xs font-black text-[#493C5E]">
                  <UsersRound aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
                  {connectionsCount} connections
                </span>
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#E9E2F3] bg-[#F8F4FF] px-3 text-xs font-black text-[#493C5E]">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#7C3AED]" />
                  {followersCount} followers
                </span>
              </div>
            </div>
          </div>
        </div>

        {ownerMode || showPublicActions ? (
          <div className="mt-6">
            <ProfileActions
              isOwner={ownerMode}
              onAddSection={onAddSection}
              onConnect={onConnect}
              onEnhanceProfile={onEnhanceProfile}
              onFollow={onFollow}
              onMessage={onMessage}
              onMore={onMore}
              onOpenTo={onOpenTo}
              connectLabel={connectLabel}
              followLabel={followLabel}
            />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
