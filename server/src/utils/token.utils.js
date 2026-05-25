import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { TOKEN_TYPES } from "../constants/index.js";
import { AppError } from "./AppError.js";

function getTokenSecret(type) {
  const secret = type === TOKEN_TYPES.REFRESH ? env.jwtRefreshSecret : env.jwtAccessSecret;

  if (!secret) {
    throw new AppError("JWT authentication is not configured", 503);
  }

  return secret;
}

export function hashToken(token) {
  return createHash("sha256").update(String(token ?? "")).digest("hex");
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
      userId,
      role: user.role,
    },
    getTokenSecret(TOKEN_TYPES.ACCESS),
    {
      expiresIn: env.jwtAccessExpiresIn,
      subject: userId,
    },
  );
}

export function generateRefreshToken(user) {
  const userId = getUserId(user);

  return jwt.sign(
    {
      userId,
      tokenVersion: Number(user.refreshTokenVersion ?? 0),
    },
    getTokenSecret(TOKEN_TYPES.REFRESH),
    {
      expiresIn: env.jwtRefreshExpiresIn,
      subject: userId,
    },
  );
}

export function generateAuthTokens(user) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

export function verifyAccessToken(token) {
  try {
    const decoded = normalizeDecodedToken(jwt.verify(token, getTokenSecret(TOKEN_TYPES.ACCESS)));

    if (decoded.tokenType && decoded.tokenType !== TOKEN_TYPES.ACCESS) {
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
  try {
    const decoded = normalizeDecodedToken(jwt.verify(token, getTokenSecret(TOKEN_TYPES.REFRESH)));

    if ((decoded.tokenType && decoded.tokenType !== TOKEN_TYPES.REFRESH) || !decoded.userId) {
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
