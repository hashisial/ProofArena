import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const saltRounds = 12;
const roleValues = ["client", "provider", "admin"];
const accountStatusValues = ["active", "pending", "suspended", "deleted"];
const legacyRoleMap = {
  user: "client",
};

function createUsernameSeed(value) {
  const seed = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return seed || `user-${Date.now()}`;
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
      match: /^[a-z0-9._-]+$/,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: "",
      select: false,
    },
    refreshTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    refreshTokenHash: {
      type: String,
      default: "",
      select: false,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      default: "",
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },
    role: {
      type: String,
      enum: roleValues,
      default: "client",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: accountStatusValues,
      default: "active",
      index: true,
    },
    accountType: {
      type: String,
      enum: ["individual", "agency"],
      default: "individual",
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    adminPermissions: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      default: null,
      index: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    stripeConnectedAccountId: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stripeConnectStatus: {
      type: String,
      enum: ["not_started", "pending", "restricted", "active"],
      default: "not_started",
      index: true,
    },
    stripeConnectRequirementsDue: {
      type: [String],
      default: [],
    },
    stripeConnectOnboardedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("validate", function normalizeIdentityFields() {
  if (legacyRoleMap[this.role]) {
    this.role = legacyRoleMap[this.role];
  }

  if (this.isSuspended && this.accountStatus === "active") {
    this.accountStatus = "suspended";
  }

  if (["suspended", "deleted"].includes(this.accountStatus)) {
    this.isSuspended = true;
  }

  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }

  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }

  if (!this.username) {
    this.username = createUsernameSeed(this.email?.split("@")[0] || this.fullName || this.name);
  }

  const hasVerifiedEmail = Boolean(this.emailVerified || this.isEmailVerified || this.isVerified);

  if (hasVerifiedEmail) {
    this.emailVerified = true;
    this.isEmailVerified = true;
    this.isVerified = true;
  }

  if (hasVerifiedEmail && this.verificationStatus === "pending") {
    this.verificationStatus = "verified";
  }

  if (this.verificationStatus === "verified") {
    this.isEmailVerified = true;
    this.isVerified = true;
    this.emailVerified = true;
  }
});

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ refreshTokenHash: 1 });
userSchema.index({ accountStatus: 1, role: 1 });
userSchema.index({ emailVerificationToken: 1 });

export const User = mongoose.model("User", userSchema);
