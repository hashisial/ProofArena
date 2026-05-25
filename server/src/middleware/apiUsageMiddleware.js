import { recordApiUsageForUser } from "../services/subscriptionService.js";

export async function enforceUserApiUsage(request, _response, next) {
  if (!request.user?.id) {
    next();
    return;
  }

  try {
    request.apiUsage = await recordApiUsageForUser(request.user.id, {
      method: request.method,
      path: request.originalUrl,
    });
    next();
  } catch (error) {
    next(error);
  }
}
