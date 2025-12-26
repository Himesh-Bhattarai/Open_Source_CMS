import {z} from 'zod';
export const MenuSchema = z.object({
    tenantId: z.string(),
    name: z.string().min(3).max(50),
    location: z.enum(["header", "footer", "mobile", "sidebar"]),
    items: z.array(z.any()),
    status: z.enum(["draft", "published"]).default("draft"),
})