import { z } from "zod";

const PageSchema = z.object({
  tenantId: z.string().optional(),
  title: z.string().min(3).max(50),
  slug: z.string().min(3).max(50),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    noIndex: z.boolean().default(false),
  }),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  publishedAt: z.date().optional(),
  publishedBy: z.string().optional(),
  authorId: z.string().optional(),
});

export const validatePage = (req, res, next) => {
  try {
    PageSchema.parse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
