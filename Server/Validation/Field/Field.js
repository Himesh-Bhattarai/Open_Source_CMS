import {z } from 'zod';

export const FieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["text", "textarea", "richtext", "number", "date", "boolean", "image", "file", "select", "relation"]),
    required: z.boolean(),
    order: z.number(),
    options: z.any(),
});
