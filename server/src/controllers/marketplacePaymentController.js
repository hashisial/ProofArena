import {
  createConnectedAccountForProvider,
  createConnectedAccountOnboardingLink,
  createMarketplaceCheckoutSession,
  getConnectedAccountForProvider,
  listMarketplaceTransactionsForUser,
  markMarketplaceWorkComplete,
} from "../services/marketplacePaymentService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyConnectedAccount = asyncHandler(async (request, response) => {
  const account = await getConnectedAccountForProvider(request.user.id);
  sendSuccess(response, account);
});

export const postMyConnectedAccount = asyncHandler(async (request, response) => {
  const account = await createConnectedAccountForProvider(request.user.id);
  sendSuccess(response, account, 201);
});

export const postMyConnectedAccountOnboardingLink = asyncHandler(
  async (request, response) => {
    const link = await createConnectedAccountOnboardingLink(request.user.id);
    sendSuccess(response, link, 201);
  },
);

export const postMarketplaceCheckoutSession = asyncHandler(
  async (request, response) => {
    const session = await createMarketplaceCheckoutSession({
      amount: request.body?.amount,
      amountCents: request.body?.amountCents,
      clientId: request.user.id,
      currency: request.body?.currency,
      description: request.body?.description,
      projectId: request.body?.projectId,
      proposalId: request.body?.proposalId,
      providerId: request.body?.providerId,
      title: request.body?.title,
    });

    sendSuccess(response, session, 201);
  },
);

export const getMyMarketplaceTransactions = asyncHandler(
  async (request, response) => {
    const transactions = await listMarketplaceTransactionsForUser(request.user.id);
    sendSuccess(response, { items: transactions });
  },
);

export const completeMarketplaceWork = asyncHandler(async (request, response) => {
  const transaction = await markMarketplaceWorkComplete({
    transactionId: request.params.transactionId,
    userId: request.user.id,
  });

  sendSuccess(response, transaction);
});
