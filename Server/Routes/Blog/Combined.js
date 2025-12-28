import express from 'express';
import {blogRoute} from './Blog.js';
import {blogCategoryRoute} from './BlogCategory.js';

const router = express.Router();

router.use('/blog', blogRoute);
router.use('/blog-category', blogCategoryRoute);

export default router