import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { getTokenFromHeader, verifyAccessToken } from "../utils/token.utils.js";
import { roles, workspaceRoles } from "./role.middleware.js";

function normalizeRole(role) {
  return role === "user" ? roles.client : role;
}

function getDecodedUserId(decoded) {
  return decoded?.userId ?? decoded?.id ?? decoded?.sub ?? null;
}

function getAccountStatus(user) {
  return user?.accountStatus ?? (user?.isSuspended ? "suspended" : "active");
}

function assertActiveAccount(user) {
  const accountStatus = getAccountStatus(user);

  if (["banned", "deleted"].includes(accountStatus)) {
    throw new AppError("Account is not available", 403);
  }

  if (accountStatus === "suspended" || user?.isSuspended) {
    throw new AppError("Account is suspended", 403);
  }
}

function hasVerifiedEmailStatus(user = {}) {
  return Boolean(user.isEmailVerified || user.emailVerified || user.isVerified);
}

function toSafeUser(user) {
  const fullName = user.fullName ?? user.name ?? "";
  const role = normalizeRole(user.role);
  const id = user._id?.toString?.() ?? user.id;
  const emailVerified = hasVerifiedEmailStatus(user);

  return {
    _id: user._id,
    id,
    accountStatus: getAccountStatus(user),
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    email: user.email,
    emailVerified,
    fullName,
    isEmailVerified: emailVerified,
    isVerified: emailVerified,
    lastLogin: user.lastLogin ?? null,
    lastLoginAt: user.lastLoginAt ?? user.lastLogin ?? null,
    name: user.name ?? fullName,
    onboardingCompleted: Boolean(user.onboardingCompleted),
    permissions: user.adminPermissions ?? [],
    profileId: user.profileId?.toString?.() ?? user.profileId ?? null,
    role,
    subscriptionId: user.subscriptionId?.toString?.() ?? user.subscriptionId ?? null,
    username: user.username ?? "",
    verificationStatus:
      user.verificationStatus ??
      (emailVerified ? "verified" : "pending"),
  };
}

async function findSafeAuthenticatedUser(userId) {
  const user = await User.findById(userId)
    .select(
      "_id accountStatus accountType adminPermissions avatar email emailVerified fullName isEmailVerified isSuspended isVerified lastLogin lastLoginAt name onboardingCompleted profileId role subscriptionId username verificationStatus",
    )
    .lean();

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  assertActiveAccount(user);
  return toSafeUser(user);
}

function mapTokenError(error) {
  if (error.statusCode === 503) {
    return error;
  }

  return new AppError("Invalid or expired token", 401);
}

export async function authenticate(request, _response, next) {
  const token = getTokenFromHeader(request);

  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    next(mapTokenError(error));
    return;
  }

  const userId = getDecodedUserId(decoded);

  if (!userId) {
    next(new AppError("Invalid or expired token", 401));
    return;
  }

  try {
    request.user = await findSafeAuthenticatedUser(userId);
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuthenticate(request, _response, next) {
  const token = getTokenFromHeader(request);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    const userId = getDecodedUserId(decoded);

    if (userId) {
      request.user = await findSafeAuthenticatedUser(userId);
    }
  } catch {
    // Public routes should still work when a visitor has an expired token.
  }

  next();
}

export function requireActiveAccount(request, _response, next) {
  try {
    assertActiveAccount(request.user);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireVerifiedEmail(request, _response, next) {
  if (!request.user) {
    next(new AppError("Authentication required", 401));
    return;
  }

  if (!request.user.isEmailVerified) {
    next(new AppError("Please verify your email first", 403));
    return;
  }

  next();
}

export function checkOwnership(resourceUserField = "userId") {
  return (request, _response, next) => {
    if (!request.user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    const ownerId =
      request.params?.[resourceUserField] ??
      request.body?.[resourceUserField] ??
      request.resource?.[resourceUserField];

    if (!ownerId || String(ownerId) !== String(request.user.id)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }

    next();
  };
}

export function protectUser(request, response, next) {
  return authenticate(request, response, (error) => {
    if (error) {
      next(error);
      return;
    }

    if (!workspaceRoles.includes(normalizeRole(request.user?.role))) {
      next(new AppError("Client or provider access required", 403));
      return;
    }

    next();
  });
}

export function optionalUser(request, response, next) {
  return optionalAuthenticate(request, response, () => {
    if (request.user && !workspaceRoles.includes(normalizeRole(request.user.role))) {
      delete request.user;
    }

    next();
  });
}
