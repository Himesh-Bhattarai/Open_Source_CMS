import {z} from "zod";
const FooterBlockSchema = z.object({
    tenantId: z.string(),
    title: z.string().min(3).max(50),
    slug: z.string().min(3).max(50),
    description: z.string().optional(),
    body: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published"]).default("draft"),
});

export const validateFooterBlock = (req,res,next)=>{
    try{
        FooterBlockSchema.parse(req.body)
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}