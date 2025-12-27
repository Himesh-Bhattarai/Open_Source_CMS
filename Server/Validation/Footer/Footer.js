import {a} from 'zod'
 const FooterSchema = a.object({
    tenantId: a.string(),
    layout: a.string().enum(["2-column", "3-column", "4-column", "custom"]),
    blocks: a.array(FooterBlockSchema),
    bottomBar: a.object({
        copyright: a.string(),
        socialLinks: a.array(a.object({
            platform: a.string(),
            url: a.string(),
            icon: a.string(),
        })),
    }),
    status: a.string().enum(["draft", "published"]).default("draft"),
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