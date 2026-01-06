import express from 'express';
import { footerCheckpoint } from '../../CheckPoint/Footer/Footer.js';
import { verificationMiddleware } from '../../Utils/Jwt/Jwt.js';
const router = express.Router();

router.post("/",

    verificationMiddleware,
    footerCheckpoint
)

export default router