import { Router } from "express";
import {
  deleteSavedItem,
  getSavedItems,
  postSavedItem,
} from "../controllers/savedItemController.js";
import { protectUser } from "../middleware/authMiddleware.js";
import { requireRole, roles } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(protectUser);
router.use(requireRole(roles.client));

router.route("/").get(getSavedItems).post(postSavedItem);
router.delete("/:id", deleteSavedItem);

export default router;
