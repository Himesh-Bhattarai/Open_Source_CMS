import { z} from 'zod';

export const ActivityLogSchema = z.object({
    tenantId: z.string(),
    userId: z.string().optional(),
    action: z.enum(["create", "update", "delete", "publish", "unpublish", "login", "logout"]),
    entityType: z.enum(["page", "blog", "menu", "footer", "media", "user", "theme", "collection"]),
    entityId: z.string(),
    details: z.any(),
    ipAddress: z.string(),
    userAgent: z.string(),
});