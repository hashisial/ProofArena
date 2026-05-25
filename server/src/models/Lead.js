import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    industry: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      enum: ["manual", "contact_form", "csv_import", "scrape"],
      default: "manual",
      index: true,
    },
    sourceKeyword: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "closed", "lost"],
      default: "new",
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    service: {
      type: String,
      default: "Manual Lead",
      trim: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

leadSchema.pre("validate", function syncLegacyName() {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }
});

leadSchema.index({ email: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ userId: 1, createdAt: -1 });
leadSchema.index({ userId: 1, status: 1, createdAt: -1 });
leadSchema.index({ userId: 1, source: 1, createdAt: -1 });

export const Lead = mongoose.model("Lead", leadSchema);
