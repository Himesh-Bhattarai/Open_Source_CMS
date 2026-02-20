import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ApiKeySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: String },
    keyHash: { type: String, required: true, index: true, unique: true },
    keyPreview: { type: String, default: "" },
    permissions: { type: [String], default: ["read:pages"] },
    isActive: { type: Boolean, default: true },
    name: { type: String },
  },
  { timestamps: true },
);

export const ApiKey = models.ApiKey || model("ApiKey", ApiKeySchema);
