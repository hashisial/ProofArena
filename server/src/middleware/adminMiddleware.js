import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { accessCookieName, getRequestCookie } from "../utils/cookie.utils.js";
import { getTokenFromHeader, verifyAccessToken } from "../utils/token.utils.js";
export { requireAdminPermission } from "./role.middleware.js";

export async function protectAdmin(request, response, next) {
  const token = getTokenFromHeader(request) ?? getRequestCookie(request, accessCookieName);

  if (!token) {
    next(new AppError("Admin token is required", 401));
    return;
  }

  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    next(new AppError(error.statusCode === 503 ? error.message : "Invalid or expired admin token", error.statusCode === 503 ? 503 : 401));
    return;
  }

  if (decoded.role !== "admin") {
    next(new AppError("Admin access required", 403));
    return;
  }

  if (decoded.id) {
    try {
      const admin = await User.findOne({ _id: decoded.id, role: "admin" })
        .select("_id accountStatus accountType adminPermissions email fullName isSuspended name role username verificationStatus")
        .lean();

      if (!admin) {
        next(new AppError("Admin access revoked or account not found", 403));
        return;
      }

      if (admin.isSuspended || ["banned", "deleted", "suspended"].includes(admin.accountStatus)) {
        next(new AppError("Admin account is not available", 403));
        return;
      }

      request.admin = {
        permissions: admin.adminPermissions ?? [],
        accountStatus: admin.accountStatus ?? "active",
        accountType: admin.accountType ?? "individual",
        email: admin.email,
        fullName: admin.fullName ?? admin.name,
        id: admin._id.toString(),
        name: admin.name ?? admin.fullName,
        role: admin.role,
        username: admin.username ?? "",
        verificationStatus: admin.verificationStatus ?? "verified",
      };
      next();
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  request.admin = {
    ...decoded,
    permissions: decoded.permissions ?? ["all"],
  };
  next();
}
