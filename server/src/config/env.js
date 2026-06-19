import "./loadEnv.js";

const validNodeEnvs = new Set(["development", "production", "test"]);
const validationErrors = [];
const validationWarnings = [];
const nodeEnv = String(process.env.NODE_ENV ?? "development").trim();
const isProduction = nodeEnv === "production";

function splitCsv(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readWithAliases(canonicalName, aliases = []) {
  for (const name of [canonicalName, ...aliases]) {
    const value = process.env[name]?.trim();

    if (value) {
      if (name !== canonicalName) {
        validationWarnings.push(`${name} is deprecated; use ${canonicalName}`);
      }

      return value;
    }
  }

  return undefined;
}

function requireInProduction(name, value) {
  if (isProduction && !value) {
    validationErrors.push(`${name} is required in production`);
  }

  return value;
}

function recommendInDevelopment(name, value) {
  if (nodeEnv === "development" && !value) {
    validationWarnings.push(`${name} is not set`);
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

function parseBoolean(name, value, fallback = false) {
  if (value === undefined || value === "") {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  validationErrors.push(`${name} must be true or false`);
  return fallback;
}

function validateUrl(name, value, { protocols = ["http:", "https:"] } = {}) {
  if (!value) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);

    if (!protocols.includes(parsedUrl.protocol)) {
      validationErrors.push(`${name} must use ${protocols.join(" or ")}`);
    }
  } catch {
    validationErrors.push(`${name} must be a valid URL`);
  }

  return value;
}

function validateMongoUri(name, value) {
  if (value && !/^mongodb(?:\+srv)?:\/\//i.test(value)) {
    validationErrors.push(`${name} must be a valid MongoDB connection URI`);
  }

  return value;
}

function validateDuration(name, value) {
  if (value && !/^\d+(?:ms|s|m|h|d|w|y)$/i.test(value)) {
    validationErrors.push(`${name} must be a duration such as 15m or 7d`);
  }

  return value;
}

function validateDurationRange(name, value, { maxMs, minMs }) {
  const match = /^(\d+)(ms|s|m|h|d|w|y)$/i.exec(String(value ?? ""));

  if (!match) {
    return value;
  }

  const multipliers = {
    d: 24 * 60 * 60 * 1000,
    h: 60 * 60 * 1000,
    m: 60 * 1000,
    ms: 1,
    s: 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  };
  const durationMs = Number.parseInt(match[1], 10) * multipliers[match[2].toLowerCase()];

  if (durationMs < minMs || durationMs > maxMs) {
    validationErrors.push(`${name} must be between 7d and 30d`);
  }

  return value;
}

function validateProductionSecret(name, value) {
  if (isProduction && value && value.length < 32) {
    validationErrors.push(`${name} must be at least 32 characters in production`);
  }

  return value;
}

if (!validNodeEnvs.has(nodeEnv)) {
  validationErrors.push("NODE_ENV must be development, production, or test");
}

if (!process.env.NODE_ENV) {
  recommendInDevelopment("NODE_ENV", process.env.NODE_ENV);
}

if (isProduction && !process.env.PORT) {
  validationErrors.push("PORT is required in production");
}

const port = parsePositiveInteger("PORT", process.env.PORT, "5000");
recommendInDevelopment("PORT", process.env.PORT);
const defaultClientUrls = isProduction
  ? []
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ];
const configuredClientUrls = [
  process.env.CLIENT_URL,
  ...splitCsv(process.env.CLIENT_URLS),
].filter(Boolean);
const clientUrls = [...new Set([...configuredClientUrls, ...defaultClientUrls])];

if (isProduction && configuredClientUrls.length === 0) {
  validationErrors.push("CLIENT_URL or CLIENT_URLS is required in production");
}

configuredClientUrls.forEach((url, index) => {
  validateUrl(index === 0 ? "CLIENT_URL" : "CLIENT_URLS", url);
});

const clientUrl = clientUrls[0];
recommendInDevelopment("CLIENT_URL", configuredClientUrls[0]);
const serverUrl = validateUrl(
  "SERVER_URL",
  requireInProduction(
    "SERVER_URL",
    process.env.SERVER_URL?.trim() || (isProduction ? undefined : `http://localhost:${port}`),
  ),
);
const mongoUri = validateMongoUri(
  "MONGODB_URI",
  requireInProduction(
    "MONGODB_URI",
    readWithAliases("MONGODB_URI", ["MONGO_URI"]),
  ),
);
const jwtLegacySecret = process.env.JWT_SECRET?.trim();
const jwtAccessSecret = validateProductionSecret(
  "JWT_ACCESS_SECRET",
  requireInProduction(
    "JWT_ACCESS_SECRET",
    readWithAliases("JWT_ACCESS_SECRET") ?? jwtLegacySecret,
  ),
);
const jwtRefreshSecret = validateProductionSecret(
  "JWT_REFRESH_SECRET",
  requireInProduction(
    "JWT_REFRESH_SECRET",
    readWithAliases("JWT_REFRESH_SECRET") ?? jwtLegacySecret,
  ),
);
const jwtAccessExpiresIn = validateDuration(
  "JWT_ACCESS_EXPIRES_IN",
  requireInProduction(
    "JWT_ACCESS_EXPIRES_IN",
    process.env.JWT_ACCESS_EXPIRES_IN?.trim() || (isProduction ? undefined : "15m"),
  ),
);
const jwtRefreshExpiresIn = validateDurationRange(
  "JWT_REFRESH_EXPIRES_IN",
  validateDuration(
    "JWT_REFRESH_EXPIRES_IN",
    requireInProduction(
      "JWT_REFRESH_EXPIRES_IN",
      process.env.JWT_REFRESH_EXPIRES_IN?.trim() || (isProduction ? undefined : "7d"),
    ),
  ),
  {
    maxMs: 30 * 24 * 60 * 60 * 1000,
    minMs: 7 * 24 * 60 * 60 * 1000,
  },
);

if (jwtLegacySecret && (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET)) {
  validationWarnings.push(
    "JWT_SECRET is deprecated; use independent JWT_ACCESS_SECRET and JWT_REFRESH_SECRET",
  );
}

recommendInDevelopment("SERVER_URL", process.env.SERVER_URL);
recommendInDevelopment("MONGODB_URI", mongoUri);
recommendInDevelopment("JWT_ACCESS_SECRET", jwtAccessSecret);
recommendInDevelopment("JWT_REFRESH_SECRET", jwtRefreshSecret);
recommendInDevelopment("JWT_ACCESS_EXPIRES_IN", process.env.JWT_ACCESS_EXPIRES_IN);
recommendInDevelopment("JWT_REFRESH_EXPIRES_IN", process.env.JWT_REFRESH_EXPIRES_IN);

const adminEmail = requireInProduction("ADMIN_EMAIL", process.env.ADMIN_EMAIL?.trim());
const adminPassword = validateProductionSecret(
  "ADMIN_PASSWORD",
  requireInProduction("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD),
);
const contactRateLimitMax = parsePositiveInteger(
  "CONTACT_RATE_LIMIT_MAX",
  process.env.CONTACT_RATE_LIMIT_MAX,
  "5",
);
const rateLimitWindowMs = parsePositiveInteger(
  "RATE_LIMIT_WINDOW_MS",
  process.env.RATE_LIMIT_WINDOW_MS,
  "900000",
);
const emailFrom = readWithAliases("EMAIL_FROM", ["SMTP_FROM"]);
const emailHost = readWithAliases("EMAIL_HOST", ["SMTP_HOST"]);
const emailPass = readWithAliases("EMAIL_PASS", ["SMTP_PASS"]);
const emailPort = parseOptionalPositiveInteger(
  "EMAIL_PORT",
  readWithAliases("EMAIL_PORT", ["SMTP_PORT"]),
  "587",
);
const emailUser = readWithAliases("EMAIL_USER", ["SMTP_USER"]);
const emailEnabled = parseBoolean(
  "EMAIL_ENABLED",
  process.env.EMAIL_ENABLED,
  Boolean(emailHost && emailFrom),
);
const emailSecure = parseBoolean(
  "EMAIL_SECURE",
  readWithAliases("EMAIL_SECURE", ["SMTP_SECURE"]),
  emailPort === 465,
);
const leadNotificationEmail = process.env.LEAD_NOTIFICATION_EMAIL?.trim() || adminEmail;
const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
const openAiModel = process.env.OPENAI_MODEL?.trim();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
const stripeProPriceId = process.env.STRIPE_PRO_PRICE_ID?.trim();
const stripeAgencyPriceId = process.env.STRIPE_AGENCY_PRICE_ID?.trim();
const stripeConnectCountry = process.env.STRIPE_CONNECT_COUNTRY?.trim() ?? "US";
const stripeMarketplaceCommissionBps = parsePositiveInteger(
  "STRIPE_MARKETPLACE_COMMISSION_BPS",
  process.env.STRIPE_MARKETPLACE_COMMISSION_BPS,
  "1000",
);
const stripeBillingEnabled = parseBoolean(
  "STRIPE_BILLING_ENABLED",
  process.env.STRIPE_BILLING_ENABLED,
  Boolean(stripeSecretKey),
);
const stripeMarketplaceEnabled = parseBoolean(
  "STRIPE_MARKETPLACE_ENABLED",
  process.env.STRIPE_MARKETPLACE_ENABLED,
  Boolean(stripeSecretKey),
);
const redisUrl = process.env.REDIS_URL?.trim();
const refreshCookieName = process.env.REFRESH_COOKIE_NAME?.trim() ?? "proofarena_refresh";
const refreshCookieSameSite = process.env.REFRESH_COOKIE_SAME_SITE?.trim();
const queueDriver = process.env.QUEUE_DRIVER?.trim() ?? (redisUrl ? "bullmq" : "memory");
const queueConcurrency = parsePositiveInteger(
  "QUEUE_CONCURRENCY",
  process.env.QUEUE_CONCURRENCY,
  "2",
);
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY?.trim();
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
const cloudinaryFolder = process.env.CLOUDINARY_FOLDER?.trim() ?? "scaleops";
const cloudinaryValues = [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret];
const cloudinaryEnabled = cloudinaryValues.every(Boolean);
const uploadDir = process.env.UPLOAD_DIR?.trim();
const isVercel = Boolean(process.env.VERCEL);
const allowVercelPreviewOrigins = parseBoolean(
  "VERCEL_PREVIEW_ORIGINS_ENABLED",
  process.env.VERCEL_PREVIEW_ORIGINS_ENABLED,
);

if (cloudinaryValues.some(Boolean) && !cloudinaryEnabled) {
  validationErrors.push(
    "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be provided together",
  );
}

if (emailEnabled) {
  if (!emailHost) {
    validationErrors.push("EMAIL_HOST is required when EMAIL_ENABLED is true");
  }

  if (!emailFrom) {
    validationErrors.push("EMAIL_FROM is required when EMAIL_ENABLED is true");
  }

  if ((emailUser && !emailPass) || (!emailUser && emailPass)) {
    validationErrors.push("EMAIL_USER and EMAIL_PASS must be provided together");
  }
}

if (openAiApiKey && !openAiModel) {
  validationWarnings.push("OPENAI_MODEL is not set while OPENAI_API_KEY is configured");
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
    validationErrors.push(
      "STRIPE_WEBHOOK_SECRET is required in production when Stripe billing is enabled",
    );
  }
}

if (stripeMarketplaceEnabled && !stripeSecretKey) {
  validationErrors.push(
    "STRIPE_SECRET_KEY is required when Stripe marketplace payments are enabled",
  );
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

if (validationWarnings.length > 0 && nodeEnv !== "test") {
  console.warn(
    `Environment configuration warnings: ${[...new Set(validationWarnings)].join("; ")}`,
  );
}

export const env = Object.freeze({
  adminEmail,
  adminPassword,
  allowVercelPreviewOrigins,
  clientUrl,
  clientUrls,
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryCloudName,
  cloudinaryEnabled,
  cloudinaryFolder,
  contactRateLimitMax,
  emailEnabled,
  emailFrom,
  emailHost,
  emailPass,
  emailPort,
  emailSecure,
  emailUser,
  isProduction,
  isVercel,
  jsonLimit: process.env.JSON_LIMIT?.trim() ?? "1mb",
  jwtAccessExpiresIn,
  jwtAccessSecret,
  jwtExpiresIn: jwtAccessExpiresIn,
  jwtRefreshExpiresIn,
  jwtRefreshSecret,
  jwtSecret: jwtLegacySecret,
  leadNotificationEmail,
  mongoUri,
  mongodbUri: mongoUri,
  nodeEnv,
  openAiApiKey,
  openAiModel,
  port,
  queueConcurrency,
  queueDriver,
  rateLimitWindowMs,
  redisUrl,
  refreshCookieName,
  refreshCookieSameSite,
  serverUrl,
  smtpHost: emailHost,
  smtpPass: emailPass,
  smtpPort: emailPort,
  smtpSecure: emailSecure,
  smtpUser: emailUser,
  stripeAgencyPriceId,
  stripeBillingEnabled,
  stripeConnectCountry,
  stripeMarketplaceCommissionBps,
  stripeMarketplaceEnabled,
  stripeProPriceId,
  stripeSecretKey,
  stripeWebhookSecret,
  uploadDir,
});
