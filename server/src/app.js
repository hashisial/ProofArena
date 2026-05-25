import express from "express";
import path from "path";
import { env } from "./config/env.js";
import { stripeWebhook } from "./controllers/billingController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { sanitizeRequest } from "./middleware/sanitizeMiddleware.js";
import { applySecurityMiddleware } from "./middleware/security.middleware.js";
import { sendSuccess } from "./utils/apiResponse.js";
import accountRoutes from "./routes/accountRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import marketplacePaymentRoutes from "./routes/marketplacePaymentRoutes.js";
import networkRoutes from "./routes/networkRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import savedItemRoutes from "./routes/savedItemRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import v1Routes from "./routes/v1/index.js";

export const app = express();
const uploadRoot = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : process.env.VERCEL
    ? path.join("/tmp", "uploads")
    : path.resolve(process.cwd(), "uploads");

if (env.isProduction) {
  app.set("trust proxy", 1);
}

applySecurityMiddleware(app, {
  beforeBodyParsers(appInstance) {
    appInstance.post(
      "/api/billing/webhook",
      express.raw({ type: "application/json" }),
      stripeWebhook,
    );
  },
});

app.use(sanitizeRequest);
app.use(
  "/uploads",
  express.static(uploadRoot, {
    fallthrough: false,
    immutable: true,
    maxAge: "30d",
  }),
);

app.use(requestLogger);

app.get("/api", (_req, res) => {
  sendSuccess(res, {
    message: "ProofArena API is running",
    name: "ProofArena API",
    routes: {
      apiV1: "/api/v1",
      auth: "/api/auth/login",
      admin: "/api/admin",
      analytics: "/api/analytics",
      account: "/api/account",
      billing: "/api/billing",
      blogs: "/api/blogs",
      challenges: "/api/v1/challenges",
      connections: "/api/connections",
      conversations: "/api/conversations",
      contact: "/api/contact",
      executionPlans: "/api/v1/execution-plans",
      follows: "/api/follows",
      health: "/api/health",
      leads: "/api/leads",
      messages: "/api/messages",
      marketplace: "/api/marketplace",
      marketplaceCategories: "/api/marketplace/categories",
      marketplaceService: "/api/marketplace/service/:slug",
      marketplaceServices: "/api/marketplace/services",
      matches: "/api/v1/matches",
      network: "/api/network",
      notifications: "/api/notifications",
      outcomeOffers: "/api/v1/outcome-offers",
      portfolio: "/api/portfolio",
      provider: "/api/providers/:username",
      providers: "/api/providers",
      profile: "/api/profile/:username",
      projects: "/api/account/projects",
      reviews: "/api/reviews",
      saved: "/api/saved",
      services: "/api/services",
      users: "/api/users",
    },
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/v1", v1Routes);
app.use("/api/account", accountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/marketplace", marketplacePaymentRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/saved", savedItemRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);
