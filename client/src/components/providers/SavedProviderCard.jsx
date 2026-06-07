import { ArrowRight, BookmarkX } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ProviderAvailabilityBadge } from "./ProviderAvailabilityBadge.jsx";
import { ProviderTrustMetrics } from "./ProviderTrustMetrics.jsx";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";
import { formatDate, getInitials } from "../../utils/index.js";

const statusLabels = {
  dismissed: "Dismissed",
  invited_later: "Invite Later",
  saved: "Saved",
  shortlisted: "Shortlisted",
};

function getName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function getAvatar(provider = {}) {
  return provider.avatarUrl || provider.avatar || provider.profilePicture || "";
}

function getProfileHref(provider = {}) {
  return provider.publicProfileUrl || provider.profileUrl || (provider.username ? `/profile/${provider.username}` : "");
}

export function SavedProviderCard({
  item,
  onRemove,
  onShortlist,
  removing = false,
  updating = false,
}) {
  const provider = item.provider ?? {};
  const name = getName(provider);
  const avatar = getAvatar(provider);
  const profileHref = getProfileHref(provider);
  const tags = item.tags ?? [];

  return (
    <Card as="article" className="flex h-full flex-col rounded-3xl" padding="md">
      <div className="flex min-w-0 items-start gap-4">
        {avatar ? (
          <img
            alt={`${name} profile photo`}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F5F3FF]"
            src={avatar}
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#7C3AED] text-lg font-black text-white ring-4 ring-[#F5F3FF]">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 break-words text-xl font-black text-[#07030D]">{name}</h2>
            <ProviderVerificationBadge
              verification={provider.verificationBadge ?? provider.verification}
              verificationStatus={provider.verificationStatus}
            />
          </div>
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#6F657C]">
            {provider.headline || "Public provider profile"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant={item.status === "shortlisted" ? "green" : "primary"}>
          {statusLabels[item.status] ?? "Saved"}
        </Badge>
        <ProviderAvailabilityBadge availability={provider.availability} />
      </div>

      <ProviderTrustMetrics className="mt-4" provider={provider} />

      {item.note ? (
        <p className="mt-4 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-3 text-sm font-semibold leading-6 text-[#493C5E]">
          {item.note}
        </p>
      ) : null}

      {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs font-bold text-[#6F657C]">
        Saved {formatDate(item.createdAt, { fallback: "recently" })}
      </p>

      <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-3">
        {profileHref ? (
          <Button as="a" className="min-h-10 px-4 py-2 text-xs" href={profileHref}>
            View Profile
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
        <Button
          className="min-h-10 px-4 py-2 text-xs"
          disabled={item.status === "shortlisted" || updating}
          isLoading={updating}
          loadingLabel="Updating..."
          onClick={() => onShortlist?.(item)}
          type="button"
          variant="outline"
        >
          Mark Shortlisted
        </Button>
        <Button
          className="min-h-10 px-4 py-2 text-xs"
          isLoading={removing}
          loadingLabel="Removing..."
          onClick={() => onRemove?.(item)}
          type="button"
          variant="secondary"
        >
          <BookmarkX aria-hidden="true" className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </div>
    </Card>
  );
}
