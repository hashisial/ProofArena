import express from "express";
import path from "path";
import { env } from "./config/env.js";
import { stripeWebhook } from "./controllers/billingController.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";
import { sanitizeRequest } from "./middleware/sanitizeMiddleware.js";
import { applySecurityMiddleware } from "./middleware/security.middleware.js";
import { sendSuccess } from "./utils/apiResponse.js";
import apiRoutes from "./routes/index.js";
import v1Routes from "./routes/v1/index.js";

export const app = express();
const uploadRoot = env.uploadDir
  ? path.resolve(env.uploadDir)
  : env.isVercel
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
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);
