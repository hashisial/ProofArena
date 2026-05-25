import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { protectAdmin, requireAdminPermission } from "../middleware/adminMiddleware.js";

const router = Router();

router
  .route("/")
  .get(protectAdmin, requireAdminPermission("users"), getUsers)
  .post(protectAdmin, requireAdminPermission("users"), createUser);

export default router;
