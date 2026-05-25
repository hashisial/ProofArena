import { Router } from "express";
import { getLeadById, getLeads } from "../controllers/leadController.js";
import { protectAdmin, requireAdminPermission } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(protectAdmin);
router.use(requireAdminPermission("leads"));

router.get("/", getLeads);
router.get("/:id", getLeadById);

export default router;
