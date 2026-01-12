import {z} from 'zod';

const BlogSchema = z.object({
    title: z.string().min(3).max(50).optional(),
    slug: z.string().min(3).max(50).optional(),
    description: z.string().optional(),
    body: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "published"]).default("draft"),
});


export const validateBlog = (req, res, next)=>{
    try{
        BlogSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}