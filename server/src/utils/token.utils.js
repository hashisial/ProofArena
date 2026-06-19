import { createHash, randomBytes, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { TOKEN_TYPES } from "../constants/index.js";
import { AppError } from "./AppError.js";

const refreshTokenBytes = 48;
const refreshTokenPattern = /^[A-Za-z0-9_-]{64}$/;

function getAccessTokenSecret() {
  const secret = env.jwtAccessSecret;

  if (!secret) {
    throw new AppError("JWT authentication is not configured", 503);
  }

  return secret;
}

function getRefreshTokenSecret() {
  const secret = env.jwtRefreshSecret;

  if (!secret) {
    throw new AppError("Refresh-token migration is not configured", 503);
  }

  return secret;
}

export function hashToken(token) {
  return createHash("sha256").update(String(token ?? "")).digest("hex");
}

export function hashRefreshToken(token) {
  return hashToken(verifyRefreshToken(token));
}

export function compareRefreshToken(token, storedHash) {
  if (!storedHash) {
    return false;
  }

  let incomingHash;

  try {
    incomingHash = hashRefreshToken(token);
  } catch {
    return false;
  }

  const incomingBuffer = Buffer.from(incomingHash);
  const storedBuffer = Buffer.from(String(storedHash));

  if (incomingBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(incomingBuffer, storedBuffer);
}

function getUserId(user) {
  const userId = user?._id?.toString?.() ?? user?.id ?? user?.userId ?? user?.sub;

  if (!userId) {
    throw new AppError("User id is required to generate a token", 500);
  }

  return String(userId);
}

function normalizeDecodedToken(decoded) {
  if (decoded?.userId && !decoded.id) {
    decoded.id = decoded.userId;
  }

  return decoded;
}

function normalizeJwtError(error) {
  if (error?.name === "TokenExpiredError") {
    return new AppError("Token expired", 401);
  }

  return new AppError("Invalid token", 401);
}

export function generateAccessToken(user) {
  const userId = getUserId(user);

  return jwt.sign(
    {
      accountStatus: user.accountStatus ?? (user.isSuspended ? "suspended" : "active"),
      role: user.role ?? "client",
      tokenType: TOKEN_TYPES.ACCESS,
      userId,
    },
    getAccessTokenSecret(),
    {
      algorithm: "HS256",
      expiresIn: env.jwtAccessExpiresIn,
      subject: userId,
    },
  );
}

export function generateRefreshToken() {
  return randomBytes(refreshTokenBytes).toString("base64url");
}

export function generateAuthTokens(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

export function verifyAccessToken(token) {
  try {
    const decoded = normalizeDecodedToken(
      jwt.verify(token, getAccessTokenSecret(), { algorithms: ["HS256"] }),
    );

    if (
      decoded.tokenType !== TOKEN_TYPES.ACCESS
      || !decoded.userId
      || !decoded.role
      || !decoded.accountStatus
    ) {
      throw new AppError("Invalid token", 401);
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw normalizeJwtError(error);
  }
}

export function verifyRefreshToken(token) {
  const normalizedToken = String(token ?? "").trim();

  if (refreshTokenPattern.test(normalizedToken)) {
    return normalizedToken;
  }

  // Existing signed refresh tokens are accepted only for migration. Successful
  // refresh rotates them into the opaque random-token format.
  if (normalizedToken.split(".").length === 3) {
    try {
      const decoded = normalizeDecodedToken(
        jwt.verify(normalizedToken, getRefreshTokenSecret(), { algorithms: ["HS256"] }),
      );

      if (!decoded.userId) {
        throw new AppError("Invalid or expired refresh token", 401);
      }

      return normalizedToken;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
    }
  }

  throw new AppError("Invalid or expired refresh token", 401);
}

export function getTokenFromHeader(request) {
  const authorizationHeader = request?.header?.("Authorization") ?? request?.headers?.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();
  return token || null;
}

export const signAccessToken = generateAccessToken;
export const signRefreshToken = generateRefreshToken;
