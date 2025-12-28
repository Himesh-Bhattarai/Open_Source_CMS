import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
const BlogPostSchema = new Schema(
    {
        tenantId: { type: String, required: true, ref: "Tenant" },
        title: { type: String, required: true },
        slug: { type: String, required: true },
        content: { type: String, required: true },
        excerpt: String,
        featuredImage: String,
        authorId: { type: String, ref: "User" },
        categoryId: { type: String, ref: "BlogCategory" },
        tags: [String],
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
            ogImage: String,
        },
        status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft" },
        publishedAt: Date,
        scheduledAt: Date,
        views: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        collection: "blog_posts",
    },
)

BlogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true })
BlogPostSchema.index({ tenantId: 1, status: 1 })
BlogPostSchema.index({ tenantId: 1, publishedAt: -1 })

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema)