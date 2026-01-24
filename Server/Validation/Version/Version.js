import { z } from "zod";

const VersionSchema = z.object({
  tenantId: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  data: z.any(),
  createdBy: z.string(),
});

export const validateVersion = (req, res, next) => {
  try {
    VersionSchema.parse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
