import express from 'express';
import { validateMenu } from '../../Validation/Menu/Menu.js';
import { menuCheckpoint } from '../../CheckPoint/Menu/Menu.js';
import { verificationMiddleware } from '../../Utils/Jwt/Jwt.js';

const router = express.Router();

router.post("/",
    validateMenu,
    verificationMiddleware,
    menuCheckpoint
)

export default router