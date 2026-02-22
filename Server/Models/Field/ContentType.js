import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
import { FieldSchema } from "./Field.js";
const ContentTypeSchema = new Schema(
  {
    _id: { type: String },
    tenantId: { type: String, ref: "Tenant" },
    name: { type: String },
    slug: { type: String },
    fields: [FieldSchema],
    icon: String,
    description: String,
    isSystem: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "content_types",
  },
);

ContentTypeSchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export const ContentType = models.ContentType || model("ContentType", ContentTypeSchema);
