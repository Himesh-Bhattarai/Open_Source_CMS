import {z} from 'zod';

 const MenuItemSchema = z.object({
    label: z.string(),
    type: z.enum(["internal", "external", "dropdown"]),
    link: z.string().optional(),
    enabled: z.boolean().default(true),
    order: z.number(),
    children: z.array(z.any()).optional(),
})

export const validateMenuItem = (req, res, next)=>{
    try{
        MenuItemSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}