import { ArrowRight, UserRoundPlus } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { getInitials } from "../../utils/index.js";
import {
  getProviderName,
  getProviderProfileHref,
} from "../../features/providers/providerComparisonUtils.js";
import { ProviderOutcomeOfferPreview } from "./ProviderOutcomeOfferPreview.jsx";
import { ProviderTrustMetrics } from "./ProviderTrustMetrics.jsx";
import { ProviderVerificationBadge } from "./ProviderVerificationBadge.jsx";
import { SaveProviderButton } from "./SaveProviderButton.jsx";

export function ProviderComparisonCard({ provider = {} }) {
  const { isAuthenticated, role } = useAuth();
  const name = getProviderName(provider);
  const profileHref = getProviderProfileHref(provider);
  const avatar = provider.avatarUrl || provider.avatar || provider.profilePicture || "";
  const inviteHref = !isAuthenticated ? ROUTES.REGISTER : role === "client" ? ROUTES.MY_CHALLENGES : "";
  const inviteDisabled = isAuthenticated && role !== "client";

  return (
    <Card
      as="article"
      className="group h-full rounded-3xl transition hover:-translate-y-1 hover:border-[#65A30D] hover:shadow-[0_22px_70px_rgba(63,98,18,0.14)]"
      padding="lg"
    >
      <div className="flex min-w-0 items-start gap-4">
        {avatar ? (
          <img
            alt={`${name} profile photo`}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-[#F7FEE7]"
            src={avatar}
          />
        ) : (
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#1C1917,#3F6212)] text-lg font-black text-white ring-4 ring-[#F7FEE7]">
            {getInitials(name)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="break-words text-xl font-black tracking-normal text-[#1C1917]">
              {name}
            </h2>
            <ProviderVerificationBadge
              verification={provider.verificationBadge ?? provider.verification}
              verificationStatus={provider.verificationStatus}
            />
          </div>
          {provider.headline ? (
            <p className="mt-2 text-sm font-semibold leading-6 text-[#78716C]">
              {provider.headline}
            </p>
          ) : null}
        </div>
      </div>

      <ProviderTrustMetrics className="mt-5" provider={provider} />
      <ProviderOutcomeOfferPreview className="mt-5" compact provider={provider} />

      <div className="mt-5 grid gap-2">
        {profileHref ? (
          <Button as="a" href={profileHref}>
            View Profile
            <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
        <Button
          as={inviteHref ? "a" : "button"}
          disabled={inviteDisabled}
          href={inviteHref || undefined}
          type="button"
          variant="outline"
        >
          <UserRoundPlus aria-hidden="true" className="mr-2 h-4 w-4" />
          Invite from challenge dashboard
        </Button>
        <SaveProviderButton provider={provider} source="comparison" variant="secondary" />
      </div>
    </Card>
  );
}
