import { Router } from "express";
import {
  getProviderReviews,
  getReviews,
  getServiceReviews,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", getReviews);
router.get("/service/:serviceId", getServiceReviews);
router.get("/provider/:providerId", getProviderReviews);

export default router;
