import express from 'express';
import  footer  from './Footer.js';
import  footerBlock  from './FooterBlock.js';

const router = express.Router();

router.use('/footer', footer);
router.use('/footer-block', footerBlock);

export default router;
