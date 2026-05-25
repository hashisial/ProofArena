import { Blog } from "../models/Blog.js";
import { AppError } from "../utils/AppError.js";
import { ensureDatabaseConnection } from "./databaseService.js";

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBlogData(blogData) {
  const slug = slugify(blogData.slug || blogData.title);

  if (!slug) {
    throw new AppError("Article slug or title is required", 400);
  }

  return {
    ...blogData,
    mediaType: blogData.mediaUrl ? blogData.mediaType || "image" : "none",
    slug,
    tags: normalizeList(blogData.tags),
  };
}

export async function findPublishedBlogs({ placement } = {}) {
  ensureDatabaseConnection();

  const filter = { status: "published" };

  if (placement) {
    filter.placement = placement;
  }

  return Blog.find(filter).sort({ createdAt: -1 }).lean();
}

export async function findAllBlogs() {
  ensureDatabaseConnection();

  return Blog.find().sort({ createdAt: -1 }).lean();
}

export async function findBlogBySlug(slug) {
  ensureDatabaseConnection();

  const blog = await Blog.findOne({
    slug: slugify(slug),
    status: "published",
  }).lean();

  if (!blog) {
    throw new AppError("Article not found", 404);
  }

  return blog;
}

export async function createBlogRecord(blogData) {
  ensureDatabaseConnection();

  return Blog.create(normalizeBlogData(blogData));
}

export async function updateBlogRecord(id, blogData) {
  ensureDatabaseConnection();

  const blog = await Blog.findByIdAndUpdate(id, normalizeBlogData(blogData), {
    new: true,
    runValidators: true,
  }).lean();

  if (!blog) {
    throw new AppError("Article not found", 404);
  }

  return blog;
}

export async function deleteBlogRecord(id) {
  ensureDatabaseConnection();

  const blog = await Blog.findByIdAndDelete(id).lean();

  if (!blog) {
    throw new AppError("Article not found", 404);
  }

  return blog;
}
