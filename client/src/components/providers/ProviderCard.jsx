import { MapPin, MessageCircle, ShieldCheck, Trophy } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { VerificationBadge } from "../profile/VerificationBadge.jsx";
import { cn, formatCompactNumber, getInitials } from "../../utils/index.js";

function getName(provider) {
  return provider.fullName || provider.user?.fullName || provider.user?.name || "ProofArena provider";
}

function getUsername(provider) {
  return provider.username || provider.user?.username || "";
}

function getProofScore(provider) {
  const score = Number(provider.proofScore ?? 0);
  return Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0;
}

function getServicesPreview(provider) {
  const services = Array.isArray(provider.servicesPreview) ? provider.servicesPreview : [];

  if (services.length > 0) {
    return services;
  }

  return (provider.serviceSummary?.titles ?? []).slice(0, 3).map((title) => ({ title }));
}

export function ProviderCard({ className = "", onMessage, provider }) {
  const name = getName(provider);
  const username = getUsername(provider);
  const profileHref = username ? `/profile/${username}` : "";
  const avatar = provider.avatar || provider.profilePicture || provider.user?.avatar || "";
  const proofScore = getProofScore(provider);
  const skills = (provider.skills ?? []).slice(0, 5);
  const categories = (provider.categories ?? []).slice(0, 3);
  const servicesPreview = getServicesPreview(provider);
  const isVerified = Boolean(provider.verification?.isVerified || provider.verificationStatus === "verified");
  const outcomes = Number(provider.completedOutcomes ?? provider.completedProjects ?? 0) || 0;
  const isAvailable = provider.isAvailableForChallenges !== false;

  return (
    <Card
      as="article"
      className={cn(
        "group flex h-full flex-col rounded-3xl border-[#E7E5E4] bg-white transition hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_22px_70px_rgba(63, 98, 18, 0.16)]",
        className,
      )}
      padding="md"
      variant="default"
    >
      <div className="flex min-w-0 items-start gap-4">
        {avatar ? (
          <img
            alt={`${name} profile photo`}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F7FEE7]"
            src={avatar}
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1C1917,#3F6212)] text-lg font-black text-white ring-4 ring-[#F7FEE7]">
            {getInitials(name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="min-w-0 break-words text-xl font-black tracking-normal text-[#1C1917]">
              {name}
            </h2>
            <VerificationBadge
              isVerified={isVerified}
              label={provider.verification?.label || "Verified"}
              size="sm"
              status={provider.verificationStatus}
            />
          </div>
          {username ? (
            <p className="mt-1 truncate text-sm font-bold text-[#78716C]">@{username}</p>
          ) : null}
          {provider.location ? (
            <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[#78716C]">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3F6212]" />
              <span className="min-w-0 break-words">{provider.location}</span>
            </p>
          ) : null}
        </div>
      </div>

      <p className="mt-5 line-clamp-3 min-h-[4.5rem] text-sm font-semibold leading-6 text-[#44403C]">
        {provider.headline || provider.currentPosition || "Public ProofArena profile with provider details."}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#ECFCCB] bg-[#FFFBEB] p-3">
          <div className="flex items-center gap-2">
            <Trophy aria-hidden="true" className="h-4 w-4 text-[#3F6212]" />
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
              Proof score
            </p>
          </div>
          <p className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
            {proofScore}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-3">
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#3F6212]" />
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">
              Outcomes
            </p>
          </div>
          <p className="mt-2 text-2xl font-black tracking-normal text-[#1C1917]">
            {formatCompactNumber(outcomes, { fallback: "0" })}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(categories.length ? categories : skills).map((item) => (
          <Badge className="max-w-full" key={item} variant="primary">
            {item}
          </Badge>
        ))}
        {isAvailable ? <Badge variant="green">Available</Badge> : <Badge variant="gray">Limited</Badge>}
      </div>

      {servicesPreview.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
            Services preview
          </p>
          <div className="mt-3 grid gap-2">
            {servicesPreview.map((service, index) => (
              <p
                className="line-clamp-1 text-sm font-bold text-[#44403C]"
                key={`${service.title}-${index}`}
              >
                {service.title}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
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
          className="w-full sm:w-auto"
          onClick={() => onMessage?.(provider)}
          type="button"
          variant="outline"
        >
          <MessageCircle aria-hidden="true" className="mr-2 h-4 w-4" />
          Message
        </Button>
      </div>
    </Card>
  );
}
