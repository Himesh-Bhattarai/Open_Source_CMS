import express from 'express';
import { validateMedia } from '../../Validation/Media/Media.js';

import {mediaCheckpoint} from '../../CheckPoint/Media/media.js';

const router = express.Router();

router.post("/media",
    validateMedia,
    mediaCheckpoint
)

export default router