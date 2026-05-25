import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/token.utils.js";

function getBearerToken(value = "") {
  if (!value.startsWith("Bearer ")) {
    return value;
  }

  return value.split(" ")[1] ?? "";
}

function normalizeRole(role) {
  return role === "user" ? "client" : role;
}

function serializePrincipal(user) {
  const fullName = user.fullName ?? user.name ?? "";

  return {
    accountType: user.accountType ?? "individual",
    avatar: user.avatar ?? "",
    email: user.email,
    fullName,
    id: user._id?.toString?.() ?? user.id,
    name: user.name ?? fullName,
    role: normalizeRole(user.role),
    username: user.username ?? "",
  };
}

export async function getMessagingPrincipalFromToken(token, { allowVirtualAdmin = false } = {}) {
  const rawToken = getBearerToken(token);

  if (!rawToken) {
    throw new AppError("Authentication token is required", 401);
  }

  let decoded;

  try {
    decoded = verifyAccessToken(rawToken);
  } catch (error) {
    throw new AppError(error.statusCode === 503 ? error.message : "Invalid or expired token", error.statusCode === 503 ? 503 : 401);
  }

  const role = normalizeRole(decoded.role);

  if (role === "admin") {
    if (!decoded.id) {
      if (allowVirtualAdmin) {
        return {
          email: decoded.email,
          id: null,
          isVirtualAdmin: true,
          name: "Admin",
          role: "admin",
        };
      }

      throw new AppError("Database-backed admin account required for messaging", 403);
    }

    const admin = await User.findOne({ _id: decoded.id, role: "admin" })
      .select("_id accountStatus accountType avatar email fullName isSuspended name role username")
      .lean();

    if (!admin || admin.isSuspended || ["deleted", "suspended"].includes(admin.accountStatus)) {
      throw new AppError("Admin access revoked or account suspended", 403);
    }

    return serializePrincipal(admin);
  }

  if (!["client", "provider"].includes(role) || !decoded.id) {
    throw new AppError("Client or provider access required", 403);
  }

  const user = await User.findOne({
    _id: decoded.id,
    role: { $in: ["client", "provider", "user"] },
  })
    .select("_id accountStatus accountType avatar email fullName isSuspended name role username")
    .lean();

  if (!user || user.isSuspended || ["deleted", "suspended"].includes(user.accountStatus)) {
    throw new AppError("User access revoked or account suspended", 403);
  }

  return serializePrincipal(user);
}
