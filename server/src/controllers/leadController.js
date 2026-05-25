import { findLeadById, findLeads } from "../services/leadService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getLeads = asyncHandler(async (request, response) => {
  const sort = request.query.sort === "asc" ? "asc" : "desc";
  const leads = await findLeads({ sort });

  sendSuccess(response, {
    items: leads,
    sort,
  });
});

export const getLeadById = asyncHandler(async (request, response) => {
  const lead = await findLeadById(request.params.id);
  sendSuccess(response, lead);
});
