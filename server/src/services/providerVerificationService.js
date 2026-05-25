import { ProviderProfile } from "../models/ProviderProfile.js";
import { AppError } from "../utils/AppError.js";
import { buildLocalUploadUrl, uploadVerificationAsset } from "./cloudinaryService.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function assertProvider(user) {
  if (!user || user.role !== "provider") {
    throw new AppError("Only providers can submit verification requests", 403);
  }
}

function serializeDocument(document = {}) {
  return {
    fileName: document.fileName ?? "",
    mimeType: document.mimeType ?? "",
    publicId: document.publicId ?? "",
    size: document.size ?? 0,
    uploadedAt: document.uploadedAt,
    url: document.url ?? "",
  };
}

function serializeVerification(profile) {
  return {
    documents: (profile.verificationDocuments ?? []).map(serializeDocument),
    status: profile.verificationStatus ?? "none",
    verifiedAt: profile.verifiedAt ?? null,
  };
}

export async function submitProviderVerificationRequest(
  provider,
  { baseUrl = "", files = [] } = {},
) {
  ensureDatabaseConnection();
  assertProvider(provider);

  if (!Array.isArray(files) || files.length === 0) {
    throw new AppError("At least one verification document is required", 400);
  }

  const profile = await ProviderProfile.findOne({ userId: provider.id });

  if (!profile) {
    throw new AppError("Provider profile is required before verification", 404);
  }

  const documents = await Promise.all(
    files.map(async (file) => {
      const cloudinaryUpload = await uploadVerificationAsset({
        file,
        userId: provider.id,
      });

      return {
        fileName: file.originalname ?? file.filename ?? "verification-document",
        mimeType: file.mimetype ?? "",
        provider: cloudinaryUpload ? "cloudinary" : "local",
        publicId: cloudinaryUpload?.publicId ?? "",
        size: cloudinaryUpload?.bytes ?? file.size,
        url: cloudinaryUpload?.secureUrl ?? buildLocalUploadUrl(file, "verification", baseUrl),
      };
    }),
  );

  profile.verificationDocuments = documents;
  profile.verificationStatus = "pending";
  profile.verifiedAt = null;
  await profile.save();

  return serializeVerification(profile.toObject());
}
