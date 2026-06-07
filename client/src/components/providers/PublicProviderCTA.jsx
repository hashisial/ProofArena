import { ArrowLeft, BriefcaseBusiness, UserRoundPlus } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../features/auth/useAuth.js";
import { ProviderAvailabilityBadge } from "./ProviderAvailabilityBadge.jsx";
import { ProviderCompareButton } from "./ProviderCompareButton.jsx";
import { SaveProviderButton } from "./SaveProviderButton.jsx";

function getRole(auth = {}) {
  return auth.role || auth.user?.role || "";
}

export function PublicProviderCTA({
  availability,
  hasOutcomeOffers = false,
  isOwner = false,
  onBackToProviders,
  provider = {},
  providerName = "this provider",
}) {
  const auth = useAuth();
  const role = getRole(auth);
  const inviteHref = !auth.isAuthenticated
    ? ROUTES.REGISTER
    : role === "client"
      ? ROUTES.MY_CHALLENGES
      : "";
  const inviteDisabled = auth.isAuthenticated && role !== "client";
  const helperText = !auth.isAuthenticated
    ? `Create an account to invite ${providerName} to an outcome challenge.`
    : role === "client"
      ? "Open one of your challenges to invite matched providers."
      : "Clients can invite this provider from their challenge dashboard.";

  return (
    <Card className="rounded-3xl" padding="lg">
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]"
        >
          <UserRoundPlus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">
            Client action
          </p>
          <h2 className="mt-1 text-xl font-black tracking-normal text-[#07030D]">
            Invite to an outcome challenge
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#6F657C]">
            {helperText}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ProviderAvailabilityBadge availability={availability} />
        {hasOutcomeOffers ? (
          <span className="rounded-full border border-[#6D28D9]/20 bg-[#FEF3C7] px-3 py-1.5 text-xs font-black text-[#6D28D9]">
            Public outcome offers
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-2">
        <SaveProviderButton
          provider={provider}
          source="public_profile"
          variant="outline"
        />
        <SaveProviderButton
          provider={provider}
          source="public_profile"
          statusOnSave="shortlisted"
          variant="secondary"
        />
        <ProviderCompareButton
          label="Compare Provider"
          provider={provider}
          selectedLabel="Remove Compare"
          variant="outline"
        />
        <Button
          as={inviteHref ? "a" : "button"}
          disabled={inviteDisabled}
          href={inviteHref || undefined}
          type="button"
        >
          <UserRoundPlus aria-hidden="true" className="mr-2 h-4 w-4" />
          Invite to Challenge
        </Button>
        <Button
          as="a"
          href={ROUTES.PROVIDER_COMPARE}
          variant="outline"
        >
          Open Comparison
        </Button>
        <Button
          as="a"
          disabled={!hasOutcomeOffers}
          href="#outcome-offers"
          variant="outline"
        >
          <BriefcaseBusiness aria-hidden="true" className="mr-2 h-4 w-4" />
          View Outcome Offers
        </Button>
        <Button onClick={onBackToProviders} type="button" variant="secondary">
          <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" />
          Back to Providers
        </Button>
        {isOwner ? (
          <Button as="a" href={ROUTES.PROFILE} variant="outline">
            Go to owner profile
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
