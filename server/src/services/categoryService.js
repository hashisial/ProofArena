import mongoose from "mongoose";
import { Category } from "../models/Category.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

export const defaultMarketplaceCategories = Object.freeze([
  {
    description: "Lead capture, qualification, funnels, and conversion systems for growth teams.",
    icon: "LG",
    name: "Lead Generation",
    slug: "lead-generation",
  },
  {
    description: "Live chat, email handling, help desk workflows, and customer response operations.",
    icon: "CS",
    name: "Customer Support",
    slug: "customer-support",
  },
  {
    description: "Web3-native support, community moderation, ticket handling, and crypto operations.",
    icon: "CR",
    name: "Crypto Support",
    slug: "crypto-support",
  },
  {
    description: "Modern websites, landing pages, CMS builds, and performance-focused web experiences.",
    icon: "WD",
    name: "Website Development",
    slug: "website-development",
  },
  {
    description: "Mobile and web application builds with scalable product architecture.",
    icon: "AD",
    name: "App Development",
    slug: "app-development",
  },
  {
    description: "SaaS platforms, dashboards, subscription products, and multi-tenant systems.",
    icon: "SD",
    name: "SaaS Development",
    slug: "saas-development",
  },
  {
    description: "Administrative support, scheduling, research, inbox management, and operations help.",
    icon: "VA",
    name: "Virtual Assistant",
    slug: "virtual-assistant",
  },
  {
    description: "Real estate lead systems, admin workflows, CRM cleanup, and agent support.",
    icon: "RE",
    name: "Real Estate Support",
    slug: "real-estate-support",
  },
  {
    description: "Automated workflows, integrations, CRM logic, and repeatable operations systems.",
    icon: "AU",
    name: "Automation",
    slug: "automation",
  },
  {
    description: "Outbound systems, email campaigns, sales workflows, and outreach operations.",
    icon: "SO",
    name: "Sales & Outreach",
    slug: "sales-outreach",
  },
]);

function createSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function serializeCategory(category) {
  if (!category) {
    return null;
  }

  return {
    _id: category._id?.toString?.() ?? category.id,
    createdAt: category.createdAt,
    description: category.description ?? "",
    icon: category.icon ?? "",
    isActive: Boolean(category.isActive),
    name: category.name ?? "",
    parentCategory: category.parentCategory
      ? {
          _id: category.parentCategory._id?.toString?.() ?? category.parentCategory.toString?.(),
          name: category.parentCategory.name ?? "",
          slug: category.parentCategory.slug ?? "",
        }
      : null,
    slug: category.slug ?? "",
    updatedAt: category.updatedAt,
  };
}

async function ensureDefaultCategories() {
  await Promise.all(
    defaultMarketplaceCategories.map((category, index) =>
      Category.updateOne(
        { slug: category.slug },
        {
          $setOnInsert: {
            ...category,
            createdAt: new Date(Date.now() + index),
            isActive: true,
          },
        },
        { upsert: true },
      ),
    ),
  );
}

async function assertParentCategory(parentCategoryId, currentCategoryId = "") {
  if (!parentCategoryId) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(parentCategoryId)) {
    throw new AppError("Parent category is invalid", 400);
  }

  if (String(parentCategoryId) === String(currentCategoryId)) {
    throw new AppError("A category cannot be its own parent", 400);
  }

  const parentCategory = await Category.findById(parentCategoryId);

  if (!parentCategory) {
    throw new AppError("Parent category not found", 404);
  }

  return parentCategory._id;
}

function normalizeCategoryPayload(payload = {}, { isUpdate = false } = {}) {
  const normalized = {};

  if (!isUpdate || payload.name !== undefined) {
    const name = String(payload.name ?? "").trim();

    if (name.length < 2) {
      throw new AppError("Category name must be at least 2 characters", 400);
    }

    normalized.name = name;
  }

  if (payload.slug !== undefined || (!isUpdate && payload.name)) {
    const slug = createSlug(payload.slug || payload.name);

    if (slug.length < 2) {
      throw new AppError("Category slug is invalid", 400);
    }

    normalized.slug = slug;
  }

  if (payload.description !== undefined) {
    normalized.description = String(payload.description ?? "").trim().slice(0, 500);
  }

  if (payload.icon !== undefined) {
    normalized.icon = String(payload.icon ?? "").trim().slice(0, 32);
  }

  if (payload.isActive !== undefined) {
    normalized.isActive = Boolean(payload.isActive);
  }

  return normalized;
}

export async function listMarketplaceCategories({ includeInactive = false } = {}) {
  ensureDatabaseConnection();
  await ensureDefaultCategories();

  const query = includeInactive ? {} : { isActive: true };
  const categories = await Category.find(query)
    .populate("parentCategory", "name slug")
    .sort({ parentCategory: 1, name: 1 })
    .lean();

  return {
    items: categories.map(serializeCategory),
  };
}

export async function findMarketplaceCategoryBySlug(slug) {
  ensureDatabaseConnection();
  await ensureDefaultCategories();

  const categorySlug = createSlug(slug);

  if (!categorySlug) {
    throw new AppError("Category slug is required", 400);
  }

  const category = await Category.findOne({
    isActive: true,
    slug: categorySlug,
  })
    .populate("parentCategory", "name slug")
    .lean();

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return serializeCategory(category);
}

export async function createMarketplaceCategory(payload = {}) {
  ensureDatabaseConnection();

  const categoryData = normalizeCategoryPayload(payload);
  categoryData.parentCategory = await assertParentCategory(payload.parentCategory);

  try {
    const category = await Category.create(categoryData);
    const populatedCategory = await Category.findById(category._id)
      .populate("parentCategory", "name slug")
      .lean();

    return serializeCategory(populatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Category slug already exists", 409);
    }

    throw error;
  }
}

export async function updateMarketplaceCategory(categoryId, payload = {}) {
  ensureDatabaseConnection();

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Category id is invalid", 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const updates = normalizeCategoryPayload(payload, { isUpdate: true });

  Object.assign(category, updates);

  if (payload.parentCategory !== undefined) {
    category.parentCategory = await assertParentCategory(payload.parentCategory, category._id);
  }

  try {
    await category.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Category slug already exists", 409);
    }

    throw error;
  }

  const populatedCategory = await Category.findById(category._id)
    .populate("parentCategory", "name slug")
    .lean();

  return serializeCategory(populatedCategory);
}

export async function deleteMarketplaceCategory(categoryId) {
  ensureDatabaseConnection();

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError("Category id is invalid", 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await Category.updateMany({ parentCategory: category._id }, { $set: { parentCategory: null } });
  await category.deleteOne();

  return serializeCategory(category.toObject());
}
