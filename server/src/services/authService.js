import { randomBytes, timingSafeEqual } from "crypto";
import { USER_ROLES, USER_ROLE_VALUES } from "../constants/index.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { getRefreshTokenMaxAgeMs } from "../utils/cookie.utils.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateAuthTokens,
  hashToken,
  verifyRefreshToken as verifyJwtRefreshToken,
} from "../utils/token.utils.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import { sendEmailVerificationEmail, sendPasswordResetEmail } from "./emailService.js";
import { ensureUserSubscription } from "./subscriptionService.js";

const validRoles = new Set(USER_ROLE_VALUES);
const validAccountTypes = new Set(["individual", "agency"]);
const validVerificationStatuses = new Set(["pending", "verified", "rejected"]);
const passwordResetTtlMs = 30 * 60 * 1000;
const emailVerificationTtlMs = 24 * 60 * 60 * 1000;

function secureCompare(value, expectedValue) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expectedValue);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function normalizeUsername(username) {
  return String(username ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

function normalizeRole(role) {
  return role === USER_ROLES.USER ? USER_ROLES.CLIENT : role;
}

function hasVerifiedEmailStatus(user = {}) {
  return Boolean(user.isEmailVerified || user.emailVerified || user.isVerified);
}

function createUsernameBase({ email, fullName, name, username }) {
  const requestedUsername = normalizeUsername(username);

  if (requestedUsername) {
    return requestedUsername;
  }

  const emailLocalPart = normalizeEmail(email).split("@")[0];
  const fallback = normalizeUsername(fullName || name || emailLocalPart);

  return fallback.length >= 3 ? fallback : `${fallback || "user"}${Date.now()}`.slice(0, 32);
}

async function createAvailableUsername(baseUsername) {
  const safeBase = baseUsername.length >= 3 ? baseUsername : `user-${Date.now()}`;

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const username =
      suffix === 0
        ? safeBase.slice(0, 32)
        : `${safeBase.slice(0, Math.max(3, 32 - String(suffix).length))}${suffix}`;
    const existingUser = await User.exists({ username });

    if (!existingUser) {
      return username;
    }
  }

  return `${safeBase.slice(0, 22)}-${randomBytes(4).toString("hex")}`;
}

function hashResetToken(token) {
  return hashToken(token);
}

function hashRefreshToken(token) {
  return hashToken(token);
}

function getClientBaseUrl(clientBaseUrl) {
  return clientBaseUrl ?? env.clientUrl;
}

function getResetUrl(token, clientBaseUrl) {
  const baseUrl = getClientBaseUrl(clientBaseUrl).replace(/\/$/, "");
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

function getVerificationUrl(token, clientBaseUrl) {
  const baseUrl = getClientBaseUrl(clientBaseUrl).replace(/\/$/, "");
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
}

export async function ensureEnvironmentAdmin() {
  if (!env.adminEmail || !env.adminPassword) {
    return null;
  }

  ensureDatabaseConnection();

  const normalizedAdminEmail = normalizeEmail(env.adminEmail);
  const existingAdmin = await User.findOne({ email: normalizedAdminEmail }).select(
    "+refreshTokenVersion",
  );

  if (existingAdmin) {
    existingAdmin.adminPermissions = ["all"];
    existingAdmin.emailVerified = true;
    existingAdmin.fullName = existingAdmin.fullName || "ScaleOps Admin";
    existingAdmin.isEmailVerified = true;
    existingAdmin.isVerified = true;
    existingAdmin.name = existingAdmin.name || existingAdmin.fullName;
    existingAdmin.role = "admin";
    existingAdmin.verificationStatus = "verified";
    await existingAdmin.save();
    return existingAdmin;
  }

  const username = await createAvailableUsername("scaleops-admin");

  return User.create({
    adminPermissions: ["all"],
    email: normalizedAdminEmail,
    emailVerified: true,
    fullName: "ScaleOps Admin",
    isEmailVerified: true,
    isVerified: true,
    name: "ScaleOps Admin",
    password: env.adminPassword,
    role: "admin",
    username,
    verificationStatus: "verified",
  });
}

export function sanitizeUser(user) {
  const fullName = user.fullName ?? user.name ?? "";
  const role = normalizeRole(user.role ?? "client");
  const accountStatus = user.accountStatus ?? (user.isSuspended ? "suspended" : "active");
  const verificationStatus =
    user.verificationStatus ??
    (hasVerifiedEmailStatus(user) ? "verified" : "pending");
  const emailVerified = hasVerifiedEmailStatus(user);

  return {
    id: user._id?.toString() ?? user.id,
    accountStatus,
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    email: user.email,
    emailVerified,
    fullName,
    isSuspended: Boolean(user.isSuspended),
    isEmailVerified: emailVerified,
    isVerified: emailVerified,
    lastLogin: user.lastLogin ?? null,
    lastLoginAt: user.lastLoginAt ?? user.lastLogin ?? null,
    name: user.name ?? fullName,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    profileId: user.profileId?.toString?.() ?? user.profileId ?? null,
    permissions: user.adminPermissions ?? [],
    role,
    subscriptionId: user.subscriptionId?.toString?.() ?? user.subscriptionId ?? null,
    verificationStatus,
    username: user.username ?? "",
  };
}

export function sanitizeAuthUser(user) {
  if (!user) {
    return null;
  }

  const source = typeof user.toObject === "function"
    ? user.toObject({ virtuals: false })
    : user;
  const fullName = source.fullName ?? source.name ?? "";
  const id = source._id?.toString?.() ?? source.id;

  return {
    id,
    accountStatus: source.accountStatus ?? (source.isSuspended ? "suspended" : "active"),
    avatar: source.avatar ?? "",
    createdAt: source.createdAt ?? null,
    email: source.email,
    emailVerified: hasVerifiedEmailStatus(source),
    fullName,
    isEmailVerified: hasVerifiedEmailStatus(source),
    lastLoginAt: source.lastLoginAt ?? source.lastLogin ?? null,
    role: normalizeRole(source.role ?? "client"),
    updatedAt: source.updatedAt ?? null,
    username: source.username ?? "",
  };
}

function signAccessToken(user) {
  return generateAccessToken(user);
}

function signRefreshToken(user) {
  return generateRefreshToken(user);
}

async function persistRefreshToken(user, refreshToken) {
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const refreshTokenExpiresAt = new Date(Date.now() + getRefreshTokenMaxAgeMs());

  await User.updateOne(
    { _id: user._id ?? user.id },
    {
      $set: {
        refreshTokenExpiresAt,
        refreshTokenHash,
      },
    },
  );

  user.refreshTokenExpiresAt = refreshTokenExpiresAt;
  user.refreshTokenHash = refreshTokenHash;
}

async function createAuthSession(user) {
  const { accessToken, refreshToken } = generateAuthTokens(user);

  await persistRefreshToken(user, refreshToken);

  return {
    accessToken,
    refreshToken,
    token: accessToken,
    user: sanitizeUser(user),
  };
}

function verifyRefreshToken(refreshToken) {
  try {
    return verifyJwtRefreshToken(refreshToken);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Invalid or expired refresh token", 401);
  }
}

function assertAccountCanAuthenticate(user) {
  const accountStatus = user.accountStatus ?? (user.isSuspended ? "suspended" : "active");

  if (["banned", "deleted"].includes(accountStatus)) {
    throw new AppError("Account is not available", 403);
  }

  if (accountStatus === "suspended" || user.isSuspended) {
    throw new AppError("Account is suspended", 403);
  }
}

function assertPublicRegistrationRole(role) {
  const requestedRole = normalizeRole(role);

  if (requestedRole === "admin") {
    throw new AppError("Admin accounts cannot be created through public registration", 409);
  }

  if (!["client", "provider"].includes(requestedRole)) {
    throw new AppError("Role must be client or provider", 400);
  }

  return requestedRole;
}

async function findRefreshTokenUser(refreshToken) {
  ensureDatabaseConnection();

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.userId ?? decoded.id).select(
    "+refreshTokenExpiresAt +refreshTokenHash +refreshTokenVersion",
  );

  if (!user) {
    throw new AppError("User account not found", 401);
  }

  assertAccountCanAuthenticate(user);

  if (!user.refreshTokenHash || !user.refreshTokenExpiresAt) {
    throw new AppError("Refresh session has expired", 401);
  }

  if (Number(user.refreshTokenVersion ?? 0) !== Number(decoded.tokenVersion ?? 0)) {
    throw new AppError("Refresh session is invalid", 401);
  }

  if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
    user.refreshTokenHash = "";
    user.refreshTokenExpiresAt = null;
    await user.save();
    throw new AppError("Refresh session has expired", 401);
  }

  const incomingHash = hashRefreshToken(refreshToken);

  if (!secureCompare(incomingHash, user.refreshTokenHash)) {
    throw new AppError("Refresh session is invalid", 401);
  }

  return user;
}

export async function refreshAuthSession(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const user = await findRefreshTokenUser(refreshToken);

  return createAuthSession(user);
}

export async function revokeRefreshSession(refreshToken) {
  if (!refreshToken) {
    return;
  }

  try {
    const user = await findRefreshTokenUser(refreshToken);

    user.refreshTokenHash = "";
    user.refreshTokenExpiresAt = null;
    await user.save();
  } catch {
    // Logout should be idempotent even when the refresh token is already invalid.
  }
}

export async function authenticateAdmin({ email, password }) {
  if (!env.adminEmail || !env.adminPassword || !env.jwtAccessSecret || !env.jwtRefreshSecret) {
    throw new AppError("Admin authentication is not configured", 503);
  }

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const normalizedAdminEmail = env.adminEmail.trim().toLowerCase();
  const isValidEmail = secureCompare(
    email.trim().toLowerCase(),
    normalizedAdminEmail,
  );
  const isValidPassword = secureCompare(password, env.adminPassword);

  if (!isValidEmail || !isValidPassword) {
    throw new AppError("Invalid admin credentials", 401);
  }

  const user = await ensureEnvironmentAdmin();
  return createAuthSession(user);
}

export async function registerUser(
  { accountType, email, fullName, name, password, role, username },
  { allowRole = false } = {},
) {
  ensureDatabaseConnection();

  const normalizedEmail = normalizeEmail(email);
  const resolvedFullName = String(fullName || name || "").trim();
  const requestedUsername = normalizeUsername(username);
  const adminEmail = normalizeEmail(env.adminEmail);
  const requestedRole = allowRole ? normalizeRole(role) : assertPublicRegistrationRole(role);
  const normalizedRole =
    requestedRole === "admin"
      ? allowRole
        ? "admin"
        : "client"
      : validRoles.has(requestedRole)
        ? requestedRole
        : "client";
  const normalizedAccountType = validAccountTypes.has(accountType)
    ? accountType
    : "individual";

  if (adminEmail && normalizedEmail === adminEmail) {
    throw new AppError("This email is reserved for administrator access", 409);
  }

  if (!resolvedFullName) {
    throw new AppError("Full name is required", 400);
  }

  if (username && requestedUsername.length < 3) {
    throw new AppError("Username must be at least 3 characters", 400);
  }

  const existingUser = await User.findOne({ email: normalizedEmail }).select("_id");

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  if (requestedUsername && (await User.exists({ username: requestedUsername }))) {
    throw new AppError("Username already exists", 409);
  }

  const generatedUsername = requestedUsername
    || (await createAvailableUsername(createUsernameBase({
      email: normalizedEmail,
      fullName: resolvedFullName,
      name,
      username,
    })));

  const user = await User.create({
    email: normalizedEmail,
    accountType: normalizedAccountType,
    fullName: resolvedFullName,
    name: resolvedFullName,
    password,
    role: normalizedRole,
    username: generatedUsername,
  });
  const subscription = await ensureUserSubscription(user._id);

  if (subscription?._id) {
    user.subscriptionId = subscription._id;
    await user.save();
  }

  return createAuthSession(user);
}

export async function authenticateUser({ email, password }) {
  ensureDatabaseConnection();

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: normalizeEmail(email) }).select(
    "+password +refreshTokenVersion",
  );

  if (!user?.password || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  assertAccountCanAuthenticate(user);

  const lastLogin = new Date();
  await User.updateOne({ _id: user._id }, { $set: { lastLogin, lastLoginAt: lastLogin } });
  user.lastLogin = lastLogin;
  user.lastLoginAt = lastLogin;

  return createAuthSession(user);
}

export async function loginUser(payload) {
  const session = await authenticateUser(payload);

  return {
    ...session,
    user: sanitizeAuthUser(session.user),
  };
}

export async function authenticateLogin(credentials) {
  const email = normalizeEmail(credentials.email);
  const adminEmail = normalizeEmail(env.adminEmail);

  if (adminEmail && email === adminEmail) {
    return authenticateAdmin(credentials);
  }

  return authenticateUser(credentials);
}

export async function requestPasswordReset({ clientBaseUrl, email }) {
  ensureDatabaseConnection();

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new AppError("Email is required", 400);
  }

  const genericResponse = {
    message: "If an account exists, password reset instructions have been sent.",
  };

  if (normalizedEmail === normalizeEmail(env.adminEmail)) {
    return genericResponse;
  }

  const tokenResult = await generatePasswordResetToken(normalizedEmail);

  if (!tokenResult) {
    return genericResponse;
  }

  const resetUrl = getResetUrl(tokenResult.token, clientBaseUrl);

  const emailResult = await sendPasswordResetEmail({
    email: tokenResult.user.email,
    name: tokenResult.user.fullName ?? tokenResult.user.name,
    resetUrl,
  });

  return {
    ...genericResponse,
    resetUrl: emailResult.skipped ? resetUrl : undefined,
  };
}

export async function resetPassword({ password, token }) {
  await resetPasswordWithToken(token, password);

  return {
    message: "Password updated successfully. You can now log in.",
  };
}

export async function generatePasswordResetToken(email) {
  ensureDatabaseConnection();

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordResetExpires +passwordResetToken",
  );

  if (!user) {
    return null;
  }

  const token = randomBytes(32).toString("hex");
  user.passwordResetToken = hashResetToken(token);
  user.passwordResetExpires = new Date(Date.now() + passwordResetTtlMs);
  await user.save();

  return {
    token,
    user: sanitizeAuthUser(user),
  };
}

export async function resetPasswordWithToken(token, newPassword) {
  ensureDatabaseConnection();

  if (!token) {
    throw new AppError("Password reset token is invalid or expired", 400);
  }

  if (!newPassword || newPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const user = await User.findOne({
    passwordResetExpires: { $gt: new Date() },
    passwordResetToken: hashResetToken(token),
  }).select("+password +passwordResetExpires +passwordResetToken +refreshTokenVersion");

  if (!user) {
    throw new AppError("Password reset token is invalid or expired", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = "";
  user.passwordResetExpires = null;
  user.refreshTokenVersion = Number(user.refreshTokenVersion ?? 0) + 1;
  await user.save();

  return sanitizeAuthUser(user);
}

export async function generateEmailVerificationToken(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId).select(
    "+emailVerificationExpires +emailVerificationToken",
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isEmailVerified || user.emailVerified || user.isVerified) {
    return {
      alreadyVerified: true,
      token: null,
      user: sanitizeAuthUser(user),
    };
  }

  const token = randomBytes(32).toString("hex");
  user.emailVerificationToken = hashToken(token);
  user.emailVerificationExpires = new Date(Date.now() + emailVerificationTtlMs);
  await user.save();

  return {
    token,
    user: sanitizeAuthUser(user),
  };
}

export async function verifyEmailWithToken(token) {
  ensureDatabaseConnection();

  if (!token) {
    throw new AppError("Email verification token is invalid or expired", 400);
  }

  const user = await User.findOne({
    emailVerificationExpires: { $gt: new Date() },
    emailVerificationToken: hashToken(token),
  }).select("+emailVerificationExpires +emailVerificationToken");

  if (!user) {
    throw new AppError("Email verification token is invalid or expired", 400);
  }

  user.emailVerified = true;
  user.isEmailVerified = true;
  user.isVerified = true;
  user.verificationStatus = "verified";
  user.emailVerificationToken = "";
  user.emailVerificationExpires = null;
  await user.save();

  return sanitizeAuthUser(user);
}

export async function resendEmailVerificationToken(email) {
  ensureDatabaseConnection();

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationExpires +emailVerificationToken",
  );

  if (!user) {
    return null;
  }

  if (user.isEmailVerified || user.emailVerified || user.isVerified) {
    return {
      alreadyVerified: true,
      token: null,
      user: sanitizeAuthUser(user),
    };
  }

  return generateEmailVerificationToken(user._id);
}

export async function requestEmailVerification({ clientBaseUrl, email }) {
  const genericResponse = {
    message: "If an unverified account exists, verification instructions have been sent.",
  };
  const tokenResult = await resendEmailVerificationToken(email);

  if (!tokenResult?.token) {
    return genericResponse;
  }

  const verificationUrl = getVerificationUrl(tokenResult.token, clientBaseUrl);
  const emailResult = await sendEmailVerificationEmail({
    email: tokenResult.user.email,
    name: tokenResult.user.fullName,
    verificationUrl,
  });

  return {
    ...genericResponse,
    verificationToken: tokenResult.token,
    verificationUrl: emailResult.skipped ? verificationUrl : undefined,
  };
}

export async function verifyEmailToken({ token } = {}) {
  const user = await verifyEmailWithToken(token);

  return {
    message: "Email verified successfully.",
    user,
  };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  ensureDatabaseConnection();

  const user = await User.findById(userId).select("+password +refreshTokenVersion");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  assertAccountCanAuthenticate(user);

  if (!user.password || !(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  user.refreshTokenVersion = Number(user.refreshTokenVersion ?? 0) + 1;
  await user.save();

  return sanitizeAuthUser(user);
}

export async function findAuthenticatedUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId).lean();

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  assertAccountCanAuthenticate(user);

  return sanitizeUser(user);
}

export async function getCurrentUser(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId)
    .select(
      "_id accountStatus avatar createdAt email emailVerified fullName isEmailVerified isSuspended isVerified lastLogin lastLoginAt role updatedAt username",
    )
    .lean();

  if (!user) {
    throw new AppError("User not found", 404);
  }

  assertAccountCanAuthenticate(user);

  return sanitizeAuthUser(user);
}

export async function refreshUserToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const session = await refreshAuthSession(refreshToken);

  return {
    ...session,
    user: sanitizeAuthUser(session.user),
  };
}

export async function incrementRefreshTokenVersion(userId) {
  ensureDatabaseConnection();

  const user = await User.findById(userId).select("+refreshTokenVersion");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.refreshTokenVersion = Number(user.refreshTokenVersion ?? 0) + 1;
  await user.save();

  return true;
}

export {
  normalizeRole,
  validAccountTypes,
  validRoles,
  validVerificationStatuses,
};
