import {z} from 'zod';

export const MenuItemSchema = z.object({
    label: z.string(),
    type: z.enum(["internal", "external", "dropdown"]),
    link: z.string().optional(),
    enabled: z.boolean().default(true),
    order: z.number(),
    children: z.array(z.any()).optional(),
})