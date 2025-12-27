import {z } from 'zod';

const FieldSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(["text", "textarea", "richtext", "number", "date", "boolean", "image", "file", "select", "relation"]),
    required: z.boolean(),
    order: z.number(),
    options: z.any(),
});


export const validateField = (req, res, next)=>{
    try{
        FieldSchema.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)
    }
}