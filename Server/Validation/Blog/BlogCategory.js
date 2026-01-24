import { z } from "zod";

const BlogCategorySchema = z.object({
  tenantId: z.string(),
  name: z.string().min(3).max(50),
  slug: z.string().min(3).max(50),
  description: z.string().optional(),
  postCount: z.number().default(0),
});

export const validateBlogCategory = (req, res, next) => {
  try {
    BlogCategorySchema.parse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
