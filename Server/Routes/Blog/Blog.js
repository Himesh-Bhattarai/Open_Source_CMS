import express from 'express';
import { validateBlog } from '../../Validation/Blog/Blog.js';
import { BlogPostCheckpoint } from '../../CheckPoint/Blog/BlogPost.js';

const router = express.Router();

router.post("/blog",
    validateBlog,
    BlogPostCheckpoint
)

export default router;