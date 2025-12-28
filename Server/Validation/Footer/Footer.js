import {z} from 'zod'
 const FooterSchema = z.object({
    tenantId: z.string(),
    layout: z.enum(["2-column", "3-column", "4-column", "custom"]),
    bottomBar: z.object({
        copyright: z.string(),
        socialLinks: z.array(z.object({
            platform: z.string(),
            url: z.string(),
            icon: z.string(),
        })),
    }),
    status: z.enum(["draft", "published"]).default("draft"),
})

export const validateFooter = (req, res, next)=>{
    try{
        FooterSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}