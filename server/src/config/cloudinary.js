import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

let isConfigured = false;

export function getCloudinaryClient() {
  if (!env.cloudinaryEnabled) {
    return null;
  }

  if (!isConfigured) {
    cloudinary.config({
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      cloud_name: env.cloudinaryCloudName,
      secure: true,
    });
    isConfigured = true;
  }

  return cloudinary;
}
