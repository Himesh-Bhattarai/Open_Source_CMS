import { z } from "zod";

const TenantSchema = z
  .object({
    name: z.string().trim().max(80).optional(),
    domain: z.string().trim().max(120).optional(),
    ownerEmail: z.string().trim().max(120).optional(),
    status: z.enum(["active", "suspended", "inactive"]).optional(),
    plan: z.enum(["free", "starter", "pro", "enterprise"]).optional(),
    subdomain: z.string().trim().max(120).optional(),
    settings: z
      .object({
        siteName: z.string().trim().optional(),
        timezone: z.string().trim().optional(),
        language: z.string().trim().optional(),
        dateFormat: z.string().trim().optional(),
      })
      .optional(),
  })
  .passthrough();

export const validateTenant = (req, res, next) => {
  try {
    const result = TenantSchema.safeParse(req.body || {});
    if (!result.success) {
      const err = new Error("Invalid tenant payload");
      err.statusCode = 400;
      throw err;
    }

    req.body = result.data;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
