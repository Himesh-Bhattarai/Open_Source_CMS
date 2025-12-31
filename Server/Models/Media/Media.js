import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const MediaSchema = new Schema(
    {
        _id: { type: String, },
        tenantId: { type: String,  ref: "Tenant" },
        filename: { type: String, },
        originalName: { type: String, },
        mimeType: { type: String, },
        size: { type: Number, },
        width: Number,
        height: Number,
        url: { type: String, },
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