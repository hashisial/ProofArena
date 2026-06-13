import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const uploadRoot = env.uploadDir
  ? path.resolve(env.uploadDir)
  : env.isVercel
    ? path.join("/tmp", "uploads")
    : path.resolve(process.cwd(), "uploads");
const profileUploadDir = path.join(uploadRoot, "profiles");
const serviceUploadDir = path.join(uploadRoot, "services");
const verificationUploadDir = path.join(uploadRoot, "verification");
const messageUploadDir = path.join(uploadRoot, "messages");
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedProfileImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedAttachmentTypes = new Map([
  ["application/pdf", [".pdf"]],
  ["image/gif", [".gif"]],
  ["image/jpeg", [".jpeg", ".jpg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["text/plain", [".txt"]],
  ["video/mp4", [".mp4"]],
  ["video/webm", [".webm"]],
]);
const mimeExtensions = new Map([
  ["image/gif", [".gif"]],
  ["image/jpeg", [".jpeg", ".jpg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
]);

fs.mkdirSync(profileUploadDir, { recursive: true });
fs.mkdirSync(serviceUploadDir, { recursive: true });
fs.mkdirSync(verificationUploadDir, { recursive: true });
fs.mkdirSync(messageUploadDir, { recursive: true });

function createStorage(destinationDir, prefix = "image") {
  return multer.diskStorage({
    destination(_request, _file, callback) {
      callback(null, destinationDir);
    },
    filename(request, file, callback) {
      const extension = mimeExtensions.get(file.mimetype)?.[0] ?? ".jpg";
      const userId = String(request.user?.id ?? "user").replace(/[^a-zA-Z0-9_-]/g, "");
      const uniqueName = `${prefix}-${userId}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      callback(null, uniqueName);
    },
  });
}

function createImageUpload(
  storage,
  {
    allowedTypes = allowedImageTypes,
    fileSize = 6 * 1024 * 1024,
    files = 6,
    typeErrorMessage = "Only JPG, PNG, WEBP, and GIF images are allowed",
  } = {},
) {
  return multer({
    fileFilter(_request, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = mimeExtensions.get(file.mimetype) ?? [];

      if (!allowedTypes.has(file.mimetype) || !allowedExtensions.includes(extension)) {
        callback(new AppError(typeErrorMessage, 400));
        return;
      }

      callback(null, true);
    },
    limits: {
      files,
      fileSize,
    },
    storage,
  });
}

function createProfileMediaUpload({ fieldNames, fileSize, prefix, sizeErrorMessage }) {
  const uploader = multer({
    fileFilter(_request, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();
      const allowedExtensions = mimeExtensions.get(file.mimetype) ?? [];

      if (!allowedProfileImageTypes.has(file.mimetype) || !allowedExtensions.includes(extension)) {
        callback(new AppError("Please upload a JPG, PNG, or WebP image.", 400));
        return;
      }

      callback(null, true);
    },
    limits: {
      fileSize,
      files: 1,
    },
    storage: createStorage(profileUploadDir, prefix),
  });

  return function uploadSingleProfileMedia(request, response, next) {
    uploader.fields(fieldNames.map((name) => ({ maxCount: 1, name })))(request, response, async (error) => {
      const uploadedFiles = Object.values(request.files ?? {}).flat();

      try {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
          throw new AppError(sizeErrorMessage, 400);
        }

        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_COUNT") {
          throw new AppError("Upload one image at a time.", 400);
        }

        if (error instanceof multer.MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
          throw new AppError(`Upload the image using the ${fieldNames[0]} field.`, 400);
        }

        if (error) {
          throw error;
        }

        const uploadedFile = fieldNames
          .map((fieldName) => request.files?.[fieldName]?.[0])
          .find(Boolean);

        if (!uploadedFile) {
          throw new AppError("Image file is required", 400);
        }

        request.file = uploadedFile;
        await validateUploadedImageFile(uploadedFile);
        next();
      } catch (uploadError) {
        await removeUploadedFiles(uploadedFiles);
        next(uploadError);
      }
    });
  };
}

const profileUpload = createImageUpload(createStorage(profileUploadDir, "profile"), {
  allowedTypes: allowedProfileImageTypes,
  files: 1,
  typeErrorMessage: "Please upload a JPG, PNG, or WebP image.",
});
const serviceUpload = createImageUpload(createStorage(serviceUploadDir, "service"));
const verificationUpload = createImageUpload(createStorage(verificationUploadDir, "verification"));
const messageAttachmentUpload = multer({
  fileFilter(_request, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = allowedAttachmentTypes.get(file.mimetype) ?? [];

    if (!allowedExtensions.includes(extension)) {
      callback(new AppError("Allowed attachments: JPG, PNG, WEBP, GIF, PDF, TXT, MP4, and WEBM", 400));
      return;
    }

    callback(null, true);
  },
  limits: {
    files: 4,
    fileSize: 10 * 1024 * 1024,
  },
  storage: createStorage(messageUploadDir, "message"),
});

function hasValidImageSignature(file, header) {
  if (file.mimetype === "image/jpeg") {
    return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (file.mimetype === "image/gif") {
    const signature = header.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a";
  }

  if (file.mimetype === "image/webp") {
    return (
      header.subarray(0, 4).toString("ascii") === "RIFF" &&
      header.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

async function validateUploadedImageFile(file) {
  if (!file?.path) {
    throw new AppError("Image file is required", 400);
  }

  const handle = await fs.promises.open(file.path, "r");

  try {
    const header = Buffer.alloc(12);
    await handle.read(header, 0, header.length, 0);

    if (!hasValidImageSignature(file, header)) {
      throw new AppError("Uploaded file content does not match a valid image type", 400);
    }
  } finally {
    await handle.close();
  }
}

async function removeUploadedFile(file) {
  if (!file?.path) {
    return;
  }

  try {
    await fs.promises.unlink(file.path);
  } catch {
    // Ignore cleanup errors so the API returns the validation failure.
  }
}

async function removeUploadedFiles(files = []) {
  await Promise.all(files.map((file) => removeUploadedFile(file)));
}

export function uploadProfileImage(request, response, next) {
  profileUpload.single("image")(request, response, async (error) => {
    try {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        throw new AppError("Image must be smaller than 6MB", 400);
      }

      if (error) {
        throw error;
      }

      await validateUploadedImageFile(request.file);
      next();
    } catch (uploadError) {
      await removeUploadedFile(request.file);
      next(uploadError);
    }
  });
}

export const uploadAvatar = createProfileMediaUpload({
  fieldNames: ["avatar", "image"],
  fileSize: 3 * 1024 * 1024,
  prefix: "avatar",
  sizeErrorMessage: "Profile photo must be under 3MB.",
});

export const uploadCover = createProfileMediaUpload({
  fieldNames: ["cover", "image"],
  fileSize: 6 * 1024 * 1024,
  prefix: "cover",
  sizeErrorMessage: "Cover photo must be under 6MB.",
});

export function uploadServiceImages(request, response, next) {
  serviceUpload.array("images", 6)(request, response, async (error) => {
    try {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        throw new AppError("Each service image must be smaller than 6MB", 400);
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_COUNT") {
        throw new AppError("Upload up to 6 service images at a time", 400);
      }

      if (error) {
        throw error;
      }

      const files = request.files ?? [];

      if (files.length === 0) {
        throw new AppError("At least one service image is required", 400);
      }

      await Promise.all(files.map((file) => validateUploadedImageFile(file)));
      next();
    } catch (uploadError) {
      await removeUploadedFiles(request.files ?? []);
      next(uploadError);
    }
  });
}

export function uploadVerificationDocuments(request, response, next) {
  verificationUpload.array("documents", 4)(request, response, async (error) => {
    try {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        throw new AppError("Each verification image must be smaller than 6MB", 400);
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_COUNT") {
        throw new AppError("Upload up to 4 verification documents at a time", 400);
      }

      if (error) {
        throw error;
      }

      const files = request.files ?? [];

      if (files.length === 0) {
        throw new AppError("At least one verification document image is required", 400);
      }

      await Promise.all(files.map((file) => validateUploadedImageFile(file)));
      next();
    } catch (uploadError) {
      await removeUploadedFiles(request.files ?? []);
      next(uploadError);
    }
  });
}

export function uploadMessageAttachments(request, response, next) {
  messageAttachmentUpload.array("attachments", 4)(request, response, async (error) => {
    try {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        throw new AppError("Each attachment must be smaller than 10MB", 400);
      }

      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_COUNT") {
        throw new AppError("Upload up to 4 attachments at a time", 400);
      }

      if (error) {
        throw error;
      }

      const files = request.files ?? [];

      if (files.length === 0) {
        throw new AppError("At least one attachment is required", 400);
      }

      await Promise.all(
        files
          .filter((file) => allowedImageTypes.has(file.mimetype))
          .map((file) => validateUploadedImageFile(file)),
      );
      next();
    } catch (uploadError) {
      await removeUploadedFiles(request.files ?? []);
      next(uploadError);
    }
  });
}
