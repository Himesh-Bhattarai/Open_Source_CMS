import { BlogPost } from "../../Models/ActivityLog/Blogpost.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const BlogPostCheckpoint = async (req, res, next) => {
    try {
        const { title, slug, excerpt, category, status } = req.body
        const userId = req.user?.userId;
        if (!userId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Blog Post Creation Attempt by: ${userId} name: ${title}`)

        const blogPost = await BlogPost.create({

            title,
            slug,
            excerpt,
            category,
            status,
            publishedAt: null || Date.now(),


        });

        log.info(`Blog Post created by: ${userId} title: ${title} Date: ${blogPost.createdAt}`);

        res.status(201).json({
            message: "Blog Post created successfully"
        })


    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err)

    }
}