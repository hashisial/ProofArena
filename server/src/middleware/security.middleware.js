import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { env } from "../config/env.js";
import { corsOptions } from "../config/cors.js";
import { apiRateLimiter } from "./rateLimitMiddleware.js";

export function applySecurityMiddleware(app, options = {}) {
  const { beforeBodyParsers } = options;

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors(corsOptions));
  if (typeof beforeBodyParsers === "function") {
    beforeBodyParsers(app);
  }

  app.use(express.json({ limit: env.jsonLimit }));
  app.use(express.urlencoded({ extended: true, limit: env.jsonLimit }));
  app.use(cookieParser());
  app.use(compression());
  app.use("/api", apiRateLimiter);
}
