import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const MediaSchema = new Schema(
  {
    userId: { type: String, ref: "User" },
    tenantId: { type: String, ref: "Tenant" },
    scope: {
      type: String,
      enum: ["global", "page", "blog"],
      default: "global",
      index: true,
    },
    entityType: {
      type: String,
      enum: ["page", "blog", null],
      default: null,
      index: true,
    },
    entityId: { type: String, default: null, index: true },
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    status: {
      type: String,
      enum: ["ready", "uploading", "failed"],
      default: "ready",
    },
    width: Number,
    height: Number,
    url: { type: String },
    altText: String,
    folder: String,
    uploadedBy: { type: String, ref: "User" },
  },
  {
    timestamps: true,
    collection: "media",
  },
);

MediaSchema.index({ tenantId: 1 });
MediaSchema.index({ tenantId: 1, folder: 1 });
MediaSchema.index({ tenantId: 1, scope: 1, entityType: 1, entityId: 1 });

export const Media = models.Media || model("Media", MediaSchema);
