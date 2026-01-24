import { z } from "zod";

const ActivityLogSchema = z.object({
  tenantId: z.string(),
  userId: z.string().optional(),
  action: z.enum([
    "create",
    "update",
    "delete",
    "publish",
    "unpublish",
    "login",
    "logout",
  ]),
  entityType: z.enum([
    "page",
    "blog",
    "menu",
    "footer",
    "media",
    "user",
    "theme",
    "collection",
  ]),
  entityId: z.string(),
  details: z.any(),
  ipAddress: z.string(),
  userAgent: z.string(),
});

export const validateActivityLog = (req, res, next) => {
  try {
    ActivityLogSchema.parse(req.body);
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
