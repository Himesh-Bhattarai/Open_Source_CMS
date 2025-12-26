import {z} from 'zod';

export const PageBlockSchema = z.object({
    id: z.string(),
    type: z.enum(["hero", "text", "features", "gallery", "cta", "testimonials", "team", "contact", "custom"]),
    order: z.number(),
    data: z.any(),
})