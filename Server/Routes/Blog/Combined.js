import express from "express";
import blogRoute from "./Blog.js";
import blogCategoryRoute from "./BlogCategory.js";
import { updateBlog } from "../../CheckPoint/Blog/UpdateBlog.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";

const router = express.Router();

router.use("/blog", blogRoute);
router.use("/blog-category", blogCategoryRoute);
router.put("/update-blog/:blogId", verificationMiddleware, updateBlog);

export default router;
