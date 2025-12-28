import express from 'express';
import { validateMenu } from '../../Validation/Menu/Menu.js';
import { menuCheckpoint } from '../../CheckPoint/Menu/Menu.js';

const router = express.Router();

router.post("/menu",
    validateMenu,
    menuCheckpoint
)

export default router