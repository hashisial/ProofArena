import {
  findSubscriptionPlans,
  getAdminSaasOverview,
  updateSubscriptionPlan,
} from "../services/subscriptionService.js";
import {
  createAdminUser,
  deleteUserRecord,
  findUsers,
  resetUserPassword,
  updateAdminUser,
  updateOwnAdminPassword,
} from "../services/userService.js";
import {
  removeUserProfileMediaForAdmin,
  updateUserProfileForAdmin,
  updateUserSettingsForAdmin,
} from "../services/userProfileService.js";
import { AppError } from "../utils/AppError.js";
import {
  createBlogRecord,
  deleteBlogRecord,
  findAllBlogs,
  updateBlogRecord,
} from "../services/blogService.js";
import {
  createReviewRecord,
  deleteReviewRecord,
  findAllReviews,
  updateReviewRecord,
} from "../services/reviewService.js";
import {
  createMarketplaceCategory,
  deleteMarketplaceCategory,
  listMarketplaceCategories,
  updateMarketplaceCategory,
} from "../services/categoryService.js";
import {
  approveServiceForAdmin,
  deleteMarketplaceServiceForAdmin,
  listMarketplaceServicesForAdmin,
  rejectServiceForAdmin,
  updateMarketplaceServiceForAdmin,
} from "../services/serviceService.js";
import {
  listMarketplaceProvidersForAdmin,
  updateMarketplaceProviderForAdmin,
} from "../services/providerSearchService.js";
import {
  createSupportAdminMessage,
  findSupportConversations,
  findSupportMessages,
  updateSupportConversation,
} from "../services/messagingService.js";
import {
  listMarketplaceTransactionsForAdmin,
  releaseMarketplaceFunds,
} from "../services/marketplacePaymentService.js";
import { Connection } from "../models/Connection.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { emitConversationEvent, emitUserEvent } from "../services/socketService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSaasOverview = asyncHandler(async (_request, response) => {
  const overview = await getAdminSaasOverview();
  sendSuccess(response, overview);
});

export const getAdminConversationMetadata = asyncHandler(async (_request, response) => {
  const conversations = await Conversation.find({})
    .select("kind type participants lastMessage lastMessageAt supportStatus priority isBlocked createdAt updatedAt")
    .populate("participants", "_id email fullName name role username avatar")
    .populate("lastMessage", "_id createdAt senderId type")
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .limit(100)
    .lean();

  sendSuccess(response, { items: conversations });
});

export const getAdminReportedMessages = asyncHandler(async (_request, response) => {
  const messages = await Message.find({ "metadata.reported": true })
    .select("_id conversationId senderId type createdAt updatedAt")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  sendSuccess(response, { items: messages });
});

export const getAdminConnectionsOverview = asyncHandler(async (_request, response) => {
  const [statusCounts, latestConnections] = await Promise.all([
    Connection.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Connection.find({})
      .select("_id senderId receiverId status blockedBy createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean(),
  ]);

  sendSuccess(response, {
    latestConnections,
    statusCounts: Object.fromEntries(
      statusCounts.map((item) => [item._id ?? "unknown", item.count]),
    ),
  });
});

export const getAdminPlans = asyncHandler(async (_request, response) => {
  const plans = await findSubscriptionPlans({ includeInactive: true });
  sendSuccess(response, { items: plans });
});

export const patchAdminPlan = asyncHandler(async (request, response) => {
  const plan = await updateSubscriptionPlan(request.params.planKey, request.body ?? {});
  sendSuccess(response, plan);
});

export const getAdminUsers = asyncHandler(async (_request, response) => {
  const users = await findUsers();
  sendSuccess(response, { items: users });
});

export const postAdminUser = asyncHandler(async (request, response) => {
  const user = await createAdminUser(request.body ?? {});
  sendSuccess(response, user, 201);
});

export const patchAdminUser = asyncHandler(async (request, response) => {
  if (
    request.admin?.id === request.params.id &&
    (
      request.body?.isSuspended === true ||
      ["client", "provider"].includes(request.body?.role)
    )
  ) {
    throw new AppError("You cannot suspend or demote your active admin account", 400);
  }

  const user = await updateAdminUser(request.params.id, request.body ?? {});
  sendSuccess(response, user);
});

export const deleteAdminUser = asyncHandler(async (request, response) => {
  if (request.admin?.id === request.params.id) {
    throw new AppError("You cannot delete your active admin account", 400);
  }

  const user = await deleteUserRecord(request.params.id);
  sendSuccess(response, { deleted: true, user });
});

export const resetAdminUserPassword = asyncHandler(async (request, response) => {
  const data = await resetUserPassword(request.params.id, request.body?.password);
  sendSuccess(response, data);
});

export const patchAdminUserProfile = asyncHandler(async (request, response) => {
  const profile = await updateUserProfileForAdmin(request.params.id, request.body ?? {});
  sendSuccess(response, profile);
});

export const patchAdminUserSettings = asyncHandler(async (request, response) => {
  const settings = await updateUserSettingsForAdmin(request.params.id, request.body ?? {});
  sendSuccess(response, settings);
});

export const deleteAdminUserMedia = asyncHandler(async (request, response) => {
  const profile = await removeUserProfileMediaForAdmin(
    request.params.id,
    request.params.type,
  );

  sendSuccess(response, profile);
});

export const patchOwnAdminPassword = asyncHandler(async (request, response) => {
  const data = await updateOwnAdminPassword(
    request.admin?.id,
    request.body?.currentPassword,
    request.body?.password,
  );
  sendSuccess(response, data);
});

export const getAdminBlogs = asyncHandler(async (_request, response) => {
  const blogs = await findAllBlogs();
  sendSuccess(response, { items: blogs });
});

export const postAdminBlog = asyncHandler(async (request, response) => {
  const blog = await createBlogRecord(request.body ?? {});
  sendSuccess(response, blog, 201);
});

export const patchAdminBlog = asyncHandler(async (request, response) => {
  const blog = await updateBlogRecord(request.params.id, request.body ?? {});
  sendSuccess(response, blog);
});

export const deleteAdminBlog = asyncHandler(async (request, response) => {
  const blog = await deleteBlogRecord(request.params.id);
  sendSuccess(response, { deleted: true, blog });
});

export const getAdminReviews = asyncHandler(async (_request, response) => {
  const reviews = await findAllReviews();
  sendSuccess(response, { items: reviews });
});

export const postAdminReview = asyncHandler(async (request, response) => {
  const review = await createReviewRecord(request.body ?? {});
  sendSuccess(response, review, 201);
});

export const patchAdminReview = asyncHandler(async (request, response) => {
  const review = await updateReviewRecord(request.params.id, request.body ?? {});
  sendSuccess(response, review);
});

export const deleteAdminReview = asyncHandler(async (request, response) => {
  const review = await deleteReviewRecord(request.params.id);
  sendSuccess(response, { deleted: true, review });
});

export const getAdminSupportConversations = asyncHandler(async (_request, response) => {
  const conversations = await findSupportConversations();
  sendSuccess(response, { items: conversations });
});

export const getAdminSupportMessages = asyncHandler(async (request, response) => {
  const messages = await findSupportMessages(request.params.conversationId);
  sendSuccess(response, { items: messages });
});

export const postAdminSupportMessage = asyncHandler(async (request, response) => {
  const result = await createSupportAdminMessage({
    adminId: request.admin.id,
    attachments: request.body?.attachments,
    conversationId: request.params.conversationId,
    text: request.body?.text,
  });

  emitConversationEvent(
    result.participantIds,
    result.message.conversationId,
    "message:new",
    {
      conversation: result.conversation,
      message: result.message,
    },
  );
  result.notifications?.forEach((notification) => {
    emitUserEvent(notification.userId, "notification:new", notification);
  });
  sendSuccess(response, result, 201);
});

export const patchAdminSupportConversation = asyncHandler(async (request, response) => {
  const conversation = await updateSupportConversation(
    request.params.conversationId,
    request.body ?? {},
  );

  emitConversationEvent(
    conversation.participants.map((participant) => participant.id),
    conversation._id,
    "conversation:update",
    { conversation },
  );
  sendSuccess(response, conversation);
});

export const getAdminMarketplaceTransactions = asyncHandler(async (_request, response) => {
  const transactions = await listMarketplaceTransactionsForAdmin();
  sendSuccess(response, { items: transactions });
});

export const getAdminMarketplaceCategories = asyncHandler(async (_request, response) => {
  const categories = await listMarketplaceCategories({ includeInactive: true });
  sendSuccess(response, categories);
});

export const postAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await createMarketplaceCategory(request.body ?? {});
  sendSuccess(response, category, 201);
});

export const patchAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await updateMarketplaceCategory(
    request.params.categoryId,
    request.body ?? {},
  );
  sendSuccess(response, category);
});

export const deleteAdminMarketplaceCategory = asyncHandler(async (request, response) => {
  const category = await deleteMarketplaceCategory(request.params.categoryId);
  sendSuccess(response, { category, deleted: true });
});

export const getAdminMarketplaceServices = asyncHandler(async (request, response) => {
  const services = await listMarketplaceServicesForAdmin(request.query ?? {});
  sendSuccess(response, services);
});

export const patchAdminMarketplaceService = asyncHandler(async (request, response) => {
  const service = await updateMarketplaceServiceForAdmin(
    request.params.serviceId,
    request.body ?? {},
  );

  sendSuccess(response, service);
});

export const approveAdminMarketplaceService = asyncHandler(async (request, response) => {
  const service = await approveServiceForAdmin(request.params.serviceId);
  sendSuccess(response, service);
});

export const rejectAdminMarketplaceService = asyncHandler(async (request, response) => {
  const service = await rejectServiceForAdmin(
    request.params.serviceId,
    request.body?.moderationNote ?? request.body?.reason ?? "",
  );

  sendSuccess(response, service);
});

export const deleteAdminMarketplaceService = asyncHandler(async (request, response) => {
  const service = await deleteMarketplaceServiceForAdmin(request.params.serviceId);
  sendSuccess(response, service);
});

export const getAdminMarketplaceProviders = asyncHandler(async (request, response) => {
  const providers = await listMarketplaceProvidersForAdmin(request.query ?? {});
  sendSuccess(response, providers);
});

export const patchAdminMarketplaceProvider = asyncHandler(async (request, response) => {
  const providers = await updateMarketplaceProviderForAdmin(
    request.params.userId,
    request.body ?? {},
  );

  sendSuccess(response, providers);
});

export const postAdminMarketplaceRelease = asyncHandler(async (request, response) => {
  const transaction = await releaseMarketplaceFunds({
    adminId: request.admin?.id,
    transactionId: request.params.transactionId,
  });

  sendSuccess(response, transaction);
});
