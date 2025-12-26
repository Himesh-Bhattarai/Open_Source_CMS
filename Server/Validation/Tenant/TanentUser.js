import {z} from 'zod';


export const TenantUserSchema = z.object({
   tenantId: z.string(),
   userId: z.string(),
   role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
   invitedBy: z.string().optional(),
   invitedAt: z.date().optional(),
   acceptedAt: z.date().optional(),
});