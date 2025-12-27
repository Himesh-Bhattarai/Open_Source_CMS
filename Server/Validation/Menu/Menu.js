import {z} from 'zod';
 const MenuSchema = z.object({
    tenantId: z.string(),
    name: z.string().min(3).max(50),
    location: z.enum(["header", "footer", "mobile", "sidebar"]),
    items: z.array(z.any()),
    status: z.enum(["draft", "published"]).default("draft"),
})

export const validateMenu = (req, res, next) =>{
    try{
        MenuSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}