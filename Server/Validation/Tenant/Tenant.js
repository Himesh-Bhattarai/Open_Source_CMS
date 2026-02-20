import { z } from "zod";

const TenantSchema = z.object({
  name: z.string().min(3).max(50),
  domain: z.string().min(3).max(50),
  ownerEmail: z.string().email(),
  status: z.enum(["active", "suspended", "inactive"]).default("active"),
  plan: z.enum(["free", "starter", "pro", "enterprise"]).default("free"),
  settings: z.object({
    siteName: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
    dateFormat: z.string().optional(),
  }),
});

export const validateTenant = (req, res, next) => {
  try {
    TenantSchema.safeParse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
