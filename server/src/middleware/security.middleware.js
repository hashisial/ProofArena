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
  app.use(
    helmet({
      contentSecurityPolicy: env.isProduction
        ? {
            useDefaults: true,
            directives: {
              "default-src": ["'self'"],
              "frame-ancestors": ["'none'"],
              "object-src": ["'none'"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts: env.isProduction
        ? {
            includeSubDomains: true,
            maxAge: 15552000,
            preload: false,
          }
        : false,
      referrerPolicy: { policy: "no-referrer" },
    }),
  );
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
