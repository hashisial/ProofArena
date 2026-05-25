import { env } from "./env.js";

export const corsOptions = {
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
  methods: ["DELETE", "GET", "PATCH", "POST", "PUT", "OPTIONS"],
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
