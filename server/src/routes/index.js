import { Router } from "express";
import accountRoutes from "./accountRoutes.js";
import adminRoutes from "./adminRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import authRoutes from "./authRoutes.js";
import billingRoutes from "./billingRoutes.js";
import blogRoutes from "./blogRoutes.js";
import connectionRoutes from "./connectionRoutes.js";
import contactRoutes from "./contactRoutes.js";
import conversationRoutes from "./conversationRoutes.js";
import followRoutes from "./followRoutes.js";
import healthRoutes from "./healthRoutes.js";
import leadRoutes from "./leadRoutes.js";
import marketplacePaymentRoutes from "./marketplacePaymentRoutes.js";
import messageRoutes from "./messageRoutes.js";
import networkRoutes from "./networkRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import portfolioRoutes from "./portfolioRoutes.js";
import profileRoutes from "./profileRoutes.js";
import providerRoutes from "./providerRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import savedItemRoutes from "./savedItemRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import userRoutes from "./userRoutes.js";

export const API_ROUTE_REGISTRY = Object.freeze([
  ["/account", accountRoutes],
  ["/admin", adminRoutes],
  ["/analytics", analyticsRoutes],
  ["/auth", authRoutes],
  ["/billing", billingRoutes],
  ["/blogs", blogRoutes],
  ["/connections", connectionRoutes],
  ["/contact", contactRoutes],
  ["/conversations", conversationRoutes],
  ["/follows", followRoutes],
  ["/health", healthRoutes],
  ["/leads", leadRoutes],
  ["/marketplace", marketplacePaymentRoutes],
  ["/messages", messageRoutes],
  ["/network", networkRoutes],
  ["/notifications", notificationRoutes],
  ["/portfolio", portfolioRoutes],
  ["/profile", profileRoutes],
  ["/providers", providerRoutes],
  ["/reviews", reviewRoutes],
  ["/saved", savedItemRoutes],
  ["/services", serviceRoutes],
  ["/users", userRoutes],
]);

const router = Router();

API_ROUTE_REGISTRY.forEach(([prefix, routes]) => {
  router.use(prefix, routes);
});

export default router;
