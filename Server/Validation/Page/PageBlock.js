import { z } from "zod";
const PageBlockSchema = z.object({
  id: z.string(),
  type: z.enum([
    "hero",
    "text",
    "features",
    "gallery",
    "cta",
    "testimonials",
    "team",
    "contact",
    "custom",
  ]),
  order: z.number(),
  data: z.any(),
});

export const validatePageBlock = (req, res, next) => {
  try {
    PageBlockSchema.parse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
