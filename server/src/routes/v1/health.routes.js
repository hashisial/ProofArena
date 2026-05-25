import { Router } from "express";
import { getHealthStatus, getServiceStatus } from "../../controllers/health.controller.js";

const router = Router();

router.get("/", getHealthStatus);
router.get("/status", getServiceStatus);

export default router;
