import PageBlock from './PageBlock.js';
import Page from './Page.js';
import express from "express";
import updatePage from './updatePage.js';
const router = express.Router();

router.use('/page', Page);
router.use('/page-block', PageBlock);
router.use('/page/:pageId', updatePage);

export default router
