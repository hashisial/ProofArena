import { matchedData } from "express-validator";
import { createLeadInquiry } from "../services/contactService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitContactLead = asyncHandler(async (request, response) => {
  const leadData = matchedData(request, { locations: ["body"] });
  const lead = await createLeadInquiry({
    ...leadData,
    userId: request.user?.id,
  });

  sendSuccess(response, {
    message: "Inquiry submitted successfully",
    lead,
  }, 201);
});
