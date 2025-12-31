import express from 'express';
import { validateBlogCategory } from '../../Validation/Blog/BlogCategory.js';
import { BlogCategoryCheckpoint } from '../../CheckPoint/Blog/BlogCategory.js';

const router = express.Router();

router.post("/",
    validateBlogCategory,
    BlogCategoryCheckpoint
)

export default router;