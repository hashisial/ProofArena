import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { ProfilePrivacyPanel } from "../components/settings/ProfilePrivacyPanel.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import {
  usePrivacySettings,
  useUpdatePrivacySettings,
} from "../features/profile/useProfile.js";
import { useAuth } from "../hooks/useAuth.js";
import {
  useCreateCheckoutSession,
  useCreateCustomerPortalSession,
  useMySubscription,
  useSelectFreePlan,
  useSubscriptionPlans,
} from "../hooks/useSubscription.js";

function formatLimit(value) {
  return value === null || value === undefined ? "Unlimited" : value;
}

function PlanCard({ currentPlanKey, onChoose, plan, pendingPlanKey }) {
  const isCurrent = currentPlanKey === plan.key;
  const isPending = pendingPlanKey === plan.key;

  return (
    <div
      className={`min-w-0 rounded-3xl border p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 sm:p-6 ${
        isCurrent
          ? "active-plan-card border-[#A78BFA]/55 bg-[#7C3AED] text-white shadow-[0_26px_80px_rgba(124, 58, 237, 0.28)]"
          : "border-white/10 bg-white/[0.06] hover:border-[#A78BFA]/35 hover:bg-white/[0.08]"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${isCurrent ? "text-white/82" : "text-[#A78BFA]"}`}>
            {plan.name}
          </p>
          <p className={`mt-3 break-words text-4xl font-bold ${isCurrent ? "text-white" : "text-white"}`}>
            ${plan.monthlyPrice}
            <span className={`text-sm font-semibold ${isCurrent ? "text-white/72" : "text-slate-400"}`}>/mo</span>
          </p>
        </div>
        {isCurrent ? (
          <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold text-white">
            Current
          </span>
        ) : null}
      </div>

      <p className={`mt-4 text-sm leading-6 sm:min-h-12 ${isCurrent ? "text-white/78" : "text-slate-400"}`}>
        {plan.description}
      </p>

      <div className={`mt-5 grid gap-3 text-sm ${isCurrent ? "text-white/78" : "text-slate-300"}`}>
        <div className={`plan-limit-row flex justify-between gap-4 rounded-2xl border px-4 py-3 ${isCurrent ? "border-white/18 bg-white/12" : "border-white/10 bg-slate-950/45"}`}>
          <span>Lead limit</span>
          <strong className={isCurrent ? "text-white" : "text-white"}>{formatLimit(plan.leadLimit)}</strong>
        </div>
        <div className={`plan-limit-row flex justify-between gap-4 rounded-2xl border px-4 py-3 ${isCurrent ? "border-white/18 bg-white/12" : "border-white/10 bg-slate-950/45"}`}>
          <span>Scrape limit</span>
          <strong className="text-white">
            {formatLimit(plan.scrapeLimitDaily ?? plan.scrapeLimitMonthly)}
          </strong>
        </div>
        <div className={`plan-limit-row flex justify-between gap-4 rounded-2xl border px-4 py-3 ${isCurrent ? "border-white/18 bg-white/12" : "border-white/10 bg-slate-950/45"}`}>
          <span>API requests</span>
          <strong className="text-white">{formatLimit(plan.apiLimitMonthly)}</strong>
        </div>
      </div>

      <ul className={`mt-5 grid gap-2 text-sm leading-6 ${isCurrent ? "text-white/78" : "text-slate-300"}`}>
        {plan.features.map((feature) => (
          <li key={feature}>- {feature}</li>
        ))}
      </ul>

      <Button
        className={`mt-6 w-full ${isCurrent ? "active-plan-button" : ""}`}
        disabled={false}
        isLoading={!isCurrent && isPending}
        loadingLabel="Starting..."
        onClick={() => {
          if (!isCurrent) {
            onChoose(plan);
          }
        }}
        type="button"
        variant={isCurrent ? "secondary" : plan.key === "free" ? "secondary" : "primary"}
      >
        {isCurrent ? "Active Plan" : plan.key === "free" ? "Switch to Free" : "Upgrade"}
      </Button>
    </div>
  );
}

export function Settings() {
  const [message, setMessage] = useState("");
  const [pendingPlanKey, setPendingPlanKey] = useState("");
  const { isAuthenticated } = useAuth();
  const privacyQuery = usePrivacySettings(isAuthenticated);
  const updatePrivacyMutation = useUpdatePrivacySettings();
  const { error: plansError, isError: plansIsError, plans } = useSubscriptionPlans();
  const {
    error: subscriptionError,
    isError: subscriptionIsError,
    subscription,
  } = useMySubscription(isAuthenticated);
  const checkoutMutation = useCreateCheckoutSession();
  const portalMutation = useCreateCustomerPortalSession();
  const freeMutation = useSelectFreePlan();
  const currentPlanKey = subscription?.subscription?.effectivePlanKey ?? "free";
  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.sortOrder - b.sortOrder),
    [plans],
  );

  async function handleChoosePlan(plan) {
    setMessage("");
    setPendingPlanKey(plan.key);

    try {
      if (plan.key === "free") {
        await freeMutation.mutateAsync();
        setMessage("Free plan selected.");
        return;
      }

      const session = await checkoutMutation.mutateAsync(plan.key);

      if (session.url) {
        window.location.href = session.url;
        return;
      }

      setMessage("Plan updated.");
    } catch (error) {
      setMessage(error.message ?? "Unable to start billing flow.");
    } finally {
      setPendingPlanKey("");
    }
  }

  async function handlePortal() {
    setMessage("");

    try {
      const session = await portalMutation.mutateAsync();

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      setMessage(error.message ?? "Unable to open billing portal.");
    }
  }

  async function handlePrivacySubmit(payload) {
    setMessage("");

    try {
      await updatePrivacyMutation.mutateAsync(payload);
      setMessage("Privacy settings updated.");
    } catch (error) {
      setMessage(error.message ?? "Unable to update privacy settings.");
      throw error;
    }
  }

  return (
    <SaaSLayout eyebrow="Account" title="Settings">
      <div className="grid gap-8">
        {(plansIsError || subscriptionIsError) ? (
          <StatusBanner tone="error">
            {plansError || subscriptionError || "Unable to load billing data."}
          </StatusBanner>
        ) : null}
        {message ? <StatusBanner>{message}</StatusBanner> : null}

        <ProfilePrivacyPanel
          isSubmitting={updatePrivacyMutation.isPending}
          key={`${privacyQuery.data?.profileVisibility ?? "public"}-${JSON.stringify(
            privacyQuery.data?.privacySettings ?? {},
          )}`}
          onSubmit={handlePrivacySubmit}
          privacyData={privacyQuery.data}
        />

        <section className="relative overflow-hidden rounded-3xl border border-[#A78BFA]/18 bg-[linear-gradient(135deg,rgba(124, 58, 237, 0.24),rgba(255,255,255,0.06)_48%,rgba(109,40,217,0.16))] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#A78BFA]/18 blur-3xl animate-pulse-glow" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="relative text-sm font-semibold uppercase tracking-[0.22em] text-[#A78BFA]">
                Subscription
              </p>
              <h2 className="mobile-safe-text relative mt-2 text-3xl font-bold text-white">
                Manage plan and billing
              </h2>
              <p className="relative mt-3 max-w-2xl text-sm leading-6 text-white/68">
                Free is limited. Pro unlocks unlimited leads. Agency adds higher
                automation capacity and advanced tools.
              </p>
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={!subscription?.subscription?.stripeCustomerId}
              isLoading={portalMutation.isPending}
              loadingLabel="Opening..."
              onClick={handlePortal}
              variant="outline"
            >
              Billing Portal
            </Button>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {sortedPlans.map((plan) => (
            <PlanCard
              currentPlanKey={currentPlanKey}
              key={plan.key}
              onChoose={handleChoosePlan}
              pendingPlanKey={pendingPlanKey}
              plan={plan}
            />
          ))}
        </section>
      </div>
    </SaaSLayout>
  );
}
