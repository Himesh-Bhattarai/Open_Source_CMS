import { BlogPost } from "../../Models/Blog/Blogpost.js";
import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
const router = express.Router();
//--------------------------[USER] LOAD BLOG POST BY ID--------------------------//
router.get("/load/:blogId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const blogId = req.params.blogId;

    if (!userId) throw new Error("Unauthorized");
    if (!blogId) throw new Error("Blog ID is required");

    const blogPost = await BlogPost.findOne({ _id: blogId, authorId: userId });
    if (!blogPost)
      return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json(blogPost);
  } catch (err) {
    next(err);
  }
});

router.get("/load-all", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const userBlogs = await BlogPost.find({ authorId: userId });
    if (!userBlogs)
      return res.status(404).json({ message: "No blog posts found" });

    res.status(200).json(userBlogs);
  } catch (err) {
    next(err);
  }
});

export default router;
