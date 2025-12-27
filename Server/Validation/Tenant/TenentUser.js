import {z} from 'zod';


 const TenantUserSchema = z.object({
   tenantId: z.string(),
   userId: z.string(),
   role: z.enum(["admin", "web-owner"]).default("web-owner"),
   invitedBy: z.string().optional(),
   invitedAt: z.date().optional(),
   acceptedAt: z.date().optional(),
});

export const validateTenantUser = (req, res, next)=>{
   try{
      TenantUserSchema.safeParse(req.body);
      next();
   }catch(err){
      err.statusCode = err.statusCode || 400;
      next(err)
   }
}