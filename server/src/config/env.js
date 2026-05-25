import "./loadEnv.js";

const isProduction = process.env.NODE_ENV === "production";
const defaultClientUrls = isProduction
  ? []
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ];
const validNodeEnvs = new Set(["development", "production", "test"]);
const validationErrors = [];

function splitCsv(value) {
  return value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function requiredInProduction(name, value) {
  if (isProduction && !value) {
    validationErrors.push(`${name} is required in production`);
  }

  return value;
}

function parsePositiveInteger(name, value, fallback) {
  const parsedValue = Number.parseInt(value ?? fallback, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    validationErrors.push(`${name} must be a positive integer`);
    return Number.parseInt(fallback, 10);
  }

  return parsedValue;
}

function parseOptionalPositiveInteger(name, value, fallback) {
  if (!value && !fallback) {
    return undefined;
  }

  return parsePositiveInteger(name, value, fallback);
}

if (!validNodeEnvs.has(process.env.NODE_ENV ?? "development")) {
  validationErrors.push("NODE_ENV must be development, production, or test");
}

const clientUrls = [
  ...new Set([
    process.env.CLIENT_URL,
    ...splitCsv(process.env.CLIENT_URLS),
    ...defaultClientUrls,
  ].filter(Boolean)),
];

if (isProduction && clientUrls.length === 0) {
  validationErrors.push("CLIENT_URL or CLIENT_URLS is required in production");
}

const adminEmail = requiredInProduction("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
const adminPassword = requiredInProduction(
  "ADMIN_PASSWORD",
  process.env.ADMIN_PASSWORD,
);
const contactRateLimitMax = parsePositiveInteger(
  "CONTACT_RATE_LIMIT_MAX",
  process.env.CONTACT_RATE_LIMIT_MAX,
  "5",
);
const jwtSecret = process.env.JWT_SECRET;
const jwtAccessSecret = requiredInProduction(
  "JWT_ACCESS_SECRET",
  process.env.JWT_ACCESS_SECRET ?? jwtSecret,
);
const jwtRefreshSecret = requiredInProduction(
  "JWT_REFRESH_SECRET",
  process.env.JWT_REFRESH_SECRET ?? jwtSecret,
);
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";
const mongoUri = requiredInProduction("MONGO_URI", process.env.MONGO_URI);
const rateLimitWindowMs = parsePositiveInteger(
  "RATE_LIMIT_WINDOW_MS",
  process.env.RATE_LIMIT_WINDOW_MS,
  "900000",
);
const emailFrom = process.env.EMAIL_FROM ?? process.env.SMTP_FROM;
const emailEnabled =
  process.env.EMAIL_ENABLED !== undefined
    ? process.env.EMAIL_ENABLED === "true"
    : Boolean(process.env.SMTP_HOST && (process.env.LEAD_NOTIFICATION_EMAIL ?? adminEmail));
const leadNotificationEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? adminEmail;
const smtpHost = process.env.SMTP_HOST;
const smtpPass = process.env.SMTP_PASS;
const smtpPort = parseOptionalPositiveInteger("SMTP_PORT", process.env.SMTP_PORT, "587");
const smtpSecure =
  process.env.SMTP_SECURE === "true" || (!process.env.SMTP_SECURE && smtpPort === 465);
const smtpUser = process.env.SMTP_USER;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID;
const stripeAgencyPriceId = process.env.STRIPE_AGENCY_PRICE_ID;
const stripeConnectCountry = process.env.STRIPE_CONNECT_COUNTRY ?? "US";
const stripeMarketplaceCommissionBps = parsePositiveInteger(
  "STRIPE_MARKETPLACE_COMMISSION_BPS",
  process.env.STRIPE_MARKETPLACE_COMMISSION_BPS,
  "1000",
);
const stripeBillingEnabled =
  process.env.STRIPE_BILLING_ENABLED !== undefined
    ? process.env.STRIPE_BILLING_ENABLED === "true"
    : Boolean(stripeSecretKey);
const stripeMarketplaceEnabled =
  process.env.STRIPE_MARKETPLACE_ENABLED !== undefined
    ? process.env.STRIPE_MARKETPLACE_ENABLED === "true"
    : Boolean(stripeSecretKey);
const redisUrl = process.env.REDIS_URL;
const refreshCookieName = process.env.REFRESH_COOKIE_NAME ?? "proofarena_refresh";
const refreshCookieSameSite = process.env.REFRESH_COOKIE_SAME_SITE;
const queueDriver = process.env.QUEUE_DRIVER ?? (redisUrl ? "bullmq" : "memory");
const queueConcurrency = parsePositiveInteger(
  "QUEUE_CONCURRENCY",
  process.env.QUEUE_CONCURRENCY,
  "2",
);
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryFolder = process.env.CLOUDINARY_FOLDER ?? "scaleops";
const cloudinaryEnabled =
  Boolean(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret);
const allowVercelPreviewOrigins = process.env.VERCEL_PREVIEW_ORIGINS_ENABLED === "true";

if (emailEnabled) {
  if (!smtpHost) {
    validationErrors.push("SMTP_HOST is required when email notifications are enabled");
  }

  if (!emailFrom) {
    validationErrors.push("EMAIL_FROM or SMTP_FROM is required when email notifications are enabled");
  }

  if (!leadNotificationEmail) {
    validationErrors.push(
      "LEAD_NOTIFICATION_EMAIL or ADMIN_EMAIL is required when email notifications are enabled",
    );
  }

  if ((smtpUser && !smtpPass) || (!smtpUser && smtpPass)) {
    validationErrors.push("SMTP_USER and SMTP_PASS must be provided together");
  }
}

if (stripeBillingEnabled) {
  if (!stripeSecretKey) {
    validationErrors.push("STRIPE_SECRET_KEY is required when Stripe billing is enabled");
  }

  if (!stripeProPriceId) {
    validationErrors.push("STRIPE_PRO_PRICE_ID is required when Stripe billing is enabled");
  }

  if (!stripeAgencyPriceId) {
    validationErrors.push("STRIPE_AGENCY_PRICE_ID is required when Stripe billing is enabled");
  }

  if (isProduction && !stripeWebhookSecret) {
    validationErrors.push("STRIPE_WEBHOOK_SECRET is required in production when Stripe billing is enabled");
  }
}

if (stripeMarketplaceEnabled && !stripeSecretKey) {
  validationErrors.push("STRIPE_SECRET_KEY is required when Stripe marketplace payments are enabled");
}

if (!["bullmq", "memory"].includes(queueDriver)) {
  validationErrors.push("QUEUE_DRIVER must be bullmq or memory");
}

if (queueDriver === "bullmq" && !redisUrl) {
  validationErrors.push("REDIS_URL is required when QUEUE_DRIVER is bullmq");
}

if (validationErrors.length > 0) {
  throw new Error(`Invalid environment configuration: ${validationErrors.join("; ")}`);
}

export const env = {
  adminEmail,
  adminPassword,
  allowVercelPreviewOrigins,
  clientUrls,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
  cloudinaryEnabled,
  cloudinaryFolder,
  contactRateLimitMax,
  emailEnabled,
  emailFrom,
  isProduction,
  jsonLimit: process.env.JSON_LIMIT ?? "1mb",
  jwtAccessExpiresIn,
  jwtAccessSecret,
  jwtExpiresIn: jwtAccessExpiresIn,
  jwtRefreshExpiresIn,
  jwtRefreshSecret,
  jwtSecret,
  leadNotificationEmail,
  mongoUri,
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ?? 5000,
  rateLimitWindowMs,
  refreshCookieName,
  refreshCookieSameSite,
  queueConcurrency,
  queueDriver,
  redisUrl,
  smtpHost,
  smtpPass,
  smtpPort,
  smtpSecure,
  smtpUser,
  stripeAgencyPriceId,
  stripeBillingEnabled,
  stripeConnectCountry,
  stripeMarketplaceCommissionBps,
  stripeMarketplaceEnabled,
  stripeProPriceId,
  stripeSecretKey,
  stripeWebhookSecret,
};
