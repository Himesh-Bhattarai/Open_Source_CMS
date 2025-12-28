import PageBlock from './PageBlock.js';
import Page from './Page.js';
import express from "express";

const router = express.Router();

router.use('/page', Page);
router.use('/page-block', PageBlock);

export default router
