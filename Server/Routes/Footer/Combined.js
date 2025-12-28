import express from 'express';
import { footer } from './Footer.js';
import { footerBlock } from './FooterBlock.js';

const router = express.Router();

app.use('/footer', footer);
app.use('/footer-block', footerBlock);

export default router;
