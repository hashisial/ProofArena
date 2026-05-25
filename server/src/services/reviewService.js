import { Review } from "../models/Review.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";
import mongoose from "mongoose";

function assertObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(`${label} is invalid`, 400);
  }
}

export async function findApprovedReviews() {
  ensureDatabaseConnection();

  return Review.find({
    projectId: null,
    status: "approved",
    targetUserId: null,
  })
    .sort({ featured: -1, createdAt: -1 })
    .lean();
}

export async function findAllReviews() {
  ensureDatabaseConnection();

  return Review.find().sort({ createdAt: -1 }).lean();
}

export async function findReviewsForUser(userId) {
  ensureDatabaseConnection();

  return Review.find({
    $or: [
      { reviewerId: userId },
      { targetUserId: userId },
      { userId },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function findReviewsByService(serviceId) {
  ensureDatabaseConnection();
  assertObjectId(serviceId, "Service id");

  return Review.find({
    serviceId,
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();
}

export async function findReviewsByProvider(providerId) {
  ensureDatabaseConnection();
  assertObjectId(providerId, "Provider id");

  return Review.find({
    $or: [
      { providerId },
      { targetUserId: providerId },
    ],
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();
}

export async function createReviewForUser(user, reviewData) {
  ensureDatabaseConnection();

  return Review.create({
    authorName: reviewData.authorName || user.name,
    comment: reviewData.comment ?? reviewData.description,
    description: reviewData.description,
    heading: reviewData.heading,
    image: reviewData.image ?? "",
    projectId: reviewData.projectId ?? null,
    providerId: reviewData.providerId ?? reviewData.targetUserId ?? null,
    rating: reviewData.rating ?? reviewData.stars ?? 5,
    reviewerId: user.id,
    serviceId: reviewData.serviceId ?? null,
    stars: reviewData.stars ?? 5,
    status: "pending",
    targetUserId: reviewData.targetUserId ?? null,
    userId: user.id,
  });
}

export async function createReviewRecord(reviewData) {
  ensureDatabaseConnection();

  return Review.create({
    ...reviewData,
    status: reviewData.status ?? "approved",
  });
}

export async function updateReviewRecord(id, reviewData) {
  ensureDatabaseConnection();

  const review = await Review.findByIdAndUpdate(id, reviewData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  return review;
}

export async function deleteReviewRecord(id) {
  ensureDatabaseConnection();

  const review = await Review.findByIdAndDelete(id).lean();

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  return review;
}
