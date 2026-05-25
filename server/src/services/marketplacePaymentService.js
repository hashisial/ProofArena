import mongoose from "mongoose";
import { env } from "../config/env.js";
import { MarketplaceTransaction } from "../models/MarketplaceTransaction.js";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import {
  createNotification,
  notifyPaymentUpdate,
  notifyProjectUpdate,
} from "./notificationService.js";
import { assertStripeMarketplaceConfigured } from "./stripeService.js";

const userSelect = "_id email fullName isSuspended name role stripeConnectedAccountId stripeConnectOnboardedAt stripeConnectStatus stripeConnectRequirementsDue username";
const transactionPopulate = [
  { path: "clientId", select: userSelect },
  { path: "providerId", select: userSelect },
];

function normalizeId(value) {
  return value?.toString?.() ?? String(value ?? "");
}

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
}

function getClientUrl(path = "") {
  const baseUrl = env.clientUrls[0] ?? "http://localhost:5173";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function normalizeCurrency(value) {
  const currency = String(value ?? "usd").trim().toLowerCase();

  if (!/^[a-z]{3}$/.test(currency)) {
    throw new AppError("Currency must be a valid three-letter currency code", 400);
  }

  return currency;
}

function normalizeAmountToMinorUnit({ amount, amountCents }) {
  const rawAmount = amountCents ?? amount;
  const numericAmount = Number(rawAmount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new AppError("Payment amount is required", 400);
  }

  const minorUnitAmount = amountCents === undefined
    ? Math.round(numericAmount * 100)
    : Math.round(numericAmount);

  if (minorUnitAmount < 50) {
    throw new AppError("Payment amount must be at least 50 cents", 400);
  }

  return minorUnitAmount;
}

function calculateCommission(amount) {
  const commissionBps = env.stripeMarketplaceCommissionBps;
  const platformFee = Math.round((amount * commissionBps) / 10_000);
  const providerAmount = amount - platformFee;

  if (providerAmount <= 0) {
    throw new AppError("Provider payout amount must be greater than zero", 400);
  }

  return {
    commissionBps,
    platformFee,
    providerAmount,
  };
}

function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat("en", {
      currency: currency.toUpperCase(),
      style: "currency",
    }).format(amount / 100);
  } catch {
    return `${amount / 100} ${currency.toUpperCase()}`;
  }
}

function getUserName(user) {
  return user?.fullName || user?.name || user?.email || "User";
}

function normalizeRequirements(account) {
  const entries = account?.requirements?.entries;

  if (Array.isArray(entries)) {
    return entries
      .map((entry) => entry?.requirement ?? entry?.code ?? entry?.field)
      .filter(Boolean);
  }

  return [
    ...(account?.requirements?.currently_due ?? []),
    ...(account?.requirements?.past_due ?? []),
    ...(account?.requirements?.eventually_due ?? []),
  ].filter(Boolean);
}

function normalizeConnectStatus(account) {
  const requirementsDue = normalizeRequirements(account);

  if (requirementsDue.length > 0) {
    return "pending";
  }

  const recipientStatus =
    account?.configuration?.recipient?.capabilities?.stripe_balance?.stripe_transfers?.status ??
    account?.capabilities?.transfers;

  if (recipientStatus === "active" || recipientStatus === "requested") {
    return "active";
  }

  return "pending";
}

function serializeConnectedAccount(user) {
  return {
    accountId: user?.stripeConnectedAccountId ?? "",
    requirementsDue: user?.stripeConnectRequirementsDue ?? [],
    status: user?.stripeConnectStatus ?? "not_started",
  };
}

function serializeUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: normalizeId(user._id),
    email: user.email ?? "",
    fullName: user.fullName ?? user.name ?? "",
    name: user.name ?? user.fullName ?? "",
    role: user.role ?? "client",
    username: user.username ?? "",
  };
}

function serializeTransaction(transaction) {
  if (!transaction) {
    return null;
  }

  const raw = transaction.toObject?.() ?? transaction;

  return {
    _id: normalizeId(raw._id),
    amount: raw.amount,
    amountLabel: formatMoney(raw.amount, raw.currency),
    client: typeof raw.clientId === "object" ? serializeUser(raw.clientId) : null,
    clientId: normalizeId(raw.clientId?._id ?? raw.clientId),
    commissionBps: raw.commissionBps,
    createdAt: raw.createdAt,
    currency: raw.currency,
    description: raw.description ?? "",
    failureReason: raw.failureReason ?? "",
    paidAt: raw.paidAt,
    platformFee: raw.platformFee,
    platformFeeLabel: formatMoney(raw.platformFee, raw.currency),
    projectId: raw.projectId ? normalizeId(raw.projectId) : null,
    proposalId: raw.proposalId ? normalizeId(raw.proposalId) : null,
    provider: typeof raw.providerId === "object" ? serializeUser(raw.providerId) : null,
    providerAmount: raw.providerAmount,
    providerAmountLabel: formatMoney(raw.providerAmount, raw.currency),
    providerId: normalizeId(raw.providerId?._id ?? raw.providerId),
    releasedAt: raw.releasedAt,
    status: raw.status,
    stripeCheckoutSessionId: raw.stripeCheckoutSessionId ?? "",
    stripeConnectedAccountId: raw.stripeConnectedAccountId ?? "",
    stripeTransferId: raw.stripeTransferId ?? "",
    title: raw.title,
    transferGroup: raw.transferGroup,
    updatedAt: raw.updatedAt,
    workCompletedAt: raw.workCompletedAt,
  };
}

async function findUserOrThrow(userId) {
  assertObjectId(userId, "user id");

  const user = await User.findById(userId).select(userSelect).lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isSuspended) {
    throw new AppError("User account is suspended", 403);
  }

  return user;
}

async function findProviderOrThrow(providerId) {
  const provider = await findUserOrThrow(providerId);

  if (provider.role !== "provider") {
    throw new AppError("Provider account is required", 400);
  }

  return provider;
}

async function populateTransaction(query) {
  return query.populate(transactionPopulate).lean();
}

export async function getConnectedAccountForProvider(userId) {
  ensureDatabaseConnection();
  const provider = await findProviderOrThrow(userId);

  if (!provider.stripeConnectedAccountId) {
    return serializeConnectedAccount(provider);
  }

  const stripe = assertStripeMarketplaceConfigured();
  const account = await stripe.v2.core.accounts.retrieve(
    provider.stripeConnectedAccountId,
    {
      include: ["configuration.recipient", "identity", "requirements"],
    },
  );
  const requirementsDue = normalizeRequirements(account);
  const status = normalizeConnectStatus(account);

  const updatedProvider = await User.findByIdAndUpdate(
    provider._id,
    {
      $set: {
        stripeConnectOnboardedAt: status === "active" ? new Date() : provider.stripeConnectOnboardedAt,
        stripeConnectRequirementsDue: requirementsDue,
        stripeConnectStatus: status,
      },
    },
    { new: true },
  ).lean();

  return serializeConnectedAccount(updatedProvider);
}

export async function createConnectedAccountForProvider(userId) {
  ensureDatabaseConnection();
  const provider = await findProviderOrThrow(userId);

  if (provider.stripeConnectedAccountId) {
    return getConnectedAccountForProvider(userId);
  }

  const stripe = assertStripeMarketplaceConfigured();
  const account = await stripe.v2.core.accounts.create({
    configuration: {
      recipient: {
        capabilities: {
          stripe_balance: {
            stripe_transfers: {
              requested: true,
            },
          },
        },
      },
    },
    contact_email: provider.email,
    dashboard: "express",
    defaults: {
      responsibilities: {
        fees_collector: "application",
        losses_collector: "application",
      },
    },
    display_name: getUserName(provider),
    identity: {
      country: env.stripeConnectCountry.toLowerCase(),
    },
    include: ["configuration.recipient", "identity", "requirements"],
  });
  const requirementsDue = normalizeRequirements(account);

  const updatedProvider = await User.findByIdAndUpdate(
    provider._id,
    {
      $set: {
        role: "provider",
        stripeConnectedAccountId: account.id,
        stripeConnectRequirementsDue: requirementsDue,
        stripeConnectStatus: normalizeConnectStatus(account),
      },
    },
    { new: true },
  ).lean();

  return serializeConnectedAccount(updatedProvider);
}

export async function createConnectedAccountOnboardingLink(userId) {
  ensureDatabaseConnection();
  let account = await getConnectedAccountForProvider(userId);

  if (!account.accountId) {
    account = await createConnectedAccountForProvider(userId);
  }

  const stripe = assertStripeMarketplaceConfigured();
  const accountLink = await stripe.v2.core.accountLinks.create({
    account: account.accountId,
    use_case: {
      account_onboarding: {
        collection_options: {
          fields: "eventually_due",
        },
        configurations: ["recipient"],
        refresh_url: getClientUrl("/payments?connect=refresh"),
        return_url: getClientUrl("/payments?connect=return"),
      },
      type: "account_onboarding",
    },
  });

  return {
    account,
    url: accountLink.url,
  };
}

export async function createMarketplaceCheckoutSession({
  amount,
  amountCents,
  clientId,
  currency = "usd",
  description = "",
  projectId,
  proposalId,
  providerId,
  title,
}) {
  ensureDatabaseConnection();
  assertObjectId(clientId, "client id");
  assertObjectId(providerId, "provider id");

  if (normalizeId(clientId) === normalizeId(providerId)) {
    throw new AppError("Client and provider must be different users", 400);
  }

  const [client, provider] = await Promise.all([
    findUserOrThrow(clientId),
    findProviderOrThrow(providerId),
  ]);

  if (!provider.stripeConnectedAccountId) {
    throw new AppError("Provider must complete Stripe Connect onboarding before accepting payments", 409);
  }

  if (projectId) {
    assertObjectId(projectId, "project id");
  }

  if (proposalId) {
    assertObjectId(proposalId, "proposal id");
  }

  const currencyCode = normalizeCurrency(currency);
  const totalAmount = normalizeAmountToMinorUnit({ amount, amountCents });
  const commission = calculateCommission(totalAmount);
  const transactionId = new mongoose.Types.ObjectId();
  const transferGroup = `mp_${transactionId.toString()}`;
  const cleanTitle = String(title ?? "").trim().slice(0, 180);

  if (!cleanTitle) {
    throw new AppError("Payment title is required", 400);
  }

  const transaction = await MarketplaceTransaction.create({
    _id: transactionId,
    ...commission,
    amount: totalAmount,
    clientId,
    currency: currencyCode,
    description: String(description ?? "").trim().slice(0, 2000),
    projectId: projectId || null,
    proposalId: proposalId || null,
    providerId,
    status: "checkout_created",
    stripeConnectedAccountId: provider.stripeConnectedAccountId,
    title: cleanTitle,
    transferGroup,
  });
  const stripe = assertStripeMarketplaceConfigured();
  const session = await stripe.checkout.sessions.create({
    cancel_url: getClientUrl(`/payments?transaction=${transaction._id}&checkout=cancelled`),
    customer_email: client.email,
    line_items: [
      {
        price_data: {
          currency: currencyCode,
          product_data: {
            description: transaction.description || undefined,
            name: transaction.title,
          },
          unit_amount: transaction.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      clientId: normalizeId(clientId),
      marketplaceTransactionId: normalizeId(transaction._id),
      projectId: projectId ? normalizeId(projectId) : "",
      providerId: normalizeId(providerId),
    },
    mode: "payment",
    payment_intent_data: {
      metadata: {
        marketplaceTransactionId: normalizeId(transaction._id),
      },
      transfer_group: transferGroup,
    },
    success_url: getClientUrl(`/payments?transaction=${transaction._id}&checkout=success&session_id={CHECKOUT_SESSION_ID}`),
  });

  const updatedTransaction = await populateTransaction(
    MarketplaceTransaction.findByIdAndUpdate(
      transaction._id,
      {
        $set: {
          status: "payment_pending",
          stripeCheckoutSessionId: session.id,
        },
      },
      { new: true },
    ),
  );

  return {
    session: {
      id: session.id,
      url: session.url,
    },
    transaction: serializeTransaction(updatedTransaction),
  };
}

export async function syncMarketplaceCheckoutSession(session) {
  ensureDatabaseConnection();
  const transactionId = session?.metadata?.marketplaceTransactionId;

  if (!transactionId || !mongoose.Types.ObjectId.isValid(transactionId)) {
    return null;
  }

  const stripe = assertStripeMarketplaceConfigured();
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  let chargeId = "";

  if (paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["latest_charge"],
    });
    chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id ?? "";
  }

  const transaction = await MarketplaceTransaction.findByIdAndUpdate(
    transactionId,
    {
      $set: {
        paidAt: new Date(),
        status: "paid",
        stripeChargeId: chargeId,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId ?? "",
      },
    },
    { new: true, runValidators: true },
  ).lean();

  if (transaction) {
    await Promise.all([
      notifyPaymentUpdate({
        amount: transaction.amount,
        currency: transaction.currency,
        status: "paid and held by platform",
        title: "Client payment received",
        userId: transaction.clientId,
      }),
      createNotification({
        actionUrl: "/payments",
        entityId: transaction._id,
        entityType: "payment",
        eventType: "payment_update",
        message: `A client payment of ${formatMoney(transaction.amount, transaction.currency)} is now held by the platform.`,
        title: "Payment held for project",
        type: "payment",
        userId: transaction.providerId,
      }),
    ]);
  }

  return serializeTransaction(transaction);
}

export async function listMarketplaceTransactionsForUser(userId) {
  ensureDatabaseConnection();
  assertObjectId(userId, "user id");

  const transactions = await populateTransaction(
    MarketplaceTransaction.find({
      $or: [{ clientId: userId }, { providerId: userId }],
    }).sort({ createdAt: -1 }),
  );

  return transactions.map(serializeTransaction);
}

export async function listMarketplaceTransactionsForAdmin() {
  ensureDatabaseConnection();

  const transactions = await populateTransaction(
    MarketplaceTransaction.find().sort({ createdAt: -1 }).limit(250),
  );

  return transactions.map(serializeTransaction);
}

export async function markMarketplaceWorkComplete({ transactionId, userId }) {
  ensureDatabaseConnection();
  assertObjectId(transactionId, "transaction id");
  assertObjectId(userId, "user id");

  const transaction = await MarketplaceTransaction.findOne({
    _id: transactionId,
    providerId: userId,
    status: { $in: ["paid", "in_progress"] },
  }).lean();

  if (!transaction) {
    throw new AppError("Transaction is not ready for work completion", 409);
  }

  const updatedTransaction = await populateTransaction(
    MarketplaceTransaction.findByIdAndUpdate(
      transaction._id,
      {
        $set: {
          status: "completed",
          workCompletedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    ),
  );

  await notifyProjectUpdate({
    message: `${updatedTransaction.title} was marked complete by the provider. Platform release is now available.`,
    projectId: updatedTransaction.projectId,
    recipientIds: [updatedTransaction.clientId?._id ?? updatedTransaction.clientId],
    status: "completed",
    title: "Work marked complete",
  });

  return serializeTransaction(updatedTransaction);
}

export async function releaseMarketplaceFunds({ adminId, transactionId }) {
  ensureDatabaseConnection();
  assertObjectId(transactionId, "transaction id");

  const transaction = await MarketplaceTransaction.findById(transactionId).lean();

  if (!transaction) {
    throw new AppError("Marketplace transaction not found", 404);
  }

  if (transaction.status === "released") {
    return serializeTransaction(
      await populateTransaction(MarketplaceTransaction.findById(transaction._id)),
    );
  }

  if (!["completed", "release_pending"].includes(transaction.status)) {
    throw new AppError("Funds can only be released after work is completed", 409);
  }

  if (!transaction.stripeConnectedAccountId) {
    throw new AppError("Provider connected account is missing", 409);
  }

  const stripe = assertStripeMarketplaceConfigured();
  let chargeId = transaction.stripeChargeId;

  if (!chargeId && transaction.stripePaymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      transaction.stripePaymentIntentId,
      { expand: ["latest_charge"] },
    );
    chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id ?? "";
  }

  if (!chargeId) {
    throw new AppError("Stripe charge is not available for this payment yet", 409);
  }

  await MarketplaceTransaction.findByIdAndUpdate(transaction._id, {
    $set: { status: "release_pending" },
  });

  const transfer = await stripe.transfers.create({
    amount: transaction.providerAmount,
    currency: transaction.currency,
    destination: transaction.stripeConnectedAccountId,
    metadata: {
      adminId: adminId ?? "",
      marketplaceTransactionId: normalizeId(transaction._id),
      platformFee: String(transaction.platformFee),
    },
    source_transaction: chargeId,
    transfer_group: transaction.transferGroup,
  });

  const updatedTransaction = await populateTransaction(
    MarketplaceTransaction.findByIdAndUpdate(
      transaction._id,
      {
        $set: {
          releasedAt: new Date(),
          status: "released",
          stripeChargeId: chargeId,
          stripeTransferId: transfer.id,
        },
      },
      { new: true, runValidators: true },
    ),
  );

  await Promise.all([
    createNotification({
      actionUrl: "/payments",
      entityId: updatedTransaction._id,
      entityType: "payment",
      eventType: "payment_update",
      message: `${formatMoney(updatedTransaction.providerAmount, updatedTransaction.currency)} was released to the provider.`,
      title: "Funds released",
      type: "payment",
      userId: updatedTransaction.clientId?._id ?? updatedTransaction.clientId,
    }),
    createNotification({
      actionUrl: "/payments",
      entityId: updatedTransaction._id,
      entityType: "payment",
      eventType: "payment_update",
      message: `${formatMoney(updatedTransaction.providerAmount, updatedTransaction.currency)} was released to your connected Stripe account.`,
      title: "Payout released",
      type: "payment",
      userId: updatedTransaction.providerId?._id ?? updatedTransaction.providerId,
    }),
  ]);

  if (updatedTransaction.projectId) {
    await Project.findByIdAndUpdate(updatedTransaction.projectId, {
      $set: { status: "completed" },
    });
  }

  return serializeTransaction(updatedTransaction);
}
