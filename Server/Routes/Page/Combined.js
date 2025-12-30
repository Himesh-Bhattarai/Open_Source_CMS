import PageBlock from './PageBlock.js';
import Page from './Page.js';
import express from "express";

const router = express.Router();

router.use('/', Page);
router.use('/', PageBlock);

export default router
