import express from 'express';

import { registerCheckpoint } from '../../../CheckPoint/Auth/Register/Register.js';
import { validateRegister } from '../../../Validation/Client/User.js';

const router = express.Router();

router.post("/register",
    validateRegister,
    registerCheckpoint
)

export default router