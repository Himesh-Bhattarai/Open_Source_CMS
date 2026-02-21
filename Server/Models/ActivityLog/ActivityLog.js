import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ActivityLogSchema = new Schema(
  {
    tenantId: { type: String, ref: "Tenant" },
    userId: { type: String, ref: "User" },
    action: {
      type: String,
      enum: ["create", "update", "delete", "publish", "unpublish", "login", "logout"],
    },
    entityType: {
      type: String,
      enum: ["page", "blog", "menu", "footer", "media", "user", "theme", "collection"],
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
);

ActivityLogSchema.index({ tenantId: 1, createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

export const ActivityLog = models.ActivityLog || model("ActivityLog", ActivityLogSchema);
