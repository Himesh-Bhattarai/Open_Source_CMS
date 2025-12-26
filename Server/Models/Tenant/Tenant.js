
import { Schema, model, models } from "mongoose"
const TenantSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    subdomain: String,
    apiKey: { type: String, required: true, unique: true },
    ownerEmail: { type: String, required: true },
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

TenantSchema.index({ domain: 1 })
TenantSchema.index({ apiKey: 1 })

export const Tenant = models.Tenant || model("Tenant", TenantSchema)