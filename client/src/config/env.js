const runtimeEnv = import.meta.env;
const validationErrors = [];
const validationWarnings = [];

function readWithAliases(canonicalName, aliases = []) {
  for (const name of [canonicalName, ...aliases]) {
    const value = runtimeEnv[name]?.trim();

    if (value) {
      if (name !== canonicalName && runtimeEnv.DEV) {
        validationWarnings.push(`${name} is deprecated; use ${canonicalName}`);
      }

      return value;
    }
  }

  return "";
}

function validateUrl(name, value, { allowRelative = false } = {}) {
  if (!value) {
    return value;
  }

  if (allowRelative && value.startsWith("/")) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      validationErrors.push(`${name} must use http: or https:`);
    }
  } catch {
    validationErrors.push(`${name} must be a valid URL`);
  }

  return value;
}

const apiBaseUrl = validateUrl(
  "VITE_API_BASE_URL",
  readWithAliases("VITE_API_BASE_URL", ["VITE_API_URL"]),
  { allowRelative: true },
);
const realtimeUrl = validateUrl("VITE_REALTIME_URL", runtimeEnv.VITE_REALTIME_URL?.trim() ?? "");
const appName = runtimeEnv.VITE_APP_NAME?.trim() || "ScaleOps";
const appEnvironment = runtimeEnv.VITE_APP_ENV?.trim() || runtimeEnv.MODE;
const analyticsKey = runtimeEnv.VITE_ANALYTICS_KEY?.trim() ?? "";

if (!apiBaseUrl) {
  const message = "VITE_API_BASE_URL is not set";

  if (runtimeEnv.PROD) {
    validationErrors.push(`${message} for the production client build`);
  } else {
    validationWarnings.push(`${message}; local API fallback will be used`);
  }
}

if (runtimeEnv.PROD && apiBaseUrl) {
  try {
    const parsedApiBaseUrl = new URL(apiBaseUrl, "https://scaleops.local");
    if (["localhost", "127.0.0.1", "::1"].includes(parsedApiBaseUrl.hostname)) {
      validationErrors.push("VITE_API_BASE_URL cannot point to localhost in production");
    }
  } catch {
    // validateUrl already records malformed URL errors.
  }
}

if (validationErrors.length > 0) {
  throw new Error(`Invalid client environment configuration: ${validationErrors.join("; ")}`);
}

if (validationWarnings.length > 0 && runtimeEnv.DEV) {
  console.warn(
    `Client environment configuration warnings: ${[...new Set(validationWarnings)].join("; ")}`,
  );
}

export const clientEnv = Object.freeze({
  analyticsKey,
  apiBaseUrl,
  appEnvironment,
  appName,
  isDevelopment: runtimeEnv.DEV,
  isProduction: runtimeEnv.PROD,
  mode: runtimeEnv.MODE,
  realtimeUrl,
});
