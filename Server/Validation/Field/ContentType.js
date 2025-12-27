import {z} from 'zon'
const ContentTypeSchema = z.object({
    tenantId: z.string(),
    name: z.string().min(3).max(50),
    slug: z.string().min(3).max(50),
    fields: z.array(z.any()),
    icon: z.string().optional(),
    description: z.string().optional(),
    isSystem: z.boolean().default(false),
});

export const validateContentType = (req, res, next)=>{
    try{
        ContentTypeSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}