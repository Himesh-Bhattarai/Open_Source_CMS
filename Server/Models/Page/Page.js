import { Schema, model, models } from "mongoose"

const PageSchema = new Schema(
    {
        _id: { type: String, required: true },
        tenantId: { type: String, required: true, ref: "Tenant" },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        blocks: [PageBlockSchema],
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
            ogImage: String,
            noIndex: { type: Boolean, default: false },
        },
        status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
        publishedAt: Date,
        publishedBy: { type: String, ref: "User" },
        authorId: { type: String, ref: "User" },
    },
    {
        timestamps: true,
        collection: "pages",
    },
)

PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true })
PageSchema.index({ tenantId: 1, status: 1 })

export const Page = models.Page || model("Page", PageSchema)