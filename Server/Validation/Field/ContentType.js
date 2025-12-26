import {z} from 'zon'

export const ContentTypeSchema = z.object({
    tenantId: z.string(),
    name: z.string().min(3).max(50),
    slug: z.string().min(3).max(50),
    fields: z.array(z.any()),
    icon: z.string().optional(),
    description: z.string().optional(),
    isSystem: z.boolean().default(false),
});