import mongoose from "mongoose";

function createSlug(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 90,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 90,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
      maxlength: 32,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre("validate", function normalizeCategory() {
  if (!this.slug && this.name) {
    this.slug = createSlug(this.name);
  }

  if (this.slug) {
    this.slug = createSlug(this.slug);
  }
});

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ isActive: 1, name: 1 });
categorySchema.index({ parentCategory: 1, isActive: 1 });

export const Category = mongoose.model("Category", categorySchema);
