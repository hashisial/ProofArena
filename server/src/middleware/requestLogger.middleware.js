import morgan from "morgan";
import { env } from "../config/env.js";

export const requestLogger =
  env.nodeEnv === "test"
    ? (_request, _response, next) => next()
    : morgan(env.isProduction ? "combined" : "dev");
