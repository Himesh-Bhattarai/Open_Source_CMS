import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
// Version History Schema
const VersionSchema = new Schema(
    {
        _id: { type: String },
        tenantId: { type: String, ref: "Tenant" },
        entityType: { type: String },
        entityId: { type: String },
        data: { type: Schema.Types.Mixed },
        createdBy: { type: String, ref: "User" },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "versions",
    },
)

VersionSchema.index({ entityType: 1, entityId: 1, createdAt: -1 })

export const Version = models.Version || model("Version", VersionSchema)