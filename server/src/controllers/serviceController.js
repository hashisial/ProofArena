import {
  createServiceForProvider,
  deleteServiceForProvider,
  getAllActiveServices,
  getProviderServices as getProviderServicesFromServiceLayer,
  getServiceBySlug as getServiceBySlugFromServiceLayer,
  updateServiceForProvider,
} from "../services/serviceService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getServices = asyncHandler(async (request, response) => {
  const services = await getAllActiveServices(request.query ?? {}, {
    userId: request.user?.id,
  });
  sendSuccess(response, services);
});

export const createService = asyncHandler(async (request, response) => {
  const service = await createServiceForProvider(request.user, request.body ?? {});
  sendSuccess(response, service, 201);
});

export const updateService = asyncHandler(async (request, response) => {
  const service = await updateServiceForProvider(
    request.user,
    request.params.id,
    request.body ?? {},
  );

  sendSuccess(response, service);
});

export const deleteService = asyncHandler(async (request, response) => {
  const service = await deleteServiceForProvider(request.user, request.params.id);
  sendSuccess(response, service);
});

export const getProviderServices = asyncHandler(async (request, response) => {
  const services = await getProviderServicesFromServiceLayer(request.params.providerId);
  sendSuccess(response, services);
});

export const getServiceBySlug = asyncHandler(async (request, response) => {
  const service = await getServiceBySlugFromServiceLayer(request.params.slug, {
    userId: request.user?.id,
  });

  sendSuccess(response, service);
});
