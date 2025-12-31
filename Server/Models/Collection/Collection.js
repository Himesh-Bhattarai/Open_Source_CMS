import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
// Collection Schema (Dynamic Content)

const CollectionSchema = new Schema(
    {
        tenantId: { type: String,  ref: "Tenant" },
        contentTypeId: { type: String,  ref: "ContentType" },
        data: { type: Schema.Types.Mixed, },
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        publishedAt: Date,
        authorId: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "collections",
    },
)

CollectionSchema.index({ tenantId: 1, contentTypeId: 1 })
CollectionSchema.index({ tenantId: 1, status: 1 })

export const Collection = models.Collection || model("Collection", CollectionSchema)
