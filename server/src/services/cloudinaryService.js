import fs from "fs/promises";
import { getCloudinaryClient } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

async function removeLocalUpload(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch {
    // Local cleanup failure should not hide a successful Cloudinary upload.
  }
}

export async function uploadProfileAsset({ file, type, userId }) {
  const cloudinary = getCloudinaryClient();

  if (!cloudinary) {
    return null;
  }

  if (!file?.path) {
    throw new AppError("Image file is required", 400);
  }

  try {
    const profileFolder = `proofarena/profile/${type}`;
    const result = await cloudinary.uploader.upload(file.path, {
      asset_folder: profileFolder,
      folder: profileFolder,
      overwrite: true,
      public_id: `${userId}-${type}-${Date.now()}`,
      resource_type: "image",
      transformation:
        type === "avatar"
          ? [{ crop: "fill", gravity: "auto", height: 720, quality: "auto", width: 720 }]
          : [{ crop: "fill", gravity: "auto", height: 900, quality: "auto", width: 2400 }],
    });

    await removeLocalUpload(file.path);

    return {
      bytes: result.bytes ?? file.size,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    throw new AppError(error.message || "Unable to upload image to Cloudinary", 502);
  }
}

export async function uploadServiceAsset({ file, userId }) {
  const cloudinary = getCloudinaryClient();

  if (!cloudinary) {
    return null;
  }

  if (!file?.path) {
    throw new AppError("Service image file is required", 400);
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      asset_folder: `${env.cloudinaryFolder}/services/${userId}`,
      folder: `${env.cloudinaryFolder}/services/${userId}`,
      overwrite: false,
      public_id: `service-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "image",
      transformation: [
        { crop: "fill", gravity: "auto", height: 1080, quality: "auto", width: 1600 },
      ],
    });

    await removeLocalUpload(file.path);

    return {
      bytes: result.bytes ?? file.size,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    throw new AppError(error.message || "Unable to upload service image to Cloudinary", 502);
  }
}

export async function uploadVerificationAsset({ file, userId }) {
  const cloudinary = getCloudinaryClient();

  if (!cloudinary) {
    return null;
  }

  if (!file?.path) {
    throw new AppError("Verification document image is required", 400);
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      asset_folder: `${env.cloudinaryFolder}/verification/${userId}`,
      folder: `${env.cloudinaryFolder}/verification/${userId}`,
      overwrite: false,
      public_id: `verification-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "image",
      transformation: [
        { crop: "limit", height: 1600, quality: "auto", width: 1600 },
      ],
    });

    await removeLocalUpload(file.path);

    return {
      bytes: result.bytes ?? file.size,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    throw new AppError(error.message || "Unable to upload verification document", 502);
  }
}

export async function uploadMessageAsset({ file, userId }) {
  const cloudinary = getCloudinaryClient();

  if (!cloudinary) {
    return null;
  }

  if (!file?.path) {
    throw new AppError("Message attachment is required", 400);
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      asset_folder: `${env.cloudinaryFolder}/messages/${userId}`,
      folder: `${env.cloudinaryFolder}/messages/${userId}`,
      overwrite: false,
      public_id: `message-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    });

    await removeLocalUpload(file.path);

    return {
      bytes: result.bytes ?? file.size,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    };
  } catch (error) {
    throw new AppError(error.message || "Unable to upload message attachment", 502);
  }
}

export function buildLocalUploadUrl(file, folder, baseUrl = "") {
  const publicPath = `/uploads/${folder}/${file.filename}`;

  if (!baseUrl) {
    return publicPath;
  }

  return `${baseUrl.replace(/\/$/, "")}${publicPath}`;
}

export async function deleteProfileAsset(publicId) {
  const cloudinary = getCloudinaryClient();

  if (!cloudinary || !publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch {
    // Deleting the database reference is more important than failing the request
    // because a remote asset cleanup call timed out.
  }
}
