import { Router } from "express";
import { submitContactLead } from "../controllers/contactController.js";
import { optionalUser } from "../middleware/authMiddleware.js";
import { contactRateLimiter } from "../middleware/rateLimitMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { contactValidationRules } from "../validators/contactValidators.js";

const router = Router();

router.post(
  "/",
  contactRateLimiter,
  optionalUser,
  contactValidationRules,
  validateRequest,
  submitContactLead,
);

export default router;
