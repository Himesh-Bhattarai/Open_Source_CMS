import {z} from 'zod';

export const BlogCategorySchema = z.object({
    tenantId: z.string(),
    name: z.string().min(3).max(50),
    slug: z.string().min(3).max(50),
    description: z.string().optional(),
    postCount: z.number().default(0),
})