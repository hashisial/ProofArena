import { getMessagingPrincipalFromToken } from "../services/messagingAuthService.js";

export async function protectMessaging(request, _response, next) {
  try {
    const token = request.header("Authorization") ?? "";
    request.user = await getMessagingPrincipalFromToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
