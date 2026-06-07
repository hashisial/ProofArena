import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import mongoose from "mongoose";

let connectionPromise;

async function ensureConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }

  connectionPromise = connectDB();

  try {
    return await connectionPromise;
  } finally {
    if (mongoose.connection.readyState !== 1) {
      connectionPromise = undefined;
    }
  }
}

export default async function handler(request, response) {
  await ensureConnection();
  return app(request, response);
}
