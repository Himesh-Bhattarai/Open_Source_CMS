import mongoose from "mongoose";
const { Schema, model, models } = mongoose;
// Blog Category Schema
const BlogCategorySchema = new Schema(
  {
    tenantId: { type: String, ref: "Tenant" },
    name: { type: String },
    slug: { type: String },
    description: String,
    postCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "blog_categories",
  },
);

BlogCategorySchema.index({ tenantId: 1, slug: 1 }, { unique: true });

export const BlogCategory =
  models.BlogCategory || model("BlogCategory", BlogCategorySchema);
