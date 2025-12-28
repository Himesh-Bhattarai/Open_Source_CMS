import {PageBlock} from './PageBlock.js';
import {Page} from './Page.js';
import express from "express";

const router = express.Router();

app.use('/page', Page);
app.use('/page-block', PageBlock);

export default router
