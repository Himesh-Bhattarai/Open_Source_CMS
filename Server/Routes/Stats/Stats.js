import express from "express";
import { Page } from "../../Models/Page/Page.js";
import { BlogPost as Blog } from "../../Models/Blog/Blogpost.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.get("/stats/:types", verificationMiddleware, async (req, res, next) => {
    try {
        const userId = req.user?.userId; 0
        const types = req.params.types;
        console.log("t`ypes", types);
        if (!userId) throw new Error("Unauthorized Access");

        // Switch case for different stats types
        switch (types) {
            case "For-Dashboard":
                {
                    const totalPages = await Page.countDocuments({ authorId: userId });
                    const publishedPages = await Page.countDocuments({
                        authorId: userId,
                        status: "published",
                    });
                    const draftPages = await Page.countDocuments({
                        authorId: userId,
                        status: "draft",
                    });

                    res.status(200).json({
                        success: true,
                        totalPages,
                        publishedPages,
                        draftPages,
                    });
                }
                break;
            case "Blog-Stats":
                {
                    const totalBlogs = await Blog.countDocuments({ userId: userId });
                    const publishedBlogs = await Blog.countDocuments({
                        userId: userId,
                        status: "published",
                    });
                    const draftBlogs = await Blog.countDocuments({
                        userId: userId,
                        status: "draft",
                    });

                    res.status(200).json({
                        success: true,
                        totalBlogs,
                        publishedBlogs,
                        draftBlogs,
                    });
                }
                break;

            case "Media-Stats": {
                //Placeholder for future media stats
            }
        }
    } catch (err) {
        next(err);
    }
});

export default router;






