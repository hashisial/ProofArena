import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const teamSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: {
      type: [teamMemberSchema],
      default: [],
    },
    permissions: {
      analytics: {
        type: Boolean,
        default: false,
      },
      billing: {
        type: Boolean,
        default: false,
      },
      campaigns: {
        type: Boolean,
        default: true,
      },
      leads: {
        type: Boolean,
        default: true,
      },
      scraper: {
        type: Boolean,
        default: true,
      },
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

teamSchema.index({ "members.userId": 1 });
teamSchema.index({ ownerId: 1, teamName: 1 });

export const Team = mongoose.model("Team", teamSchema);
