import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const TenantSchema = new Schema(
  {
    tenantId: { type: String, unique: true },
    userId: { type: String, ref: "User" },
    name: { type: String, },
    domain: { type: String, unique: true },
    subdomain: String,
    apiKey: { type: String, unique: true },
    ownerEmail: { type: String, },
    status: { type: String, enum: ["active", "suspended", "inactive"], default: "active" },
    plan: { type: String, enum: ["free", "starter", "pro", "enterprise"], default: "free" },
    settings: {
      siteName: String,
      timezone: String,
      language: String,
      dateFormat: String,
    },
  },
  {
    timestamps: true,
    collection: "tenants",
  },
)

export const Tenant = models.Tenant || model("Tenant", TenantSchema)