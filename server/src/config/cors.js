import { env } from "./env.js";

export const corsOptions = {
  allowedHeaders: ["Authorization", "Content-Type", "X-Requested-With"],
  credentials: true,
  maxAge: env.isProduction ? 86400 : 0,
  methods: ["DELETE", "GET", "PATCH", "POST", "PUT", "OPTIONS"],
  optionsSuccessStatus: 204,
  origin(origin, callback) {
    if (!origin || env.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    try {
      const { hostname, protocol } = new URL(origin);
      if (
        env.allowVercelPreviewOrigins &&
        protocol === "https:" &&
        hostname.endsWith(".vercel.app")
      ) {
        callback(null, true);
        return;
      }
    } catch {
      // Fall through to blocked origin response.
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
};
