import express from 'express';
import { validateFooter } from '../../Validation/Footer/Footer.js';
import { footerCheckpoint } from '../../../CheckPoint/Footer/Footer.js';
const router = express.Router();

router.post("/footer",
    validateFooter,
    footerCheckpoint
)

export default router