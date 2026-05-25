import {
  createCheckoutSession,
  createCustomerPortalSession,
  findSubscriptionPlans,
  getUserSubscriptionDetails,
  handleStripeWebhookEvent,
  selectFreeSubscription,
} from "../services/subscriptionService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPlans = asyncHandler(async (_request, response) => {
  const plans = await findSubscriptionPlans();
  sendSuccess(response, { items: plans });
});

export const getMySubscription = asyncHandler(async (request, response) => {
  const subscription = await getUserSubscriptionDetails(request.user.id);
  sendSuccess(response, subscription);
});

export const startCheckout = asyncHandler(async (request, response) => {
  const requestedPlan = request.body?.plan ?? request.body?.planKey;
  const session = await createCheckoutSession(request.user.id, requestedPlan);
  sendSuccess(response, session, session.localPlanSelected ? 200 : 201);
});

export const openCustomerPortal = asyncHandler(async (request, response) => {
  const session = await createCustomerPortalSession(request.user.id);
  sendSuccess(response, session);
});

export const selectFreePlan = asyncHandler(async (request, response) => {
  const subscription = await selectFreeSubscription(request.user.id);
  sendSuccess(response, { subscription });
});

export const stripeWebhook = asyncHandler(async (request, response) => {
  const result = await handleStripeWebhookEvent(request);
  sendSuccess(response, result);
});
