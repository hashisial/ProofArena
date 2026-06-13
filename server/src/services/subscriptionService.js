import { env } from "../config/env.js";
import {
  defaultSubscriptionPlans,
  PLAN_KEYS,
  PLAN_ORDER,
} from "../constants/subscriptionPlans.js";
import { ApiUsage } from "../models/ApiUsage.js";
import { Invoice } from "../models/Invoice.js";
import { Lead } from "../models/Lead.js";
import { LeadScrapeJob } from "../models/LeadScrapeJob.js";
import { OutreachEmail } from "../models/OutreachEmail.js";
import { Subscription } from "../models/Subscription.js";
import { SubscriptionPlan } from "../models/SubscriptionPlan.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { syncMarketplaceCheckoutSession } from "./marketplacePaymentService.js";
import { notifyPaymentUpdate } from "./notificationService.js";
import { assertStripeBillingConfigured, getStripe } from "./stripeService.js";

function getConfiguredDefaultPlans() {
  return defaultSubscriptionPlans.map((plan) => {
    if (plan.key === PLAN_KEYS.PRO) {
      return { ...plan, stripePriceId: env.stripeProPriceId ?? "" };
    }

    if (plan.key === PLAN_KEYS.AGENCY) {
      return { ...plan, stripePriceId: env.stripeAgencyPriceId ?? "" };
    }

    return plan;
  });
}

function getClientUrl(path = "") {
  const baseUrl = env.clientUrl;
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function getMonthStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

function getDayStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function getCurrentPeriodKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function fromUnixTimestamp(value) {
  return value ? new Date(value * 1000) : null;
}

function normalizePlanKey(planKey) {
  return String(planKey ?? "").trim().toLowerCase();
}

function normalizeNullableLimit(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new AppError("Plan limits must be non-negative numbers", 400);
  }

  return Math.floor(numberValue);
}

function normalizePlanUpdate(planData = {}) {
  const update = {};

  ["name", "description", "stripePriceId"].forEach((field) => {
    if (planData[field] !== undefined) {
      update[field] = String(planData[field] ?? "").trim();
    }
  });

  if (planData.monthlyPrice !== undefined) {
    const price = Number(planData.monthlyPrice);

    if (!Number.isFinite(price) || price < 0) {
      throw new AppError("Monthly price must be a non-negative number", 400);
    }

    update.monthlyPrice = price;
  }

  [
    "apiLimitMonthly",
    "emailLimitMonthly",
    "leadLimit",
    "scrapeLimitDaily",
    "scrapeLimitMonthly",
  ].forEach((field) => {
    if (planData[field] !== undefined) {
      update[field] = normalizeNullableLimit(planData[field]);
    }
  });

  if (planData.advancedTools !== undefined) {
    update.advancedTools = Boolean(planData.advancedTools);
  }

  if (planData.isActive !== undefined) {
    update.isActive = Boolean(planData.isActive);
  }

  if (planData.features !== undefined) {
    update.features = Array.isArray(planData.features)
      ? planData.features.map((feature) => String(feature ?? "").trim()).filter(Boolean)
      : String(planData.features ?? "")
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean);
  }

  return update;
}

function getUsageLimitsFromPlan(plan = {}) {
  const planLimits = plan ?? {};

  return {
    maxEmails: planLimits.emailLimitMonthly ?? null,
    maxLeads: planLimits.leadLimit ?? null,
    maxScrapes: planLimits.scrapeLimitDaily ?? planLimits.scrapeLimitMonthly ?? null,
  };
}

function normalizeUsageLimits(limits = {}) {
  return {
    maxEmails: limits?.maxEmails ?? null,
    maxLeads: limits?.maxLeads ?? null,
    maxScrapes: limits?.maxScrapes ?? null,
  };
}

function usageLimitsMatch(currentLimits, nextLimits) {
  const current = normalizeUsageLimits(currentLimits);
  const next = normalizeUsageLimits(nextLimits);

  return (
    current.maxEmails === next.maxEmails &&
    current.maxLeads === next.maxLeads &&
    current.maxScrapes === next.maxScrapes
  );
}

function getSubscriptionPlanKey(subscription) {
  const planKey = normalizePlanKey(subscription?.plan ?? subscription?.planKey);
  return PLAN_ORDER.includes(planKey) ? planKey : PLAN_KEYS.FREE;
}

function isPaidActive(subscription) {
  return ["active", "trialing", "past_due"].includes(subscription?.status);
}

function getEffectivePlanKey(subscription) {
  const planKey = getSubscriptionPlanKey(subscription);

  if (!subscription || planKey === PLAN_KEYS.FREE) {
    return PLAN_KEYS.FREE;
  }

  return isPaidActive(subscription) ? planKey : PLAN_KEYS.FREE;
}

function toSubscriptionResponse(subscription, effectivePlanKey = getEffectivePlanKey(subscription)) {
  const planKey = getSubscriptionPlanKey(subscription);

  return {
    ...subscription,
    effectivePlanKey,
    plan: planKey,
    planKey,
  };
}

async function getPlanByPriceId(priceId) {
  if (!priceId) {
    return null;
  }

  await ensureDefaultPlans();
  return SubscriptionPlan.findOne({ stripePriceId: priceId }).lean();
}

async function getPlanOrThrow(planKey) {
  await ensureDefaultPlans();

  const normalizedPlanKey = normalizePlanKey(planKey);

  if (!PLAN_ORDER.includes(normalizedPlanKey)) {
    throw new AppError("Subscription plan is invalid", 400);
  }

  const plan = await SubscriptionPlan.findOne({
    isActive: true,
    key: normalizedPlanKey,
  }).lean();

  if (!plan) {
    throw new AppError("Subscription plan not found", 404);
  }

  return plan;
}

async function getUserOrThrow(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  return user;
}

async function getUsageForUser(userId) {
  const dayStart = getDayStart();
  const monthStart = getMonthStart();
  const period = getCurrentPeriodKey();
  const [leadCount, scrapeCount, scrapeCountToday, emailCount, apiUsage] = await Promise.all([
    Lead.countDocuments({ userId }),
    LeadScrapeJob.countDocuments({ createdAt: { $gte: monthStart }, userId }),
    LeadScrapeJob.countDocuments({ createdAt: { $gte: dayStart }, userId }),
    OutreachEmail.countDocuments({ status: "sent", userId }),
    ApiUsage.findOne({ period, userId }).lean(),
  ]);

  return {
    apiRequestsThisMonth: apiUsage?.requestCount ?? 0,
    emailsSent: emailCount,
    leads: leadCount,
    scrapeRequestsToday: scrapeCountToday,
    scrapeRequestsThisMonth: scrapeCount,
  };
}

function buildLimitState(plan, usage) {
  return {
    apiLimitMonthly: plan.apiLimitMonthly,
    apiRequestsThisMonth: usage.apiRequestsThisMonth,
    emailLimitMonthly: plan.emailLimitMonthly,
    emailsSent: usage.emailsSent,
    leadLimit: plan.leadLimit,
    leads: usage.leads,
    scrapeLimitDaily: plan.scrapeLimitDaily,
    scrapeRequestsToday: usage.scrapeRequestsToday,
    scrapeLimitMonthly: plan.scrapeLimitMonthly,
    scrapeRequestsThisMonth: usage.scrapeRequestsThisMonth,
    usageLimits: getUsageLimitsFromPlan(plan),
  };
}

async function syncSubscriptionUsageLimits(subscription) {
  if (!subscription) {
    return subscription;
  }

  const planKey = getSubscriptionPlanKey(subscription);
  const plan =
    (await SubscriptionPlan.findOne({ key: planKey }).lean()) ??
    (await SubscriptionPlan.findOne({ key: PLAN_KEYS.FREE }).lean());
  const usageLimits = getUsageLimitsFromPlan(plan);

  if (
    subscription.plan === planKey &&
    usageLimitsMatch(subscription.usageLimits, usageLimits)
  ) {
    return {
      ...subscription,
      usageLimits,
    };
  }

  return Subscription.findByIdAndUpdate(
    subscription._id,
    {
      $set: {
        plan: planKey,
        usageLimits,
      },
      $unset: {
        planKey: "",
      },
    },
    { new: true, runValidators: true, strict: false },
  ).lean();
}

export async function recordApiUsageForUser(userId, { method = "", path = "" } = {}) {
  const { limits, plan, subscription } = await getUserSubscriptionDetails(userId);

  if (
    limits.apiLimitMonthly !== null &&
    limits.apiLimitMonthly !== undefined &&
    limits.apiRequestsThisMonth >= limits.apiLimitMonthly
  ) {
    throw new AppError(
      `${plan.name} plan API usage limit reached for this month. Upgrade to continue.`,
      429,
    );
  }

  const period = getCurrentPeriodKey();

  return ApiUsage.findOneAndUpdate(
    { period, userId },
    {
      $inc: { requestCount: 1 },
      $set: {
        lastMethod: method,
        lastPath: path,
        lastRequestAt: new Date(),
        planKey: subscription.effectivePlanKey,
      },
      $setOnInsert: { period, userId },
    },
    { new: true, upsert: true },
  ).lean();
}

export async function ensureDefaultPlans() {
  ensureDatabaseConnection();

  const plans = getConfiguredDefaultPlans();

  await Promise.all(
    plans.map(async (plan) => {
      await SubscriptionPlan.updateOne(
        { key: plan.key },
        { $setOnInsert: plan },
        { upsert: true },
      );
      await SubscriptionPlan.updateOne(
        { apiLimitMonthly: { $exists: false }, key: plan.key },
        { $set: { apiLimitMonthly: plan.apiLimitMonthly } },
      );
      await SubscriptionPlan.updateOne(
        { emailLimitMonthly: { $exists: false }, key: plan.key },
        { $set: { emailLimitMonthly: plan.emailLimitMonthly } },
      );
      await SubscriptionPlan.updateOne(
        { scrapeLimitDaily: { $exists: false }, key: plan.key },
        { $set: { scrapeLimitDaily: plan.scrapeLimitDaily ?? null } },
      );
    }),
  );

  await SubscriptionPlan.updateOne(
    { key: PLAN_KEYS.FREE, leadLimit: 25 },
    {
      $set: {
        leadLimit: 100,
        scrapeLimitDaily: 5,
        scrapeLimitMonthly: null,
      },
    },
  );
  await SubscriptionPlan.updateOne(
    { key: PLAN_KEYS.FREE, scrapeLimitMonthly: 3 },
    {
      $set: {
        scrapeLimitDaily: 5,
        scrapeLimitMonthly: null,
      },
    },
  );
  await SubscriptionPlan.updateOne(
    { key: PLAN_KEYS.PRO, advancedTools: false },
    { $set: { advancedTools: true } },
  );
}

export async function findSubscriptionPlans({ includeInactive = false } = {}) {
  ensureDatabaseConnection();

  await ensureDefaultPlans();

  return SubscriptionPlan.find(includeInactive ? {} : { isActive: true })
    .sort({ sortOrder: 1 })
    .lean();
}

export async function updateSubscriptionPlan(planKey, planData) {
  ensureDatabaseConnection();

  const normalizedPlanKey = normalizePlanKey(planKey);

  if (!PLAN_ORDER.includes(normalizedPlanKey)) {
    throw new AppError("Plan key is invalid", 400);
  }

  await ensureDefaultPlans();

  const update = normalizePlanUpdate(planData);

  if (Object.keys(update).length === 0) {
    throw new AppError("No plan fields provided for update", 400);
  }

  const plan = await SubscriptionPlan.findOneAndUpdate(
    { key: normalizedPlanKey },
    update,
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!plan) {
    throw new AppError("Subscription plan not found", 404);
  }

  const usageLimits = getUsageLimitsFromPlan(plan);

  await Subscription.updateMany(
    { plan: normalizedPlanKey },
    { $set: { usageLimits } },
    { runValidators: true },
  );

  return plan;
}

export async function ensureUserSubscription(userId) {
  ensureDatabaseConnection();

  await ensureDefaultPlans();

  await Subscription.updateOne(
    {
      plan: { $exists: false },
      planKey: { $exists: true },
      userId,
    },
    [{ $set: { plan: "$planKey" } }, { $unset: "planKey" }],
    { strict: false, updatePipeline: true },
  );

  const freePlan = await SubscriptionPlan.findOne({ key: PLAN_KEYS.FREE }).lean();
  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: {
        plan: PLAN_KEYS.FREE,
        status: "free",
        usageLimits: getUsageLimitsFromPlan(freePlan),
        userId,
      },
    },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  return syncSubscriptionUsageLimits(subscription);
}

export async function getUserSubscriptionDetails(userId) {
  ensureDatabaseConnection();

  const subscription = await ensureUserSubscription(userId);
  const effectivePlanKey = getEffectivePlanKey(subscription);
  const [plan, usage] = await Promise.all([
    getPlanOrThrow(effectivePlanKey),
    getUsageForUser(userId),
  ]);

  return {
    limits: buildLimitState(plan, usage),
    plan,
    subscription: toSubscriptionResponse(subscription, effectivePlanKey),
  };
}

export async function assertLeadLimitForUser(userId, additionalLeads = 1) {
  const { limits, plan } = await getUserSubscriptionDetails(userId);

  if (
    limits.leadLimit !== null &&
    limits.leadLimit !== undefined &&
    limits.leads + additionalLeads > limits.leadLimit
  ) {
    throw new AppError(
      `${plan.name} plan lead limit reached. Upgrade to Pro for unlimited leads.`,
      402,
    );
  }
}

export async function assertScrapeLimitForUser(userId) {
  const { limits, plan } = await getUserSubscriptionDetails(userId);

  if (
    limits.scrapeLimitDaily !== null &&
    limits.scrapeLimitDaily !== undefined &&
    limits.scrapeRequestsToday >= limits.scrapeLimitDaily
  ) {
    throw new AppError(
      `${plan.name} plan daily scraping limit reached. Upgrade to continue scraping.`,
      402,
    );
  }

  if (
    limits.scrapeLimitMonthly !== null &&
    limits.scrapeLimitMonthly !== undefined &&
    limits.scrapeRequestsThisMonth >= limits.scrapeLimitMonthly
  ) {
    throw new AppError(
      `${plan.name} plan scraping limit reached for this month. Upgrade to continue scraping.`,
      402,
    );
  }
}

export async function assertEmailLimitForUser(userId, additionalEmails = 1) {
  const { limits, plan } = await getUserSubscriptionDetails(userId);

  if (
    limits.emailLimitMonthly !== null &&
    limits.emailLimitMonthly !== undefined &&
    limits.emailsSent + additionalEmails > limits.emailLimitMonthly
  ) {
    throw new AppError(
      `${plan.name} plan email limit reached for this month. Upgrade to continue outreach.`,
      402,
    );
  }
}

export async function selectFreeSubscription(userId) {
  ensureDatabaseConnection();

  const subscription = await ensureUserSubscription(userId);

  if (subscription.stripeSubscriptionId && isPaidActive(subscription)) {
    throw new AppError("Use the billing portal to cancel or change a paid plan", 409);
  }

  const freePlan = await getPlanOrThrow(PLAN_KEYS.FREE);

  const updatedSubscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      cancelAtPeriodEnd: false,
      currentPeriodEnd: null,
      currentPeriodStart: null,
      plan: PLAN_KEYS.FREE,
      status: "free",
      stripePriceId: "",
      stripeSubscriptionId: "",
      usageLimits: getUsageLimitsFromPlan(freePlan),
    },
    { new: true, runValidators: true },
  ).lean();

  return toSubscriptionResponse(updatedSubscription, PLAN_KEYS.FREE);
}

export async function createCheckoutSession(userId, requestedPlanKey) {
  ensureDatabaseConnection();

  const normalizedPlanKey = normalizePlanKey(requestedPlanKey);

  if (normalizedPlanKey === PLAN_KEYS.FREE) {
    const subscription = await selectFreeSubscription(userId);
    return {
      localPlanSelected: true,
      subscription: toSubscriptionResponse(subscription, PLAN_KEYS.FREE),
    };
  }

  const selectedPlan = await getPlanOrThrow(normalizedPlanKey);

  if (!selectedPlan.stripePriceId) {
    throw new AppError("Stripe price is not configured for this plan", 503);
  }

  const stripe = assertStripeBillingConfigured();
  const [user, currentSubscription] = await Promise.all([
    getUserOrThrow(userId),
    ensureUserSubscription(userId),
  ]);
  let stripeCustomerId = currentSubscription.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
      name: user.name,
    });

    stripeCustomerId = customer.id;
    await Subscription.updateOne({ userId }, { stripeCustomerId });
  }

  const metadata = {
    plan: selectedPlan.key,
    planKey: selectedPlan.key,
    userId: user._id.toString(),
  };

  const session = await stripe.checkout.sessions.create({
    cancel_url: getClientUrl("/settings?checkout=cancelled"),
    customer: stripeCustomerId,
    line_items: [{ price: selectedPlan.stripePriceId, quantity: 1 }],
    metadata,
    mode: "subscription",
    success_url: getClientUrl("/settings?checkout=success"),
    subscription_data: {
      metadata,
    },
  });

  return {
    id: session.id,
    url: session.url,
  };
}

export async function createCustomerPortalSession(userId) {
  ensureDatabaseConnection();

  const subscription = await ensureUserSubscription(userId);

  if (!subscription.stripeCustomerId) {
    throw new AppError("No Stripe customer exists for this account yet", 404);
  }

  const session = await assertStripeBillingConfigured().billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: getClientUrl("/settings"),
  });

  return {
    id: session.id,
    url: session.url,
  };
}

async function syncStripeSubscription(stripeSubscription, fallbackMetadata = {}) {
  const stripePriceId = stripeSubscription.items?.data?.[0]?.price?.id ?? "";
  const metadataPlanKey =
    stripeSubscription.metadata?.planKey ??
    stripeSubscription.metadata?.plan ??
    fallbackMetadata.planKey ??
    fallbackMetadata.plan;
  const plan =
    (await getPlanByPriceId(stripePriceId)) ??
    (metadataPlanKey ? await getPlanOrThrow(metadataPlanKey) : null);
  const userId = stripeSubscription.metadata?.userId ?? fallbackMetadata.userId;

  if (!userId || !plan) {
    return null;
  }

  const status = stripeSubscription.status ?? "incomplete";
  const isDeleted = status === "canceled" || status === "incomplete_expired";
  const storedPlanKey = isDeleted ? PLAN_KEYS.FREE : plan.key;
  const storedPlan = isDeleted ? await getPlanOrThrow(PLAN_KEYS.FREE) : plan;
  const existingSubscription = await Subscription.findOne({ userId }).lean();

  const subscription = await Subscription.findOneAndUpdate(
    { userId },
    {
      cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),
      currentPeriodEnd: fromUnixTimestamp(stripeSubscription.current_period_end),
      currentPeriodStart: fromUnixTimestamp(stripeSubscription.current_period_start),
      plan: storedPlanKey,
      status: isDeleted ? "canceled" : status,
      stripeCustomerId:
        typeof stripeSubscription.customer === "string"
          ? stripeSubscription.customer
          : stripeSubscription.customer?.id ?? "",
      stripePriceId,
      stripeSubscriptionId: stripeSubscription.id,
      usageLimits: getUsageLimitsFromPlan(storedPlan),
      userId,
    },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  if (
    subscription?._id &&
    (
      !existingSubscription ||
      existingSubscription.status !== subscription.status ||
      existingSubscription.plan !== subscription.plan ||
      existingSubscription.cancelAtPeriodEnd !== subscription.cancelAtPeriodEnd
    )
  ) {
    await notifyPaymentUpdate({
      status: subscription.status,
      subscriptionId: subscription._id,
      title: "Subscription updated",
      userId: subscription.userId,
    });
  }

  return subscription;
}

async function syncStripeInvoice(stripeInvoice) {
  const subscriptionId =
    typeof stripeInvoice.subscription === "string"
      ? stripeInvoice.subscription
      : stripeInvoice.subscription?.id;
  const customerId =
    typeof stripeInvoice.customer === "string"
      ? stripeInvoice.customer
      : stripeInvoice.customer?.id;
  const lookup = [
    subscriptionId ? { stripeSubscriptionId: subscriptionId } : null,
    customerId ? { stripeCustomerId: customerId } : null,
  ].filter(Boolean);

  if (lookup.length === 0) {
    return null;
  }

  const subscription = await Subscription.findOne({
    $or: lookup,
  }).lean();

  if (!subscription?.userId || !stripeInvoice.id) {
    return null;
  }

  const existingInvoice = await Invoice.findOne({
    stripeInvoiceId: stripeInvoice.id,
  }).lean();
  const invoice = await Invoice.findOneAndUpdate(
    { stripeInvoiceId: stripeInvoice.id },
    {
      amount:
        stripeInvoice.amount_paid ??
        stripeInvoice.amount_due ??
        stripeInvoice.total ??
        0,
      currency: stripeInvoice.currency ?? "usd",
      status: stripeInvoice.status ?? "draft",
      stripeInvoiceId: stripeInvoice.id,
      userId: subscription.userId,
    },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  if (
    invoice?._id &&
    (!existingInvoice || existingInvoice.status !== invoice.status)
  ) {
    await notifyPaymentUpdate({
      amount: invoice.amount,
      currency: invoice.currency,
      invoiceId: invoice._id,
      status: invoice.status,
      title: "Invoice updated",
      userId: invoice.userId,
    });
  }

  return invoice;
}

export async function handleStripeWebhookEvent(request) {
  const stripe = getStripe();
  const signature = request.headers["stripe-signature"];
  let event;

  if (env.stripeWebhookSecret) {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      env.stripeWebhookSecret,
    );
  } else {
    event = JSON.parse(request.body.toString("utf8"));
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.metadata?.marketplaceTransactionId) {
      await syncMarketplaceCheckoutSession(session);
      return { received: true };
    }

    if (session.mode === "subscription" && session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscriptionId,
      );

      await syncStripeSubscription(stripeSubscription, session.metadata ?? {});
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    await syncStripeSubscription(event.data.object);
  }

  if (
    event.type === "invoice.created" ||
    event.type === "invoice.finalized" ||
    event.type === "invoice.payment_failed" ||
    event.type === "invoice.payment_succeeded" ||
    event.type === "invoice.updated"
  ) {
    await syncStripeInvoice(event.data.object);
  }

  return { received: true };
}

export async function getAdminSaasOverview() {
  ensureDatabaseConnection();

  await ensureDefaultPlans();

  const dayStart = getDayStart();
  const monthStart = getMonthStart();
  const period = getCurrentPeriodKey();
  const [users, subscriptions, plans] = await Promise.all([
    User.find().sort({ createdAt: -1 }).select("-password").lean(),
    Subscription.find().lean(),
    SubscriptionPlan.find().sort({ sortOrder: 1 }).lean(),
  ]);
  const subscriptionByUserId = new Map(
    subscriptions.map((subscription) => [subscription.userId.toString(), subscription]),
  );

  const usersWithUsage = await Promise.all(
    users.map(async (user) => {
      const userId = user._id.toString();
      const subscription =
        subscriptionByUserId.get(userId) ?? (await ensureUserSubscription(userId));
      const effectivePlanKey = getEffectivePlanKey(subscription);
      const plan = plans.find((item) => item.key === effectivePlanKey);
      const [leadCount, scrapeCount, scrapeCountToday, emailCount, apiUsage] = await Promise.all([
        Lead.countDocuments({ userId }),
        LeadScrapeJob.countDocuments({ createdAt: { $gte: monthStart }, userId }),
        LeadScrapeJob.countDocuments({ createdAt: { $gte: dayStart }, userId }),
        OutreachEmail.countDocuments({ status: "sent", userId }),
        ApiUsage.findOne({ period, userId }).lean(),
      ]);

      return {
        subscription: toSubscriptionResponse(subscription, effectivePlanKey),
        usage: {
          apiLimitMonthly: plan?.apiLimitMonthly ?? null,
          apiRequestsThisMonth: apiUsage?.requestCount ?? 0,
          emailLimitMonthly: plan?.emailLimitMonthly ?? null,
          emailsSent: emailCount,
          leadLimit: plan?.leadLimit ?? null,
          leads: leadCount,
          scrapeLimitDaily: plan?.scrapeLimitDaily ?? null,
          scrapeRequestsToday: scrapeCountToday,
          scrapeLimitMonthly: plan?.scrapeLimitMonthly ?? null,
          scrapeRequestsThisMonth: scrapeCount,
          usageLimits: getUsageLimitsFromPlan(plan),
        },
        user,
      };
    }),
  );
  const planCounts = PLAN_ORDER.reduce((counts, planKey) => {
    counts[planKey] = usersWithUsage.filter(
      (item) => item.subscription.effectivePlanKey === planKey,
    ).length;
    return counts;
  }, {});

  return {
    plans,
    summary: {
      agencyUsers: planCounts.agency,
      freeUsers: planCounts.free,
      proUsers: planCounts.pro,
      totalApiRequestsThisMonth: usersWithUsage.reduce(
        (total, item) => total + item.usage.apiRequestsThisMonth,
        0,
      ),
      totalEmailsSent: usersWithUsage.reduce(
        (total, item) => total + item.usage.emailsSent,
        0,
      ),
      totalLeads: usersWithUsage.reduce((total, item) => total + item.usage.leads, 0),
      totalScrapesThisMonth: usersWithUsage.reduce(
        (total, item) => total + item.usage.scrapeRequestsThisMonth,
        0,
      ),
      totalUsers: users.length,
    },
    users: usersWithUsage,
  };
}
