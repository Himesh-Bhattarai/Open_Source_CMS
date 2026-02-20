import { z } from "zod";

const TenantUserSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  role: z.enum(["admin", "web-owner"]).default("web-owner"),
  invitedBy: z.string().optional(),
  invitedAt: z.date().optional(),
  acceptedAt: z.date().optional(),
});

export const validateTenantUser = (req, res, next) => {
  try {
    const result = TenantUserSchema.safeParse(req.body);
    if (!result.success) {
      const err = new Error("Invalid tenant-user payload");
      err.statusCode = 400;
      throw err;
    }
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
