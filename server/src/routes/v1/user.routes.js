import { Router } from "express";
import userRoutes from "../userRoutes.js";
import { successResponse } from "../../utils/apiResponse.js";

const router = Router();

router.get("/status", (_request, response) =>
  successResponse(response, 200, "User module placeholder", {
    module: "users",
    status: "planned",
  }),
);

router.use("/", userRoutes);

export default router;
