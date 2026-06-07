import {
  addOpportunityNote as addOpportunityNoteService,
  calculateOpportunityStats,
  completeNextAction as completeNextActionService,
  createOpportunity as createOpportunityService,
  deleteOrArchiveOpportunity,
  getMyOpportunities as getMyOpportunitiesService,
  getOpportunityById as getOpportunityByIdService,
  updateNextAction as updateNextActionService,
  updateOpportunity as updateOpportunityService,
  updateOpportunityStage as updateOpportunityStageService,
} from "../services/opportunityPipeline.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOpportunity = asyncHandler(async (request, response) => {
  const opportunity = await createOpportunityService(request.user.id, request.body ?? {});
  return successResponse(response, 201, "Opportunity created successfully", opportunity);
});

export const getMyOpportunities = asyncHandler(async (request, response) => {
  const opportunities = await getMyOpportunitiesService(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Opportunities fetched successfully", opportunities);
});

export const getOpportunityStats = asyncHandler(async (request, response) => {
  const stats = await calculateOpportunityStats(request.user.id);
  return successResponse(response, 200, "Opportunity stats fetched successfully", stats);
});

export const getOpportunityById = asyncHandler(async (request, response) => {
  const opportunity = await getOpportunityByIdService(request.user.id, request.params.opportunityId);
  return successResponse(response, 200, "Opportunity fetched successfully", opportunity);
});

export const updateOpportunity = asyncHandler(async (request, response) => {
  const opportunity = await updateOpportunityService(
    request.user.id,
    request.params.opportunityId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Opportunity updated successfully", opportunity);
});

export const updateOpportunityStage = asyncHandler(async (request, response) => {
  const opportunity = await updateOpportunityStageService(
    request.user.id,
    request.params.opportunityId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Opportunity stage updated successfully", opportunity);
});

export const addOpportunityNote = asyncHandler(async (request, response) => {
  const opportunity = await addOpportunityNoteService(
    request.user.id,
    request.params.opportunityId,
    request.body.body,
  );
  return successResponse(response, 200, "Opportunity note added successfully", opportunity);
});

export const updateNextAction = asyncHandler(async (request, response) => {
  const opportunity = await updateNextActionService(
    request.user.id,
    request.params.opportunityId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Opportunity next action updated successfully", opportunity);
});

export const completeNextAction = asyncHandler(async (request, response) => {
  const opportunity = await completeNextActionService(
    request.user.id,
    request.params.opportunityId,
    request.body.completed,
  );
  return successResponse(response, 200, "Opportunity next action completed successfully", opportunity);
});

export const archiveOpportunity = asyncHandler(async (request, response) => {
  const opportunity = await deleteOrArchiveOpportunity(request.user.id, request.params.opportunityId);
  return successResponse(response, 200, "Opportunity archived successfully", opportunity);
});
