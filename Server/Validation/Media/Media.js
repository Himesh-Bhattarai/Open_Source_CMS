import {z} from 'zod';

const MediaSchema = z.object({
    tenantId: z.string(),   
    filename: z.string(),
    originalName: z.string(),
    mimeType: z.string(),
    size: z.number(),
    url: z.string(),
})

export const validateMedia = (req, res, next)=>{
    try{
        MediaSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}