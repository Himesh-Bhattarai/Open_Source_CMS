import express from 'express';
import { validateBlog } from '../../Validation/Blog/Blog.js';
import { BlogCheckpoint } from '../../../CheckPoint/Blog/Blog.js';

const router = express.Router();

router.post("/blog",
    validateBlog,
    BlogCheckpoint
)

export default router;