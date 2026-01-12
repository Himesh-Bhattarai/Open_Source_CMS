import mongoose from "mongoose"
const { Schema, model, models } = mongoose

const BlogPostSchema = new Schema(
    {
        tenantId: { type: String, required: true, index: true },
        authorId: { type: String, required: true },

        title: { type: String, default: "" },
        slug: { type: String, default: "" },
        excerpt: { type: String, default: "" },
        content: { type: String, default: "" },

        featuredImage: { type: String, default: null },

        category: { type: String, default: "Development" },
        tags: { type: [String], default: [] },

        author: { type: String, default: "Admin" },

        status: {
            type: String,
            enum: ["draft", "published", "scheduled"],
            default: "draft",
        },

        publishDate: { type: Date, default: null },

        seo: {
            metaTitle: { type: String, default: "" },
            metaDescription: { type: String, default: "" },
            focusKeyword: { type: String, default: "" },
        },

        settings: {
            featured: { type: Boolean, default: false },
            allowComments: { type: Boolean, default: true },
            showAuthor: { type: Boolean, default: true },
        },

        views: { type: Number, default: 0 },
    },
    { timestamps: true, collection: "blog_posts" }
)

BlogPostSchema.index({ tenantId: 1, slug: 1 }, { unique: true })

export const BlogPost = models.BlogPost || model("BlogPost", BlogPostSchema)
