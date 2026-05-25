import {
  acceptExecutionPlan as acceptExecutionPlanService,
  getExecutionPlanByIdForClient as getExecutionPlanByIdForClientService,
  getExecutionPlanByIdForProvider as getExecutionPlanByIdForProviderService,
  getMyExecutionPlans as getMyExecutionPlansService,
  getPlansForClientChallenge as getPlansForClientChallengeService,
  rejectExecutionPlan as rejectExecutionPlanService,
  shortlistExecutionPlan as shortlistExecutionPlanService,
  submitExecutionPlan as submitExecutionPlanService,
  updateExecutionPlan as updateExecutionPlanService,
  withdrawExecutionPlan as withdrawExecutionPlanService,
} from "../services/executionPlan.service.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await submitExecutionPlanService(request.user.id, request.body ?? {});
  return successResponse(response, 201, "Execution plan submitted successfully", plan);
});

export const getMyExecutionPlans = asyncHandler(async (request, response) => {
  const plans = await getMyExecutionPlansService(request.user.id, request.query ?? {});
  return successResponse(response, 200, "Execution plans fetched successfully", plans);
});

export const getExecutionPlanByIdForProvider = asyncHandler(async (request, response) => {
  const plan = await getExecutionPlanByIdForProviderService(
    request.user.id,
    request.params.planId,
  );
  return successResponse(response, 200, "Execution plan fetched successfully", plan);
});

export const getPlansForClientChallenge = asyncHandler(async (request, response) => {
  const plans = await getPlansForClientChallengeService(
    request.user.id,
    request.params.challengeId,
    request.query ?? {},
  );
  return successResponse(response, 200, "Execution plans fetched successfully", plans);
});

export const getExecutionPlanByIdForClient = asyncHandler(async (request, response) => {
  const plan = await getExecutionPlanByIdForClientService(
    request.user.id,
    request.params.planId,
  );
  return successResponse(response, 200, "Execution plan fetched successfully", plan);
});

export const updateExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await updateExecutionPlanService(
    request.user.id,
    request.params.planId,
    request.body ?? {},
  );
  return successResponse(response, 200, "Execution plan updated successfully", plan);
});

export const withdrawExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await withdrawExecutionPlanService(request.user.id, request.params.planId);
  return successResponse(response, 200, "Execution plan withdrawn successfully", plan);
});

export const shortlistExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await shortlistExecutionPlanService(
    request.user.id,
    request.params.planId,
    request.body?.note ?? "",
  );
  return successResponse(response, 200, "Execution plan shortlisted successfully", plan);
});

export const rejectExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await rejectExecutionPlanService(
    request.user.id,
    request.params.planId,
    request.body?.rejectionReason ?? request.body?.note ?? "",
  );
  return successResponse(response, 200, "Execution plan rejected successfully", plan);
});

export const acceptExecutionPlan = asyncHandler(async (request, response) => {
  const plan = await acceptExecutionPlanService(
    request.user.id,
    request.params.planId,
    request.body?.note ?? "",
  );
  return successResponse(response, 200, "Execution plan accepted successfully", plan);
});
