import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    content: String,

    attachments: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    replyTo: {
      type: Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    seenBy: [
      {
        user: {
          type: Types.ObjectId,
          ref: "User",
          required: true,
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String,
      siteName: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.models.Message || model("Message", schema);