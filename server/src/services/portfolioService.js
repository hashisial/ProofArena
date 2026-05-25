import { Portfolio } from "../models/Portfolio.js";
import { AppError } from "../utils/AppError.js";
import { getOwnerFilter } from "../utils/ownerScope.js";
import { ensureDatabaseConnection } from "./databaseService.js";

export async function findPortfolioItems({ userId } = {}) {
  ensureDatabaseConnection();

  return Portfolio.find(getOwnerFilter(userId)).sort({ createdAt: -1 }).lean();
}

export async function findPortfolioItemById(id, { userId } = {}) {
  ensureDatabaseConnection();

  const portfolioItem = await Portfolio.findOne({
    _id: id,
    ...getOwnerFilter(userId),
  }).lean();

  if (!portfolioItem) {
    throw new AppError("Portfolio item not found", 404);
  }

  return portfolioItem;
}

export async function createPortfolioRecord(portfolioData, { userId } = {}) {
  ensureDatabaseConnection();

  return Portfolio.create({
    ...portfolioData,
    userId: userId ?? null,
  });
}
