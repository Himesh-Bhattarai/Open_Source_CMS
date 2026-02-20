import { z } from "zod";

const VersionSchema = z.object({
  tenantId: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  data: z.any(),
  createdBy: z.string().optional(),
  userId: z.string().optional(),
});

export const validateVersion = (req, res, next) => {
  try {
    const parsed = VersionSchema.parse(req.body);
    if (!parsed.createdBy && !parsed.userId) {
      const err = new Error("Either createdBy or userId is required");
      err.statusCode = 400;
      throw err;
    }
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
