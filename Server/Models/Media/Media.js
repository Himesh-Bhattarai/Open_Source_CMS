
const MediaSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        width: Number,
        height: Number,
        url: { type: String, required: true },
        altText: String,
        folder: String,
        uploadedBy: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "media",
    },
)

MediaSchema.index({ tenantId: 1 })
MediaSchema.index({ tenantId: 1, folder: 1 })

export const Media = models.Media || model("Media", MediaSchema)