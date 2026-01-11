import mongoose from "mongoose";
const { Schema, model, models } = mongoose; 

export const PageSchema = new Schema({
    tenantId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },

    // Phase-1 content
    pageTree: { type: Schema.Types.Mixed, required: true },

    // Phase-1 locked SEO
    seo: {
        keywords: [String],
        noIndex: { type: Boolean, default: false },

        // Phase-2 editable
        metaTitle: String,
        metaDescription: String,
        canonicalUrl: String,
        ogImage: String,
        openGraph: {
            title: String,
            description: String,
            image: String,
            type: { type: String, default: "website" }
        },
        twitter: {
            card: { type: String, default: "summary_large_image" },
            title: String,
            description: String,
            image: String
        },
        structuredData: Schema.Types.Mixed
    },

    settings: {
        pageType: { type: String, default: "default" },
        visibility: { type: String, default: "public" },
        featured: { type: Boolean, default: false },
        allowComments: { type: Boolean, default: true },
        template: { type: String, default: "default" },
        isHomepage: { type: Boolean, default: false }
    },

    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
    publishedAt: Date,

    authorId: { type: String, required: true },
    etag: {
        type: String,
        required: true,
        index: true
    },

}, { timestamps: true })


PageSchema.index({ tenantId: 1, slug: 1 }, { unique: true })
PageSchema.index({ tenantId: 1, status: 1 })

export const Page = models.Page || model("Page", PageSchema)