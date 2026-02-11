import { z } from "zod";

export const validateSchema = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Schema validation failed: ${messages}`);
  }
  return result.data;
};

export const pageResponseSchema = z.object({
  data: z.any().optional(),
  pages: z.array(z.object({
    _id: z.any(),
    title: z.string().optional(),
    slug: z.string().optional(),
  })).optional(),
});

export const blogResponseSchema = z.object({
  blog: z.object({ _id: z.any() }).optional(),
  getMenu: z.any().optional(),
});

export const seoResponseSchema = z.object({
  data: z.any().optional(),
  getSeo: z.any().optional(),
});

export const menuResponseSchema = z.object({
  ok: z.boolean().optional(),
  menus: z.array(z.any()).optional(),
});
