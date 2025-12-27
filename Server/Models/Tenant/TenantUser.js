import { Schema, model, models } from "mongoose"

const TenantUserSchema = new Schema(
    {
        tenantId: { type: String, required: true, ref: "Tenant" },
        userId: { type: String, required: true, ref: "User" },
        role: { type: String, enum: ["owner", "manager", "editor", "viewer"], required: true },
        invitedBy: { type: String, ref: "User" },
        invitedAt: { type: Date, default: Date.now },
        acceptedAt: Date,
    },
    {
        timestamps: true,
        collection: "tenant_users",
    },
)

TenantUserSchema.index({ tenantId: 1, userId: 1 }, { unique: true })
TenantUserSchema.index({ tenantId: 1 })

export const TenantUser = models.TenantUser || model("TenantUser", TenantUserSchema)