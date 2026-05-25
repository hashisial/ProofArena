import { findPortfolioItems } from "../services/portfolioService.js";
import {
  createServiceForProvider,
  deleteServiceForProvider,
  findServices,
  uploadServiceImagesForProvider,
  updateServiceForProvider,
} from "../services/serviceService.js";
import { getAnalyticsSummary } from "../services/analyticsService.js";
import {
  createCampaignForUser,
  findCampaignsForUser,
  startCampaignForUser,
  updateCampaignForUser,
} from "../services/campaignService.js";
import {
  createLeadForUser,
  deleteLeadForUser,
  findLeadsForUser,
  findRecentLeadsForUser,
  importLeadsForUser,
  updateLeadForUser,
} from "../services/leadService.js";
import {
  createLeadScrapeJob,
  findLeadScrapeJobById,
  findLeadScrapeJobs,
} from "../services/leadScraperService.js";
import { findLeadActivitiesForUser } from "../services/leadActivityService.js";
import {
  createEmailTemplate,
  createOutreachAutomationJob,
  deleteEmailTemplate,
  findEmailTemplates,
  findOutreachEmails,
  findOutreachJobs,
  sendTemplateToLead,
  updateEmailTemplate,
} from "../services/outreachService.js";
import { getUserSubscriptionDetails } from "../services/subscriptionService.js";
import {
  createReviewForUser,
  findReviewsForUser,
} from "../services/reviewService.js";
import {
  createProjectForUser,
  findProjectsForUser,
  updateProjectForUser,
} from "../services/projectService.js";
import { findUserActivityFeed } from "../services/userActivityFeedService.js";
import {
  getUserProfileForUser,
  updateUserProfileMediaForUser,
  updateUserProfileForUser,
} from "../services/userProfileService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyLeads = asyncHandler(async (request, response) => {
  const sort = request.query.sort === "asc" ? "asc" : "desc";
  const leads = await findLeadsForUser(request.user.id, { sort });

  sendSuccess(response, {
    items: leads,
    sort,
  });
});

export const getMyLeadActivities = asyncHandler(async (request, response) => {
  const activities = await findLeadActivitiesForUser(request.user.id, {
    leadId: request.query.leadId,
  });

  sendSuccess(response, { items: activities });
});

export const createMyLead = asyncHandler(async (request, response) => {
  const lead = await createLeadForUser(request.user.id, request.body ?? {});
  sendSuccess(response, lead, 201);
});

export const importMyLeads = asyncHandler(async (request, response) => {
  const leads = await importLeadsForUser(request.user.id, request.body?.leads);

  sendSuccess(
    response,
    {
      count: leads.length,
      items: leads,
    },
    201,
  );
});

export const updateMyLead = asyncHandler(async (request, response) => {
  const lead = await updateLeadForUser(
    request.user.id,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, lead);
});

export const deleteMyLead = asyncHandler(async (request, response) => {
  const lead = await deleteLeadForUser(request.user.id, request.params.id);

  sendSuccess(response, {
    deleted: true,
    lead,
  });
});

export const startMyLeadScrape = asyncHandler(async (request, response) => {
  const job = await createLeadScrapeJob(
    request.user.id,
    request.body?.keyword,
    request.body?.location,
  );

  sendSuccess(response, job, 202);
});

export const getMyLeadScrapeJobs = asyncHandler(async (request, response) => {
  const jobs = await findLeadScrapeJobs(request.user.id);

  sendSuccess(response, { items: jobs });
});

export const getMyLeadScrapeJob = asyncHandler(async (request, response) => {
  const job = await findLeadScrapeJobById(request.user.id, request.params.id);

  sendSuccess(response, job);
});

export const getMyCampaigns = asyncHandler(async (request, response) => {
  const campaigns = await findCampaignsForUser(request.user.id);

  sendSuccess(response, { items: campaigns });
});

export const createMyCampaign = asyncHandler(async (request, response) => {
  const campaign = await createCampaignForUser(request.user.id, request.body ?? {});

  sendSuccess(response, campaign, 201);
});

export const updateMyCampaign = asyncHandler(async (request, response) => {
  const campaign = await updateCampaignForUser(
    request.user.id,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, campaign);
});

export const startMyCampaign = asyncHandler(async (request, response) => {
  const campaign = await startCampaignForUser(request.user.id, request.params.id);

  sendSuccess(response, campaign, 202);
});

export const getMyEmailTemplates = asyncHandler(async (request, response) => {
  const templates = await findEmailTemplates(request.user.id);

  sendSuccess(response, { items: templates });
});

export const createMyEmailTemplate = asyncHandler(async (request, response) => {
  const template = await createEmailTemplate(request.user.id, request.body ?? {});

  sendSuccess(response, template, 201);
});

export const updateMyEmailTemplate = asyncHandler(async (request, response) => {
  const template = await updateEmailTemplate(
    request.user.id,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, template);
});

export const deleteMyEmailTemplate = asyncHandler(async (request, response) => {
  const template = await deleteEmailTemplate(request.user.id, request.params.id);

  sendSuccess(response, {
    deleted: true,
    template,
  });
});

export const sendMyOutreachEmail = asyncHandler(async (request, response) => {
  const email = await sendTemplateToLead(request.user.id, request.body ?? {});

  sendSuccess(response, email, 201);
});

export const getMyOutreachEmails = asyncHandler(async (request, response) => {
  const emails = await findOutreachEmails(request.user.id);

  sendSuccess(response, { items: emails });
});

export const startMyOutreachAutomation = asyncHandler(async (request, response) => {
  const job = await createOutreachAutomationJob(request.user.id, request.body ?? {});

  sendSuccess(response, job, 202);
});

export const getMyOutreachJobs = asyncHandler(async (request, response) => {
  const jobs = await findOutreachJobs(request.user.id);

  sendSuccess(response, { items: jobs });
});

export const getMyServices = asyncHandler(async (request, response) => {
  const services = await findServices({ userId: request.user.id });
  sendSuccess(response, { items: services });
});

export const createMyService = asyncHandler(async (request, response) => {
  const service = await createServiceForProvider(request.user, request.body ?? {});

  sendSuccess(response, service, 201);
});

export const uploadMyServiceImages = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const uploads = await uploadServiceImagesForProvider(request.user, {
    baseUrl,
    files: request.files ?? [],
  });

  sendSuccess(response, uploads, 201);
});

export const updateMyService = asyncHandler(async (request, response) => {
  const service = await updateServiceForProvider(
    request.user,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, service);
});

export const deleteMyService = asyncHandler(async (request, response) => {
  const service = await deleteServiceForProvider(request.user, request.params.id);

  sendSuccess(response, service);
});

export const getMyPortfolioItems = asyncHandler(async (request, response) => {
  const portfolioItems = await findPortfolioItems({ userId: request.user.id });
  sendSuccess(response, { items: portfolioItems });
});

export const getMyReviews = asyncHandler(async (request, response) => {
  const reviews = await findReviewsForUser(request.user.id);
  sendSuccess(response, { items: reviews });
});

export const createMyReview = asyncHandler(async (request, response) => {
  const review = await createReviewForUser(request.user, request.body ?? {});
  sendSuccess(response, review, 201);
});

export const getMyProjects = asyncHandler(async (request, response) => {
  const projects = await findProjectsForUser(request.user.id, {
    status: request.query.status,
  });

  sendSuccess(response, { items: projects });
});

export const createMyProject = asyncHandler(async (request, response) => {
  const project = await createProjectForUser(request.user.id, request.body ?? {});

  sendSuccess(response, project, 201);
});

export const updateMyProject = asyncHandler(async (request, response) => {
  const project = await updateProjectForUser(
    request.user.id,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, project);
});

export const getMyProfile = asyncHandler(async (request, response) => {
  const profile = await getUserProfileForUser(request.user.id);
  sendSuccess(response, profile);
});

export const updateMyProfile = asyncHandler(async (request, response) => {
  const profile = await updateUserProfileForUser(request.user.id, request.body ?? {});
  sendSuccess(response, profile);
});

export const uploadMyProfileMedia = asyncHandler(async (request, response) => {
  const baseUrl = `${request.protocol}://${request.get("host")}`;
  const profile = await updateUserProfileMediaForUser(request.user.id, {
    baseUrl,
    file: request.file,
    type: request.body?.type,
  });

  sendSuccess(response, profile, 201);
});

export const getMyActivityFeed = asyncHandler(async (request, response) => {
  const activities = await findUserActivityFeed(request.user.id, {
    limit: request.query.limit,
  });

  sendSuccess(response, { items: activities });
});

export const getMyDashboard = asyncHandler(async (request, response) => {
  const [activities, analytics, campaigns, recentLeads, subscription] = await Promise.all([
    findLeadActivitiesForUser(request.user.id, { limit: 6 }),
    getAnalyticsSummary({ userId: request.user.id }),
    findCampaignsForUser(request.user.id),
    findRecentLeadsForUser(request.user.id, { limit: 5 }),
    getUserSubscriptionDetails(request.user.id),
  ]);

  const serviceCounts = recentLeads.reduce((counts, lead) => {
    counts[lead.service] = (counts[lead.service] ?? 0) + 1;
    return counts;
  }, {});
  const topService =
    Object.entries(serviceCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ??
    "No requests yet";

  sendSuccess(response, {
    overview: {
      activeCampaigns: campaigns.filter((campaign) => campaign.status === "running").length,
      conversionRate: analytics.conversionRate,
      conversions: analytics.formSubmissions,
      leads: analytics.leads,
      pageVisits: analytics.pageVisits,
      topService,
      emailsSent: subscription.limits.emailsSent,
    },
    recentActivity: activities,
    campaigns: campaigns.slice(0, 5),
    recentLeads,
    subscription,
  });
});
