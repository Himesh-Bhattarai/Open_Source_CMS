import express from 'express';

import {mediaCheckpoint} from '../../CheckPoint/Media/media.js';
import { verificationMiddleware } from '../../Utils/Jwt/Jwt.js';

const router = express.Router();

router.post("/media",
   verificationMiddleware,
    mediaCheckpoint
)

export default router