import express from 'express';
import { validateBlog } from '../../Validation/Blog/Blog.js';
import { BlogPostCheckpoint } from '../../CheckPoint/Blog/BlogPost.js';
import { verificationMiddleware } from '../../Utils/Jwt/Jwt.js';

const router = express.Router();

router.post("/",
    validateBlog,
    verificationMiddleware,
    BlogPostCheckpoint
)

export default router;