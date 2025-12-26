
// Blog Category Schema
const BlogCategorySchema = new Schema(
    {
        tenantId: { type: String, required: true, ref: "Tenant" },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: String,
        postCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        collection: "blog_categories",
    },
)

BlogCategorySchema.index({ tenantId: 1, slug: 1 }, { unique: true })

export const BlogCategory = models.BlogCategory || model("BlogCategory", BlogCategorySchema)
