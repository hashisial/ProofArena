import { app } from "../src/app.js";
import { connectDB } from "../src/config/db.js";

let connectionPromise;

async function ensureConnection() {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  return connectionPromise;
}

export default async function handler(request, response) {
  await ensureConnection();
  return app(request, response);
}
