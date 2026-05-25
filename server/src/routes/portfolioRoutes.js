import { Router } from "express";
import {
  createPortfolioItem,
  getPortfolioItemById,
  getPortfolioItems,
} from "../controllers/portfolioController.js";
import { protectAdmin, requireAdminPermission } from "../middleware/adminMiddleware.js";
import { optionalUser } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(optionalUser, getPortfolioItems)
  .post(protectAdmin, requireAdminPermission("content"), createPortfolioItem);
router.get("/:id", optionalUser, getPortfolioItemById);

export default router;
