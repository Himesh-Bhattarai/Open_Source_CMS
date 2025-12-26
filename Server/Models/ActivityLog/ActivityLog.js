import { Schema, model, models } from "mongoose"

const ActivityLogSchema = new Schema(
    {
        tenantId: { type: String, required: true, ref: "Tenant" },
        userId: { type: String, ref: "User" },
        action: {
            type: String,
            enum: ["create", "update", "delete", "publish", "unpublish", "login", "logout"],
            required: true,
        },
        entityType: {
            type: String,
            enum: ["page", "blog", "menu", "footer", "media", "user", "theme", "collection"],
            required: true,
        },
        entityId: String,
        details: Schema.Types.Mixed,
        ipAddress: String,
        userAgent: String,
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "activity_logs",
    },
)

ActivityLogSchema.index({ tenantId: 1, createdAt: -1 })
ActivityLogSchema.index({ entityType: 1, entityId: 1 })

export const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema)