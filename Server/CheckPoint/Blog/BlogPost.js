import { BlogPost } from "../../Models/Blog/Blogpost.js";
import {logger as log} from "../../Utils/Logger/logger.js";

export const BlogPostCheckpoint =async (req, res, next) =>{
    try{
       const {userId, tenantId, title, slug, content, excerpt, featuredImage, authorId, categoryId, tags, seo, status, publishedAt, scheduledAt, views} = req.body

       if(!userId || !tenantId ){
           const err = new Error("Missing required fields");
           err.statusCode = 400;
           throw err;
       }

       log.info(`Blog Post Creation Attempt by: ${userId} name: ${title}`)

       const blogPost = await BlogPost.create({
           tenantId,
           title,
           slug,
           content,
           excerpt,
           featuredImage,
           authorId,
           categoryId,
           tags,
           seo,
           status,
           publishedAt,
           scheduledAt,
           views
       });

       log.info(`Blog Post created by: ${userId} title: ${title} Date: ${blogPost.createdAt}`);
        
       res.status(201).json({
        message: "Blog Post created successfully"
       })
       
        
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err)

    }
}