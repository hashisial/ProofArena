import { env } from "../config/env.js";
import { AUTH_COOKIE_NAMES } from "../constants/index.js";

export const accessCookieName = AUTH_COOKIE_NAMES.ACCESS_TOKEN;
export const refreshCookieName = env.refreshCookieName || AUTH_COOKIE_NAMES.REFRESH_TOKEN;

const durationPattern = /^(\d+)(ms|s|m|h|d)$/i;
const durationMultipliers = Object.freeze({
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  ms: 1,
  s: 1000,
});

function parseDurationMs(value, fallbackMs) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  const normalizedValue = String(value ?? "").trim();
  const match = durationPattern.exec(normalizedValue);

  if (!match) {
    return fallbackMs;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  return amount * durationMultipliers[unit];
}

function getSameSite() {
  const configuredSameSite = env.refreshCookieSameSite?.toLowerCase();

  if (["lax", "strict", "none"].includes(configuredSameSite)) {
    return configuredSameSite;
  }

  return env.isProduction ? "none" : "lax";
}

export function getAccessTokenMaxAgeMs() {
  return parseDurationMs(env.jwtAccessExpiresIn, 15 * 60 * 1000);
}

export function getRefreshTokenMaxAgeMs() {
  return parseDurationMs(env.jwtRefreshExpiresIn, 7 * 24 * 60 * 60 * 1000);
}

function getBaseCookieOptions() {
  const sameSite = getSameSite();

  return {
    httpOnly: true,
    path: "/",
    sameSite,
    secure: env.isProduction || sameSite === "none",
  };
}

export function getAccessCookieOptions() {
  return {
    ...getBaseCookieOptions(),
    maxAge: getAccessTokenMaxAgeMs(),
  };
}

export function getRefreshCookieOptions() {
  return {
    ...getBaseCookieOptions(),
    maxAge: getRefreshTokenMaxAgeMs(),
  };
}

function getClearCookieOptions(getOptions) {
  const { maxAge: _maxAge, ...options } = getOptions();
  return options;
}

function parseCookieHeader(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .map((cookie) => {
      const separatorIndex = cookie.indexOf("=");
      const key = separatorIndex >= 0 ? cookie.slice(0, separatorIndex) : cookie;
      const value = separatorIndex >= 0 ? cookie.slice(separatorIndex + 1) : "";

      try {
        return [key, decodeURIComponent(value)];
      } catch {
        return [key, value];
      }
    });
}

export function getRequestCookie(request, name) {
  if (request?.cookies?.[name]) {
    return request.cookies[name];
  }

  const cookieHeader = request?.headers?.cookie;

  if (!cookieHeader) {
    return "";
  }

  return parseCookieHeader(cookieHeader).find(([key]) => key === name)?.[1] ?? "";
}

export function setRefreshTokenCookie(response, refreshToken) {
  response.cookie(refreshCookieName, refreshToken, getRefreshCookieOptions());
}

export function clearRefreshTokenCookie(response) {
  response.clearCookie(refreshCookieName, getClearCookieOptions(getRefreshCookieOptions));
}

export function getRefreshTokenFromCookie(request) {
  return getRequestCookie(request, refreshCookieName);
}

export function setAuthCookies(response, { accessToken, refreshToken }) {
  if (accessToken) {
    response.cookie(accessCookieName, accessToken, getAccessCookieOptions());
  }

  if (refreshToken) {
    setRefreshTokenCookie(response, refreshToken);
  }
}

export function clearAuthCookies(response) {
  response.clearCookie(accessCookieName, getClearCookieOptions(getAccessCookieOptions));
  clearRefreshTokenCookie(response);
}
