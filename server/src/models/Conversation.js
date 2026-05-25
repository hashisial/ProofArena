import mongoose from "mongoose";

function normalizeParticipants(participants) {
  if (!Array.isArray(participants)) {
    return [];
  }

  const uniqueIds = new Set(
    participants
      .map((participant) => participant?.toString?.() ?? String(participant ?? ""))
      .filter(Boolean),
  );

  return Array.from(uniqueIds).map((participantId) =>
    new mongoose.Types.ObjectId(participantId),
  );
}

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "support", "project"],
      default: "direct",
      index: true,
    },
    kind: {
      type: String,
      enum: ["direct", "support", "project"],
      default: "direct",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    relatedProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    directKey: {
      type: String,
      default: "",
      trim: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      set: normalizeParticipants,
      validate: {
        message: "Conversation requires at least two participants",
        validator: (participants) => Array.isArray(participants) && participants.length >= 2,
      },
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    unreadCounts: {
      type: Map,
      of: {
        type: Number,
        min: 0,
        default: 0,
      },
      default: () => ({}),
    },
    isArchivedFor: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      set: normalizeParticipants,
    },
    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      index: true,
    },
    subject: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    supportStatus: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.pre("validate", function normalizeConversationType() {
  if (this.kind !== this.type) {
    if (this.isModified("kind")) {
      this.type = this.kind;
    } else {
      this.kind = this.type;
    }
  }

  if (this.type === "direct" && Array.isArray(this.participants) && this.participants.length !== 2) {
    throw new Error("Direct conversation must have exactly two participants");
  }

  if (this.type === "direct" && Array.isArray(this.participants) && this.participants.length === 2) {
    this.directKey = this.participants
      .map((participant) => participant.toString())
      .sort()
      .join(":");
  } else {
    this.directKey = "";
  }
});

conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ updatedAt: -1 });
conversationSchema.index({ type: 1, lastMessageAt: -1 });
conversationSchema.index({ kind: 1, supportStatus: 1, priority: 1, updatedAt: -1 });
conversationSchema.index(
  { directKey: 1 },
  {
    partialFilterExpression: { directKey: { $type: "string", $gt: "" } },
    unique: true,
  },
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
