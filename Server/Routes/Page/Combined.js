import PageBlock from './PageBlock.js';
import Page from './Page.js';
import slug from './Services.js';
import express from "express";

const router = express.Router();

router.use('/page', Page);
router.use('/page-block', PageBlock);
router.use('/slug', slug);


export default router
