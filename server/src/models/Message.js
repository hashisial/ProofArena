import mongoose from "mongoose";
import { Conversation } from "./Conversation.js";

const attachmentTypes = ["image", "video", "document", "audio", "other"];
const messageTypes = ["text", "image", "file", "system"];

function normalizeObjectIdList(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  const uniqueIds = new Set(
    values
      .map((value) => value?.toString?.() ?? String(value ?? ""))
      .filter(Boolean),
  );

  return Array.from(uniqueIds).map((value) => new mongoose.Types.ObjectId(value));
}

const attachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: attachmentTypes,
      default: "other",
    },
    name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    fileName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 180,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
      maxlength: 240,
    },
    mimeType: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    fileType: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },
    size: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      index: true,
      set: normalizeObjectIdList,
    },
    text: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },
    type: {
      type: String,
      enum: messageTypes,
      default: "text",
      index: true,
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    readBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      index: true,
      set: normalizeObjectIdList,
    },
    deliveredTo: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      set: normalizeObjectIdList,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deletedFor: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
      set: normalizeObjectIdList,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.pre("validate", async function validateMessageMembership() {
  if (!this.conversationId || !this.senderId) {
    return;
  }

  const conversation = await Conversation.findById(this.conversationId)
    .select("participants isBlocked")
    .lean();

  if (!conversation) {
    throw new Error("Message must belong to a valid conversation");
  }

  const participantIds = (conversation.participants ?? []).map((participant) =>
    participant.toString(),
  );

  if (!participantIds.includes(this.senderId.toString())) {
    throw new Error("Message sender must be a conversation participant");
  }

  if (conversation.isBlocked) {
    throw new Error("This conversation is blocked");
  }

  if (!this.receiverIds?.length) {
    this.receiverIds = participantIds
      .filter((participantId) => participantId !== this.senderId.toString())
      .map((participantId) => new mongoose.Types.ObjectId(participantId));
  }
});

messageSchema.pre("validate", function requireTextOrAttachment() {
  if (!this.text && (!this.attachments || this.attachments.length === 0)) {
    throw new Error("Message requires text or at least one attachment");
  }
});

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, readBy: 1 });
messageSchema.index({ conversationId: 1, deletedFor: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
