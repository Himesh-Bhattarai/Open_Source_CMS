import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const TenantSchema = new Schema(
  {
    tenantId: { type: String, unique: true },
    userId: { type: String, ref: "User" },
    name: { type: String },
    domain: { type: String, unique: true, trim: true, lowercase: true },
    subdomain: String,
    ownerEmail: { type: String },
    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    settings: {
      siteName: String,
      timezone: String,
      language: String,
      dateFormat: String,
    },
    integrations: {
      pages: { type: Boolean, default: false },
      footer: { type: Boolean, default: false },
      navbar: { type: Boolean, default: false },
      theme: { type: Boolean, default: false },
      seo: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    collection: "tenants",
  },
);

TenantSchema.pre("save", function (next) {
  if (!this.tenantId) {
    this.tenantId = this._id.toString();
  }
  next();
});

export const Tenant = models.Tenant || model("Tenant", TenantSchema);
