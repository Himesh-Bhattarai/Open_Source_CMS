import mongoose from "mongoose";
import crypto from "crypto";

const { Schema, model, models } = mongoose;

const ApiKeySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true }, // link to tenant
    keyHash: { type: String, required: true }, // hashed API key
    permissions: { type: [String], default: ["read:pages"] }, // feature permissions
    isActive: { type: Boolean, default: true }, // active/inactive
    name: { type: String }, // optional: key label for UI
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to hash raw API key if provided
ApiKeySchema.pre("save", function (next) {
  if (this.apiKeyRaw) {
    // temporary field for raw key
    this.keyHash = crypto
      .createHash("sha256")
      .update(this.apiKeyRaw)
      .digest("hex");
    delete this.apiKeyRaw; // remove temporary raw key
  }
  next();
});

// Method to validate incoming API key
ApiKeySchema.methods.validateKey = function (rawKey) {
  const hash = crypto.createHash("sha256").update(rawKey).digest("hex");
  return hash === this.keyHash && this.isActive;
};

export const ApiKey = models.ApiKey || model("ApiKey", ApiKeySchema);
