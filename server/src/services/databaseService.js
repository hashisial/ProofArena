import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

export function ensureDatabaseConnection() {
  if (![1, 2].includes(mongoose.connection.readyState)) {
    throw new AppError("Database connection is unavailable", 503);
  }
}
