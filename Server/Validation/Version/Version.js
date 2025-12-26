import {z} from 'zod';

export const VersionSchema = z.object({
    tenantId: z.string(),
    entityType: z.string(),
    entityId: z.string(),
    data: z.any(),
    createdBy: z.string(),
})