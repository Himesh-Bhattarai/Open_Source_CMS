import {z} from 'zod';

export const WebhookSchema = z.object({
    tenantId: z.string(),
    url: z.string(),
    events: z.array(z.enum(["page.created", "page.updated", "page.published", "blog.created", "blog.updated", "blog.published", "menu.updated", "footer.updated"])),
    secret: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
    lastTriggered: z.date().optional(),
    failureCount: z.number().default(0),
})