import express from "express";
import { BlogPost } from "../../Models/Blog/Blogpost.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

//Delete blog by ID
router.delete("/blog/:blogId", verificationMiddleware, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user?.userId;
  try {
    if (!blogId) throw new Error("Blog ID is required");
    if (!userId) throw new Error("Unauthorized");

    const blog = await BlogPost.findOne({ _id: blogId, authorId: userId });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await BlogPost.deleteOne({ _id: blogId, authorId: userId });
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
