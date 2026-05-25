import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { APP_PERMISSIONS } from "../features/auth/roleAccess.js";
import { useAuth } from "../hooks/useAuth.js";
import {
  completeMarketplaceWork,
  createMarketplaceCheckoutSession,
  createMarketplaceConnectAccount,
  createMarketplaceOnboardingLink,
  getMarketplaceConnectAccount,
  getMarketplaceTransactions,
} from "../services/api.js";
import { formatDateTime } from "../utils/index.js";

const initialPaymentForm = {
  amount: "",
  currency: "usd",
  description: "",
  projectId: "",
  proposalId: "",
  providerId: "",
  title: "",
};

function getInitialPaymentForm() {
  if (typeof window === "undefined") {
    return initialPaymentForm;
  }

  const providerId = new URLSearchParams(window.location.search).get("providerId") ?? "";

  return {
    ...initialPaymentForm,
    providerId,
  };
}

function getStatusClasses(status) {
  if (status === "released") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700";
  }

  if (["paid", "completed", "release_pending"].includes(status)) {
    return "border-[#3F6212]/24 bg-[#3F6212]/10 text-[#365314]";
  }

  if (["failed", "cancelled", "refunded"].includes(status)) {
    return "border-red-500/20 bg-red-500/10 text-red-700";
  }

  return "border-black/10 bg-white text-black/58";
}

function TransactionCard({ isCompleting, onComplete, transaction, userId }) {
  const isProvider = transaction.providerId === userId;
  const canComplete = isProvider && ["paid", "in_progress"].includes(transaction.status);

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_20px_65px_rgba(63, 98, 18, 0.08)] transition hover:-translate-y-0.5 hover:border-[#3F6212]/36 hover:shadow-[0_28px_85px_rgba(63, 98, 18, 0.15)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClasses(transaction.status)}`}>
            {transaction.status.replace(/_/g, " ")}
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-[-0.05em] text-black">
            {transaction.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/56">
            {transaction.description || "Marketplace payment"}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-black/56 sm:grid-cols-2">
            <span>Client: <strong className="text-black">{transaction.client?.name || transaction.client?.email || "Client"}</strong></span>
            <span>Provider: <strong className="text-black">{transaction.provider?.name || transaction.provider?.email || "Provider"}</strong></span>
            <span>Paid: <strong className="text-black">{formatDateTime(transaction.paidAt, { fallback: "Pending" })}</strong></span>
            <span>Released: <strong className="text-black">{formatDateTime(transaction.releasedAt, { fallback: "Pending" })}</strong></span>
          </div>
        </div>
        <div className="grid shrink-0 gap-2 rounded-[1.25rem] border border-[#3F6212]/12 bg-[#fffbeb] p-4 text-sm">
          <div className="flex justify-between gap-8">
            <span className="text-black/50">Total</span>
            <strong className="text-black">{transaction.amountLabel}</strong>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-black/50">Provider</span>
            <strong className="text-black">{transaction.providerAmountLabel}</strong>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-black/50">Commission</span>
            <strong className="text-[#365314]">{transaction.platformFeeLabel}</strong>
          </div>
          {canComplete ? (
            <Button
              className="mt-3 min-h-10 px-4 py-2"
              disabled={isCompleting}
              onClick={() => onComplete(transaction._id)}
            >
              Mark Work Complete
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Payments() {
  const { can, user } = useAuth();
  const [form, setForm] = useState(getInitialPaymentForm);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const canHireProvider = can(APP_PERMISSIONS.MARKETPLACE_HIRE);
  const canManagePayouts = can(APP_PERMISSIONS.MARKETPLACE_PAYOUTS);
  const {
    data: transactions = [],
    error: transactionError,
    isError: isTransactionError,
    isLoading: isTransactionsLoading,
  } = useQuery({
    queryFn: getMarketplaceTransactions,
    queryKey: ["marketplace", "transactions"],
    staleTime: 10_000,
  });
  const {
    data: connectAccount,
    isLoading: isConnectLoading,
  } = useQuery({
    enabled: canManagePayouts,
    queryFn: getMarketplaceConnectAccount,
    queryKey: ["marketplace", "connect-account"],
    retry: false,
    staleTime: 20_000,
  });
  const createConnectMutation = useMutation({
    mutationFn: createMarketplaceConnectAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace", "connect-account"] });
      setMessage("Connected account created. Continue onboarding to enable payouts.");
    },
    onError: (error) => setMessage(error.message ?? "Unable to create connected account."),
  });
  const onboardingMutation = useMutation({
    mutationFn: createMarketplaceOnboardingLink,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => setMessage(error.message ?? "Unable to start onboarding."),
  });
  const checkoutMutation = useMutation({
    mutationFn: createMarketplaceCheckoutSession,
    onSuccess: (data) => {
      if (data.session?.url) {
        window.location.href = data.session.url;
      }
    },
    onError: (error) => setMessage(error.message ?? "Unable to create checkout session."),
  });
  const completeMutation = useMutation({
    mutationFn: completeMarketplaceWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace", "transactions"] });
      setMessage("Work marked complete. Platform admin can now release funds.");
    },
    onError: (error) => setMessage(error.message ?? "Unable to mark work complete."),
  });
  const totals = useMemo(
    () =>
      transactions.reduce(
        (summary, transaction) => ({
          commission: summary.commission + (transaction.platformFee ?? 0),
          held:
            summary.held +
            (["paid", "in_progress", "completed", "release_pending"].includes(transaction.status)
              ? transaction.providerAmount ?? 0
              : 0),
          released:
            summary.released +
            (transaction.status === "released" ? transaction.providerAmount ?? 0 : 0),
        }),
        { commission: 0, held: 0, released: 0 },
      ),
    [transactions],
  );

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function submitPayment(event) {
    event.preventDefault();
    checkoutMutation.mutate({
      ...form,
      projectId: form.projectId.trim() || undefined,
      proposalId: form.proposalId.trim() || undefined,
    });
  }

  return (
    <SaaSLayout eyebrow="Marketplace" title="Payments and payouts">
      <div className="grid gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_85%_15%,rgba(63, 98, 18, 0.18),transparent_32%),linear-gradient(135deg,#ffffff,#fffbeb)] p-6 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3F6212]">
                Secure marketplace flow
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.07em] text-black md:text-6xl">
                Client pays, platform holds, provider gets paid after completion.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-black/58">
                Track every payment, commission, completion event, and provider release from one workspace.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_20px_65px_rgba(63, 98, 18, 0.08)]">
              {[
                ["Held for release", totals.held],
                ["Released to providers", totals.released],
                ["Platform commission", totals.commission],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-[#fffbeb] px-4 py-3" key={label}>
                  <span className="text-sm font-semibold text-black/56">{label}</span>
                  <strong className="text-lg text-black">
                    ${(value / 100).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {message ? <StatusBanner>{message}</StatusBanner> : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              Client checkout
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.055em] text-black">
              Create a held payment
            </h2>
            {canHireProvider ? (
              <form className="mt-5 grid gap-4" onSubmit={submitPayment}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="title"
                    onChange={updateForm}
                    placeholder="Project title"
                    required
                    value={form.title}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="providerId"
                    onChange={updateForm}
                    placeholder="Provider user ID"
                    required
                    value={form.providerId}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    min="0.5"
                    name="amount"
                    onChange={updateForm}
                    placeholder="Amount"
                    required
                    step="0.01"
                    type="number"
                    value={form.amount}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold uppercase text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    maxLength={3}
                    name="currency"
                    onChange={updateForm}
                    placeholder="USD"
                    value={form.currency}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="projectId"
                    onChange={updateForm}
                    placeholder="Project ID optional"
                    value={form.projectId}
                  />
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    name="proposalId"
                    onChange={updateForm}
                    placeholder="Proposal ID optional"
                    value={form.proposalId}
                  />
                </div>
                <textarea
                  className="min-h-24 rounded-[1.25rem] border border-black/10 bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  name="description"
                  onChange={updateForm}
                  placeholder="Payment description"
                  value={form.description}
                />
                <Button
                  isLoading={checkoutMutation.isPending}
                  loadingLabel="Creating checkout..."
                  type="submit"
                >
                  Pay with Stripe Checkout
                </Button>
              </form>
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-[#3F6212]/14 bg-[#3F6212]/6 p-5">
                <p className="font-bold text-black">Client permission required</p>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Provider accounts can view transactions and manage payouts. Client accounts create held payments for hiring providers.
                </p>
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] md:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              Provider payouts
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.055em] text-black">
              Stripe Connect
            </h2>
            {!canManagePayouts ? (
              <p className="mt-4 text-sm leading-6 text-black/58">
                Switch to a provider account to onboard payouts and receive project releases.
              </p>
            ) : null}
            {canManagePayouts && isConnectLoading ? <LoadingState columns={2} /> : null}
            {canManagePayouts && !isConnectLoading ? (
              <div className="mt-5 grid gap-4">
                <div className="rounded-[1.25rem] border border-[#3F6212]/14 bg-[#fffbeb] p-4">
                  <p className="text-sm font-semibold text-black/56">Connect status</p>
                  <p className="mt-2 text-2xl font-bold capitalize text-black">
                    {(connectAccount?.status ?? "not_started").replace(/_/g, " ")}
                  </p>
                  {connectAccount?.requirementsDue?.length ? (
                    <p className="mt-2 text-sm leading-6 text-black/50">
                      {connectAccount.requirementsDue.length} onboarding requirement
                      {connectAccount.requirementsDue.length === 1 ? "" : "s"} remaining.
                    </p>
                  ) : null}
                </div>
                {!connectAccount?.accountId ? (
                  <Button
                    isLoading={createConnectMutation.isPending}
                    loadingLabel="Creating..."
                    onClick={() => createConnectMutation.mutate()}
                  >
                    Create Connected Account
                  </Button>
                ) : null}
                <Button
                  disabled={!connectAccount?.accountId && createConnectMutation.isPending}
                  isLoading={onboardingMutation.isPending}
                  loadingLabel="Opening Stripe..."
                  onClick={() => onboardingMutation.mutate()}
                  variant={connectAccount?.accountId ? "primary" : "outline"}
                >
                  Continue Stripe Onboarding
                </Button>
              </div>
            ) : null}
          </aside>
        </div>

        <section className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
                Transaction history
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-[-0.055em] text-black">
                Payment ledger
              </h2>
            </div>
          </div>
          {isTransactionError ? (
            <StatusBanner tone="error">
              {transactionError?.message ?? "Unable to load transactions."}
            </StatusBanner>
          ) : null}
          {isTransactionsLoading ? <LoadingState columns={4} /> : null}
          {!isTransactionsLoading && transactions.length === 0 ? (
            <EmptyState
              description="Client payments, held balances, provider completion, and payout releases will appear here."
              title="No marketplace transactions yet"
            />
          ) : null}
          {transactions.map((transaction) => (
            <TransactionCard
              isCompleting={completeMutation.isPending}
              key={transaction._id}
              onComplete={(transactionId) => completeMutation.mutate(transactionId)}
              transaction={transaction}
              userId={user?.id}
            />
          ))}
        </section>
      </div>
    </SaaSLayout>
  );
}
