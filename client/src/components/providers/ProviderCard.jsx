import { MapPin, Tags, UserRoundPlus } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { cn, getInitials } from "../../utils/index.js";
import { ProviderAvailabilityBadge } from "./ProviderAvailabilityBadge.jsx";
import { ProviderOutcomeOfferPreview } from "./ProviderOutcomeOfferPreview.jsx";
import { ProviderTrustMetrics } from "./ProviderTrustMetrics.jsx";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";
import { ProviderCompareButton } from "./ProviderCompareButton.jsx";
import { SaveProviderButton } from "./SaveProviderButton.jsx";

function getName(provider) {
  return (
    provider.displayName ||
    provider.fullName ||
    provider.user?.fullName ||
    provider.user?.name ||
    "ProofArena provider"
  );
}

function getUsername(provider) {
  return provider.username || provider.user?.username || "";
}

export function ProviderCard({
  className = "",
  isAuthenticated = false,
  provider,
  viewerRole = "",
}) {
  const name = getName(provider);
  const username = getUsername(provider);
  const profileHref = provider.publicProfileUrl || provider.profileUrl || (username ? `/profile/${username}` : "");
  const avatar = provider.avatarUrl || provider.avatar || provider.profilePicture || provider.user?.avatar || "";
  const skills = provider.skills ?? [];
  const visibleSkills = skills.slice(0, 5);
  const hiddenSkillCount = Math.max(0, skills.length - visibleSkills.length);
  const categories = [
    ...(provider.categories ?? []),
    ...(provider.outcomeOffersSummary?.categories ?? []),
    ...(provider.serviceSummary?.categories ?? []),
  ].filter(Boolean);
  const uniqueCategories = Array.from(new Set(categories)).slice(0, 3);
  const mainCategory = uniqueCategories[0] || provider.serviceSummary?.titles?.[0] || "";
  const positioning =
    provider.bioExcerpt ||
    provider.headline ||
    provider.currentPosition ||
    "Public ProofArena provider profile.";
  const capacityNote = provider.capacityNote || provider.availabilityNote || provider.serviceSummary?.availabilityNote || "";
  const inviteHref = !isAuthenticated
    ? ROUTES.REGISTER
    : viewerRole === "client"
      ? ROUTES.MY_CHALLENGES
      : "";
  const inviteDisabled = isAuthenticated && viewerRole !== "client";
  const inviteLabel = !isAuthenticated
    ? "Sign in to invite"
    : viewerRole === "client"
      ? "Invite to Challenge"
      : "Invite from client dashboard";

  return (
    <Card
      as="article"
      className={cn(
        "group flex h-full min-w-0 flex-col rounded-3xl border-[#E9E2F3] bg-white transition hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_22px_70px_rgba(124,58,237,0.16)]",
        className,
      )}
      padding="md"
      variant="default"
    >
      <div className="flex min-w-0 items-start gap-4">
        {avatar ? (
          <img
            alt={`${name} profile photo`}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F5F3FF]"
            src={avatar}
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#07030D,#7C3AED)] text-lg font-black text-white ring-4 ring-[#F5F3FF]">
            {getInitials(name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="min-w-0 break-words text-xl font-black tracking-normal text-[#07030D]">
              {name}
            </h2>
            <ProviderVerificationBadge
              verification={provider.verificationBadge ?? provider.verification}
              verificationStatus={provider.verificationStatus}
            />
          </div>
          {username ? (
            <p className="mt-1 truncate text-sm font-bold text-[#6F657C]">@{username}</p>
          ) : null}
          {provider.location ? (
            <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[#6F657C]">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
              <span className="min-w-0 break-words">{provider.location}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
        <div className="flex flex-wrap items-center gap-2">
          {mainCategory ? <Badge variant="primary">{mainCategory}</Badge> : null}
          {uniqueCategories.slice(mainCategory ? 1 : 0, 3).map((item) => (
            <Badge className="max-w-full" key={item} variant="gray">
              {item}
            </Badge>
          ))}
        </div>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#493C5E]">
          {positioning}
        </p>

        {visibleSkills.length > 0 ? (
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Tags aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7C3AED]" />
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
                Helps with
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {visibleSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {hiddenSkillCount > 0 ? <Badge variant="secondary">+{hiddenSkillCount} more</Badge> : null}
            </div>
          </div>
        ) : null}
      </div>

      <ProviderTrustMetrics className="mt-5" provider={provider} />

      <ProviderOutcomeOfferPreview className="mt-5" provider={provider} />

      <div className="mt-5 rounded-2xl border border-[#E9E2F3] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            Availability
          </p>
          <ProviderAvailabilityBadge availability={provider.availability} />
        </div>
        {capacityNote ? (
          <p className="mt-3 text-sm font-semibold leading-6 text-[#6F657C]">
            {capacityNote}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <SaveProviderButton
          className="min-h-10 px-4 py-2 text-xs"
          provider={provider}
          source="provider_discovery"
          variant="outline"
        />
        <ProviderCompareButton
          className="min-h-10 px-4 py-2 text-xs"
          provider={provider}
          selectedLabel="Remove Compare"
        />
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
        {profileHref ? (
          <Button as="a" className="w-full sm:flex-1" href={profileHref}>
            View Profile
          </Button>
        ) : (
          <Button className="w-full sm:flex-1" disabled>
            Profile unavailable
          </Button>
        )}
        <Button
          as={inviteHref ? "a" : "button"}
          className="w-full sm:flex-1"
          disabled={inviteDisabled}
          href={inviteHref || undefined}
          type="button"
          variant="outline"
        >
          <UserRoundPlus aria-hidden="true" className="mr-2 h-4 w-4" />
          {inviteLabel}
        </Button>
      </div>
    </Card>
  );
}
