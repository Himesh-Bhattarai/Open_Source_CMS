
// Version History Schema
const VersionSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        entityType: { type: String, required: true },
        entityId: { type: String, required: true },
        data: { type: Schema.Types.Mixed, required: true },
        createdBy: { type: String, ref: "User" },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        collection: "versions",
    },
)

VersionSchema.index({ entityType: 1, entityId: 1, createdAt: -1 })

export const Version = models.Version || model("Version", VersionSchema)