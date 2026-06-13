import { Router } from "express";
import accountRoutes from "../accountRoutes.js";
import adminRoutes from "../adminRoutes.js";
import analyticsRoutes from "../analyticsRoutes.js";
import authRoutes from "./auth.routes.js";
import billingRoutes from "../billingRoutes.js";
import blogRoutes from "../blogRoutes.js";
import challengeRoutes from "./challenge.routes.js";
import connectionRoutes from "../connectionRoutes.js";
import conversationRoutes from "../conversationRoutes.js";
import contactRoutes from "../contactRoutes.js";
import executionPlanRoutes from "./executionPlan.routes.js";
import firstClientRoutes from "./firstClient.routes.js";
import followRoutes from "../followRoutes.js";
import healthRoutes from "./health.routes.js";
import leadRoutes from "../leadRoutes.js";
import messageRoutes from "../messageRoutes.js";
import marketplacePaymentRoutes from "../marketplacePaymentRoutes.js";
import matchRoutes from "./match.routes.js";
import networkRoutes from "../networkRoutes.js";
import notificationRoutes from "../notificationRoutes.js";
import opportunityPipelineRoutes from "./opportunityPipeline.routes.js";
import outcomeOfferRoutes from "./outcomeOffer.routes.js";
import portfolioRoutes from "../portfolioRoutes.js";
import proofAssetRoutes from "./proofAsset.routes.js";
import providerRoutes from "../providerRoutes.js";
import profileRoutes from "./profile.routes.js";
import reviewRoutes from "../reviewRoutes.js";
import savedProviderRoutes from "./savedProvider.routes.js";
import savedItemRoutes from "../savedItemRoutes.js";
import serviceRoutes from "../serviceRoutes.js";
import userRoutes from "./user.routes.js";

const router = Router();

export const V1_ROUTE_REGISTRY = Object.freeze([
  ["/health", healthRoutes],
  ["/auth", authRoutes],
  ["/users", userRoutes],
  ["/account", accountRoutes],
  ["/admin", adminRoutes],
  ["/analytics", analyticsRoutes],
  ["/billing", billingRoutes],
  ["/blogs", blogRoutes],
  ["/challenges", challengeRoutes],
  ["/connections", connectionRoutes],
  ["/conversations", conversationRoutes],
  ["/contact", contactRoutes],
  ["/execution-plans", executionPlanRoutes],
  ["/first-client", firstClientRoutes],
  ["/follows", followRoutes],
  ["/leads", leadRoutes],
  ["/messages", messageRoutes],
  ["/marketplace", marketplacePaymentRoutes],
  ["/matches", matchRoutes],
  ["/network", networkRoutes],
  ["/notifications", notificationRoutes],
  ["/opportunities", opportunityPipelineRoutes],
  ["/outcome-offers", outcomeOfferRoutes],
  ["/portfolio", portfolioRoutes],
  ["/proof-assets", proofAssetRoutes],
  ["/providers", providerRoutes],
  ["/profile", profileRoutes],
  ["/reviews", reviewRoutes],
  ["/saved-providers", savedProviderRoutes],
  ["/saved", savedItemRoutes],
  ["/services", serviceRoutes],
]);

V1_ROUTE_REGISTRY.forEach(([prefix, routes]) => {
  router.use(prefix, routes);
});

export default router;
